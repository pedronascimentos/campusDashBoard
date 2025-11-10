import type { CollectionConfig } from 'payload'
import { authenticated } from '../access/authenticated'

/**
 * Coleção de Análises
 * 
 * Rastreamento abrangente de análises para artigos, postagens e interações de usuários.
 * Esta coleção armazena métricas detalhadas, incluindo visualizações de página,
 * engajamento do usuário, tempo gasto no conteúdo, informações do dispositivo,
 * dados geográficos e muito mais.
 * 
 * ## Principais Funcionalidades:
 * - Rastreamento de visualizações de artigos/postagens com identificação única de usuário
 * - Análises baseadas em sessão com informações de dispositivo e navegador
 * - Rastreamento geográfico (país, cidade, região)
 * - Métricas de engajamento (tempo gasto, profundidade de rolagem, interações)
 * - Rastreamento de origem de tráfego e referência
 * - Suporte a agregação de dados em tempo real
 * 
 * ## Controle de Acesso:
 * - Leitura: Apenas usuários autenticados (administradores, editores)
 * - Criação: Acesso público via API (para rastrear eventos do front-end)
 * - Atualização/Exclusão: Apenas usuários autenticados
 * 
 * ## Casos de Uso:
 * - Rastrear desempenho e popularidade de conteúdos
 * - Analisar o comportamento e o engajamento dos usuários
 * - Gerar relatórios de desempenho de conteúdo
 * - Identificar tópicos em alta e conteúdos de alto desempenho
 * - Monitorar fontes de tráfego e referências
 */
