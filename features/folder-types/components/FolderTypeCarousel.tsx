'use client';
import {
  Badge,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/shared/components';
import { ROUTES } from '@/shared/constants';
import { FileText, Plus, TrendingUp } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import type { FolderType } from '../types';

interface FolderTypeCarouselProps {
  folderTypes: Array<
    FolderType & {
      foldersCount?: number;
      activeFoldersCount?: number;
    }
  >;
}

export const FolderTypeCarousel = ({
  folderTypes,
}: FolderTypeCarouselProps) => {
  const router = useRouter();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {folderTypes.map((folderType) => (
        <Card
          key={folderType.id}
          className="hover:shadow-lg transition-shadow cursor-pointer group relative"
          onClick={() => router.push(ROUTES.FOLDER_TYPES.DETAIL(folderType.id))}
        >
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              {folderType.foldersCount !== undefined && (
                <Badge variant="secondary" className="text-xs">
                  {folderType.foldersCount} dossier
                  {folderType.foldersCount > 1 ? 's' : ''}
                </Badge>
              )}
            </div>
            <CardTitle className="text-lg group-hover:text-blue-600 transition-colors">
              {folderType.name}
            </CardTitle>
            {folderType.description && (
              <p className="text-sm text-gray-600 line-clamp-2">
                {folderType.description}
              </p>
            )}
          </CardHeader>

          <CardContent className="pt-0 pb-12">
            <div className="space-y-3">
              {/* Documents Required */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <FileText className="h-4 w-4 text-gray-500" />
                  <span className="text-sm font-medium text-gray-700">
                    Documents requis
                  </span>
                </div>
                <div className="flex flex-wrap gap-1">
                  {folderType.requiredDocuments.slice(0, 3).map((doc) => (
                    <Badge key={doc.id} variant="outline" className="text-xs">
                      {doc.label}
                    </Badge>
                  ))}
                  {folderType.requiredDocuments.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{folderType.requiredDocuments.length - 3}
                    </Badge>
                  )}
                </div>
              </div>

              {/* Stats */}
              {(folderType.foldersCount !== undefined ||
                folderType.activeFoldersCount !== undefined) && (
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  {folderType.activeFoldersCount !== undefined && (
                    <div className="flex items-center gap-1">
                      <TrendingUp className="h-3 w-3" />
                      <span>
                        {folderType.activeFoldersCount} actif
                        {folderType.activeFoldersCount > 1 ? 's' : ''}
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>
          </CardContent>

          {/* Plus Button - Bottom Right Corner */}
          <div className="absolute bottom-4 right-4 group/button">
            <Link
              href={`${ROUTES.FOLDERS.NEW}?typeId=${folderType.id}`}
              onClick={(e) => e.stopPropagation()} // Empêche la propagation du clic vers la card
            >
              <div className="relative">
                {/* Tooltip */}
                <div className="absolute bottom-full right-0 mb-2 px-3 py-1 bg-gray-900 text-white text-sm rounded-lg opacity-0 group-hover/button:opacity-100 transform scale-95 group-hover/button:scale-100 transition-all duration-200 pointer-events-none whitespace-nowrap">
                  Nouveau dossier
                  <div className="absolute top-full right-4 w-2 h-2 bg-gray-900 transform rotate-45 -mt-1" />
                </div>

                {/* Button */}
                <button
                  type="button"
                  className="w-10 h-10 bg-blue-600 text-white rounded-full hover:bg-blue-700 hover:scale-110 transition-all duration-200 flex items-center justify-center shadow-lg hover:shadow-xl"
                >
                  <Plus className="h-5 w-5" />
                </button>
              </div>
            </Link>
          </div>
        </Card>
      ))}
    </div>
  );
};
