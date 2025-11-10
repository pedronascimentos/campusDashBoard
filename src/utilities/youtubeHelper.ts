/**
 * Extrai o ID do vídeo de várias URLs do YouTube.
 * @param url A URL do YouTube
 * @returns O ID do vídeo (string) or null se não for encontrado.
 */
export function getYoutubeVideoId(url: string): string | null {
  if (!url) return null;

  // Regex para cobrir:
  // - youtube.com/watch?v=...
  // - youtu.be/...
  // - youtube.com/embed/...
  // - youtube.com/v/...
  const regex =
    /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:watch\?v=|embed\/|v\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
  
  const match = url.match(regex);
  
  return match ? match[1] : null;
}

/**
 * Gera a URL de embed "no-cookie" para privacidade.
 * @param videoId O ID do vídeo do YouTube
 * @returns A URL completa para o iframe.
 */
export function getYoutubeEmbedUrl(videoId: string): string {
  // Parâmetros:
  // - rel=0: Não mostrar vídeos relacionados no final
  // - modestbranding=1: Logo do YouTube menor
  // - controls=1: Mostrar controles
  return `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=0&controls=1&modestbranding=1&rel=0`;
}