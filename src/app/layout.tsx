import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Campus Multiplataforma',
    description: 'Sistema de gerenciamento de conteúdo',
    icons: {
        icon: '/favicon.png',
        shortcut: '/favicon.png',
        apple: '/favicon.png',
    },
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return children
}
