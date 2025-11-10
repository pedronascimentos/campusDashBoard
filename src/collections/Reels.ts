import { CollectionConfig, CollectionBeforeChangeHook } from 'payload' // 1. Importar o tipo de Hook
import { authenticated } from '../access/authenticated'
import { Reel } from '@/payload-types' // 2. Importar o tipo Reel

/**
 * Hook para buscar o CÓDIGO EMBED do TikTok via oEmbed API.
 * Executa no servidor antes de salvar.
 */
// 3. Tipar a função do hook
const fetchTikTokEmbed: CollectionBeforeChangeHook<Reel> = async ({ data, operation }) => {
  // Executa apenas na criação ou atualização E se uma URL estiver presente
  if ((operation === 'create' || operation === 'update') && data.url) {
    
    // Só tenta se for TikTok
    if (data.platform === 'tiktok') {
      try {
        // URL da API oEmbed pública do TikTok
        const oEmbedUrl = `https://www.tiktok.com/oembed?url=${encodeURIComponent(data.url)}`;
        const response = await fetch(oEmbedUrl);

        if (!response.ok) {
          throw new Error(`Falha ao buscar oEmbed do TikTok: ${response.statusText}`);
        }
        
        const json: any = await response.json(); // 'any' aqui é aceitável para uma resposta de API externa
        
        // Salva o HTML do embed no novo campo
        if (json.html) {
          data.embedHtml = json.html;
          // O oEmbed também retorna a thumbnail, vamos salvar
          data.thumbnailUrl = json.thumbnail_url || null; 
        } else {
          data.embedHtml = null; 
          data.thumbnailUrl = null;
        }
      } catch (error) { // 4. Corrigir o 'catch'
        // 'error' é 'unknown', então verificamos se é uma instância de Error
        if (error instanceof Error) {
          console.error('Erro no hook do TikTok:', error.message);
        } else {
          console.error('Erro desconhecido no hook do TikTok:', error);
        }
        data.embedHtml = null; // Limpa em caso de erro
        data.thumbnailUrl = null;
      }
    } else {
      // Limpa os campos se for Reels ou YouTube
      data.embedHtml = null;
      data.thumbnailUrl = null;
    }
  }
  return data;
}

export const Reels: CollectionConfig = {
  slug: 'reels',
  labels: {
    singular: 'Reel',
    plural: 'Reels',
  },
  hooks: {
    beforeChange: [fetchTikTokEmbed],
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'platform', 'url'],
    group: 'Conteúdo',
  },
  access: {
    read: () => true,
    create: authenticated,
    update: authenticated,
    delete: authenticated,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      label: 'Título (ex: "Dica de IA")',
    },
    {
      name: 'url',
      type: 'text',
      required: true,
      label: 'URL do Vídeo (TikTok, Reels ou YouTube)',
    },
    {
      name: 'platform',
      type: 'select',
      required: true,
      options: [
        { label: 'TikTok', value: 'tiktok' },
        { label: 'Reels (Instagram)', value: 'reels' },
        { label: 'YouTube', value: 'youtube' }, 
      ],
    },
    {
      name: 'embedHtml',
      type: 'text',
      label: 'HTML do Embed (Automático p/ TikTok)',
      admin: {
        readOnly: true,
        position: 'sidebar',
      },
    },
    {
      name: 'thumbnailUrl',
      type: 'text',
      label: 'URL da Thumbnail (Automático p/ TikTok)',
      admin: {
        readOnly: true,
        position: 'sidebar',
      },
    },
  ],
}