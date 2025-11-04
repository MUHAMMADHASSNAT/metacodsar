// API Configuration
// In development: uses Vite proxy (empty string)
// In production: uses VITE_API_URL environment variable
const getApiBaseUrl = (): string => {
  // Production: use VITE_API_URL from environment
  if (import.meta.env.PROD) {
    // Try VITE_API_URL first
    if (import.meta.env.VITE_API_URL) {
      return import.meta.env.VITE_API_URL;
    }
    
    // Try VITE_API_UR (common typo) as fallback
    if (import.meta.env.VITE_API_UR) {
      console.warn('⚠️ Using VITE_API_UR (should be VITE_API_URL in Vercel)');
      return import.meta.env.VITE_API_UR;
    }
    
    // Auto-detect server URL from current origin
    // If client is on Vercel, server should be on same domain with /api
    const currentOrigin = window.location.origin;
    if (currentOrigin.includes('vercel.app')) {
      // Server is on same domain, use relative path
      return '';
    }
    
    console.error('❌ VITE_API_URL environment variable is missing in Vercel!');
    console.error('Please add VITE_API_URL in Vercel dashboard with your server URL');
    return '';
  }
  
  // Development: use proxy (empty string means same origin)
  if (import.meta.env.DEV) {
    return '';
  }
  
  // Fallback for production without env var
  return '';
};

export const API_BASE_URL = getApiBaseUrl();

// Helper function to build full image URLs
export const getImageUrl = (imagePath: string): string => {
  if (!imagePath) return '';
  
  // If already a full URL, return as is
  if (imagePath.startsWith('http')) {
    return imagePath;
  }
  
  // Build full URL
  const baseUrl = API_BASE_URL || (import.meta.env.DEV ? 'http://localhost:5001' : '');
  const path = imagePath.startsWith('/') ? imagePath : `/${imagePath}`;
  return `${baseUrl}${path}`;
};




