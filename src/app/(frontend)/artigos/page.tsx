import React from 'react'
import { FeaturedArticle } from '@/components/FeaturedArticle'
import { CategorySection } from '@/components/CategorySection'
import { ReelsSection } from '@/components/ReelsSection'
import { Header } from '@/components/Header' // Header principal (com logo grande/pequeno)

// (A interface AppLayoutData e a função getAppLayout permanecem iguais)
interface AppLayoutData {
  sections: Array<{
    blockType: string
    article?: any
    category?: any
    title?: string
    reels?: any[]
    isHidden?: boolean
  }>
}

async function getAppLayout(): Promise<AppLayoutData | null> {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'}/api/globals/app-layout?depth=10&draft=false`,
      {
        next: { revalidate: 60 },
      }
    )

    if (!res.ok) return null
    return await res.json()
  } catch (error) {
    console.error('Erro ao buscar layout:', error)
    return null
  }
}


export default async function HomePage() {
  const layout = await getAppLayout()

  if (!layout || !layout.sections) {
    return (
      <main style={{ padding: '2rem', textAlign: 'center' }}>
        <p>Nenhum conteúdo disponível no momento.</p>
      </main>
    )
  }

  // Filtra APENAS os featured-articles visíveis
  const featuredArticleSections = layout.sections.filter(section =>
    section.blockType === 'featured-article' && section.article && !section.isHidden
  );

  // Filtra TODO O RESTO (que não seja featured-article) e que esteja visível
  const otherSections = layout.sections.filter(section =>
    section.blockType !== 'featured-article' && !section.isHidden
  );

  return (
    <>
      {/* Estilos Globais da Homepage */}
      <style dangerouslySetInnerHTML={{
        __html: `
          @import url('https://fonts.googleapis.com/css2?family=Reith+Sans:wght@400;500;700&family=Reith+Serif:wght@400;700&display=swap');
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { font-family: 'Reith Sans', 'Helvetica Neue', Arial, sans-serif; background: #ffffff; color: #141414; line-height: 1.5; }
          .bbc-container { max-width: 1280px; margin: 0 auto; padding: 0 16px; }
          ::-webkit-scrollbar { height: 8px; }
          ::-webkit-scrollbar-track { background: #f0f0f0; }
          ::-webkit-scrollbar-thumb { background: #c0c0c0; border-radius: 4px; }
          ::-webkit-scrollbar-thumb:hover { background: #a0a0a0; }
        `}} />

      <main>
        {/* Header Principal (Sticky, muda de tamanho) */}
        <Header />

        {/* Featured Articles (FORA do container - Largura Total) */}
        {featuredArticleSections.map((section, index) => (
          <FeaturedArticle
            key={`featured-${index}`} // Chave corrigida
            article={section.article}
          />
        ))}


        {/* Outras seções (DENTRO do bbc-container - Com padding) */}
        <div className="bbc-container" style={{ paddingTop: '24px', paddingBottom: '48px' }}>
          {otherSections.map((section, index) => {

            // Category Section
            if (section.blockType === 'category-section' && section.category) {
              return (
                <CategorySection
                  key={`category-${index}`} // Chave corrigida
                  category={section.category}
                />
              )
            }

            // Reels Section
            if (section.blockType === 'reels-section' && section.reels) {
              return (
                <ReelsSection
                  key={`reels-${index}`} // Chave corrigida
                  title={section.title || 'Vídeos'}
                  reels={section.reels}
                />
              )
            }

            return null
          })}
        </div>

        {/* Footer (Permanece o mesmo) */}
        <footer style={{
          background: '#1e1e1e',
          color: '#ffffff',
          padding: '32px 16px',
          marginTop: '48px',
        }}>
          <div className="bbc-container">
            {/* ... conteúdo do footer ... */}
            <p style={{ fontSize: '12px', opacity: 0.6, borderTop: '1px solid #404040', paddingTop: '16px' }}>
              © 2025 Campus News. Todos os direitos reservados.
            </p>
          </div>
        </footer>
      </main>
    </>
  )
}