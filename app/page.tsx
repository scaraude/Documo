'use client'
import { useFolderTypes } from '@/features/folder-types'
import { ROUTES } from '@/shared/constants'
import { Plus, FileText, FolderOpen } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { HoverCard, HoverCardContent, HoverCardTrigger } from '../shared/components/ui/hover-card'
import { Button } from '@/shared/components'

export default function HomePage() {
  const router = useRouter();
  const { getAllFolderTypes } = useFolderTypes()
  const { data: folderTypes, isLoading } = getAllFolderTypes()
  const hasFolderTypes = !isLoading && folderTypes && folderTypes.length > 0

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Hero Section */}
      <div className="relative px-6 lg:px-8">
        <div className="mx-auto max-w-3xl pt-20 pb-32 sm:pt-32 sm:pb-40">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
              Simplifiez vos transferts de{' '}
              <span className="text-blue-600">documents</span>
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-600 max-w-2xl mx-auto">
              Une solution sécurisée pour gérer et échanger vos documents administratifs.
              Créez des dossiers personnalisés, envoyez des demandes et recevez les documents
              en toute simplicité.
            </p>
          </div>
        </div>
      </div>

      <div className='flex justify-evenly mb-10'>
        <Button size={'xl'} variant={'outline'} onClick={() => router.push(ROUTES.FOLDER_TYPES.NEW)}>
          <FolderOpen className="size-6" />
          <span className='text-lg'>Créer un type de dossier</span>
        </Button>
        {!hasFolderTypes ? <HoverCard>
          <HoverCardTrigger>
            <Button size={'xl'} disabled={!hasFolderTypes} className='bg-blue-600 hover:bg-blue-700' onClick={() => router.push(ROUTES.FOLDERS.NEW)} >
              <Plus className="size-6" strokeWidth={2.25} />
              <span className='text-lg font-bold'>Créer un dossier</span>
            </Button>
          </HoverCardTrigger>
          <HoverCardContent className="w-80">
            <p className="text-sm text-gray-500">
              Commencez par créer un dossier 📂
            </p>
          </HoverCardContent>
        </HoverCard> :
          <Button size={'xl'} disabled={!hasFolderTypes} className='bg-blue-600 hover:bg-blue-700' onClick={() => router.push(ROUTES.FOLDERS.NEW)} >
            <Plus className="size-6" strokeWidth={2.25} />
            <span className='text-lg font-bold'>Créer un dossier</span>
          </Button>}
      </div>
      {/* Features Section */}
      <div className="py-16 bg-white">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Comment ça marche ?
            </h2>
          </div>
          <div className="mx-auto mt-16 max-w-5xl">
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
              <div className="text-center">
                <div className="mx-auto h-16 w-16 rounded-full bg-blue-100 flex items-center justify-center">
                  <FolderOpen className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="mt-6 text-lg font-semibold text-gray-900">
                  1. Créez des types de dossiers
                </h3>
                <p className="mt-2 text-gray-600">
                  Définissez quels documents sont nécessaires pour vos différents processus
                </p>
              </div>
              <div className="text-center">
                <div className="mx-auto h-16 w-16 rounded-full bg-green-100 flex items-center justify-center">
                  <Plus className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="mt-6 text-lg font-semibold text-gray-900">
                  2. Créez des dossiers
                </h3>
                <p className="mt-2 text-gray-600">
                  Instanciez vos types pour des cas concrets et envoyez des demandes
                </p>
              </div>
              <div className="text-center">
                <div className="mx-auto h-16 w-16 rounded-full bg-purple-100 flex items-center justify-center">
                  <FileText className="h-8 w-8 text-purple-600" />
                </div>
                <h3 className="mt-6 text-lg font-semibold text-gray-900">
                  3. Recevez les documents
                </h3>
                <p className="mt-2 text-gray-600">
                  Les utilisateurs téléchargent leurs documents de manière sécurisée
                </p>
              </div>
            </div>
          </div>
        </div>
        {isLoading && (
          <div className="flex justify-center mt-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        )}
      </div>
    </div>
  )
}