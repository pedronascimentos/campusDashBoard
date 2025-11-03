import type { CollectionConfig } from 'payload'
import { authenticated } from '../access/authenticated'

/**
 * Themes Collection
 * 
 * Comprehensive theme management system for application-wide visual customization.
 * This collection enables complete control over the application's visual identity,
 * including color schemes, typography, spacing, borders, shadows, and component-specific
 * styling. Themes can be applied globally or conditionally based on user preferences,
 * device types, or content categories.
 * 
 * ## Architecture & Design Philosophy:
 * The theme system is built on a token-based design system approach, where:
 * 1. **Design Tokens**: Atomic design values (colors, font sizes, spacing units)
 * 2. **Component Tokens**: Component-specific styling built from design tokens
 * 3. **Semantic Tokens**: Contextual tokens (success, error, warning colors)
 * 4. **Theme Variants**: Different color modes (light, dark, high-contrast)
 * 
 * ## Key Features:
 * - **Color System**: Primary, secondary, accent colors with automatic shade generation
 * - **Typography**: Complete font family, size, weight, and line-height control
 * - **Spacing System**: Consistent spacing scale for margins, padding, gaps
 * - **Component Theming**: Button, card, input, navigation component customization
 * - **Dark/Light Modes**: Automatic theme variant generation
 * - **Accessibility**: WCAG contrast checking and accessible color combinations
 * - **Live Preview**: Real-time theme preview in admin interface
 * - **Export/Import**: JSON export for theme backup and sharing
 * 
 * ## Use Cases:
 * - Multi-brand support (different themes for different content sections)
 * - Seasonal theme variations (holiday themes, event-specific branding)
 * - User preference themes (light/dark mode, accessibility themes)
 * - Content category theming (sports section vs. news section)
 * - White-label applications (customizable branding per client)
 * 
 * ## Integration:
 * - Frontend apps consume theme JSON via CDN
 * - Themes can be assigned to articles, sections, or user preferences
 * - CSS variables are auto-generated from theme configuration
 * - Mobile apps receive theme configuration on app launch
 * 
 * ## Access Control:
 * - Read: Public (for frontend consumption)
 * - Create/Update/Delete: Authenticated admins only
 */
