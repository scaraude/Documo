import { Button, Card, CardContent } from '@/shared/components';
import { FolderOpen } from 'lucide-react';
import Link from 'next/link';

export const LoadingState = () => (
  <div className="flex items-center justify-center py-12">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
  </div>
);

export const EmptyFolderTypesState = () => (
  <Card className="text-center py-12">
    <CardContent>
      <FolderOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
      <h3 className="text-lg font-medium text-gray-900 mb-2">
        Aucun type de dossier disponible
      </h3>
      <p className="text-gray-500 mb-6">
        Vous devez d&apos;abord créer un type de dossier avant de pouvoir ouvrir
        un dossier
      </p>
      <Button asChild>
        <Link href="/folder-types/new">Créer un type de dossier</Link>
      </Button>
    </CardContent>
  </Card>
);
