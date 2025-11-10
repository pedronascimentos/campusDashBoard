import React from 'react'
// 1. Importar o Link
import Link from 'next/link'

export default function NotFound() {
  return (
    <main style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: 'white',
      padding: '2rem',
      textAlign: 'center',
      fontFamily: 'sans-serif', // Adicionado um fallback de fonte
    }}>
      <h1 style={{
        fontSize: '6rem',
        marginBottom: '1rem',
        fontWeight: '700',
      }}>
        404
      </h1>

      <h2 style={{
        fontSize: '2rem',
        marginBottom: '1rem',
      }}>
        Artigo não encontrado
      </h2>

      <p style={{
        fontSize: '1.2rem',
        marginBottom: '2rem',
        opacity: 0.9,
      }}>
        O artigo que você procura não existe ou foi removido.
      </p>

      {/* 2. CORRIGIDO: <a> substituído por <Link> */}
      <Link
        href="/"
        style={{
          padding: '1rem 2rem',
          background: '#6C0318', // Cor do seu tema
          color: 'white',
          borderRadius: '8px',
          textDecoration: 'none',
          fontWeight: '600',
          fontSize: '1.1rem',
        }}
      >
        ← Voltar para home
      </Link>
    </main>
  )
}