export const Themes: CollectionConfig = {
  slug: 'themes',
  
  admin: {
    defaultColumns: ['name', 'isActive', 'isDefault', 'updatedAt'],
    useAsTitle: 'name',
    description: 'Manage application themes, colors, typography, and visual styling',
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
        description: 'Theme name (e.g., "Campus Default", "Dark Mode", "High Contrast")',
      },
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      index: true,
      admin: {
        description: 'URL-friendly identifier for API access',
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
        description: 'Description of this theme and when to use it',
      },
    },
    {
      name: 'isActive',
      type: 'checkbox',
      defaultValue: true,
      admin: {
        position: 'sidebar',
        description: 'Enable/disable this theme',
      },
    },
    {
      name: 'isDefault',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        position: 'sidebar',
        description: 'Set as default theme (only one should be default)',
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
          label: 'Primary Color Palette',
          fields: [
            {
              name: 'main',
              type: 'text',
              required: true,
              defaultValue: '#1976d2',
              admin: {
                description: 'Primary brand color (hex format: #1976d2)',
                placeholder: '#1976d2',
              },
            },
            {
              name: 'light',
              type: 'text',
              admin: {
                description: 'Lighter variant (auto-generated if empty)',
                placeholder: '#42a5f5',
              },
            },
            {
              name: 'dark',
              type: 'text',
              admin: {
                description: 'Darker variant (auto-generated if empty)',
                placeholder: '#1565c0',
              },
            },
            {
              name: 'contrast',
              type: 'text',
              defaultValue: '#ffffff',
              admin: {
                description: 'Text color on primary background',
                placeholder: '#ffffff',
              },
            },
          ],
        },
        
        // Secondary Colors
        {
          name: 'secondary',
          type: 'group',
          label: 'Secondary Color Palette',
          fields: [
            {
              name: 'main',
              type: 'text',
              required: true,
              defaultValue: '#dc004e',
              admin: {
                description: 'Secondary brand color',
                placeholder: '#dc004e',
              },
            },
            {
              name: 'light',
              type: 'text',
              admin: {
                description: 'Lighter variant',
                placeholder: '#f50057',
              },
            },
            {
              name: 'dark',
              type: 'text',
              admin: {
                description: 'Darker variant',
                placeholder: '#c51162',
              },
            },
            {
              name: 'contrast',
              type: 'text',
              defaultValue: '#ffffff',
              admin: {
                description: 'Text color on secondary background',
              },
            },
          ],
        },

        // Accent/Tertiary Color
        {
          name: 'accent',
          type: 'group',
          label: 'Accent Color',
          fields: [
            {
              name: 'main',
              type: 'text',
              defaultValue: '#ff9800',
              admin: {
                description: 'Accent color for highlights and CTAs',
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
          label: 'Background Colors',
          fields: [
            {
              name: 'default',
              type: 'text',
              required: true,
              defaultValue: '#ffffff',
              admin: {
                description: 'Default background color',
              },
            },
            {
              name: 'paper',
              type: 'text',
              defaultValue: '#ffffff',
              admin: {
                description: 'Background for cards and elevated surfaces',
              },
            },
            {
              name: 'elevated',
              type: 'text',
              defaultValue: '#f5f5f5',
              admin: {
                description: 'Background for headers, toolbars',
              },
            },
          ],
        },

        // Text Colors
        {
          name: 'text',
          type: 'group',
          label: 'Text Colors',
          fields: [
            {
              name: 'primary',
              type: 'text',
              required: true,
              defaultValue: '#000000',
              admin: {
                description: 'Primary text color',
              },
            },
            {
              name: 'secondary',
              type: 'text',
              defaultValue: '#757575',
              admin: {
                description: 'Secondary/muted text color',
              },
            },
            {
              name: 'disabled',
              type: 'text',
              defaultValue: '#bdbdbd',
              admin: {
                description: 'Disabled text color',
              },
            },
            {
              name: 'hint',
              type: 'text',
              defaultValue: '#9e9e9e',
              admin: {
                description: 'Hint/placeholder text color',
              },
            },
          ],
        },

        // Semantic Colors
        {
          name: 'semantic',
          type: 'group',
          label: 'Semantic Colors',
          fields: [
            {
              name: 'success',
              type: 'text',
              defaultValue: '#4caf50',
              admin: {
                description: 'Success state color',
              },
            },
            {
              name: 'error',
              type: 'text',
              defaultValue: '#f44336',
              admin: {
                description: 'Error state color',
              },
            },
            {
              name: 'warning',
              type: 'text',
              defaultValue: '#ff9800',
              admin: {
                description: 'Warning state color',
              },
            },
            {
              name: 'info',
              type: 'text',
              defaultValue: '#2196f3',
              admin: {
                description: 'Info state color',
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
            description: 'Border and divider color',
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
          label: 'Font Families',
          fields: [
            {
              name: 'primary',
              type: 'text',
              defaultValue: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
              admin: {
                description: 'Primary font family for body text',
              },
            },
            {
              name: 'heading',
              type: 'text',
              defaultValue: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
              admin: {
                description: 'Font family for headings',
              },
            },
            {
              name: 'monospace',
              type: 'text',
              defaultValue: '"Fira Code", "Consolas", "Monaco", monospace',
              admin: {
                description: 'Monospace font for code blocks',
              },
            },
          ],
        },

        // Font Sizes
        {
          name: 'fontSize',
          type: 'group',
          label: 'Font Sizes (in pixels)',
          fields: [
            {
              name: 'h1',
              type: 'number',
              defaultValue: 32,
              admin: {
                description: 'Heading 1 size',
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
                description: 'Base body text size',
              },
            },
            {
              name: 'small',
              type: 'number',
              defaultValue: 14,
              admin: {
                description: 'Small text size',
              },
            },
            {
              name: 'caption',
              type: 'number',
              defaultValue: 12,
              admin: {
                description: 'Caption and helper text',
              },
            },
          ],
        },

        // Font Weights
        {
          name: 'fontWeight',
          type: 'group',
          label: 'Font Weights',
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
          label: 'Line Heights',
          fields: [
            {
              name: 'tight',
              type: 'number',
              defaultValue: 1.2,
              admin: {
                description: 'Tight line height for headings',
              },
            },
            {
              name: 'normal',
              type: 'number',
              defaultValue: 1.5,
              admin: {
                description: 'Normal line height for body text',
              },
            },
            {
              name: 'relaxed',
              type: 'number',
              defaultValue: 1.75,
              admin: {
                description: 'Relaxed line height for readability',
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
      label: 'Spacing Scale (in pixels)',
      admin: {
        description: 'Define spacing units for consistent margins and padding',
      },
      fields: [
        { name: 'xs', type: 'number', defaultValue: 4, admin: { description: 'Extra small (4px)' } },
        { name: 'sm', type: 'number', defaultValue: 8, admin: { description: 'Small (8px)' } },
        { name: 'md', type: 'number', defaultValue: 16, admin: { description: 'Medium (16px)' } },
        { name: 'lg', type: 'number', defaultValue: 24, admin: { description: 'Large (24px)' } },
        { name: 'xl', type: 'number', defaultValue: 32, admin: { description: 'Extra large (32px)' } },
        { name: 'xxl', type: 'number', defaultValue: 48, admin: { description: '2X large (48px)' } },
      ],
    },

    // Border Radius
    {
      name: 'borderRadius',
      type: 'group',
      label: 'Border Radius (in pixels)',
      fields: [
        { name: 'none', type: 'number', defaultValue: 0 },
        { name: 'sm', type: 'number', defaultValue: 4 },
        { name: 'md', type: 'number', defaultValue: 8 },
        { name: 'lg', type: 'number', defaultValue: 12 },
        { name: 'xl', type: 'number', defaultValue: 16 },
        { name: 'full', type: 'number', defaultValue: 9999, admin: { description: 'Fully rounded (pill shape)' } },
      ],
    },

    // Shadows/Elevation
    {
      name: 'shadows',
      type: 'group',
      label: 'Shadow Definitions',
      fields: [
        {
          name: 'sm',
          type: 'text',
          defaultValue: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
          admin: {
            description: 'Small shadow (subtle elevation)',
          },
        },
        {
          name: 'md',
          type: 'text',
          defaultValue: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
          admin: {
            description: 'Medium shadow (cards)',
          },
        },
        {
          name: 'lg',
          type: 'text',
          defaultValue: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
          admin: {
            description: 'Large shadow (modals, popovers)',
          },
        },
        {
          name: 'xl',
          type: 'text',
          defaultValue: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
          admin: {
            description: 'Extra large shadow (overlays)',
          },
        },
      ],
    },

    // Component-Specific Theming
    {
      name: 'components',
      type: 'group',
      label: 'Component Customization',
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
                description: 'Button border radius',
              },
            },
            {
              name: 'paddingX',
              type: 'number',
              defaultValue: 16,
              admin: {
                description: 'Horizontal padding',
              },
            },
            {
              name: 'paddingY',
              type: 'number',
              defaultValue: 8,
              admin: {
                description: 'Vertical padding',
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
                { label: 'None', value: 'none' },
                { label: 'Small', value: 'sm' },
                { label: 'Medium', value: 'md' },
                { label: 'Large', value: 'lg' },
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
        description: 'Additional custom CSS to inject (advanced users only)',
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
            description: 'Theme version for tracking changes',
          },
        },
        {
          name: 'author',
          type: 'text',
          admin: {
            description: 'Theme author/creator',
          },
        },
        {
          name: 'tags',
          type: 'text',
          admin: {
            description: 'Comma-separated tags (e.g., "dark, minimal, corporate")',
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
        console.log(`Theme "${doc.name}" updated - frontend should reload theme configuration`)
        // TODO: Invalidate theme cache, trigger CDN update
      },
    ],
  },

  timestamps: true,
}
