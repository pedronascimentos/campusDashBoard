// src/components/ArticleCard.tsx
'use client'

import React, { useState } from 'react'
import Link from 'next/link' // 1. Importar o Link

// Interface atualizada para Mídia
export interface Media { // 2. Exportar a interface
  url: string
  alt?: string
}

// Interface necessária para os Autores (baseado no relationTo: 'users')
export interface Author { // 3. Exportar a interface
  id: string
  name: string
}

// Props atualizadas para incluir data e autores
export interface ArticleCardProps { // 4. Exportar a interface principal
  article: {
    id: string
    title: string
    slug: string
    description?: string
    featuredImage?: Media
    cardType: 'card_normal' | 'card_detailed' | 'title_only' | 'thumbnail_only'
    publishedAt?: string
    authors?: Author[]
  }
}

export function ArticleCard({ article }: ArticleCardProps) {
  const [isHovered, setIsHovered] = useState(false)

  const {
    cardType,
    title,
    description,
    featuredImage,
    slug,
    publishedAt,
    authors
  } = article

  const baseStyle: React.CSSProperties = {
    background: 'white',
    overflow: 'hidden',
    textDecoration: 'none',
    transition: 'transform 0.2s ease',
    cursor: 'pointer',
    display: 'block',
    transform: isHovered ? 'translateY(-2px)' : 'translateY(0)',
    border: 'none',
  }

  // 5. Trocar <a> por <Link> em todos os cards
  // CARD TIPO: SÓ TÍTULO
  if (cardType === 'title_only') {
    return (
      <Link
        href={`/artigos/${slug}`}
        style={{
          ...baseStyle,
          padding: '20px',
          borderLeft: '4px solid #bb1919',
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <h3 style={{
          fontSize: '18px',
          color: '#141414',
          fontWeight: '700',
          margin: 0,
          lineHeight: '1.3',
          fontFamily: '"Reith Sans", Arial, sans-serif',
        }}>
          {title}
        </h3>
      </Link>
    )
  }

  // CARD TIPO: SÓ THUMBNAIL (IMAGEM)
  if (cardType === 'thumbnail_only' && featuredImage?.url) {
    return (
      <Link
        href={`/artigos/${slug}`}
        style={{
          ...baseStyle,
          padding: 0,
          display: 'block',
          width: '100%',
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div style={{
          position: 'relative',
          width: '100%',
          height: '200px',
          overflow: 'hidden',
        }}>
          <img
            src={featuredImage.url}
            alt={featuredImage.alt || title}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              display: 'block',
            }}
          />
        </div>
      </Link>
    )
  }

  // CARD TIPO: DETALHADO (TÍTULO + DESCRIÇÃO)
  if (cardType === 'card_detailed') {
    return (
      <Link
        href={`/artigos/${slug}`}
        style={baseStyle}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {featuredImage?.url && (
          <div style={{ position: 'relative', paddingTop: '56.25%', overflow: 'hidden' }}>
            <img
              src={featuredImage.url}
              alt={featuredImage.alt || title}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                objectFit: 'cover',
              }}
            />
          </div>
        )}
        <div style={{ padding: '16px' }}>
          <h3 style={{
            fontSize: '18px',
            marginBottom: '8px',
            color: '#141414',
            fontWeight: '700',
            lineHeight: '1.3',
            fontFamily: '"Reith Sans", Arial, sans-serif',
          }}>
            {title}
          </h3>
          {description && (
            <p style={{
              fontSize: '14px',
              color: '#606060',
              marginBottom: '12px',
              display: '-webkit-box',
              WebkitLineClamp: 3,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              lineHeight: '1.5',
            }}>
              {description}
            </p>
          )}
          <span style={{
            color: '#bb1919',
            fontWeight: '600',
            fontSize: '14px',
          }}>
            Ler mais →
          </span>
        </div>
      </Link>
    )
  }

  // --- Lógica de formatação de dados ---
  let timeAgo = 'Recentemente'
  if (publishedAt) {
    const diffMs = Date.now() - new Date(publishedAt).getTime()
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60))

    if (diffHours < 1) {
      const diffMins = Math.floor(diffMs / (1000 * 60))
      timeAgo = `${diffMins} min atrás`
    } else if (diffHours < 24) {
      timeAgo = `${diffHours} h atrás`
    } else {
      timeAgo = `${Math.floor(diffHours / 24)} d atrás`
    }
  }

  const authorName = authors && authors.length > 0
    ? authors[0].name
    : 'Redação'

  // CARD TIPO: NORMAL (PADRÃO) - Layout Estilo BBC
  return (
    <Link
      href={`/artigos/${slug}`}
      style={{
        ...baseStyle,
        display: 'flex',
        flexDirection: 'row',
        padding: 0,
        alignItems: 'stretch',
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Container da Imagem (Esquerda) */}
      {featuredImage?.url && (
        <div style={{
          width: '120px',
          flexShrink: 0,
          position: 'relative',
          background: '#f0f0f0',
        }}>
          <img
            src={featuredImage.url}
            alt={featuredImage.alt || title}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }}
          />
        </div>
      )}

      {/* Container do Conteúdo (Direita) */}
      <div style={{
        padding: '12px 16px',
        flexGrow: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        minHeight: '90px',
      }}>
        <h3 style={{
          fontSize: '18px',
          margin: 0,
          color: '#141414',
          fontWeight: '700',
          lineHeight: '1.3',
          fontFamily: '"Reith Sans", Arial, sans-serif',
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
        }}>
          {title}
        </h3>

        {/* Container da Metadata (Tempo e Autor) */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          color: '#606060',
          fontSize: '14px',
          fontFamily: '"Reith Sans", Arial, sans-serif',
          marginTop: '8px',
        }}>
          <span style={{ fontWeight: 500 }}>{timeAgo}</span>
          <span style={{ margin: '0 8px', color: '#ccc' }}>|</span>
          <span style={{ fontWeight: 700 }}>{authorName}</span>
        </div>
      </div>
    </Link>
  )
}