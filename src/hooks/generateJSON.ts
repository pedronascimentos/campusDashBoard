import { Payload } from 'payload'
import fs from 'fs/promises'
import path from 'path'
import { getYoutubeVideoId } from '@/utilities/youtubeHelper'
import { AppLayout, Article, Category, Reel } from '@/payload-types' 

/**
 * Serializa um artigo para o formato resumido (usado em listas).
 */
// 1. Tipagem forte para 'article' (pode ser objeto, id, ou nulo)
function serializeArticle(article: Article | number | string | null | undefined) {
  // Se o artigo não estiver populado (depth baixo), retorna nulo
  if (typeof article !== 'object' || !article?.id) {
    return null;
  }
  
  return {
    id: article.id,
    slug: article.slug,
    title: article.title,
    description: article.description,
    thumbnail: extractThumbnail(article),
    authors: article.authors?.map((a: any) => ({
      name: a.name,
      photo: a.photo?.url, 
    })) || [],
    publishedAt: article.publishedAt,
  }
}

/**
 * Serializa um artigo para o formato completo (detalhes).
 */
function serializeArticleFull(article: Article) {
  return {
    ...serializeArticle(article),
    content: article.content, 
  }
}

/**
 * Extrai a thumbnail (imagem de destaque).
 */
function extractThumbnail(article: Article) {
  if (typeof article.featuredImage === 'object' && article.featuredImage?.url) {
    return article.featuredImage.url
  }
  return null
}

/**
 * Gera os arquivos JSON para o feed do aplicativo.
 */
export async function generateJSON(payload: Payload) {
  try {
    const appLayout: AppLayout = await payload.findGlobal({
      slug: 'app-layout',
      depth: 10, 
    })

    if (!appLayout || !appLayout.sections) {
      throw new Error('AppLayout global não encontrado ou está vazio.');
    }

    // Os tipos que esperamos dos nossos blocos (baseado no AppLayout.ts)
    // Usar AppLayout['sections'][number] é mais seguro que [0]
    type SectionArrayType = NonNullable<AppLayout['sections']>;
    
    // 2. Extrai o tipo de união dos membros do array (BlocoA | BlocoB | ...)
    type SectionMemberType = SectionArrayType[number];

    // 3. Usa o tipo 'SectionMemberType' para extrair os blocos
    type FeaturedBlockType = Extract<SectionMemberType, { blockType: 'featured-article' }>;
    type CategoryBlockType = Extract<SectionMemberType, { blockType: 'category-section' }>;
    type ReelsBlockType = Extract<SectionMemberType, { blockType: 'reels-section' }>;

    const featuredSection = appLayout.sections.find(
      (s): s is FeaturedBlockType => s.blockType === 'featured-article'
    );
    const categorySections = appLayout.sections.filter(
      (s): s is CategoryBlockType => s.blockType === 'category-section' 
    );
    const reelsSection = appLayout.sections.find(
      (s): s is ReelsBlockType => s.blockType === 'reels-section'
    );

    // Processar Destaque (Tipagem segura)
    let featuredItem: any = null;
    if (featuredSection) {
      if (featuredSection.featureType === 'video' && featuredSection.videoFeature) {
        featuredItem = {
          type: 'video',
          title: featuredSection.videoFeature.videoUrl, 
          url: featuredSection.videoFeature.videoUrl,
          isLive: featuredSection.videoFeature.isLive,
          videoId: getYoutubeVideoId(featuredSection.videoFeature.videoUrl),
        };
      } else if (featuredSection.featureType === 'article' && featuredSection.article) {
        featuredItem = serializeArticle(featuredSection.article);
      }
    }

    // Processar Seções de Categoria (Tipagem segura)
    const themes = categorySections.map(section => {
      // 2. Adicionar type guard para 'category'
      const category = section.category;
      if (typeof category !== 'object' || !category?.id) return null;

      const articles = (category.articles as Article[])?.map(serializeArticle).filter(Boolean) || [];
      
      return {
        id: category.id,
        name: category.name,
        articles: articles,
      }
    }).filter(Boolean); 

    // Processar Seção de Reels (Tipagem segura)
    const socialVideos = reelsSection?.reels?.map((reel: Reel | string | number | null | undefined) => { // 3. Tipagem forte
      // 4. Adicionar type guard para 'reel'
      if (typeof reel !== 'object' || !reel?.id) return null;
      
      return {
        id: reel.id,
        platform: reel.platform,
        url: reel.url,
        embedHtml: reel.embedHtml, 
        thumbnail: reel.thumbnailUrl, 
        title: reel.title,
      }
    }).filter(Boolean) || [];


    // Montar estrutura do feed final
    const feed = {
      version: '1.1', 
      generatedAt: new Date().toISOString(),
      featured: featuredItem,
      themes: themes,
      socialVideos: socialVideos,
    }

    // Salvar feed.json
    const cdnPath = process.env.CDN_PATH || path.resolve(process.cwd(), '.cdn');
    const feedPath = path.join(cdnPath, 'feed.json');
    
    await fs.mkdir(cdnPath, { recursive: true });
    await fs.writeFile(feedPath, JSON.stringify(feed, null, 2));

    // Salvar artigos individuais
    const allArticles = await payload.find({
      collection: 'articles',
      where: { status: { equals: 'published' } },
      depth: 2, 
      limit: 1000,
    });

    const articlesDir = path.join(cdnPath, 'articles');
    await fs.mkdir(articlesDir, { recursive: true });
    
    for (const article of allArticles.docs) {
      const articlePath = path.join(articlesDir, `${article.id}.json`);
      await fs.writeFile(
        articlePath,
        JSON.stringify(serializeArticleFull(article), null, 2)
      );
    }

    if (process.env.CLOUDFLARE_API_TOKEN) {
      // Lógica de invalidação...
    }

    console.log('✅ Feed gerado com sucesso! (v1.1)');
    
  } catch (error) {
    console.error('❌ Erro ao gerar feed:', error);
    throw error;
  }
}