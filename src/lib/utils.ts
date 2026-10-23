export const BASE_DOMAIN = 'localhost:3000';

// Reserved aliases for simulated conflict detection
export const RESERVED_ALIASES = new Set([
  'admin',
  'api',
  'dashboard',
  'features',
  'github',
  'google',
  'help',
  'login',
  'pricing',
  'privacy',
  'settings',
  'shortnd',
  'terms',
  'user',
  'verify',
]);

/**
 * Generates a random Base62 string of given length
 */
export function generateBase62Code(length = 6): string {
  const chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let result = '';
  const cryptoObj = window.crypto || (window as unknown as { msCrypto: Crypto }).msCrypto;
  if (cryptoObj && cryptoObj.getRandomValues) {
    const values = new Uint8Array(length);
    cryptoObj.getRandomValues(values);
    for (let i = 0; i < length; i++) {
      result += chars[values[i] % chars.length];
    }
  } else {
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
  }
  return result;
}

/**
 * Validates a target URL strictly for HTTP/HTTPS protocols and valid format
 */
export function validateUrl(url: string): { isValid: boolean; error?: string } {
  const trimmed = url.trim();

  if (!trimmed) {
    return { isValid: false, error: 'Please enter a URL to shorten.' };
  }

  // Check protocol explicitly
  const protocolMatch = trimmed.match(/^([a-zA-Z0-9+.-]+):/);
  if (protocolMatch) {
    const protocol = protocolMatch[1].toLowerCase();
    if (protocol !== 'http' && protocol !== 'https') {
      return {
        isValid: false,
        error: `Protocol "${protocol}:" is not supported. Only HTTP and HTTPS URLs are allowed.`,
      };
    }
  } else {
    // If no protocol was entered, warn or require https://
    return {
      isValid: false,
      error: 'Please include the protocol prefix (e.g., https://).',
    };
  }

  try {
    const parsed = new URL(trimmed);
    if (!parsed.hostname || !parsed.hostname.includes('.') && parsed.hostname !== 'localhost') {
      return { isValid: false, error: 'Please enter a valid domain name (e.g., example.com).' };
    }
    return { isValid: true };
  } catch {
    return { isValid: false, error: 'Please enter a valid, well-formed URL.' };
  }
}

/**
 * Validates a custom alias according to the 6–20 char rule and character set
 */
export function validateAlias(alias: string): { isValid: boolean; error?: string; isReserved?: boolean } {
  const trimmed = alias.trim().toLowerCase();

  if (!trimmed) {
    return { isValid: false, error: 'Please enter a custom alias.' };
  }

  if (trimmed.length < 6) {
    return {
      isValid: false,
      error: `Custom alias must be at least 6 characters (currently ${trimmed.length}).`,
    };
  }

  if (trimmed.length > 20) {
    return {
      isValid: false,
      error: `Custom alias cannot exceed 20 characters (currently ${trimmed.length}).`,
    };
  }

  const aliasPattern = /^[a-zA-Z0-9_-]+$/;
  if (!aliasPattern.test(trimmed)) {
    return {
      isValid: false,
      error: 'Only letters, numbers, hyphens (-), and underscores (_) are allowed.',
    };
  }

  if (RESERVED_ALIASES.has(trimmed)) {
    return {
      isValid: false,
      isReserved: true,
      error: `"${trimmed}" is reserved by the system. Try another unique alias (e.g., ${trimmed}-2026).`,
    };
  }

  return { isValid: true };
}

/**
 * Extracts clean domain hostname for display
 */
export function extractHostname(url: string): string {
  try {
    const parsed = new URL(url);
    return parsed.hostname.replace(/^www\./, '');
  } catch {
    return 'external link';
  }
}

/**
 * Formats relative time (e.g., "Just now", "2m ago")
 */
export function formatRelativeTime(timestamp: number): string {
  const diffSec = Math.floor((Date.now() - timestamp) / 1000);
  if (diffSec < 10) return 'Just now';
  if (diffSec < 60) return `${diffSec}s ago`;
  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffHr = Math.floor(diffMin / 60);
  return `${diffHr}h ago`;
}
