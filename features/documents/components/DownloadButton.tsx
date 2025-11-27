import { Button } from '@/shared/components/ui/button';
import type { AppDocument } from '@/shared/types';
import { Download, Loader2 } from 'lucide-react';
import type React from 'react';
import { useDecryptedDocument } from '../hooks/useDecryptedDocument';

interface DownloadButtonProps {
  document: AppDocument;
}

export function DownloadButton({ document }: DownloadButtonProps) {
  const classNames =
    'inline-flex items-center shadow-sm px-2.5 py-0.5 border border-gray-300 text-sm leading-5 font-medium rounded-full text-gray-700 bg-white hover:bg-gray-50';
  const { objectUrl, isLoading, error, decryptDocument } =
    useDecryptedDocument(document);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  if (isLoading) {
    return (
      <Button className={classNames} disabled onClick={handleClick}>
        <Loader2 className="h-4 w-4 animate-spin mr-2" />
        Decrypting...
      </Button>
    );
  }

  if (error) {
    return (
      <Button
        className={classNames}
        onClick={(e: React.MouseEvent) => {
          e.stopPropagation();
          decryptDocument();
        }}
      >
        <Download className="h-4 w-4" />
        Retry Download
      </Button>
    );
  }

  if (!objectUrl) {
    return null;
  }

  return (
    <Button className={classNames} onClick={handleClick} asChild>
      <a href={objectUrl} download={document.fileName}>
        <Download className="h-4 w-4" />
        Download
      </a>
    </Button>
  );
}
