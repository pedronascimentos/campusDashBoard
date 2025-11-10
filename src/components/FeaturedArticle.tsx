// src/components/FeaturedArticle.tsx
import React from 'react'
import Link from 'next/link'

interface FeaturedArticleProps {
  article: {
    id: string
    title: string // Necessário para o 'alt' text
    slug: string
    description?: string
    featuredImage?: {
      url: string
      alt?: string
    }
    authors?: Array<{ name: string }>
  }
}

export function FeaturedArticle({ article }: FeaturedArticleProps) {
  // Se não houver imagem, o componente não renderiza
  if (!article.featuredImage) {
    return null
  }

  return (
    <section style={{
      marginBottom: '0px',

    }}>
      <Link
        href={`/artigos/${article.slug}`}
        style={{
          display: 'block', // 'block' é mais simples que 'grid'
          color: 'inherit',
          width: '100%',
          textDecoration: 'none',
        }}
      >
        {/* Imagem com Aspect Ratio 16:9 */}
        <div style={{
          position: 'relative',
          width: '100%',
          // A proporção 16:9 é (9 / 16) = 0.5625
          paddingTop: '56.25%',
          overflow: 'hidden',
          background: '#f0f0f0', // Background de loading
        }}>
          <img
            src={article.featuredImage.url}
            alt={article.featuredImage.alt || article.title}
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
      </Link>
    </section>
  )
}