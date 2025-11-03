import { Payload } from 'payload'
import fs from 'fs/promises'
import path from 'path'

export async function generateJSON(payload: Payload) {
  try {
    // 1. Buscar todas as notícias publicadas
    const articles = await payload.find({
      collection: 'articles',
      where: {
        status: { equals: 'published' }
      },
      depth: 2, // Inclui relacionamentos (authors, theme, media)
      limit: 1000,
    })

    // 2. Buscar temas
    const themes = await payload.find({
      collection: 'themes',
      depth: 1,
      limit: 100,
    })

    // 3. Buscar vídeos sociais
    const socialVideos = await payload.find({
      collection: 'social-videos',
      where: {
        visible: { equals: true }
      },
      limit: 50,
    })

    // 4. Buscar configuração do layout do app
    const appLayout = await payload.findGlobal({
      slug: 'app-layout',
      depth: 1,
    })

    // 5. Montar estrutura do feed
    const feed = {
      version: '1.0',
      generatedAt: new Date().toISOString(),
      
      featured: articles.docs.find(a => a.id === appLayout.featuredArticle),
      
      themes: themes.docs
        .sort((a, b) => a.order - b.order)
        .map(theme => ({
          id: theme.id,
          name: theme.name,
          articles: articles.docs
            .filter(a => a.theme?.id === theme.id)
            .sort((a, b) => {
              const orderA = theme.articlesOrder.indexOf(a.id)
              const orderB = theme.articlesOrder.indexOf(b.id)
              return orderA - orderB
            })
            .map(serializeArticle)
        })),
      
      standaloneArticles: articles.docs
        .filter(a => !a.theme && a.id !== appLayout.featuredArticle)
        .sort((a, b) => {
          const orderA = appLayout.standaloneOrder.indexOf(a.id)
          const orderB = appLayout.standaloneOrder.indexOf(b.id)
          return orderA - orderB
        })
        .map(serializeArticle),
      
      socialVideos: socialVideos.docs.map(v => ({
        id: v.id,
        platform: v.platform,
        url: v.url,
        thumbnail: v.thumbnail?.url,
        duration: v.duration,
        title: v.title,
      })),
    }

    // 6. Salvar no sistema de arquivos (CDN local)
    const cdnPath = process.env.CDN_PATH || '/var/www/cdn'
    const feedPath = path.join(cdnPath, 'feed.json')
    
    await fs.mkdir(cdnPath, { recursive: true })
    await fs.writeFile(feedPath, JSON.stringify(feed, null, 2))

    // 7. Salvar artigos individuais
    const articlesDir = path.join(cdnPath, 'articles')
    await fs.mkdir(articlesDir, { recursive: true })
    
    for (const article of articles.docs) {
      const articlePath = path.join(articlesDir, `${article.id}.json`)
      await fs.writeFile(
        articlePath,
        JSON.stringify(serializeArticleFull(article), null, 2)
      )
    }

    // 8. (Opcional) Invalidar cache do Cloudflare
    if (process.env.CLOUDFLARE_API_TOKEN) {
      await invalidateCloudflareCache([
        'https://cdn.seudominio.com/feed.json',
        ...articles.docs.map(a => `https://cdn.seudominio.com/articles/${a.id}.json`)
      ])
    }

    console.log('✅ Feed gerado com sucesso!')
    
  } catch (error) {
    console.error('❌ Erro ao gerar feed:', error)
    throw error
  }
}

// Serializa artigo para o formato do app (resumido para lista)
function serializeArticle(article: any) {
  return {
    id: article.id,
    type: article.type,
    title: article.title,
    description: article.description,
    thumbnail: extractThumbnail(article),
    authors: article.authors.map((a: any) => ({
      name: a.name,
      photo: a.photo?.url,
    })),
    publishedAt: article.publishedAt,
  }
}

// Serializa artigo completo (para página de detalhes)
function serializeArticleFull(article: any) {
  return {
    ...serializeArticle(article),
    content: article.content,
    gallery: article.gallery?.map((g: any) => ({
      url: g.media.url,
      caption: g.caption,
      type: g.media.mimeType?.startsWith('video') ? 'video' : 'image',
    })),
    podcast: article.podcast ? {
      cover: article.podcast.cover?.url,
      audioUrl: article.podcast.audioUrl,
      duration: article.podcast.duration,
    } : null,
  }
}

function extractThumbnail(article: any) {
  if (article.featuredMedia?.image?.url) {
    return article.featuredMedia.image.url
  }
  if (article.featuredMedia?.youtubeUrl) {
    const videoId = extractYouTubeId(article.featuredMedia.youtubeUrl)
    return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`
  }
  return null
}

function extractYouTubeId(url: string): string | null {
  const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/
  const match = url.match(regex)
  return match ? match[1] : null
}

async function invalidateCloudflareCache(urls: string[]) {
  // Implementar invalidação via API do Cloudflare
}