import type { CollectionConfig } from 'payload'
import { authenticated } from '../access/authenticated'

/**
 * Themes Collection
 * * Comprehensive theme management system for application-wide visual customization.
 * This collection enables complete control over the application's visual identity,
 * including color schemes, typography, spacing, borders, shadows, and component-specific
 * styling. Themes can be applied globally or conditionally based on user preferences,
 * device types, or content categories.
 * * ## Architecture & Design Philosophy:
 * The theme system is built on a token-based design system approach, where:
 * 1. **Design Tokens**: Atomic design values (colors, font sizes, spacing units)
 * 2. **Component Tokens**: Component-specific styling built from design tokens
 * 3. **Semantic Tokens**: Contextual tokens (success, error, warning colors)
 * 4. **Theme Variants**: Different color modes (light, dark, high-contrast)
 * * ## Key Features:
 * - **Color System**: Primary, secondary, accent colors with automatic shade generation
 * - **Typography**: Complete font family, size, weight, and line-height control
 * - **Spacing System**: Consistent spacing scale for margins, padding, gaps
 * - **Component Theming**: Button, card, input, navigation component customization
 * - **Dark/Light Modes**: Automatic theme variant generation
 * - **Accessibility**: WCAG contrast checking and accessible color combinations
 * - **Live Preview**: Real-time theme preview in admin interface
 * - **Export/Import**: JSON export for theme backup and sharing
 * * ## Use Cases:
 * - Multi-brand support (different themes for different content sections)
 * - Seasonal theme variations (holiday themes, event-specific branding)
 * - User preference themes (light/dark mode, accessibility themes)
 * - Content category theming (sports section vs. news section)
 * - White-label applications (customizable branding per client)
 * * ## Integration:
 * - Frontend apps consume theme JSON via CDN
 * - Themes can be assigned to articles, sections, or user preferences
 * - CSS variables are auto-generated from theme configuration
 * - Mobile apps receive theme configuration on app launch
 * * ## Access Control:
 * - Read: Public (for frontend consumption)
 * - Create/Update/Delete: Authenticated admins only
 */
