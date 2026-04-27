'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Send, Cpu, Battery, Wifi, Bike, Zap } from 'lucide-react';

export default function ChatPage() {
  const [messages, setMessages] = useState<{ role: string; parts: { text: string }[] }[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Saludo inicial de Ruedas
    setMessages([{
      role: 'model',
      parts: [{ text: '¡Hola Súper Ingenieros y Súper Ingenieras! 🤖 Soy Ruedas, me muero de ganas por recorrer Torrelavega 🚲, pero tengo amnesia de ruta hoy y necesito que me programéis. ¿Estáis listos para empezar vuestra primera misión y no chocar en la maqueta? ⚡' }]
    }]);
  }, []);

  const handleSend = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || isLoading) return;

    const newMessages = [...messages, { role: 'user', parts: [{ text: input.trim() }] }];
    setMessages(newMessages);
    setInput('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMessages })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || '¡Oh, oh! Mis circuitos tienen pequeñas interferencias en la red temporalmente... ⚡');
      }

      setMessages(prev => [...prev, { role: 'model', parts: [{ text: data.text }] }]);
    } catch (error: any) {
      setMessages(prev => [...prev, { role: 'model', parts: [{ text: error.message || 'Interferencias en la red temporalmente... Súper Ingenieros, ¿revisamos los cables? 🔌' }] }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-screen w-full bg-bg font-sans text-ink flex flex-col lg:grid lg:grid-cols-[280px_1fr] overflow-hidden">
      {/* Sidebar (Artistic Flair) */}
      <aside className="hidden lg:flex bg-white border-r-[4px] border-ink p-6 flex-col gap-5 shadow-brutal-sidebar z-10 relative">
        <div className="text-center mb-5">
          <div className="text-5xl mb-[-10px]">🚲</div>
          <h1 className="font-black text-3xl tracking-tight text-primary">RUEDAS</h1>
          <p className="text-xs font-semibold opacity-60">MISIÓN TORRELAVEGA</p>
        </div>

        <div className="border-[2px] border-ink rounded-xl p-3 flex items-center gap-3 transition-all bg-white opacity-60 line-through border-dashed">
          <span className="font-black text-xl min-w-[30px]">01</span>
          <div>
            <div className="text-[0.65rem] font-extrabold uppercase">Exploración</div>
            <div className="text-sm font-semibold">Señales de Tráfico</div>
          </div>
        </div>

        <div className="border-[2px] border-ink rounded-xl p-3 flex items-center gap-3 transition-all bg-accent -rotate-1 shadow-brutal">
          <span className="font-black text-xl min-w-[30px]">02</span>
          <div>
            <div className="text-[0.65rem] font-extrabold uppercase">Precisión</div>
            <div className="text-sm font-semibold">Malla de 15x15 cm</div>
          </div>
        </div>

        <div className="border-[2px] border-ink rounded-xl p-3 flex items-center gap-3 transition-all bg-white">
          <span className="font-black text-xl min-w-[30px]">03</span>
          <div>
            <div className="text-[0.65rem] font-extrabold uppercase">Construcción</div>
            <div className="text-sm font-semibold">Ciudad Reciclada</div>
          </div>
        </div>

        <div className="border-[2px] border-ink rounded-xl p-3 flex items-center gap-3 transition-all bg-white">
          <span className="font-black text-xl min-w-[30px]">04</span>
          <div>
            <div className="text-[0.65rem] font-extrabold uppercase">Electricidad</div>
            <div className="text-sm font-semibold">Makey Makey</div>
          </div>
        </div>

        <div className="border-[2px] border-ink rounded-xl p-3 flex items-center gap-3 transition-all bg-white">
          <span className="font-black text-xl min-w-[30px]">05</span>
          <div>
            <div className="text-[0.65rem] font-extrabold uppercase">Algoritmos</div>
            <div className="text-sm font-semibold">Scratch Power</div>
          </div>
        </div>

        <div className="mt-auto p-3 bg-slate-100 rounded-xl border-[2px] border-ink">
          <div className="text-[0.7rem] font-extrabold mb-1">INGENIERO AL MANDO</div>
          <div className="font-bold">Súper Ingeniero/a</div>
        </div>
      </aside>

      {/* Main Chat Area */}
      <main className="flex flex-col h-screen relative bg-bg">
        {/* Mobile Header (Fallback) & Desktop Header */}
        <header className="p-4 lg:p-6 flex justify-between items-center shrink-0 bg-white lg:bg-transparent border-b-[4px] border-ink lg:border-none z-20 shadow-brutal lg:shadow-none mb-4 lg:mb-0">
          <div className="flex items-center gap-3">
             <div className="lg:hidden text-3xl">🚲</div>
             <div>
              <h2 className="font-extrabold text-xl lg:text-2xl text-primary lg:text-ink">Laboratorio de Pruebas ⚡</h2>
              <p className="text-sm opacity-70 hidden sm:block">Conectado con el sistema de navegación de Ruedas</p>
             </div>
          </div>
          <div className="bg-emerald-500 text-white px-3 py-1 rounded-full text-xs font-bold uppercase border-[2px] border-ink flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-white animate-pulse"></span>
            Online
          </div>
        </header>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 lg:px-10 pb-32 pt-2 flex flex-col space-y-6">
          {messages.map((m, i) => (
            <div key={i} className={`flex flex-col ${m.role === 'user' ? 'items-end' : 'items-start'}`}>
              <div 
                className={`max-w-[85%] lg:max-w-[80%] p-4 lg:p-5 border-[3px] border-ink leading-relaxed relative ${
                m.role === 'user'
                  ? 'bg-accent self-end rounded-t-[20px] rounded-bl-[20px] rounded-br-[4px] shadow-brutal-user'
                  : 'bg-white self-start rounded-t-[20px] rounded-br-[20px] rounded-bl-[4px] shadow-brutal-robot'
              }`}>
                {m.role === 'model' && (
                  <div className="w-[40px] h-[40px] lg:w-[50px] lg:h-[50px] bg-primary border-[3px] border-ink rounded-full flex items-center justify-center text-xl lg:text-2xl mb-2">
                    🤖
                  </div>
                )}
                {m.role === 'user' && (
                  <p className="font-bold mb-2 text-sm lg:text-base">Súper Ingeniero</p>
                )}
                <div className="whitespace-pre-wrap text-[15px] lg:text-base font-medium">{m.parts[0].text}</div>
              </div>
            </div>
          ))}
          
          {isLoading && (
            <div className="flex justify-start">
              <div className="flex items-center gap-2 font-semibold text-secondary ml-2 relative">
                <span className="inline-block w-2.5 h-2.5 bg-secondary rounded-full animate-bounce"></span>
                <span className="animate-pulse">Ruedas está procesando datos...</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} className="h-4" />
        </div>

        {/* Input Area */}
        <div className="absolute bottom-4 lg:bottom-6 left-4 right-4 lg:left-10 lg:right-10 flex gap-2 lg:gap-3 z-20">
          <form onSubmit={handleSend} className="flex flex-1 gap-2 lg:gap-3">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Escribe tu respuesta para ayudar a Ruedas..."
              className="flex-1 border-[3px] border-ink px-4 lg:px-6 py-3 lg:py-4 rounded-full text-base lg:text-lg shadow-brutal focus:outline-none focus:ring-4 focus:ring-primary/20 bg-white placeholder:text-ink/50 font-medium"
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="bg-primary border-[3px] border-ink text-white w-[50px] h-[50px] lg:w-[60px] lg:h-[60px] rounded-full flex items-center justify-center text-xl lg:text-2xl cursor-pointer shadow-brutal shrink-0 disabled:opacity-50 disabled:cursor-not-allowed hover:-translate-y-1 hover:shadow-[4px_6px_0_1E293B] active:translate-y-1 active:shadow-none transition-all"
            >
              🚀
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
