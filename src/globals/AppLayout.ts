// src/globals/AppLayout.ts

// 1. Importe 'Block' e 'GlobalConfig' de 'payload/types'
import type { GlobalConfig, Block } from 'payload'
import { authenticated } from '../access/authenticated'


// Definições dos Blocos de Seção
const FeaturedArticleBlock: Block = {
  slug: 'featured-article',
  // 3. 'label' deve ser 'labels' (plural) e um objeto
  labels: {
    singular: 'Destaque',
    plural: 'Artigos em Destaque',
  },
  fields: [
    {
      name: 'article',
      type: 'relationship',
      relationTo: 'articles',
      required: true,
      hasMany: false,
      label: 'Artigo Selecionado',
    },
    {
      name: 'isHidden',
      type: 'checkbox',
      label: 'Esconder esta seção?',
      defaultValue: false,
    },
  ],
}

const CategorySectionBlock: Block = {
  slug: 'category-section',
  labels: { // 3. Correção
    singular: 'Categorias',
    plural: 'Seções de Categoria',
  },
  fields: [
    {
      name: 'category',
      type: 'relationship',
      relationTo: 'categories', // 4. Correção
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

const ReelsSectionBlock: Block = {
  slug: 'reels-section',
  labels: { // 3. Correção
    singular: 'Videos Curtos',
    plural: 'Seções de Vídeos',
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
      relationTo: 'reels', // 4. Correção
      hasMany: true,
      isSortable: true,
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
      // 5. 'isSortable' para 'blocks' deve estar DENTRO de 'admin'
      admin: {
        isSortable: true,
      },
      blocks: [
        FeaturedArticleBlock,
        CategorySectionBlock,
        ReelsSectionBlock,
      ],
    },
  ],
}