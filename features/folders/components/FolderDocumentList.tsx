import { DocumentListItem } from '@/features/documents/components/DocumentListItem';
import type { AppDocumentWithStatus } from '@/shared/types';

interface FolderDocumentListProps {
  document: AppDocumentWithStatus;
}

export const FolderDocumentList = (props: FolderDocumentListProps) => {
  const { document } = props;
  return <DocumentListItem document={document} />;
};
