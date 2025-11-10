// @/utilities/fieldAccess.ts
import type { FieldAccess, Access } from 'payload'

/**
 * Field access: apenas admins podem atualizar
 */
export const isAdminFieldAccess: FieldAccess = ({ req }) => {
  // Retorna boolean (não Where query)
  return req.user?.role === 'admin'
}
// @/utilities/usersAccess.ts


/**
 * Permite que admins vejam tudo, outros usuários apenas seus próprios dados
 */
export const isAdminOrSelf: Access = ({ req }) => {
  // Admins podem ver tudo
  if (req.user?.role === 'admin') {
    return true
  }

  // Outros usuários só podem ver seus próprios dados
  if (req.user) {
    return {
      id: {
        equals: req.user.id,
      },
    }
  }

  return false
}

/**
 * Permite que usuários atualizem apenas seus próprios dados
 * (exceto o campo role que é protegido separadamente)
 */
export const isAdminOrSelfUpdate: Access = ({ req }) => {
  // Admins podem atualizar tudo
  if (req.user?.role === 'admin') {
    return true
  }

  // Outros usuários só podem atualizar seus próprios dados
  if (req.user) {
    return {
      id: {
        equals: req.user.id,
      },
    }
  }

  return false
}