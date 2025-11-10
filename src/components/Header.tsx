"use client";

import React, { useState, useEffect } from 'react';
// 1. Importar o Link
import Link from 'next/link';

/**
 * Componente ÚNICO que substitui Logo e IconLogo.
 * Ele recebe 'isScrolled' como prop e muda seu próprio estilo.
 */
function HeaderLogo({ isScrolled }: { isScrolled: boolean }) {
  const [hasError, setHasError] = useState(false);

  const logoSrc = isScrolled ? "/campus-logo.png" : "/campus-logo.png";
  const altText = "Campus Multiplataforma";
  const fallbackText = isScrolled ? 'C' : 'CAMPUS';
  const targetHeight = isScrolled ? '22px' : '28px';
  const transitionDuration = '0.2s';

  // Fallback em caso de erro
  if (hasError) {
    return (
      <h1 style={{
        fontSize: '24px',
        margin: '0',
        fontFamily: '"Reith Serif", Georgia, serif',
        color: 'white',
        height: targetHeight,
        display: 'flex',
        alignItems: 'center',
        transition: `height ${transitionDuration} ease-in-out`,
      }}>
        {fallbackText}
      </h1>
    );
  }

  // Renderização da imagem
  return (
    <img
      src={logoSrc}
      alt={altText}
      style={{
        height: targetHeight,
        display: 'block',
        margin: '0 auto',
        transition: `height ${transitionDuration} ease-in-out`,
      }}
      onError={() => setHasError(true)}
    />
  );
}

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const transitionDuration = '0.2s';

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY >= 10);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <header style={{
      background: '#6a0000',
      position: 'sticky',
      top: 0,
      zIndex: 1000,
      transition: `padding ${transitionDuration} ease-in-out`,
    }}>
      <div className="bbc-container" style={{
        padding: isScrolled ? '2px 8px' : '6px 6px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        transition: `padding ${transitionDuration} ease-in-out`,
      }}>

        {/* Ícone 1: Menu (Esquerda) */}
        <button style={{
          background: 'transparent',
          border: 'none',
          color: '#ffffff',
          fontSize: '24px',
          cursor: 'pointer',
          padding: '8px',
          width: '40px',
        }}>
          ☰
        </button>

        {/* 2. CORREÇÃO: Trocar <a> por <Link> para corrigir erro de build */}
        <Link href="/" style={{ textDecoration: 'none', color: 'white' }}>
          <HeaderLogo isScrolled={isScrolled} />
        </Link>

        {/* Ícone 2: Busca (Direita) - Ícone transparente para manter o layout */}
        <button style={{
          background: 'transparent',
          border: 'none',
          color: 'transparent', // Escondido
          fontSize: '24px',
          cursor: 'default', // Não clicável
          pointerEvents: 'none', // Ignora o mouse
          padding: '8px',
          width: '40px',
        }}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            style={{ height: '24px', width: '24px', display: 'block' }}
          >
            <path d="M10 18a7.952 7.952 0 0 0 4.897-1.688l4.396 4.396 1.414-1.414-4.396-4.396A7.952 7.952 0 0 0 18 10c0-4.411-3.589-8-8-8s-8 3.589-8 8 3.589 8 8 8zm0-14c3.309 0 6 2.691 6 6s-2.691 6-6 6-6-2.691-6-6 2.691-6 6-6z" />
          </svg>
        </button>
      </div>
    </header>
  );
}