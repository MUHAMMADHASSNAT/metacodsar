// API Configuration
// In development: uses Vite proxy (empty string)
// In production: uses VITE_API_URL environment variable
const getApiBaseUrl = (): string => {
  // Production: use VITE_API_URL from environment
  if (import.meta.env.PROD) {
    // Try VITE_API_URL first
    if (import.meta.env.VITE_API_URL) {
      const url = import.meta.env.VITE_API_URL.trim();
      console.log('✅ Using VITE_API_URL:', url);
      return url;
    }
    
    // Try VITE_API_UR (common typo) as fallback
    if (import.meta.env.VITE_API_UR) {
      const url = import.meta.env.VITE_API_UR.trim();
      console.warn('⚠️ Using VITE_API_UR (should be VITE_API_URL in Vercel):', url);
      return url;
    }
    
    // Auto-detect: Try common Vercel server URL patterns
    const currentOrigin = window.location.origin;
    console.log('🔍 Current origin:', currentOrigin);
    
    // Pattern 1: If client is on vercel.app, try to find server URL
    if (currentOrigin.includes('vercel.app')) {
      // Try same domain with /api prefix (if server is in same project)
      console.log('ℹ️ Client on Vercel, trying relative path for API');
      
      // Pattern 2: Try common server URL patterns
      // If client is metacodsar-h3a4.vercel.app, server might be metacodsar-api.vercel.app
      const originParts = currentOrigin.replace('https://', '').split('.');
      if (originParts.length >= 2) {
        const projectName = originParts[0];
        
        // Try different server URL patterns
        const possibleServerUrls = [
          `https://${projectName}-api.vercel.app`,
          `https://api-${projectName}.vercel.app`,
          `https://${projectName.replace('-client', '').replace('-frontend', '')}-api.vercel.app`,
          `https://${projectName.replace('-client', '').replace('-frontend', '')}-server.vercel.app`,
        ];
        
        console.log('🔍 Trying possible server URLs:', possibleServerUrls);
        
        // For now, return empty to use relative paths (will work if server is same domain)
        // User should set VITE_API_URL in Vercel for proper configuration
        console.warn('⚠️ VITE_API_URL not set. Using relative paths. This may not work if server is on different domain.');
        console.warn('💡 Please set VITE_API_URL in Vercel Dashboard → Client Project → Environment Variables');
        return '';
      }
    }
    
    console.error('❌ VITE_API_URL environment variable is missing!');
    console.error('📝 To fix: Vercel Dashboard → Client Project → Settings → Environment Variables');
    console.error('   Add: VITE_API_URL = https://your-server-project.vercel.app');
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




