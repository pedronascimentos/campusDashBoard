import type { Access } from 'payload'

/**
 * Define o acesso apenas para usuários com a role 'admin'.
 */
export const isAdmin: Access = ({ req }) => {
  // Se o usuário estiver logado E tiver a role 'admin', permite o acesso.
  if (req.user && req.user.role === 'admin') {
    return true
  }
  
  // Caso contrário, nega o acesso.
  return false
}