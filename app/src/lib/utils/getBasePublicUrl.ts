export function getBasePublicUrl(): string {
  // Check if we're in development/local mode
  if (process.env.NODE_ENV === 'development') {
    return process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
  }

  // In production, use the Vercel URL
  return process.env.VERCEL_PROJECT_PRODUCTION_URL || process.env.NEXT_PUBLIC_BASE_URL || ''
} 