import React from 'react'

export default function FrontendLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      {children}
    </html>
  )
}
