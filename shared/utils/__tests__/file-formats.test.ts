import { describe, expect, it } from 'vitest';
import {
  formatAcceptedFormats,
  formatToMimeType,
  formatsToFileExtensions,
} from '../file-formats';

describe('file-formats utilities', () => {
  describe('formatAcceptedFormats', () => {
    it('should format a single extension', () => {
      expect(formatAcceptedFormats(['pdf'])).toBe('PDF');
    });

    it('should format a single MIME type', () => {
      expect(formatAcceptedFormats(['application/pdf'])).toBe('PDF');
    });

    it('should format two extensions with "et"', () => {
      expect(formatAcceptedFormats(['pdf', 'jpg'])).toBe('PDF et JPG');
    });

    it('should format two MIME types with "et"', () => {
      expect(formatAcceptedFormats(['application/pdf', 'image/jpeg'])).toBe(
        'PDF et JPEG',
      );
    });

    it('should format three extensions with commas and "et"', () => {
      expect(formatAcceptedFormats(['pdf', 'jpg', 'png'])).toBe(
        'PDF, JPG et PNG',
      );
    });

    it('should format three MIME types with commas and "et"', () => {
      expect(
        formatAcceptedFormats([
          'application/pdf',
          'image/jpeg',
          'image/png',
        ]),
      ).toBe('PDF, JPEG et PNG');
    });

    it('should handle mixed extensions and MIME types', () => {
      expect(formatAcceptedFormats(['pdf', 'image/jpeg', 'png'])).toBe(
        'PDF, JPEG et PNG',
      );
    });

    it('should remove duplicates', () => {
      expect(formatAcceptedFormats(['jpg', 'jpeg', 'image/jpeg'])).toBe(
        'JPG et JPEG',
      );
    });

    it('should return empty string for empty array', () => {
      expect(formatAcceptedFormats([])).toBe('');
    });

    it('should handle unknown formats by uppercasing', () => {
      expect(formatAcceptedFormats(['xyz'])).toBe('XYZ');
    });
  });

  describe('formatToMimeType', () => {
    it('should convert pdf to MIME type', () => {
      expect(formatToMimeType('pdf')).toBe('application/pdf');
    });

    it('should convert jpg to MIME type', () => {
      expect(formatToMimeType('jpg')).toBe('image/jpeg');
    });

    it('should convert jpeg to MIME type', () => {
      expect(formatToMimeType('jpeg')).toBe('image/jpeg');
    });

    it('should convert png to MIME type', () => {
      expect(formatToMimeType('png')).toBe('image/png');
    });

    it('should convert doc to MIME type', () => {
      expect(formatToMimeType('doc')).toBe('application/msword');
    });

    it('should convert docx to MIME type', () => {
      expect(formatToMimeType('docx')).toBe(
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      );
    });

    it('should handle case-insensitive input', () => {
      expect(formatToMimeType('PDF')).toBe('application/pdf');
      expect(formatToMimeType('JPG')).toBe('image/jpeg');
    });

    it('should default unknown formats to application/*', () => {
      expect(formatToMimeType('xyz')).toBe('application/xyz');
    });
  });

  describe('formatsToFileExtensions', () => {
    it('should convert extensions to file input format', () => {
      expect(formatsToFileExtensions(['pdf', 'jpg', 'png'])).toBe(
        '.pdf,.jpg,.png',
      );
    });

    it('should convert MIME types to file input format', () => {
      expect(
        formatsToFileExtensions([
          'application/pdf',
          'image/jpeg',
          'image/png',
        ]),
      ).toBe('.pdf,.jpg,.png');
    });

    it('should handle mixed formats', () => {
      expect(formatsToFileExtensions(['pdf', 'image/jpeg', 'png'])).toBe(
        '.pdf,.jpg,.png',
      );
    });

    it('should handle empty array', () => {
      expect(formatsToFileExtensions([])).toBe('');
    });

    it('should handle case-insensitive input', () => {
      expect(formatsToFileExtensions(['PDF', 'JPG'])).toBe('.pdf,.jpg');
      expect(
        formatsToFileExtensions(['APPLICATION/PDF', 'IMAGE/JPEG']),
      ).toBe('.pdf,.jpg');
    });
  });
});
