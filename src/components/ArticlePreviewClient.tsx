'use client'

import { useEffect, useState } from 'react'
import { serializeSlate } from '@/utilities/serializeSlate'

/**
 * ArticlePreviewClient Component
...
 */

interface ArticlePreviewClientProps {
  initialArticle: any
  slug: string
}

export function ArticlePreviewClient({ initialArticle, slug }: ArticlePreviewClientProps) {
  const [article, setArticle] = useState(initialArticle)
  const [lastUpdate, setLastUpdate] = useState(new Date().toISOString())

  // Auto-refresh effect
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const response = await fetch(
          `/api/articles?where[slug][equals]=${slug}&draft=true&depth=2&limit=1`,
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
    }, 2000)

    return () => clearInterval(interval)
  }, [slug, article])

  // Process data for display
  const authors =
    (article.authors as any[])?.map((author) => author.name).join(' | ') || 'Redação do Campus'

  const categories = (article.categories as any[]) || []

  const displayDate = new Date(article.publishedAt || article.createdAt)
    .toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
    .replace(',', '')

  const featuredImage =
    article.featuredImage && typeof article.featuredImage === 'object'
      ? (article.featuredImage as any)
      : null

  const featuredImageCaption = featuredImage?.caption || featuredImage?.alt || ''

  // ---------------------------------------------------
  // CORREÇÃO DA LÓGICA DE CONTEÚDO
  // ---------------------------------------------------
  // Encontra o array de 'children' independentemente do formato
  let contentNodes = []
  if (article.content) {
    if (Array.isArray(article.content)) {
      // Formato antigo/simples: article.content é o array
      contentNodes = article.content
    } else if (article.content.root && Array.isArray(article.content.root.children)) {
      // Formato novo/padrão: article.content é { root: { children: [...] } }
      contentNodes = article.content.root.children
    }
  }
  // ---------------------------------------------------
  // FIM DA CORREÇÃO
  // ---------------------------------------------------

  return (
    <>
      {/* Estilos Globais */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
            /* ... (Seu CSS está correto e permanece o mesmo) ... */

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
            }
            
            .slate-content h2 {
              font-family: var(--font-family-rowdies);
              font-size: 18px;
              font-weight: 700;
              color: var(--text-heading);
              border-top: 2px solid var(--text-heading);
              padding-top: 0.5rem;
              margin: 2.5rem 0 1rem;
              overflow-wrap: break-word;
              word-break: break-word;
            }
            
            .slate-content h3 {
              font-family: var(--font-family-rowdies);
              font-size: 16px;
              font-weight: 700;
              color: var(--text-black);
              margin: 2rem 0 1rem;
              overflow-wrap: break-word;
              word-break: break-word;
            }

            .slate-content a {
              color: var(--text-link);
              font-weight: 700;
              text-decoration: none;
              overflow-wrap: break-word;
              word-break: break-word;
            }
            
            .slate-content ul,
            .slate-content ol {
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

            /* Category badges */
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
              z-index: 1000;
            }
          `,
        }}
      />

      {/* Indicador de última atualização */}
      <div className="last-update">
        Atualizado: {new Date(lastUpdate).toLocaleTimeString('pt-BR')}
      </div>

      {/* Estrutura da Página */}
      <div className="pagina-de-artigo">
        {/* Header do App */}
        <div
          style={{
            background: 'var(--brand-primary)',
            color: 'white',
            padding: '1rem 1.5rem',
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            boxShadow: '0px 0.33px 0px 0px rgba(0,0,0,0.5)',
          }}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M16 7H3.83L9.42 1.41L8 0L0 8L8 16L9.41 14.59L3.83 9H16V7Z" fill="white" />
          </svg>
          <img
            src="https://s3-alpha-sig.figma.com/img/d660/9611/49b951c89f5c404d16e788afb441a115?Expires=1731283200&Key-Pair-Id=K1F2S4F31828P4&Signature=gK-9c-x1J~t663p4p8aWn14Ff2q2-3m~FvQ~7Vp2r639-6zN6-g3iW2uF-t~59kP~K-28yJd2V80B9y4R-3t0Q64tE9a7eU0eN5M-iA6zI-d7x7o3y-N1f9~vV3jY2T2rR0h5rS8pL1Z1oW~2hN-c5T3aR2bM0fE6tG1qW-k~y~4z-b8d1v-s6~9a4w~8oR-c5rT~1eW-f3r2w-u5o3p~9l-b2v-i4t-y-q6w~7u~9p-a~2f-e8n-j5o~k~5c-o~l-x~5a-c~7~9w__"
            style={{ width: '130px', height: 'auto' }}
            alt="logo"
          />
        </div>

        {/* Imagem Destacada */}
        {featuredImage && (
          <img
            src={featuredImage.url}
            alt={featuredImage.alt}
            style={{
              width: '100%',
              height: '180px',
              objectFit: 'cover',
              objectPosition: 'center',
              display: 'block',
            }}
          />
        )}

        {/* Área de Conteúdo */}
        <div style={{ padding: '1.5rem 24px 2rem 24px' }}>
          {/* Legenda */}
          {featuredImageCaption && (
            <figcaption
              style={{
                fontFamily: 'var(--font-family-quicksand)',
                fontWeight: 400,
                fontSize: '10px',
                color: 'var(--text-black)',
                margin: '0 0 1.5rem 0',
                padding: '0 0.5rem',
                overflowWrap: 'break-word',
                wordBreak: 'break-word',
              }}
            >
              {featuredImageCaption}
            </figcaption>
          )}

          {/* Header do Artigo */}
          <header>
            {/* Category Badges */}
            {categories.length > 0 && (
              <div className="category-badges">
                {categories.map((cat: any, idx: number) => (
                  <span key={idx} className={`category-badge ${cat.color || 'gray'}`}>
                    {cat.name}
                  </span>
                ))}
              </div>
            )}

            <h1
              style={{
                fontFamily: 'var(--font-family-quicksand)',
                fontWeight: 500,
                fontSize: '20px',
                color: 'var(--text-black)',
                lineHeight: 1.3,
                marginBottom: '0.75rem',
                overflowWrap: 'break-word',
                wordBreak: 'break-word',
              }}
            >
              {article.title}
            </h1>

            <p
              style={{
                fontFamily: 'var(--font-family-quicksand)',
                fontWeight: 400,
                fontSize: '10px',
                color: 'var(--text-black)',
                textTransform: 'uppercase',
                margin: 0,
              }}
            >
              Por {authors}
            </p>

            <p
              style={{
                fontFamily: 'var(--font-family-quicksand)',
                fontWeight: 400,
                fontSize: '10px',
                color: 'var(--text-black)',
                margin: '0.25rem 0 1.5rem 0',
              }}
            >
              {displayDate}
            </p>
          </header>

          {/* ---------------------------------------------------
            CORREÇÃO DA CONDIÇÃO DE RENDERIZAÇÃO
            ---------------------------------------------------
          */}
          {/* Renderiza se contentNodes (o array) tiver itens */}
          {contentNodes.length > 0 && (
            <article className="slate-content">{serializeSlate(contentNodes)}</article>
          )}
          {/* ---------------------------------------------------
            FIM DA CORREÇÃO
            ---------------------------------------------------
          */}
        </div>
      </div>
    </>
  )
}