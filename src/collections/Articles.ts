import { CollectionConfig } from "payload"
import { slateEditor } from '@payloadcms/richtext-slate'
import { authenticated } from '../access/authenticated'

export const Articles: CollectionConfig = {
  slug: 'articles',
  
  // Admin UI
  admin: {
    defaultColumns: ['title', 'status', 'theme', 'createdAt'],
    useAsTitle: 'title',
    livePreview: {
      url: ({ data }) => {
        const baseUrl = process.env.PAYLOAD_PUBLIC_SERVER_URL || 'http://localhost:3000'
        return `${baseUrl}/preview/${data.slug || 'new'}`
      },
    },
  },

  // Access Control
  access: {
    read: () => true,
    create: ({ req: { user } }) => {
      // Only reporters, editors, art editors, and admins can create
      return ['reporter', 'editor', 'art_editor', 'admin'].includes((user as any)?.role)
    },
    update: ({ req: { user } }) => {
      // Admins and editors can edit everything
      if (['admin', 'editor'].includes((user as any)?.role)) return true
      // Reporters and art editors can only edit their own articles
      return {
        createdBy: { equals: user?.id }
      }
    },
    delete: ({ req: { user } }) => {
      // Only admins and editors can delete
      return ['admin', 'editor'].includes((user as any)?.role)
    },
  },

  fields: [
    {
      type: 'tabs',
      tabs: [
        // Content Tab
        {
          label: 'Content',
          fields: [
            {
              name: 'title',
              type: 'text',
              required: true,
              maxLength: 200,
              admin: {
                description: 'Article title (max 200 characters)',
              }
            },
            {
              name: 'content',
              type: 'richText',
              required: true,
              editor: slateEditor({
                admin: {
                  elements: [
                    'h1',
                    'h2',
                    'h3',
                    'h4',
                    'link',
                    'ul',
                    'ol',
                    'upload',
                    'relationship',
                    'blockquote',
                  ],
                  leaves: [
                    'bold',
                    'italic',
                    'underline',
                    'strikethrough',
                    'code',
                  ],
                },
              }),
            },
          ],
        },

        // Settings Tab
        {
          label: 'Settings',
          fields: [
            {
              name: 'slug',
              type: 'text',
              unique: true,
              required: true,
              admin: {
                description: 'URL-friendly identifier',
              },
              hooks: {
                beforeValidate: [
                  ({ value, data }) => {
                    if (!value && data?.title) {
                      return data.title
                        .toLowerCase()
                        .normalize('NFD')
                        .replace(/[\u0300-\u036f]/g, '')
                        .replace(/[^\w\s-]/g, '')
                        .replace(/\s+/g, '-')
                    }
                    return value
                  }
                ]
              }
            },
            {
              name: 'cardType',
              label: 'Tipo de Card (Layout)',
              type: 'select',
              required: true,
              defaultValue: 'card_normal',
              admin: {
                description: 'Como este artigo deve aparecer nas listagens.',
              },
              options: [
                {
                  label: 'Card Normal (Título + Conteúdo)',
                  value: 'card_normal',
                },
                {
                  label: 'Card Detalhado (Título + Descrição)',
                  value: 'card_detailed',
                },
                {
                  label: 'Só Título',
                  value: 'title_only',
                },
                {
                  label: 'Só Thumbnail (Imagem)',
                  value: 'thumbnail_only',
                },
              ],
            },
            {
              name: 'theme',
              type: 'relationship',
              relationTo: 'themes' as any,
              admin: {
                description: 'Select a theme for this article',
              }
            },
            {
              name: 'featured',
              type: 'checkbox',
              defaultValue: false,
              admin: {
                description: 'Mark as featured article (appears on top)',
              }
            },
            {
              name: 'featuredImage',
              type: 'upload',
              relationTo: 'media',
              admin: {
                description: 'Main featured image for the article',
              }
            },
            {
              name: 'description',
              type: 'textarea',
              maxLength: 300,
              admin: {
                description: 'Short description for previews (max 300 characters)',
              }
            },
            {
              name: 'authors',
              type: 'relationship',
              relationTo: 'users',
              hasMany: true,
              admin: {
                description: 'Select article authors (multiple selection allowed)',
              },
            },
            { 
              name: 'categories',
              type: 'relationship',
              relationTo: 'categories',
              hasMany: true,
              admin: {
                description: 'Select categories for this article',
                allowCreate: true,
                isSortable: true,
              },
            },
          ],
        },

        // Status Tab
        {
          label: 'Status',
          fields: [
            {
              name: 'status',
              type: 'select',
              required: true,
              options: [
                { label: 'Rascunho', value: 'draft' },
                { label: 'Aguardando Aprovação', value: 'pending_approval' },
                { label: 'Publicado', value: 'published' },
                { label: 'Rejeitado', value: 'rejected' },
              ],
              defaultValue: 'draft',
              admin: {
                description: 'Current publication status',
              },
              hooks: {
                beforeChange: [
                  ({ req, value }) => {
                    const userRole = (req.user as any)?.role
                    
                    // Reporters and art editors cannot publish directly
                    if (['reporter', 'art_editor'].includes(userRole) && value === 'published') {
                      return 'pending_approval'
                    }
                    
                    // Only admins and editors can publish
                    if (value === 'published' && !['admin', 'editor'].includes(userRole)) {
                      return 'pending_approval'
                    }
                    
                    return value
                  }
                ]
              }
            },
            {
              name: 'publishedAt',
              type: 'date',
              admin: {
                description: 'Publication date',
                date: {
                  pickerAppearance: 'dayAndTime',
                },
                condition: (data) => data.status === 'published',
              }
            },
            {
              name: 'createdBy',
              type: 'relationship',
              relationTo: 'users',
              admin: {
                readOnly: true,
                description: 'Article creator',
              },
              hooks: {
                beforeChange: [
                  ({ req, value }) => {
                    if (!value && req.user) {
                      return req.user.id
                    }
                    return value
                  }
                ]
              }
            },
          ],
        },
      ],
    },
  ],

  timestamps: true,
  
  versions: {
    drafts: {
      autosave: {
        interval: 100, // Autosave every 100ms for live preview
      },
    },
    maxPerDoc: 50,
  },
}