export const Themes: CollectionConfig = {
  slug: 'themes',
  labels: {
    singular: 'Tema',
    plural: 'Temas',
  },
  
  admin: {
    defaultColumns: ['name', 'isActive', 'isDefault', 'updatedAt'],
    useAsTitle: 'name',
    description: 'Gerencie temas, cores, tipografia e estilos visuais da aplicação',
    group: 'Configurações',
  },

  access: {
    // Public read access for frontend apps
    read: () => true,
    // Only authenticated admins can modify themes
    create: authenticated,
    update: authenticated,
    delete: authenticated,
  },

  fields: [
    // Theme Identity
    {
      name: 'name',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        description: 'Nome do tema (ex: "Campus Padrão", "Modo Escuro", "Alto Contraste")',
      },
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      index: true,
      admin: {
        description: 'Identificador amigável para URL (API)',
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
      name: 'description',
      type: 'textarea',
      admin: {
        description: 'Descrição deste tema e quando usá-lo',
      },
    },
    {
      name: 'isActive',
      type: 'checkbox',
      defaultValue: true,
      admin: {
        position: 'sidebar',
        description: 'Ativar/desativar este tema',
      },
    },
    {
      name: 'isDefault',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        position: 'sidebar',
        description: 'Definir como tema padrão (apenas um deve ser padrão)',
      },
    },

    // Color System
    {
      name: 'colors',
      type: 'group',
      fields: [
        // Primary Colors
        {
          name: 'primary',
          type: 'group',
          label: 'Paleta de Cores Primária',
          fields: [
            {
              name: 'main',
              type: 'text',
              required: true,
              defaultValue: '#1976d2',
              admin: {
                description: 'Cor principal da marca (formato hex: #1976d2)',
                placeholder: '#1976d2',
              },
            },
            {
              name: 'light',
              type: 'text',
              admin: {
                description: 'Variante mais clara (auto-gerada se vazia)',
                placeholder: '#42a5f5',
              },
            },
            {
              name: 'dark',
              type: 'text',
              admin: {
                description: 'Variante mais escura (auto-gerada se vazia)',
                placeholder: '#1565c0',
              },
            },
            {
              name: 'contrast',
              type: 'text',
              defaultValue: '#ffffff',
              admin: {
                description: 'Cor do texto sobre fundo primário',
                placeholder: '#ffffff',
              },
            },
          ],
        },
        
        // Secondary Colors
        {
          name: 'secondary',
          type: 'group',
          label: 'Paleta de Cores Secundária',
          fields: [
            {
              name: 'main',
              type: 'text',
              required: true,
              defaultValue: '#dc004e',
              admin: {
                description: 'Cor secundária da marca',
                placeholder: '#dc004e',
              },
            },
            {
              name: 'light',
              type: 'text',
              admin: {
                description: 'Variante mais clara',
                placeholder: '#f50057',
              },
            },
            {
              name: 'dark',
              type: 'text',
              admin: {
                description: 'Variante mais escura',
                placeholder: '#c51162',
              },
            },
            {
              name: 'contrast',
              type: 'text',
              defaultValue: '#ffffff',
              admin: {
                description: 'Cor do texto sobre fundo secundário',
              },
            },
          ],
        },

        // Accent/Tertiary Color
        {
          name: 'accent',
          type: 'group',
          label: 'Cor de Destaque',
          fields: [
            {
              name: 'main',
              type: 'text',
              defaultValue: '#ff9800',
              admin: {
                description: 'Cor de destaque para ênfases e CTAs',
              },
            },
            {
              name: 'contrast',
              type: 'text',
              defaultValue: '#000000',
            },
          ],
        },

        // Background Colors
        {
          name: 'background',
          type: 'group',
          label: 'Cores de Fundo',
          fields: [
            {
              name: 'default',
              type: 'text',
              required: true,
              defaultValue: '#ffffff',
              admin: {
                description: 'Cor de fundo padrão',
              },
            },
            {
              name: 'paper',
              type: 'text',
              defaultValue: '#ffffff',
              admin: {
                description: 'Fundo para cards e superfícies elevadas',
              },
            },
            {
              name: 'elevated',
              type: 'text',
              defaultValue: '#f5f5f5',
              admin: {
                description: 'Fundo para cabeçalhos, barras de ferramentas',
              },
            },
          ],
        },

        // Text Colors
        {
          name: 'text',
          type: 'group',
          label: 'Cores de Texto',
          fields: [
            {
              name: 'primary',
              type: 'text',
              required: true,
              defaultValue: '#000000',
              admin: {
                description: 'Cor de texto principal',
              },
            },
            {
              name: 'secondary',
              type: 'text',
              defaultValue: '#757575',
              admin: {
                description: 'Cor de texto secundária/suave',
              },
            },
            {
              name: 'disabled',
              type: 'text',
              defaultValue: '#bdbdbd',
              admin: {
                description: 'Cor de texto desabilitado',
              },
            },
            {
              name: 'hint',
              type: 'text',
              defaultValue: '#9e9e9e',
              admin: {
                description: 'Cor de texto para dicas/placeholders',
              },
            },
          ],
        },

        // Semantic Colors
        {
          name: 'semantic',
          type: 'group',
          label: 'Cores Semânticas',
          fields: [
            {
              name: 'success',
              type: 'text',
              defaultValue: '#4caf50',
              admin: {
                description: 'Cor de estado de sucesso',
              },
            },
            {
              name: 'error',
              type: 'text',
              defaultValue: '#f44336',
              admin: {
                description: 'Cor de estado de erro',
              },
            },
            {
              name: 'warning',
              type: 'text',
              defaultValue: '#ff9800',
              admin: {
                description: 'Cor de estado de aviso',
              },
            },
            {
              name: 'info',
              type: 'text',
              defaultValue: '#2196f3',
              admin: {
                description: 'Cor de estado de informação',
              },
            },
          ],
        },

        // Border and Divider
        {
          name: 'divider',
          type: 'text',
          defaultValue: '#e0e0e0',
          admin: {
            description: 'Cor de borda e divisor',
          },
        },
      ],
    },

    // Typography System
    {
      name: 'typography',
      type: 'group',
      fields: [
        // Font Families
        {
          name: 'fontFamily',
          type: 'group',
          label: 'Famílias de Fonte',
          fields: [
            {
              name: 'primary',
              type: 'text',
              defaultValue: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
              admin: {
                description: 'Família de fonte principal para corpo de texto',
              },
            },
            {
              name: 'heading',
              type: 'text',
              defaultValue: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
              admin: {
                description: 'Família de fonte para cabeçalhos',
              },
            },
            {
              name: 'monospace',
              type: 'text',
              defaultValue: '"Fira Code", "Consolas", "Monaco", monospace',
              admin: {
                description: 'Fonte monoespaçada para blocos de código',
              },
            },
          ],
        },

        // Font Sizes
        {
          name: 'fontSize',
          type: 'group',
          label: 'Tamanhos de Fonte (em pixels)',
          fields: [
            {
              name: 'h1',
              type: 'number',
              defaultValue: 32,
              admin: {
                description: 'Tamanho do Cabeçalho 1',
              },
            },
            {
              name: 'h2',
              type: 'number',
              defaultValue: 28,
            },
            {
              name: 'h3',
              type: 'number',
              defaultValue: 24,
            },
            {
              name: 'h4',
              type: 'number',
              defaultValue: 20,
            },
            {
              name: 'h5',
              type: 'number',
              defaultValue: 18,
            },
            {
              name: 'h6',
              type: 'number',
              defaultValue: 16,
            },
            {
              name: 'body',
              type: 'number',
              defaultValue: 16,
              admin: {
                description: 'Tamanho base do corpo de texto',
              },
            },
            {
              name: 'small',
              type: 'number',
              defaultValue: 14,
              admin: {
                description: 'Tamanho de texto pequeno',
              },
            },
            {
              name: 'caption',
              type: 'number',
              defaultValue: 12,
              admin: {
                description: 'Legenda e texto de ajuda',
              },
            },
          ],
        },

        // Font Weights
        {
          name: 'fontWeight',
          type: 'group',
          label: 'Pesos da Fonte',
          fields: [
            {
              name: 'light',
              type: 'number',
              defaultValue: 300,
            },
            {
              name: 'regular',
              type: 'number',
              defaultValue: 400,
            },
            {
              name: 'medium',
              type: 'number',
              defaultValue: 500,
            },
            {
              name: 'semibold',
              type: 'number',
              defaultValue: 600,
            },
            {
              name: 'bold',
              type: 'number',
              defaultValue: 700,
            },
          ],
        },

        // Line Heights
        {
          name: 'lineHeight',
          type: 'group',
          label: 'Alturas de Linha',
          fields: [
            {
              name: 'tight',
              type: 'number',
              defaultValue: 1.2,
              admin: {
                description: 'Altura de linha justa para cabeçalhos',
              },
            },
            {
              name: 'normal',
              type: 'number',
              defaultValue: 1.5,
              admin: {
                description: 'Altura de linha normal para corpo de texto',
              },
            },
            {
              name: 'relaxed',
              type: 'number',
              defaultValue: 1.75,
              admin: {
                description: 'Altura de linha relaxada para legibilidade',
              },
            },
          ],
        },
      ],
    },

    // Spacing System
    {
      name: 'spacing',
      type: 'group',
      label: 'Escala de Espaçamento (em pixels)',
      admin: {
        description: 'Defina unidades de espaçamento para margens e preenchimentos consistentes',
      },
      fields: [
        { name: 'xs', type: 'number', defaultValue: 4, admin: { description: 'Extra pequeno (4px)' } },
        { name: 'sm', type: 'number', defaultValue: 8, admin: { description: 'Pequeno (8px)' } },
        { name: 'md', type: 'number', defaultValue: 16, admin: { description: 'Médio (16px)' } },
        { name: 'lg', type: 'number', defaultValue: 24, admin: { description: 'Grande (24px)' } },
        { name: 'xl', type: 'number', defaultValue: 32, admin: { description: 'Extra grande (32px)' } },
        { name: 'xxl', type: 'number', defaultValue: 48, admin: { description: '2X grande (48px)' } },
      ],
    },

    // Border Radius
    {
      name: 'borderRadius',
      type: 'group',
      label: 'Raio da Borda (em pixels)',
      fields: [
        { name: 'none', type: 'number', defaultValue: 0 },
        { name: 'sm', type: 'number', defaultValue: 4 },
        { name: 'md', type: 'number', defaultValue: 8 },
        { name: 'lg', type: 'number', defaultValue: 12 },
        { name: 'xl', type: 'number', defaultValue: 16 },
        { name: 'full', type: 'number', defaultValue: 9999, admin: { description: 'Totalmente arredondado (forma de pílula)' } },
      ],
    },

    // Shadows/Elevation
    {
      name: 'shadows',
      type: 'group',
      label: 'Definições de Sombra',
      fields: [
        {
          name: 'sm',
          type: 'text',
          defaultValue: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
          admin: {
            description: 'Sombra pequena (elevação sutil)',
          },
        },
        {
          name: 'md',
          type: 'text',
          defaultValue: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
          admin: {
            description: 'Sombra média (cards)',
          },
        },
        {
          name: 'lg',
          type: 'text',
          defaultValue: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
          admin: {
            description: 'Sombra grande (modais, popovers)',
          },
        },
        {
          name: 'xl',
          type: 'text',
          defaultValue: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
          admin: {
            description: 'Sombra extra grande (sobreposições)',
          },
        },
      ],
    },

    // Component-Specific Theming
    {
      name: 'components',
      type: 'group',
      label: 'Customização de Componentes',
      fields: [
        // Button Styles
        {
          name: 'button',
          type: 'group',
          fields: [
            {
              name: 'borderRadius',
              type: 'number',
              defaultValue: 8,
              admin: {
                description: 'Raio da borda do botão',
              },
            },
            {
              name: 'paddingX',
              type: 'number',
              defaultValue: 16,
              admin: {
                description: 'Preenchimento horizontal',
              },
            },
            {
              name: 'paddingY',
              type: 'number',
              defaultValue: 8,
              admin: {
                description: 'Preenchimento vertical',
              },
            },
          ],
        },

        // Card Styles
        {
          name: 'card',
          type: 'group',
          fields: [
            {
              name: 'borderRadius',
              type: 'number',
              defaultValue: 12,
            },
            {
              name: 'padding',
              type: 'number',
              defaultValue: 16,
            },
            {
              name: 'shadow',
              type: 'select',
              options: [
                { label: 'Nenhuma', value: 'none' },
                { label: 'Pequena', value: 'sm' },
                { label: 'Média', value: 'md' },
                { label: 'Grande', value: 'lg' },
              ],
              defaultValue: 'md',
            },
          ],
        },

        // Input Styles
        {
          name: 'input',
          type: 'group',
          fields: [
            {
              name: 'borderRadius',
              type: 'number',
              defaultValue: 8,
            },
            {
              name: 'borderColor',
              type: 'text',
              defaultValue: '#e0e0e0',
            },
            {
              name: 'focusBorderColor',
              type: 'text',
              defaultValue: '#1976d2',
            },
          ],
        },
      ],
    },

    // Custom CSS
    {
      name: 'customCSS',
      type: 'code',
      admin: {
        language: 'css',
        description: 'CSS personalizado adicional para injetar (apenas usuários avançados)',
      },
    },

    // Metadata
    {
      name: 'metadata',
      type: 'group',
      admin: {
        position: 'sidebar',
      },
      fields: [
        {
          name: 'version',
          type: 'text',
          defaultValue: '1.0.0',
          admin: {
            description: 'Versão do tema para rastrear mudanças',
          },
        },
        {
          name: 'author',
          type: 'text',
          admin: {
            description: 'Autor/criador do tema',
          },
        },
        {
          name: 'tags',
          type: 'text',
          admin: {
            description: 'Tags separadas por vírgula (ex: "escuro, minimalista, corporativo")',
          },
        },
      ],
    },
  ],

  // Hooks for validation and post-processing
  hooks: {
    beforeChange: [
      async ({ data, req }) => {
        // Ensure only one default theme
        if (data.isDefault) {
          const existingDefaults: any = await req.payload.find({
            collection: 'themes' as any,
            where: {
              isDefault: { equals: true },
              id: { not_equals: data.id },
            },
          })

          if (existingDefaults.docs.length > 0) {
            // Unset other defaults
            for (const theme of existingDefaults.docs) {
              await req.payload.update({
                collection: 'themes' as any,
                id: theme.id,
                data: { isDefault: false } as any,
              })
            }
          }
        }

        return data
      },
    ],
    afterChange: [
      async ({ doc }) => {
        console.log(`Tema "${doc.name}" atualizado - frontend deve recarregar a configuração do tema`)
        // TODO: Invalidate theme cache, trigger CDN update
      },
    ],
  },

  timestamps: true,
}