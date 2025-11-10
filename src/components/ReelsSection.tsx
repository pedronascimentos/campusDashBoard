'use client'

// 1. Importar useEffect
import React, { useEffect } from 'react'
import { ReelCard } from './ReelsCard'

interface Reel {
  id: string
  title: string
  url: string
  platform: 'tiktok' | 'reels'
  embedHtml?: string // 2. Adicionar o novo campo
}

interface ReelsSectionProps {
  title: string
  reels: Reel[]
}

export function ReelsSection({ title, reels }: ReelsSectionProps) {

  // 3. Adicionar Efeito para carregar o script do TikTok
  useEffect(() => {
    // Verifica se o script já foi injetado
    if (document.getElementById('tiktok-embed-script')) {
      return;
    }

    const script = document.createElement('script');
    script.id = 'tiktok-embed-script';
    script.async = true;
    script.src = 'https://www.tiktok.com/embed.js';
    document.body.appendChild(script);

    // Limpeza (opcional, mas boa prática)
    return () => {
      const existingScript = document.getElementById('tiktok-embed-script');
      if (existingScript) {
        // Não removemos para o caso de outra ReelsSection precisar dele
      }
    };
  }, []); // Array vazio [] garante que rode apenas uma vez

  if (!reels || reels.length === 0) return null

  return (
    <section style={{
      marginBottom: '48px',
      borderTop: '4px solid #e5e5e5',
      paddingTop: '24px',
    }}>
      {/* Header (permanece igual) */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        marginBottom: '24px',
      }}>
        <div style={{
          width: '6px',
          height: '28px',
          background: '#bb1919',
        }} />
        <h2 style={{
          fontSize: '28px',
          fontWeight: '700',
          fontFamily: '"Reith Serif", Georgia, serif',
          textTransform: 'uppercase',
          letterSpacing: '0.5px',
          color: '#141414',
          margin: 0,
        }}>
          {title}
        </h2>
      </div>

      {/* Horizontal Scroll */}
      <div style={{
        display: 'flex',
        gap: '16px',
        overflowX: 'auto',
        paddingBottom: '16px',
        scrollbarWidth: 'thin',
      }}>
        {reels.map((reel) => (
          <ReelCard key={reel.id} reel={reel} />
        ))}
      </div>
    </section>
  )
}