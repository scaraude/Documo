import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Navbar } from '@/shared/components'
import { Toaster } from 'sonner'
import TRPCProvider from './providers/trpc-provider'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Document Transfer App',
  description: 'Transfert sécurisé de documents entre organisations et citoyens',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr">
      <body className={inter.className}>
        <TRPCProvider>
          <Navbar />
          {children}
          <Toaster richColors />
        </TRPCProvider>
      </body>
    </html>
  )
}