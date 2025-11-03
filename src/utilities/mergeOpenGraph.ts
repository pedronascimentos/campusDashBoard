import type { Metadata } from 'next'
import { getServerSideURL } from './getURL'

const defaultOpenGraph: Metadata['openGraph'] = {
  type: 'website',
  description: 'Campus Multiplataforma - Plataforma de gestão de conteúdo multiplataforma.',
  images: [
    {
      url: `${getServerSideURL()}/campus-logo.png`,
    },
  ],
  siteName: 'Campus Multiplataforma',
  title: 'Campus Multiplataforma',
}

export const mergeOpenGraph = (og?: Metadata['openGraph']): Metadata['openGraph'] => {
  return {
    ...defaultOpenGraph,
    ...og,
    images: og?.images ? og.images : defaultOpenGraph.images,
  }
}
