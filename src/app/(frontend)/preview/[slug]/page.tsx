// src/app/(frontend)/preview/[slug]/page.tsx

import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { notFound } from 'next/navigation'
import { ArticlePreviewClient } from '@/components/ArticlePreviewClient'

export default async function PreviewPage({ params }: { params: { slug: string } }) {
  // CORREÇÃO: 'params' é um objeto, não uma Promise.
  const { slug } = params 

  const payload = await getPayload({ config: configPromise })

  const articles = await payload.find({
    collection: 'articles',
    where: {
      slug: {
        equals: slug,
      },
    },
    limit: 1,
    draft: true,
    depth: 2,
  })

  const article = articles.docs[0]

  if (!article) {
    notFound()
  }

  return (
    <body style={{ margin: 0, padding: 0, background: '#f0f0f0' }}>
      <ArticlePreviewClient initialArticle={article} slug={slug} />
    </body>
  )
}