// API Configuration
// In development: uses Vite proxy (empty string)
// In production: uses VITE_API_URL environment variable
const getApiBaseUrl = (): string => {
  // Production: use VITE_API_URL from environment
  if (import.meta.env.PROD && import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
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



