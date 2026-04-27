import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Misión Torrelavega sobre ruedas',
  description: 'Chat interactivo con Ruedas el Tale-Bot',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
