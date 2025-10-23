import { format, formatDistanceToNow } from 'date-fns';

export function formatDate(date: string): string {
  return format(new Date(date), 'MMM dd, yyyy');
}

export function formatDateTime(date: string): string {
  return format(new Date(date), 'MMM dd, yyyy HH:mm');
}

export function formatRelativeTime(date: string): string {
  return formatDistanceToNow(new Date(date), { addSuffix: true });
}

export function getYouTubeEmbedUrl(url: string): string | null {
  if (!url) return null;
  
  try {
    const urlObj = new URL(url);
    
    if (urlObj.hostname === 'youtu.be') {
      const videoId = urlObj.pathname.slice(1);
      return `https://www.youtube.com/embed/${videoId}`;
    }
    
    if (urlObj.hostname.includes('youtube.com')) {
      const videoId = urlObj.searchParams.get('v');
      if (videoId) {
        return `https://www.youtube.com/embed/${videoId}`;
      }
    }
  } catch {
    return null;
  }
  
  return null;
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
}

export function getMediaUrl(path: string | null): string | null {
  if (!path) return null;
  if (path.startsWith('http')) return path;
  
  // Temporary solution: use placeholder images until backend is deployed
  const apiUrl = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '');
  if (!apiUrl || apiUrl.includes('localhost')) {
    // Use placeholder images for localhost/undeployed backend
    return `https://via.placeholder.com/800x600/4F46E5/FFFFFF?text=Image+Placeholder`;
  }
  
  return `${apiUrl}${path}`;
}

