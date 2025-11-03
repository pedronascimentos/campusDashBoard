// src/utilities/serializeSlate.tsx

import React, { Fragment } from 'react'
import escapeHTML from 'escape-html'

/**
 * Check if a node is a text node
 */
const isText = (node: any): boolean => {
  return typeof node.text === 'string'
}

/**
 * Serializes Slate JSON to HTML
 */
export const serializeSlate = (children: any[]): React.ReactElement[] => {
  return children?.map((node, i) => {
    if (isText(node)) {
      let text = <span dangerouslySetInnerHTML={{ __html: escapeHTML(node.text) }} />

      if (node.bold) {
        text = <strong key={i}>{text}</strong>
      }
      if (node.code) {
        text = <code key={i}>{text}</code>
      }
      if (node.italic) {
        text = <em key={i}>{text}</em>
      }
      if (node.underline) {
        text = (
          <span key={i} style={{ textDecoration: 'underline' }}>
            {text}
          </span>
        )
      }
      if (node.strikethrough) {
        text = (
          <span key={i} style={{ textDecoration: 'line-through' }}>
            {text}
          </span>
        )
      }
      return <Fragment key={i}>{text}</Fragment>
    }

    if (!node) {
      return null
    }

    // Garante que 'children' seja um array antes de serializar (para 'default' case)
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
        return (
          <a
            key={i}
            href={escapeHTML(node.url)}
            target={node.newTab ? '_blank' : undefined}
            rel={node.newTab ? 'noopener noreferrer' : undefined}
          >
            {serializeSlate(childrenNodes)}
          </a>
        )

      // --- CORREÇÃO APLICADA AQUI ---
      case 'upload':
        const uploadData = node.value
        if (uploadData && typeof uploadData === 'object') {
          
          // Lógica para extrair os 'children' da legenda,
          // não importa se é um array ou um objeto { root: ... }
          let captionNodes = []
          if (uploadData.caption) {
            if (Array.isArray(uploadData.caption)) {
              captionNodes = uploadData.caption
            } else if (uploadData.caption.root && Array.isArray(uploadData.caption.root.children)) {
              captionNodes = uploadData.caption.root.children
            }
          }

          return (
            <figure key={i} className="upload">
              <img src={uploadData.url} alt={uploadData.alt || ''} />
              
              {/* Serializa recursivamente os nós da legenda */}
              {captionNodes.length > 0 && (
                <figcaption>
                  {serializeSlate(captionNodes)}
                </figcaption>
              )}
            </figure>
          )
        }
        return null
      // --- FIM DA CORREÇÃO ---

      case 'relationship':
        return (
          <div key={i} className="relationship">
            {node.value && typeof node.value === 'object' && (
              <p>Related: {node.value.title || node.value.name || 'Untitled'}</p>
            )}
          </div>
        )

      default:
        return <p key={i}>{serializeSlate(childrenNodes)}</p>
    }
  }) as React.ReactElement[]
}