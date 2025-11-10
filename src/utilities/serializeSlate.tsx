import React, { Fragment } from 'react'
import escapeHTML from 'escape-html'
import { getYoutubeVideoId, getYoutubeEmbedUrl } from './youtubeHelper'

// Função auxiliar para verificar se é um nó de texto
const isText = (node: any): boolean => {
  return typeof node.text === 'string'
}

// Função auxiliar para serializar legendas (que também podem ser Rich Text)
const serializeCaption = (caption: any): React.ReactNode => {
  if (!caption) return null;
  let captionNodes = [];
  if (Array.isArray(caption)) { // Formato Slate
    captionNodes = caption;
  } else if (caption.root && Array.isArray(caption.root.children)) { // Formato Lexical (compatibilidade)
    captionNodes = caption.root.children;
  } else if (typeof caption === 'string') { // Formato texto simples (legado)
    return <span dangerouslySetInnerHTML={{ __html: escapeHTML(caption) }} />;
  }
  if (captionNodes.length > 0) {
    return serializeSlate(captionNodes);
  }
  return null;
}

/**
 * Serializa o JSON do Slate para elementos React
 */
export const serializeSlate = (children: any[]): React.ReactElement[] => {
  return children?.map((node, i) => {

    // Serialização de Nós de Texto (com correção de key)
    if (isText(node)) {
      let text = <span dangerouslySetInnerHTML={{ __html: escapeHTML(node.text).replace(/\n/g, '<br />') }} />
      if (node.bold) text = <strong>{text}</strong>
      if (node.code) text = <code>{text}</code>
      if (node.italic) text = <em>{text}</em>
      if (node.underline) text = <span style={{ textDecoration: 'underline' }}>{text}</span>
      if (node.strikethrough) text = <span style={{ textDecoration: 'line-through' }}>{text}</span>
      return <Fragment key={i}>{text}</Fragment>
    }

    if (!node) {
      return null
    }

    const childrenNodes = Array.isArray(node.children) ? node.children : []

    switch (node.type) {
      case 'h1':
        return <h1 key={i}>{serializeSlate(childrenNodes)}</h1>
      case 'h2':
        return <h2 key={i}>{serializeSlate(childrenNodes)}</h2>
      case 'h3':
        return <h3 key={i}>{serializeSlate(childrenNodes)}</h3>
      case 'h4':
        return <h4 key={i}>{serializeSlate(childrenNodes)}</h4>
      case 'h5':
        return <h5 key={i}>{serializeSlate(childrenNodes)}</h5>
      case 'h6':
        return <h6 key={i}>{serializeSlate(childrenNodes)}</h6>
      case 'blockquote':
        return <blockquote key={i}>{serializeSlate(childrenNodes)}</blockquote>
      case 'ul':
        return <ul key={i}>{serializeSlate(childrenNodes)}</ul>
      case 'ol':
        return <ol key={i}>{serializeSlate(childrenNodes)}</ol>
      case 'li':
        return <li key={i}>{serializeSlate(childrenNodes)}</li>

      case 'link':
        const videoId = getYoutubeVideoId(node.url);

        // Se for um link do YouTube, renderiza o embed
        if (videoId) {
          return (
            <div
              key={i}
              className="youtube-embed-container"
              style={{
                position: 'relative',
                width: '100%',
                paddingBottom: '56.25%', // 16:9
                margin: '1.5rem 0',
                overflow: 'hidden',
                borderRadius: '8px',
              }}
            >
              <iframe
                src={getYoutubeEmbedUrl(videoId)}
                title="YouTube video player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                }}
              />
            </div>
          );
        }

        // Se não, renderiza um link padrão
        return (
          <a
            key={i}
            href={escapeHTML(node.url)}
            target={node.newTab ? '_blank' : undefined}
            rel={node.newTab ? 'noopener noreferrer' : 'noopener'}
          >
            {serializeSlate(childrenNodes)}
          </a>
        )

      case 'upload':
        const uploadData = node.value
        if (uploadData && typeof uploadData === 'object') {
          const caption = serializeCaption(uploadData.caption);
          return (
            <figure key={i} className="upload">
              <img src={uploadData.url} alt={uploadData.alt || ''} />
              {caption && (
                <figcaption>
                  {caption}
                </figcaption>
              )}
            </figure>
          )
        }
        return null

      case 'relationship':
        return null // Implemente se necessário

      default:
        // ===============================================
        // INÍCIO DA CORREÇÃO DE HIDRATAÇÃO
        // ===============================================

        // Verifica se este nó de parágrafo contém *apenas* um link de vídeo
        const isOnlyVideo = childrenNodes.length === 1 &&
          childrenNodes[0].type === 'link' &&
          getYoutubeVideoId(childrenNodes[0].url);

        if (isOnlyVideo) {
          // Se for apenas um vídeo, renderiza o vídeo *sem* a tag <p>
          return <Fragment key={i}>{serializeSlate(childrenNodes)}</Fragment>;
        }

        // Caso contrário, renderiza como um parágrafo normal
        return <p key={i}>{serializeSlate(childrenNodes)}</p>
      // ===============================================
      // FIM DA CORREÇÃO
      // ===============================================
    }
  }) as React.ReactElement[]
}