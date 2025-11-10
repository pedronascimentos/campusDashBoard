import React from 'react'
import './globals.css'

export const metadata = {
  title: 'Campus Multiplataforma',
  description: 'Suas notícias em todas as plataformas',
  icons: {
    icon: '/favicon.png',
  },
}

export default function FrontendLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  )
}
