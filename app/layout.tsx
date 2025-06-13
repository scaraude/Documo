import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Navbar } from '@/shared/components'
import { Toaster } from 'sonner'
import TRPCProvider from './providers/trpc-provider'
import { AuthProvider } from '@/features/auth'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Centradoc',
  description: 'Plateforme sécurisée de transfert de documents entre organisations et citoyens',
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
          <AuthProvider>
            <Navbar />
            {children}
            <Toaster richColors />
          </AuthProvider>
        </TRPCProvider>
      </body>
    </html>
  )
}