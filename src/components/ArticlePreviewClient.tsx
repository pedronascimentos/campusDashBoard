'use client'

import { useEffect, useState } from 'react'
import { serializeSlate } from '@/utilities/serializeSlate'
import { ArticleHeader } from '@/components/ArticleHeader'

// Define a interface para o Artigo (igual à página final)
interface Media {
  url: string
  alt?: string
  caption?: any
}
interface Author {
  name: string
}
interface Category {
  name: string
  color?: string
}
interface Article {
  id: string
  title: string
  slug: string
  description?: string
  featuredImage?: Media
  content: any
  authors?: Author[]
  categories?: Category[]
  createdAt: string
  publishedAt?: string
}

interface ArticlePreviewClientProps {
  initialArticle: Article
  slug: string
}

export function ArticlePreviewClient({ initialArticle, slug }: ArticlePreviewClientProps) {
  const [article, setArticle] = useState(initialArticle)
  const [lastUpdate, setLastUpdate] = useState(new Date().toISOString())

  // Efeito de Auto-Refresh (a principal diferença desta página)
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const response = await fetch(
          `/api/articles?where[slug][equals]=${slug}&draft=true&depth=10`, // Busca rascunho
        )
        const data = await response.json()

        if (data.docs && data.docs.length > 0) {
          const newArticle = data.docs[0]
          if (JSON.stringify(newArticle) !== JSON.stringify(article)) {
            setArticle(newArticle)
            setLastUpdate(new Date().toISOString())
          }
        }
      } catch (error) {
        console.error('Error refreshing preview:', error)
      }
    }, 2000) // Atualiza a cada 2 segundos

    return () => clearInterval(interval)
  }, [slug, article])

  // --- Processamento de Dados (Idêntico ao ArticlePage) ---
  const authors = article.authors?.map((author) => author.name).join(' | ') || 'Redação do Campus'
  const categories = article.categories || []

  const displayDate = new Date(article.publishedAt || article.createdAt)
    .toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
    .replace(',', '')

  const featuredImage = article.featuredImage
  let featuredImageCaption: React.ReactNode = null;
  if (featuredImage?.caption) {
    if (typeof featuredImage.caption === 'object' &&
      featuredImage.caption.root &&
      Array.isArray(featuredImage.caption.root.children)) {
      featuredImageCaption = serializeSlate(featuredImage.caption.root.children);
    }
    else if (typeof featuredImage.caption === 'string') {
      featuredImageCaption = featuredImage.caption;
    }
  }
  if (!featuredImageCaption && featuredImage?.alt) {
    featuredImageCaption = featuredImage.alt;
  }

  let contentNodes = []
  if (article.content) {
    if (Array.isArray(article.content)) {
      contentNodes = article.content
    } else if (article.content.root && Array.isArray(article.content.root.children)) {
      contentNodes = article.content.root.children
    } else if (article.content.children) {
      contentNodes = article.content.children
    }
  }

  return (
    <>
      {/* Estilos Globais (Idêntico ao ArticlePage) */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
            @import url('https://fonts.googleapis.com/css2?family=Quicksand:wght@400;500;700&display=swap');
            @import url('https://fonts.googleapis.com/css2?family=Rowdies:wght@700&display=swap');

            :root {
              --font-family-quicksand: 'Quicksand', sans-serif;
              --font-family-rowdies: 'Rowdies', sans-serif;
              --text-black: rgba(0, 0, 0, 1);
              --text-link: rgba(108, 3, 24, 1);
              --text-heading: rgba(171, 35, 47, 1);
              --brand-primary: rgba(108, 3, 24, 1);
              --brand-secondary: rgba(171, 35, 47, 1);
            }

            body {
              margin: 0;
              padding: 0;
              background: #f5f5f5;
            }

            .pagina-de-artigo {
              max-width: 420px;
              margin: 0 auto;
              background-color: #ffffff;
              min-height: 100vh;
              font-family: var(--font-family-quicksand);
              color: var(--text-black);
            }

            .slate-content p {
              margin: 1.5rem 0;
              font-size: 14px;
              line-height: 1.7;
              overflow-wrap: break-word;
              word-break: break-word;
              text-align: justify;
            }
            
            .slate-content h2, .slate-content h3 {
              font-family: var(--font-family-rowdies);
              font-weight: 700;
              margin: 2.5rem 0 1rem;
              overflow-wrap: break-word;
              word-break: break-word;
            }
            .slate-content h2 {
              font-size: 18px;
              color: var(--text-heading);
              border-top: 2px solid var(--text-heading);
              padding-top: 0.5rem;
            }
            .slate-content h3 {
              font-size: 16px;
              color: var(--text-black);
            }

            .slate-content a {
              color: var(--text-link);
              font-weight: 700;
              text-decoration: none;
              overflow-wrap: break-word;
              word-break: break-word;
            }
            
            .slate-content ul, .slate-content ol {
              margin: 1.5rem 0;
              padding-left: 1.5rem;
            }
            
            .slate-content li {
              margin: 0.5rem 0;
              padding-left: 0.5rem;
              font-size: 14px;
              overflow-wrap: break-word;
              word-break: break-word;
            }
            
            .slate-content .upload {
              margin: 2rem 0;
              padding: 0;
            }
            .slate-content .upload img {
              width: 100%;
              height: 150px; 
              border-radius: 4px; 
            }
            
            .slate-content .upload figcaption {
              display: block;
              font-size: 10px; 
              color: #555;
              font-style: italic;
              text-align: center;
              margin-top: 0.5rem;
              padding: 0 0.5rem;
              overflow-wrap: break-word;
              word-break: break-word;
            }

            .slate-content .upload figcaption p {
              text-align: center;
              margin: 0;
              padding: 0;
              font-size: 10px;
              line-height: 1.4;
            }

            .category-badges {
              display: flex;
              flex-wrap: wrap;
              gap: 0.5rem;
              margin: 0 0 1rem 0;
            }

            .category-badge {
              display: inline-block;
              padding: 0.25rem 0.75rem;
              border-radius: 12px;
              font-size: 10px;
              font-weight: 600;
              text-transform: uppercase;
              letter-spacing: 0.5px;
            }

            .category-badge.red { background-color: #ffebee; color: #c62828; }
            .category-badge.orange { background-color: #fff3e0; color: #e65100; }
            .category-badge.yellow { background-color: #fffde7; color: #f57f17; }
            .category-badge.green { background-color: #e8f5e9; color: #2e7d32; }
            .category-badge.blue { background-color: #e3f2fd; color: #1565c0; }
            .category-badge.purple { background-color: #f3e5f5; color: #6a1b9a; }
            .category-badge.brown { background-color: #efebe9; color: #4e342e; }
            .category-badge.gray { background-color: #f5f5f5; color: #424242; }

            .last-update {
              position: fixed;
              top: 10px;
              right: 10px;
              background: rgba(0, 0, 0, 0.7);
              color: white;
              padding: 0.5rem 1rem;
              border-radius: 4px;
              font-size: 10px;
              z-index: 2000; /* Acima do ArticleHeader */
            }
          `,
        }}
      />

      {/* Indicador de última atualização */}
      <div className="last-update">
        Atualizado: {new Date(lastUpdate).toLocaleTimeString('pt-BR')}
      </div>

      {/* Layout da Página (Idêntico ao ArticlePage) */}
      <main className="pagina-de-artigo">
        <ArticleHeader />

        <div style={{ padding: '20px 20px 120px 20px' }}>
          <header>
            {categories.length > 0 && (
              <div className="category-badges">
                {categories.map((cat, idx) => (
                  <span key={idx} className={`category-badge ${cat.color || 'gray'}`}>
                    {cat.name}
                  </span>
                ))}
              </div>
            )}

            <h1 style={{
              fontFamily: 'var(--font-family-quicksand)',
              fontWeight: 500,
              fontSize: '20px',
              color: 'var(--text-black)',
              lineHeight: 1.3,
              marginBottom: '0.75rem',
              overflowWrap: 'break-word',
              wordBreak: 'break-word',
            }}>
              {article.title}
            </h1>

            <p style={{
              fontFamily: 'var(--font-family-quicksand)',
              fontWeight: 400,
              fontSize: '10px',
              color: 'var(--text-black)',
              textTransform: 'uppercase',
              margin: 0,
            }}>
              Por {authors}
            </p>

            <p style={{
              fontFamily: 'var(--font-family-quicksand)',
              fontWeight: 400,
              fontSize: '10px',
              color: 'var(--text-black)',
              margin: '0.25rem 0 1.5rem 0',
            }}>
              {displayDate}
            </p>
          </header>

          {featuredImage && (
            <figure style={{ margin: '0 0 1.5rem 0' }}>
              <img
                src={featuredImage.url}
                alt={featuredImage.alt}
                style={{
                  width: '100%',
                  height: 'auto',
                  aspectRatio: '16 / 9',
                  objectFit: 'cover',
                  display: 'block',
                }}
              />
              {featuredImageCaption && (
                <figcaption
                  className="slate-content" // Usa a classe para herdar estilos
                  style={{
                    fontFamily: 'var(--font-family-quicksand)',
                    fontWeight: 400,
                    fontSize: '10px',
                    color: 'var(--text-black)',
                    margin: '0.5rem 0 1.5rem 0',
                    padding: '0 0.5rem',
                    overflowWrap: 'break-word',
                    wordBreak: 'break-word',
                    textAlign: 'center',
                  }}
                >
                  {featuredImageCaption}
                </figcaption>
              )}
            </figure>
          )}

          {contentNodes.length > 0 && (
            <article className="slate-content">{serializeSlate(contentNodes)}</article>
          )}
        </div>
      </main>
    </>
  )
}