export const Analytics: CollectionConfig = {
  slug: 'analytics',
  labels: {
    singular: 'Análise',
    plural: 'Análises',
  },
  
  admin: {
    defaultColumns: ['contentType', 'contentId', 'eventType', 'createdAt'],
    useAsTitle: 'id',
    description: 'Dados de análise e rastreamento de desempenho de conteúdo e engajamento de usuários',
    group: 'Configurações',
  },

  access: {
    // O público pode criar eventos de análise (rastreados a partir do front-end)
    create: () => true,
    // Apenas usuários autenticados podem ler/atualizar/excluir
    read: authenticated,
    update: authenticated,
    delete: authenticated,
  },

  fields: [
    // Referência do Conteúdo
    {
      name: 'contentType',
      type: 'select',
      required: true,
      options: [
        { label: 'Artigo', value: 'article' },
        { label: 'Postagem', value: 'post' },
        { label: 'Mídia', value: 'media' },
        { label: 'Página', value: 'page' },
      ],
      admin: {
        description: 'Tipo de conteúdo que está sendo rastreado',
      },
    },
    {
      name: 'contentId',
      type: 'text',
      required: true,
      index: true,
      admin: {
        description: 'ID do item de conteúdo (artigo, postagem, etc.)',
      },
    },
    {
      name: 'contentTitle',
      type: 'text',
      admin: {
        description: 'Título do conteúdo para referência',
        readOnly: true,
      },
    },

    // Informações do Evento
    {
      name: 'eventType',
      type: 'select',
      required: true,
      options: [
        { label: 'Visualização de Página', value: 'page_view' },
        { label: 'Leitura de Conteúdo', value: 'content_read' },
        { label: 'Reprodução de Vídeo', value: 'video_play' },
        { label: 'Vídeo Concluído', value: 'video_complete' },
        { label: 'Compartilhamento', value: 'share' },
        { label: 'Curtida', value: 'like' },
        { label: 'Comentário', value: 'comment' },
        { label: 'Download', value: 'download' },
      ],
      admin: {
        description: 'Tipo de evento analítico registrado',
      },
    },

    // Informações do Usuário
    {
      name: 'userId',
      type: 'text',
      index: true,
      admin: {
        description: 'Identificador único do usuário (anônimo ou autenticado)',
      },
    },
    {
      name: 'sessionId',
      type: 'text',
      index: true,
      admin: {
        description: 'Identificador da sessão para agrupar atividades do usuário',
      },
    },
    {
      name: 'isAuthenticated',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        description: 'Indica se o usuário estava logado',
      },
    },

    // Informações do Dispositivo e Navegador
    {
      name: 'deviceInfo',
      type: 'group',
      fields: [
        {
          name: 'deviceType',
          type: 'select',
          options: [
            { label: 'Desktop', value: 'desktop' },
            { label: 'Celular', value: 'mobile' },
            { label: 'Tablet', value: 'tablet' },
            { label: 'Outro', value: 'other' },
          ],
        },
        {
          name: 'os',
          type: 'text',
          admin: {
            description: 'Sistema operacional (ex: iOS, Android, Windows)',
          },
        },
        {
          name: 'osVersion',
          type: 'text',
        },
        {
          name: 'browser',
          type: 'text',
          admin: {
            description: 'Nome do navegador (ex: Chrome, Safari, Firefox)',
          },
        },
        {
          name: 'browserVersion',
          type: 'text',
        },
        {
          name: 'screenResolution',
          type: 'text',
          admin: {
            description: 'Resolução da tela (ex: 1920x1080)',
          },
        },
      ],
    },

    // Informações Geográficas
    {
      name: 'geoLocation',
      type: 'group',
      fields: [
        {
          name: 'country',
          type: 'text',
          index: true,
        },
        {
          name: 'countryCode',
          type: 'text',
          admin: {
            description: 'Código ISO do país (ex: BR, US, UK)',
          },
        },
        {
          name: 'region',
          type: 'text',
          admin: {
            description: 'Estado ou região',
          },
        },
        {
          name: 'city',
          type: 'text',
        },
        {
          name: 'latitude',
          type: 'number',
        },
        {
          name: 'longitude',
          type: 'number',
        },
      ],
    },

    // Métricas de Engajamento
    {
      name: 'engagementMetrics',
      type: 'group',
      fields: [
        {
          name: 'timeSpent',
          type: 'number',
          admin: {
            description: 'Tempo gasto no conteúdo (em segundos)',
          },
        },
        {
          name: 'scrollDepth',
          type: 'number',
          admin: {
            description: 'Percentual de rolagem do conteúdo (0–100)',
          },
        },
        {
          name: 'clickCount',
          type: 'number',
          defaultValue: 0,
          admin: {
            description: 'Número de cliques/interações',
          },
        },
        {
          name: 'bounced',
          type: 'checkbox',
          defaultValue: false,
          admin: {
            description: 'Usuário saiu sem interação',
          },
        },
      ],
    },

    // Fonte de Tráfego
    {
      name: 'trafficSource',
      type: 'group',
      fields: [
        {
          name: 'referrer',
          type: 'text',
          admin: {
            description: 'URL de referência',
          },
        },
        {
          name: 'source',
          type: 'select',
          options: [
            { label: 'Direto', value: 'direct' },
            { label: 'Busca', value: 'search' },
            { label: 'Mídia Social', value: 'social' },
            { label: 'E-mail', value: 'email' },
            { label: 'Referência', value: 'referral' },
            { label: 'Outro', value: 'other' },
          ],
        },
        {
          name: 'medium',
          type: 'text',
          admin: {
            description: 'Meio de marketing (ex: cpc, orgânico, e-mail)',
          },
        },
        {
          name: 'campaign',
          type: 'text',
          admin: {
            description: 'Nome da campanha para rastreamento',
          },
        },
        {
          name: 'utmParams',
          type: 'json',
          admin: {
            description: 'Parâmetros UTM completos em formato JSON',
          },
        },
      ],
    },

    // Metadados Adicionais
    {
      name: 'ipAddress',
      type: 'text',
      admin: {
        description: 'Endereço IP do usuário (anonimizado por privacidade)',
      },
    },
    {
      name: 'userAgent',
      type: 'text',
      admin: {
        description: 'String completa do agente do usuário',
      },
    },
    {
      name: 'metadata',
      type: 'json',
      admin: {
        description: 'Metadados adicionais personalizados em formato JSON',
      },
    },
  ],

  // Timestamps são adicionados automaticamente pelo Payload
  timestamps: true,

  // Índices para performance
  // Observação: índices adicionais devem ser criados para:
  // - contentId + createdAt (para consultas temporais)
  // - userId + createdAt (para rastreamento de atividades do usuário)
  // - sessionId (para análise de sessões)
}
