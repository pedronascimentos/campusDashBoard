import { getPayload } from 'payload' 
import configPromise from '@payload-config'
import { notFound } from 'next/navigation'
import { ArticlePreviewClient } from '@/components/ArticlePreviewClient'

/**
 * Article Preview Page (Server Component)
 * 
 * This server component fetches the article data and passes it to
 * the client component which handles auto-refresh and rendering.
 * 
 * The preview updates automatically every 2 seconds while editing.
 */
export default async function PreviewPage({ params }: { params: { slug: string } }) {
  const { slug } = await params
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