// src/components/ArticleHeader.tsx
"use client";

import React, { useState, useEffect } from 'react';
// 1. Importar o Link
import Link from 'next/link';
// 2. Remover o useRouter
// import { useRouter } from 'next/navigation'; 

export function ArticleHeader() {
  // 3. Remover a instância do router
  // const router = useRouter(); 
  const [isScrolledDown, setIsScrolledDown] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);

  // Lógica para detectar a direção do scroll (permanece igual)
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY <= 0) {
        setIsScrolledDown(false);
      } else if (currentScrollY > lastScrollY) {
        setIsScrolledDown(true);
      } else {
        setIsScrolledDown(false);
      }
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [lastScrollY]);

  // Lógica para o botão "Compartilhar" (permanece igual)
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: document.title,
          url: window.location.href,
        });
      } catch (error) {
        console.error('Erro ao compartilhar:', error);
      }
    } else {
      alert('A API de compartilhamento não é suportada neste navegador.');
    }
  };

  return (
    <header
      style={{
        // Estilo do Header (permanece igual)
        background: '#6a0000',
        color: '#141414',
        padding: '0 16px',
        height: '52px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'sticky',
        top: 0,
        zIndex: 1000,
        width: '100%',
        maxWidth: '420px',
        transition: 'transform 0.3s ease-in-out',
        transform: isScrolledDown ? 'translateY(-100%)' : 'translateY(0)',
      }}
    >
      {/* 4. Substituir <button> por <Link> */}
      <Link
        href="/"
        style={{
          // Estilos do <button> anterior
          background: 'none',
          border: 'none',
          padding: '8px',
          cursor: 'pointer',
          // Adicionado para alinhar o ícone
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
        aria-label="Voltar para a Home"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M20 11H7.83L13.42 5.41L12 4L4 12L12 20L13.41 18.59L7.83 13H20V11Z" fill="#ffffffff" />
        </svg>
      </Link>

      {/* 2. Logo (Usando seu logo) */}
      <img
        src="/campus-logo.png"
        style={{ height: '28px', width: 'auto' }}
        alt="Campus Logo"
      />

      {/* 3. Botão Compartilhar (permanece igual) */}
      <button
        onClick={handleShare}
        style={{ background: 'none', border: 'none', padding: '8px', cursor: 'pointer' }}
        aria-label="Compartilhar"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M18 16.08C17.24 16.08 16.56 16.37 16.04 16.85L8.91 12.7C8.96 12.47 9 12.24 9 12C9 11.76 8.96 11.53 8.91 11.3L16.04 7.15C16.56 7.63 17.24 7.92 18 7.92C19.66 7.92 21 6.58 21 4.92C21 3.26 19.66 1.92 18 1.92C16.34 1.92 15 3.26 15 4.92C15 5.16 15.04 5.39 15.09 5.61L7.96 9.75C7.44 9.27 6.76 8.92 6 8.92C4.34 8.92 3 10.26 3 11.92C3 13.58 4.34 14.92 6 14.92C6.76 14.92 7.44 14.57 7.96 14.09L15.09 18.23C15.04 18.46 15 18.69 15 18.92C15 20.58 16.34 21.92 18 21.92C19.66 21.92 21 20.58 21 18.92C21 17.26 19.66 15.92 18 15.92V16.08Z" fill="#ffffffff" />
        </svg>
      </button>
    </header>
  );
}