import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function normalizeUrl(url: string): string {
  try {
    const urlObj = new URL(url);
    // Remove trailing slash from pathname
    urlObj.pathname = urlObj.pathname.replace(/\/$/, '');
    // Remove fragment and sort search params for consistency
    urlObj.hash = '';
    urlObj.search = '';
    return urlObj.toString();
  } catch {
    return url;
  }
}

export function deriveTitleFromUrl(url: string): string {
  try {
    // Extract the last part of the URL path
    const urlObj = new URL(url);
    const pathSegments = urlObj.pathname.split('/').filter(segment => segment.length > 0);
    const lastSegment = pathSegments[pathSegments.length - 1];
    
    if (!lastSegment) {
      return 'Untitled Problem';
    }
    
    // Remove hyphens and underscores, then capitalize each word
    const title = lastSegment
      .replace(/[-_]/g, ' ')
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
    
    return title || 'Untitled Problem';
  } catch {
    return 'Untitled Problem';
  }
}
