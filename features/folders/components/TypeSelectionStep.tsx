import type { FolderType } from '@/features/folder-types/types';
import {
  Badge,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/shared/components';
import { FileText, FolderOpen } from 'lucide-react';

interface TypeSelectionStepProps {
  folderTypes: FolderType[];
  onTypeSelect: (folderType: FolderType) => void;
}

export const TypeSelectionStep = ({
  folderTypes,
  onTypeSelect,
}: TypeSelectionStepProps) => {
  return (
    <div>
      <h2 className="text-xl font-bold text-gray-900 mb-4">
        Choisissez un modèle de dossier
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {folderTypes.map((folderType) => (
          <Card
            key={folderType.id}
            className="cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => onTypeSelect(folderType)}
          >
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <FolderOpen className="h-6 w-6 text-blue-600" />
                </div>
                <Badge variant="secondary" className="text-xs">
                  {folderType.requiredDocuments.length} docs
                </Badge>
              </div>
              <CardTitle className="text-lg">{folderType.name}</CardTitle>
              {folderType.description && (
                <p className="text-sm text-gray-600 line-clamp-2">
                  {folderType.description}
                </p>
              )}
            </CardHeader>
            <CardContent className="pt-0">
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <FileText className="h-4 w-4" />
                <span>
                  {folderType.requiredDocuments.length} document
                  {folderType.requiredDocuments.length > 1 ? 's' : ''} requis
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
