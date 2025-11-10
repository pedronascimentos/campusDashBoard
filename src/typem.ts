// src/types/compat.ts
import type { Article as PayloadArticle } from '@/payload-types'

// Alias para compatibilidade com código antigo
export type Post = PayloadArticle
export type Article = PayloadArticle

// Re-export outros tipos que você usa
export type { Category, Media, User, Theme } from '@/payload-types'