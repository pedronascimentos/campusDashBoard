import type { CollectionConfig } from 'payload'
import { authenticated } from '../access/authenticated'

export const Categories: CollectionConfig = {
  slug: 'categories',
  labels: {
    singular: 'Categoria',
    plural: 'Categorias',
  },
  
  admin: {
    // Hide from sidebar - only accessible via inline creation in Articles
    hidden: true,
    useAsTitle: 'name',
    defaultColumns: ['name', 'slug', 'color'],
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
        description: 'Nome da categoria (ex: "Esportes", "Tecnologia", "Cultura")',
      },
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        description: 'Identificador amigável para URL',
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
        { label: '🔴 Vermelho', value: 'red' },
        { label: '🟠 Laranja', value: 'orange' },
        { label: '🟡 Amarelo', value: 'yellow' },
        { label: '🟢 Verde', value: 'green' },
        { label: '🔵 Azul', value: 'blue' },
        { label: '🟣 Roxo', value: 'purple' },
        { label: '🟤 Marrom', value: 'brown' },
        { label: '⚫ Cinza', value: 'gray' },
      ],
      admin: {
        description: 'Cor para organização visual',
      },
    },
    {
      name: 'description',
      type: 'textarea',
      maxLength: 200,
      admin: {
        description: 'Descrição opcional (máx 200 caracteres)',
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