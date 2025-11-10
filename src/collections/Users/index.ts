import type { CollectionConfig } from 'payload'
import { isAdmin } from '@/utilities/admin'
import { authenticated } from '../../access/authenticated'
import { isAdminFieldAccess } from '@/utilities/notAdmin'
import { isAdminOrSelf, isAdminOrSelfUpdate } from '@/utilities/notAdmin'

export const Users: CollectionConfig = {
  slug: 'users',
  labels: {
    singular: 'Usuário',
    plural: 'Usuários',
  },
  access: {
    admin: authenticated,
    create: isAdmin,
    delete: isAdmin,
    read: isAdminOrSelf,      // ✅ Usuários podem ver seus próprios dados
    update: isAdminOrSelfUpdate, // ✅ Usuários podem atualizar seus próprios dados
  },
  admin: {
    defaultColumns: ['name', 'role', 'email'],
    useAsTitle: 'name',
    group: 'Settings',
    hidden: ({ user }) => !user || user.role !== 'admin',
  },
  auth: true,
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'role',
      type: 'select',
      required: true,
      defaultValue: 'reporter',
      options: [
        { label: 'Admin', value: 'admin' },
        { label: 'Editor', value: 'editor' },
        { label: 'Reporter', value: 'reporter' },
        { label: 'Editor de Arte', value: 'art_editor' },
      ],
      access: {
        // Apenas admins podem alterar roles
        update: isAdminFieldAccess,
      },
      admin: {
        description: 'User role determines access and permissions',
      },
    },
  ],
  timestamps: true,
}