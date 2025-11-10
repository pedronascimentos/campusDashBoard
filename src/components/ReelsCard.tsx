'use client'

import React, { useState } from 'react'
// 1. Importa os helpers de YouTube

interface Reel {
  id: string
  title: string
  url: string
  // 2. Adiciona 'youtube' como plataforma válida
  platform: 'tiktok' | 'reels'
  thumbnailUrl?: string
}

export function ReelCard({ reel }: { reel: Reel }) {
  const [isHovered, setIsHovered] = useState(false)

  // 3. Lógica para extrair o ID do YouTube

  // 4. Lógica para definir a URL da thumbnail
  // Se for YouTube, gera a URL. Se for TikTok, usa a URL salva (se existir).
  const displayThumbnailUrl = reel.thumbnailUrl; // Usa a thumbnail do TikTok (ou undefined para Reels)

  // 5. Define o gradiente de fallback (agora incluindo YouTube)
  let fallbackBackground = 'linear-gradient(135deg, #833ab4 0%, #fd1d1d 50%, #fcb045 100%)'; // Reels
  if (reel.platform === 'tiktok') {
    fallbackBackground = 'linear-gradient(135deg, #000000 0%, #fe2c55 100%)';
  }

  return (
    <a
      key={reel.id}
      href={reel.url}
      target="_blank"
      rel="noopener noreferrer"
      style={{
        minWidth: '180px',
        maxWidth: '180px',
        textDecoration: 'none',
        color: 'inherit',
        transition: 'transform 0.2s ease',
        transform: isHovered ? 'translateY(-4px)' : 'translateY(0)',
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Thumbnail Container */}
      <div style={{
        width: '180px',
        height: '320px',
        background: fallbackBackground,
        borderRadius: '12px',
        marginBottom: '12px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden',
        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
      }}>

        {/* Lógica da Thumbnail (agora usa displayThumbnailUrl) */}
        {displayThumbnailUrl ? (
          <img
            src={displayThumbnailUrl}
            alt={reel.title}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              position: 'absolute',
              top: 0,
              left: 0,
            }}
          />
        ) : (
          <div style={{ fontSize: '56px', opacity: 0.9 }}>
            ▶️
          </div>
        )}

        {/* 6. Platform Badge (agora dinâmico) */}
        <div style={{
          position: 'absolute',
          top: '12px',
          right: '12px',
          background: 'rgba(0,0,0,0.8)',
          color: 'white',
          padding: '6px 10px',
          borderRadius: '6px',
          fontSize: '11px',
          fontWeight: '700',
          textTransform: 'uppercase',
          letterSpacing: '0.5px',
          zIndex: 2,
        }}>
          {reel.platform.toUpperCase()}
        </div>
      </div>

      {/* Título (permanece igual) */}
      <p style={{
        fontSize: '14px',
        fontWeight: '700',
        lineHeight: '1.3',
        color: '#141414',
        display: '-webkit-box',
        WebkitLineClamp: 2,
        WebkitBoxOrient: 'vertical',
        overflow: 'hidden',
        margin: 0,
      }}>
        {reel.title}
      </p>
    </a>
  )
}