/**
 * Supported file format extensions
 */
export type FileFormat = 'pdf' | 'jpg' | 'jpeg' | 'png' | 'doc' | 'docx';

/**
 * Map of MIME types and extensions to human-readable names
 */
const FORMAT_NAMES: Record<string, string> = {
  // Extensions
  pdf: 'PDF',
  jpg: 'JPG',
  jpeg: 'JPEG',
  png: 'PNG',
  doc: 'DOC',
  docx: 'DOCX',
  // MIME types
  'application/pdf': 'PDF',
  'image/jpeg': 'JPEG',
  'image/jpg': 'JPG',
  'image/png': 'PNG',
  'application/msword': 'DOC',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
    'DOCX',
};

/**
 * Converts a MIME type or extension to its extension form
 *
 * @param format - MIME type or file extension
 * @returns File extension (e.g., 'pdf', 'jpg')
 */
function normalizeToExtension(format: string): string {
  const lower = format.toLowerCase();

  // If it's already an extension, return it
  if (!lower.includes('/')) {
    return lower;
  }

  // Convert MIME type to extension
  const mimeToExtension: Record<string, string> = {
    'application/pdf': 'pdf',
    'image/jpeg': 'jpg',
    'image/jpg': 'jpg',
    'image/png': 'png',
    'application/msword': 'doc',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
      'docx',
  };

  return mimeToExtension[lower] || lower.split('/')[1] || lower;
}

/**
 * Formats an array of file format strings (MIME types or extensions) into a human-friendly text
 * with proper French grammar (using "et" before the last item)
 *
 * @param formats - Array of MIME types or file extensions (e.g., ['application/pdf', 'image/jpeg'] or ['pdf', 'jpg'])
 * @returns Human-friendly formatted string (e.g., "PDF, JPG et PNG")
 *
 * @example
 * formatAcceptedFormats(['pdf']) // "PDF"
 * formatAcceptedFormats(['application/pdf', 'image/jpeg']) // "PDF et JPEG"
 * formatAcceptedFormats(['pdf', 'jpg', 'png']) // "PDF, JPG et PNG"
 */
export function formatAcceptedFormats(formats: string[]): string {
  if (formats.length === 0) return '';

  // Get human-readable names, handling both MIME types and extensions
  const formattedFormats = formats.map((f) => {
    const lower = f.toLowerCase();
    return FORMAT_NAMES[lower] || f.toUpperCase();
  });

  // Remove duplicates (e.g., if both 'jpg' and 'jpeg' are present)
  const uniqueFormats = [...new Set(formattedFormats)];

  if (uniqueFormats.length === 1) {
    return uniqueFormats[0];
  }

  // Join all but the last with commas, then add "et" before the last one
  const allButLast = uniqueFormats.slice(0, -1).join(', ');
  const last = uniqueFormats[uniqueFormats.length - 1];

  return `${allButLast} et ${last}`;
}

/**
 * Converts file format strings to MIME types
 *
 * @param format - File format string (e.g., 'pdf', 'jpg')
 * @returns MIME type string (e.g., 'application/pdf', 'image/jpeg')
 */
export function formatToMimeType(format: string): string {
  switch (format.toLowerCase()) {
    case 'pdf':
      return 'application/pdf';
    case 'jpg':
    case 'jpeg':
      return 'image/jpeg';
    case 'png':
      return 'image/png';
    case 'doc':
      return 'application/msword';
    case 'docx':
      return 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
    default:
      return `application/${format}`;
  }
}

/**
 * Converts an array of file formats (MIME types or extensions) to file extensions for HTML input accept attribute
 *
 * @param formats - Array of MIME types or file extensions (e.g., ['application/pdf', 'image/jpeg'] or ['pdf', 'jpg'])
 * @returns Comma-separated file extensions (e.g., '.pdf,.jpg,.png')
 *
 * @example
 * formatsToFileExtensions(['pdf', 'jpg']) // ".pdf,.jpg"
 * formatsToFileExtensions(['application/pdf', 'image/jpeg']) // ".pdf,.jpg"
 */
export function formatsToFileExtensions(formats: string[]): string {
  return formats.map((f) => `.${normalizeToExtension(f)}`).join(',');
}
