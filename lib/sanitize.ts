/**
 * Input Sanitization Utilities (#69)
 * Prevents XSS and injection attacks
 */

// HTML entities map for escaping
const htmlEntities: Record<string, string> = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#x27;',
  '/': '&#x2F;',
  '`': '&#96;',
  '=': '&#x3D;',
};

/**
 * Escape HTML special characters to prevent XSS
 */
export function escapeHtml(str: string): string {
  return str.replace(/[&<>"'`=/]/g, (char) => htmlEntities[char] || char);
}

/**
 * Strip HTML tags from a string
 */
export function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, '');
}

/**
 * Sanitize user input for text overlays
 */
export function sanitizeTextInput(input: string, maxLength = 2000): string {
  // Trim whitespace
  let sanitized = input.trim();
  
  // Remove null bytes
  sanitized = sanitized.replace(/\0/g, '');
  
  // Limit length
  if (sanitized.length > maxLength) {
    sanitized = sanitized.substring(0, maxLength);
  }
  
  // Escape HTML to prevent XSS when rendering
  return escapeHtml(sanitized);
}

/**
 * Sanitize AI prompts to prevent prompt injection
 */
export function sanitizeAIprompt(prompt: string): string {
  // Remove potential instruction injection patterns
  let sanitized = prompt
    .replace(/ignore\s+(previous|all|above)\s+(instructions?|rules?|prompts?)/gi, '')
    .replace(/system\s*:/gi, '')
    .replace(/assistant\s*:/gi, '')
    .replace(/you\s+(are|must|should)\s+/gi, '')
    .replace(/<\|.*?\|>/g, '')  // Remove any tokenizer control tokens
    .replace(/\x00-\x1F\x7F/g, '');  // Remove control characters
  
  // Escape any HTML that might be in the prompt
  sanitized = escapeHtml(sanitized);
  
  return sanitized.trim();
}

/**
 * Sanitize file names to prevent path traversal
 */
export function sanitizeFileName(fileName: string): string {
  // Remove path separators and dangerous characters
  return fileName
    .replace(/[\/\\]/g, '_')
    .replace(/[\x00-\x1F]/g, '')
    .replace(/^\.+/, '')  // Remove leading dots
    .replace(/\.+$/, '')  // Remove trailing dots
    .substring(0, 255);  // Limit length
}

/**
 * Validate and sanitize URLs
 */
export function sanitizeUrl(url: string, allowedProtocols = ['http', 'https', 'data', 'blob']): string | null {
  try {
    const parsed = new URL(url);
    
    // Check protocol is allowed
    if (!allowedProtocols.includes(parsed.protocol.replace(':', ''))) {
      return null;
    }
    
    // Block javascript: and data: URLs unless explicitly allowed
    if (parsed.protocol === 'javascript:') {
      return null;
    }
    
    // For data URLs, only allow safe media types
    if (parsed.protocol === 'data:') {
      const mimeType = parsed.pathname.split(';')[0];
      const allowedMimes = ['image/', 'audio/', 'video/', 'text/'];
      if (!allowedMimes.some(mime => mimeType.startsWith(mime))) {
        return null;
      }
    }
    
    return url;
  } catch {
    // Invalid URL
    return null;
  }
}

/**
 * Sanitize CSS values to prevent CSS injection
 */
export function sanitizeCssValue(value: string): string {
  // Remove potentially dangerous CSS
  return value
    .replace(/expression\s*\(/gi, '')
    .replace(/url\s*\(/gi, '')
    .replace(/behavior\s*:/gi, '')
    .replace(/-moz-binding/gi, '')
    .substring(0, 500);
}

/**
 * Create a sanitizer for React props
 */
export function createPropSanitizer<T extends Record<string, unknown>>(
  schema: Record<keyof T, (value: unknown) => unknown>
) {
  return (props: T): T => {
    const sanitized = { ...props };
    for (const [key, sanitizer] of Object.entries(schema)) {
      if (key in sanitized) {
        try {
          (sanitized as Record<string, unknown>)[key] = sanitizer((sanitized as Record<string, unknown>)[key]);
        } catch {
          // If sanitization fails, remove the prop
          delete (sanitized as Record<string, unknown>)[key];
        }
      }
    }
    return sanitized;
  };
}