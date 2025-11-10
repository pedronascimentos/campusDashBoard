import React from 'react'
import { notFound } from 'next/navigation'
import { ArticlePreviewClient } from '@/components/ArticlePreviewClient' // Importa o Client Component

// Esta função busca o RASCUNHO (draft=true)
async function getDraftArticle(slug: string) {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'}/api/articles?where[slug][equals]=${slug}&depth=10&draft=true`,
      {
        cache: 'no-store', // Rascunhos NUNCA devem ter cache
      }
    )
    if (!res.ok) {
      console.error(`Erro ao buscar rascunho: ${res.statusText}`);
      return null
    }
    const data = await res.json()
    return data.docs?.[0] || null
  } catch (error) {
    console.error('Erro fatal ao buscar rascunho:', error)
    return null
  }
}

/**
 * CORREÇÃO:
 * A tipagem de 'params' foi atualizada de '{ slug: string }'
 * para 'Promise<{ slug: string }>' para ser compatível com o Next.js 15.
 */
export default async function ArticlePreviewPage({ params }: { params: Promise<{ slug: string }> }) {
  // CORREÇÃO: Adicionado 'await' para resolver a Promise de params
  const { slug } = await params
  const article = await getDraftArticle(slug)

  if (!article) {
    notFound()
  }

  // Passa os dados iniciais para o Client Component
  return <ArticlePreviewClient initialArticle={article} slug={slug} />
}