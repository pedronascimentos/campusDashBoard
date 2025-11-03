import { CollectionConfig } from 'payload'
import { authenticated } from '../access/authenticated'

export const Reels: CollectionConfig = {
  slug: 'reels',
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
      label: 'URL do Vídeo (TikTok ou Reels)',
    },
    {
      name: 'platform',
      type: 'select',
      required: true,
      options: [
        { label: 'TikTok', value: 'tiktok' },
        { label: 'Reels (Instagram)', value: 'reels' },
      ],
    },
  ],
}