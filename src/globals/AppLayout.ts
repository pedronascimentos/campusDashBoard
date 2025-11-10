import type { GlobalConfig, Block } from 'payload'
import { authenticated } from '../access/authenticated'

// Bloco "Featured" ATUALIZADO
const FeaturedBlock: Block = {
  slug: 'featured-article', // O slug permanece o mesmo
  labels: {
    singular: 'Destaque (Artigo ou Vídeo)',
    plural: 'Destaques (Artigo ou Vídeo)',
  },
  fields: [
    {
      name: 'featureType',
      label: 'Tipo de Destaque',
      type: 'radio',
      options: [
        {
          label: 'Artigo',
          value: 'article',
        },
        {
          label: 'Vídeo (YouTube)',
          value: 'video',
        },
      ],
      defaultValue: 'article',
      admin: {
        layout: 'horizontal',
      }
    },
    
    // --- Campo Condicional para Artigo ---
    {
      name: 'article',
      label: 'Artigo em Destaque',
      type: 'relationship',
      relationTo: 'articles',
      required: true,
      admin: {
        condition: (_, siblingData) => siblingData.featureType === 'article',
      },
    },

    // --- Campos Condicionais para Vídeo ---
    {
      name: 'videoFeature',
      label: 'Destaque de Vídeo',
      type: 'group',
      admin: {
        condition: (_, siblingData) => siblingData.featureType === 'video',
      },
      fields: [
        {
          name: 'videoUrl',
          label: 'URL do Vídeo (YouTube)',
          type: 'text',
          required: true,
        },
        {
          name: 'isLive',
          label: 'É uma transmissão ao vivo?',
          type: 'checkbox',
          defaultValue: false,
        },
      ]
    },
    {
      name: 'isHidden',
      label: 'Ocultar Seção',
      type: 'checkbox',
      defaultValue: false,
    },
  ],
}

// Bloco "Category" (Corrigido)
const CategorySectionBlock: Block = {
  slug: 'category-section',
  labels: { 
    singular: 'Seção de Categoria',
    plural: 'Seções de Categoria',
  },
  fields: [
    {
      name: 'category',
      type: 'relationship',
      relationTo: 'categories',
      required: true,
      hasMany: false,
      label: 'Categoria Selecionada',
    },
    {
      name: 'isHidden',
      type: 'checkbox',
      label: 'Esconder esta seção?',
      defaultValue: false,
    },
  ],
}

// Bloco "Reels" (Corrigido)
const ReelsSectionBlock: Block = {
  slug: 'reels-section',
  labels: {
    singular: 'Seção de Vídeos Curtos',
    plural: 'Seções de Vídeos Curtos',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      label: 'Título da Seção',
      defaultValue: 'Vídeos Curtos',
    },
    {
      name: 'reels',
      type: 'relationship',
      relationTo: 'reels',
      hasMany: true,
      label: 'Vídeos',
    },
    {
      name: 'isHidden',
      type: 'checkbox',
      label: 'Esconder esta seção?',
      defaultValue: false,
    },
  ],
}

// Configuração do Global
export const AppLayout: GlobalConfig = {
  slug: 'app-layout',
  label: 'Layout do Aplicativo',
  access: {
    read: () => true,
    update: authenticated,
  },
  fields: [
    {
      name: 'sections',
      type: 'blocks',
      label: 'Seções do Aplicativo',
      minRows: 1,
      admin: {
        isSortable: true,
      },
      blocks: [
        FeaturedBlock, // Atualizado
        CategorySectionBlock,
        ReelsSectionBlock,
      ],
    },
  ],
}