import { CollectionConfig } from "payload"
import { slateEditor } from '@payloadcms/richtext-slate'
import { authenticated } from '../access/authenticated'

export const Articles: CollectionConfig = {
  slug: 'articles',
  labels: {
    singular: 'Artigo',
    plural: 'Artigos',
  },
  
  // Admin UI
  admin: {
    defaultColumns: ['title', 'status', 'theme', 'createdAt'],
    useAsTitle: 'title',
    group: 'Content',
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
      
      // Reporters and art editors can edit any article (to change status to pending_approval)
      // This allows them to submit articles for review
      if (['reporter', 'art_editor'].includes((user as any)?.role)) return true
      
      return false
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
              },
              // Reporters can only edit title on their own drafts
              access: {
                update: ({ req, doc }) => {
                  const userRole = (req.user as any)?.role
                  if (['admin', 'editor'].includes(userRole)) return true
                  
                  // Reporters can edit if it's their article and not published
                  if (['reporter', 'art_editor'].includes(userRole)) {
                    return doc?.createdBy === req.user?.id && doc?.status !== 'published'
                  }
                  
                  return false
                }
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
              // Reporters can only edit content on their own drafts
              access: {
                update: ({ req, doc }) => {
                  const userRole = (req.user as any)?.role
                  if (['admin', 'editor'].includes(userRole)) return true
                  
                  // Reporters can edit if it's their article and not published
                  if (['reporter', 'art_editor'].includes(userRole)) {
                    return doc?.createdBy === req.user?.id && doc?.status !== 'published'
                  }
                  
                  return false
                }
              }
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
              // Control who can change status and to what values
              access: {
                update: ({ req, doc }) => {
                  const userRole = (req.user as any)?.role
                  
                  // Admins and editors can always change status
                  if (['admin', 'editor'].includes(userRole)) return true
                  
                  // Reporters and art editors can only change from draft to pending_approval
                  if (['reporter', 'art_editor'].includes(userRole)) {
                    return doc?.status === 'draft' || doc?.status === 'rejected'
                  }
                  
                  return false
                }
              },
              hooks: {
                beforeChange: [
                  ({ req, value, originalDoc }) => {
                    const userRole = (req.user as any)?.role
                    const currentStatus = originalDoc?.status
                    
                    // Reporters and art editors can only move to pending_approval
                    if (['reporter', 'art_editor'].includes(userRole)) {
                      // They can only change from draft/rejected to pending_approval
                      if (['draft', 'rejected'].includes(currentStatus) && value === 'pending_approval') {
                        return 'pending_approval'
                      }
                      // If they try to publish, force to pending_approval
                      if (value === 'published') {
                        return 'pending_approval'
                      }
                      // Keep current status if they try to change to something else
                      return currentStatus || 'draft'
                    }
                    
                    // Admins and editors have full control
                    if (['admin', 'editor'].includes(userRole)) {
                      return value
                    }
                    
                    // Default: keep current status
                    return currentStatus || 'draft'
                  }
                ]
              },
            },
            {
              name: 'publishedAt',
              type: 'date',
              admin: {
                description: 'Publication date',
                date: {
                  pickerAppearance: 'dayAndTime',
                },
                condition: (data) => data?.status === 'published',
              },
              hooks: {
                beforeChange: [
                  ({ value, originalDoc, data }) => {
                    // If status is changing to 'published' and publishedAt is not set, use current time
                    if (data?.status === 'published' && !value) {
                      return new Date();
                    }
                    // If already published and no change to publishedAt, keep original
                    if (data?.status === 'published' && originalDoc?.status === 'published' && !value) {
                      return originalDoc.publishedAt;
                    }
                    return value;
                  }
                ]
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