// src/components/CategorySection.tsx
'use client'

import React, { useState } from 'react'
// 1. Importar o Link (não é mais usado aqui, mas estava no original)
// import Link from 'next/link' 

// 2. IMPORTAR o componente ArticleCard e seus tipos
import { ArticleCard, type ArticleCardProps } from './ArticleCard'
// (Ajuste o caminho se o ArticleCard.tsx não estiver na mesma pasta)

// 3. REMOVER a interface 'Article' local. Usaremos a importada.

interface CategorySectionProps {
  category: {
    id: string
    name: string
    color?: string
    // 4. Usar o tipo importado
    articles: ArticleCardProps['article'][]
  }
}

export function CategorySection({ category }: CategorySectionProps) {
  const publishedArticles = category.articles.filter(
    (article) => article.id
  )

  if (publishedArticles.length === 0) return null

  const getCategoryColor = (color: string) => {
    const colors: Record<string, string> = {
      red: '#bb1919',
      orange: '#e66000',
      yellow: '#f4b400',
      green: '#00a767',
      blue: '#0060a9',
      purple: '#7834bc',
      brown: '#8b4513',
      gray: '#404040',
    }
    return colors[color] || colors.gray
  }

  return (
    <section style={{
      marginBottom: '48px',
      borderTop: '4px solid #e5e5e5',
      paddingTop: '24px',
    }}>
      {/* Category Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        marginBottom: '24px',
      }}>
        <div style={{
          width: '6px',
          height: '28px',
          background: getCategoryColor(category.color || 'gray'),
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
          {category.name}
        </h2>
      </div>

      {/* Articles Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
        gap: '14px',
      }}>
        {publishedArticles.map((article) => (
          // 5. Agora isso chama o componente IMPORTADO
          <ArticleCard key={article.id} article={article} />
        ))}
      </div>
    </section>
  )
}

// 6. REMOVER TODA A FUNÇÃO 'function ArticleCard' DAQUI.
// (A função que ia da linha 92 até 184 no seu original foi removida).