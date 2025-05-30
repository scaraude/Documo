'use client'
import Link from 'next/link'
import { useFolderTypes } from '@/features/folder-types'
import { ROUTES } from '@/shared/constants'
import { Plus, FileText, FolderOpen } from 'lucide-react'

export default function HomePage() {
  const { folderTypes, isLoaded } = useFolderTypes()
  const hasFolderTypes = isLoaded && folderTypes.length > 0

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
        <div className="py-20 flex flex-col sm:flex-row gap-6 justify-evenly items-center">
          {/* Create Folder Type CTA */}
          <Link href={ROUTES.FOLDER_TYPES.NEW}>
            <button className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-8 text-lg rounded-lg shadow-lg transition duration-300 ease-in-out transform hover:scale-105 flex items-center gap-3">
              <FolderOpen className="h-6 w-6" />
              Créer un type de dossier
            </button>
          </Link>

          {/* Create Folder CTA */}
          <div className="relative">
            <Link
              href={hasFolderTypes ? ROUTES.FOLDERS.NEW : '#'}
              className={hasFolderTypes ? '' : 'pointer-events-none'}
            >
              <button
                className={`w-full sm:w-auto font-bold py-4 px-8 text-lg rounded-lg shadow-lg transition duration-300 ease-in-out flex items-center gap-3 ${hasFolderTypes
                  ? 'bg-green-600 hover:bg-green-700 text-white transform hover:scale-105'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                disabled={!hasFolderTypes}
              >
                <Plus className="h-6 w-6" />
                Créer un dossier
              </button>
            </Link>

            {/* Overlay for disabled state */}
            {!hasFolderTypes && isLoaded && (
              <div className="absolute inset-0 bg-black bg-opacity-50 rounded-lg flex items-center justify-center">
                <div className="bg-white p-3 rounded-lg shadow-lg text-center max-w-xs">
                  <p className="text-sm font-medium text-gray-900">
                    Créez un type de dossier d&apos;abord
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
        {!isLoaded && (
          <div className="flex justify-center mt-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        )}
      </div>
    </div>
  )
}