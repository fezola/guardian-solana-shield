export function getSiteUrl() {
  // For Vercel deployments
  if (process.env.NEXT_PUBLIC_VERCEL_URL) {
    return `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`;
  }
  
  // For production
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return process.env.NEXT_PUBLIC_SITE_URL;
  }
  
  // Fallback for local development
  return 'http://localhost:3000';
}

export function getAbsoluteUrl(path: string) {
  return `${getSiteUrl()}${path}`;
}