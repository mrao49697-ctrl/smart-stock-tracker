import type { Metadata } from 'next'
import './globals.css'
import { ThemeProvider } from '@/components/ThemeProvider'
import { AiAssistant } from '@/components/AiAssistant'

export const metadata: Metadata = {
  title: 'StockSathi AI | Smart Store Tracker',
  description: 'Manage your store inventory smartly with AI.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {children}
          <AiAssistant />
        </ThemeProvider>
      </body>
    </html>
  )
}
