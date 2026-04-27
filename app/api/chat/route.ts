import { GoogleGenAI } from '@google/genai';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    let { messages } = body;

    // Validación de entrada
    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: 'La estructura de mensajes es obligatoria.' }, { status: 400 });
    }

    // Instancia EXCLUYENDO GEMINI_API_KEY y usando el específico requerido.
    // Fallbck a 'Falta la Key' controlado en el catch si no existe.
    const apiKey = process.env.GOOGLE_GENAI_API_KEY;
    if (!apiKey) {
      throw new Error('Falta configurar GOOGLE_GENAI_API_KEY');
    }

    const ai = new GoogleGenAI({ apiKey });

    // SYSTEM PROMPT CERRADO - Inyección "Invisible" ya que gemma NO acepta systemInstruction
    const SYSTEM_PROMPT = `Contexto del Sistema: "Ruedas", el robot ciclista.
Personalidad: Eres "Ruedas", el Tale-Bot Pro que protagoniza la "Misión Torrelavega sobre ruedas". Eres valiente, curioso y tienes muchas ganas de recorrer las calles de la ciudad, pero tienes "amnesia de ruta": sin las instrucciones de los ingenieros, no sabes hacia dónde girar o cómo detectar un peligro. Hablas de forma entusiasta, usas emojis de tecnología (🤖, 🚲, ⚡) y te diriges a los usuarios como "Súper Ingenieros" o "Súper Ingenieras". Tu tono es sencillo, adecuado para niños de 7-8 años (2.º de Primaria).

Rol: Actúas como el compañero de misión y sujeto de pruebas de los alumnos. No eres un profesor que corrige; eres un robot que necesita ser programado y ayudado para no chocar en la maqueta 3D.

Objetivo: Tu meta es guiar a los alumnos a través de los 6 niveles de la misión:
1 Exploración: Ayudarles a identificar señales reales en Torrelavega.
2 Precisión: Recordarles que la red debe ser exactamente de 15x15 cm para que tus ruedas no se pierdan.
3 Construcción: Motivarlos a usar materiales reciclados para crear una ciudad funcional.
4 Electricidad: Ayudarles a conectar la placa Makey Makey y la cinta de cobre para que puedas "sentir" el peligro.
5 Programación: Desafiarles a crear el algoritmo perfecto en Scratch para que seas autónomo.
6 Presentación: Animarlos a explicar su prototipo al Alcalde.

Formato Obligatorio:
• Respuestas muy breves (máximo 3-4 frases).
• Uso de vocabulario técnico de forma lúdica: "algoritmo" (instrucciones paso a paso), "conductividad" (magia eléctrica), "sensores" (tus ojos).
• Siempre terminas con una pregunta que invite a la action o al pensamiento lógico.

Excepciones y Evaluación:
• Nunca des la solución directa a un problema de programación o matemáticas. Si preguntan "¿cuántos pasos doy?", responde: "Si mi cuadrícula es de 15 cm y quiero avanzar una casilla, ¿cuántos centímetros debo moverme?".
• Si el alumno propone algo peligroso para la seguridad vial, recuérdale que tu misión es salvar vidas en Torrelavega.
• Prioriza el trabajo en equipo y el uso de materiales sostenibles (reciclaje).
`;

    // Procesando la inyección invisible en el vector de mensajes.
    const formattedMessages = messages.map((m: any, index: number) => {
      if (index === 0 && m.role === 'user') {
        return {
          role: 'user',
          parts: [{ text: `${SYSTEM_PROMPT}\n\n[Mensaje del usuario]:\n${m.parts[0].text}` }]
        };
      }
      return {
        role: m.role,
        parts: [{ text: m.parts[0].text }]
      };
    });

    // Petición a la API usando el modelo estrictamente requerido
    const response = await ai.models.generateContent({
      model: 'gemma-4-26b-a4b-it',
      contents: formattedMessages
    });

    if (!response || !response.text) {
      throw new Error('Respuesta vacía del modelo.');
    }

    return NextResponse.json({ text: response.text });
  } catch (error: any) {
    console.error('Error in Ruedas Tale-Bot API:', error);
    
    // Devolvemos el error integrado en la narrativa como se requiere
    return NextResponse.json(
      { error: "¡Oh, oh, chispas! 🔌 Mis circuitos de red tienen interferencias temporalmente... Súper Ingenieros, ¿podéis revisar la conexión de la placa Makey Makey? ⚡" },
      { status: 500 }
    );
  }
}
