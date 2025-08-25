export function getEventCodeFromSubdomain(): string | null {
  // Check if we're in a browser environment
  if (typeof window === 'undefined') {
    return null
  }

  const hostname = window.location.hostname

  // Handle localhost development
  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    return null
  }

  // Extract subdomain (e.g., "osday25" from "osday25.tanglecat.dev")
  const parts = hostname.split('.')

  // Check if we have at least 2 parts (subdomain.domain)
  if (parts.length < 2) {
    return null
  }

  const subdomain = parts[0]

  // Check if it's a valid subdomain format (not www, api, etc.)
  if (subdomain &&
      subdomain !== 'www' &&
      subdomain !== 'api' &&
      subdomain !== 'admin' &&
      subdomain !== 'staging' &&
      subdomain !== 'dev' &&
      subdomain !== 'test') {
    return subdomain
  }

  return null
}

export function isLocalhost(): boolean {
  if (typeof window === 'undefined') {
    return false
  }

  const hostname = window.location.hostname
  return hostname === 'localhost' || hostname === '127.0.0.1'
}

export function getCurrentHostname(): string {
  if (typeof window === 'undefined') {
    return ''
  }

  return window.location.hostname
}

export function getCurrentUrl(): string {
  if (typeof window === 'undefined') {
    return ''
  }

  return window.location.href
}
