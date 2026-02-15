import './globals.css';
import type { Metadata } from 'next';
import type React from 'react';
import TRPCProvider from './providers/trpc-provider';

export const metadata: Metadata = {
  title: 'Documo',
  description:
    "l'échange de document à l'ère moderne - Plateforme sécurisée de transfert de documents",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body>
        <TRPCProvider>{children}</TRPCProvider>
      </body>
    </html>
  );
}
