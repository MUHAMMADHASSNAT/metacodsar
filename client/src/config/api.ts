// API Configuration
// In development: uses Vite proxy (empty string)
// In production: uses VITE_API_URL environment variable
const getApiBaseUrl = (): string => {
  // Production: use VITE_API_URL from environment
  if (import.meta.env.PROD) {
    // Try VITE_API_URL first
    if (import.meta.env.VITE_API_URL) {
      let url = import.meta.env.VITE_API_URL.trim();
      // Remove trailing slash if present
      url = url.replace(/\/$/, '');
      console.log('✅ Using VITE_API_URL:', url);
      return url;
    }
    
    // Try VITE_API_UR (common typo) as fallback
    if (import.meta.env.VITE_API_UR) {
      let url = import.meta.env.VITE_API_UR.trim();
      url = url.replace(/\/$/, '');
      console.warn('⚠️ Using VITE_API_UR (should be VITE_API_URL in Vercel):', url);
      return url;
    }
    
    // Auto-detect: Try common Vercel server URL patterns
    const currentOrigin = window.location.origin;
    console.log('🔍 Current origin:', currentOrigin);
    console.warn('⚠️ VITE_API_URL environment variable is missing!');
    console.warn('📝 To fix:');
    console.warn('   1. Go to Vercel Dashboard → Client Project → Settings → Environment Variables');
    console.warn('   2. Add: VITE_API_URL = https://your-server-project.vercel.app');
    console.warn('   3. Make sure there is NO trailing slash');
    console.warn('   4. Redeploy the client project after adding the variable');
    
    // Don't return empty string - this will cause API calls to fail
    // Instead, try to construct a reasonable fallback URL
    if (currentOrigin.includes('vercel.app')) {
      const originParts = currentOrigin.replace('https://', '').split('.');
      if (originParts.length >= 2) {
        const projectName = originParts[0];
        // Try to guess server URL based on common patterns
        const guessedUrl = `https://${projectName.replace('-client', '').replace('-frontend', '').replace(/-h3a4$/, '')}-api.vercel.app`;
        console.warn('⚠️ Attempting fallback URL (this may not work):', guessedUrl);
        console.warn('💡 Please set VITE_API_URL = https://metacodsar-2vf1.vercel.app in Vercel for reliable connection');
        return guessedUrl;
      }
    }
    
    console.error('❌ Cannot determine API URL. Please set VITE_API_URL in Vercel environment variables.');
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
  
  // If it's a base64 data URI, return as is
  if (imagePath.startsWith('data:')) {
    return imagePath;
  }
  
  // Build full URL
  const baseUrl = API_BASE_URL || (import.meta.env.DEV ? 'http://localhost:5001' : '');
  const path = imagePath.startsWith('/') ? imagePath : `/${imagePath}`;
  return `${baseUrl}${path}`;
};




