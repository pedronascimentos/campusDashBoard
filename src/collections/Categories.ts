import type { CollectionConfig } from 'payload'
import { authenticated } from '../access/authenticated'

export const Categories: CollectionConfig = {
  slug: 'categories',
  
  admin: {
    // Hide from sidebar - only accessible via inline creation in Articles
    hidden: true,
    useAsTitle: 'name',
    defaultColumns: ['name', 'slug', 'color'],
    group: 'Conteúdo', // Adicione um grupo para organização
  },

  access: {
    read: () => true,
    create: authenticated,
    update: authenticated,
    delete: authenticated,
  },

  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        description: 'Category name (e.g., "Sports", "Technology", "Culture")',
      },
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        description: 'URL-friendly identifier',
      },
      hooks: {
        beforeValidate: [
          ({ value, data }) => {
            if (!value && data?.name) {
              return data.name
                .toLowerCase()
                .normalize('NFD')
                .replace(/[\u0300-\u036f]/g, '')
                .replace(/[^\w\s-]/g, '')
                .replace(/\s+/g, '-')
            }
            return value
          },
        ],
      },
    },
    {
      name: 'color',
      type: 'select',
      defaultValue: 'gray',
      options: [
        { label: '🔴 Red', value: 'red' },
        { label: '🟠 Orange', value: 'orange' },
        { label: '🟡 Yellow', value: 'yellow' },
        { label: '🟢 Green', value: 'green' },
        { label: '🔵 Blue', value: 'blue' },
        { label: '🟣 Purple', value: 'purple' },
        { label: '🟤 Brown', value: 'brown' },
        { label: '⚫ Gray', value: 'gray' },
      ],
      admin: {
        description: 'Color for visual organization',
      },
    },
    {
      name: 'description',
      type: 'textarea',
      maxLength: 200,
      admin: {
        description: 'Optional description (max 200 characters)',
      },
    },
    {
      name: 'articles',
      label: 'Artigos (Ordem da Categoria)',
      type: 'relationship',
      relationTo: 'articles',
      hasMany: true,
      admin: {
        isSortable: true, 
        description: 'Arraste e solte os artigos para definir a ordem de exibição nesta categoria.',
      }
    }
  ],

  timestamps: true,
}
