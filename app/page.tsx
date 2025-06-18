'use client';
import { useFolderTypes } from '@/features/folder-types';
import { APP_ICON_PATH, ROUTES } from '@/shared/constants';
import {
  Plus,
  FileText,
  FolderOpen,
  Shield,
  Clock,
  Users,
  CheckCircle,
  Mail,
  Lock,
  Zap,
  ArrowRight,
  Star,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '../shared/components/ui/hover-card';
import { Button } from '@/shared/components';
import Image from 'next/image';

export default function HomePage() {
  const router = useRouter();
  const { getAllFolderTypes } = useFolderTypes();
  const { data: folderTypes, isLoading } = getAllFolderTypes();
  const hasFolderTypes = !isLoading && folderTypes && folderTypes.length > 0;

  return (
    <div className="min-h-screen overflow-hidden">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-indigo-50">
        <div className="relative mx-auto max-w-7xl px-6 lg:px-8 pt-20 pb-32">
          <div className="mx-auto max-w-5xl text-center">
            {/* Main title */}
            <h1 className="text-6xl font-bold tracking-tight text-gray-900 sm:text-8xl mb-8 animate-fadeInUp delay-200 flex items-center justify-center gap-4">
              <Image
                src={APP_ICON_PATH}
                alt="Documo Logo"
                width={100}
                height={100}
                className="rounded-lg mr-4"
              />
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent">
                Documo
              </span>
            </h1>

            {/* Slogan */}
            <p className="text-3xl sm:text-4xl font-medium text-gray-700 mb-8 animate-fadeInUp delay-500">
              l&apos;échange de document à l&apos;ère moderne
            </p>

            {/* Description */}
            <p className="mt-8 text-xl leading-relaxed text-gray-600 max-w-4xl mx-auto mb-12 animate-fadeInUp delay-700">
              La plateforme sécurisée qui révolutionne la gestion documentaire
              entre organisations et citoyens.
              <span className="font-semibold text-gray-800">
                {' '}
                Fini les envois d&apos;emails non sécurisés
              </span>{' '}
              et les processus complexes.
            </p>

            {/* CTA Buttons */}
            <div className="flex items-center justify-center gap-6 flex-wrap mb-16 animate-fadeInUp delay-1000">
              <Button
                size="lg"
                className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-10 py-4 text-lg font-semibold shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-200"
                onClick={() => router.push(ROUTES.AUTH.SIGNUP)}
              >
                Commencer gratuitement
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="px-10 py-4 text-lg border-2 border-gray-300 hover:border-gray-400 hover:shadow-lg transform hover:scale-105 transition-all duration-200"
                onClick={() => router.push('#features')}
              >
                Découvrir les fonctionnalités
              </Button>
            </div>

            {/* Trust indicators */}
            <div className="flex items-center justify-center gap-12 text-sm text-gray-500 flex-wrap animate-fadeInUp delay-1000">
              <div className="flex items-center group">
                <CheckCircle className="h-5 w-5 text-green-500 mr-2 group-hover:scale-110 transition-transform" />
                <span className="font-medium">Gratuit pour débuter</span>
              </div>
              <div className="flex items-center group">
                <Shield className="h-5 w-5 text-green-500 mr-2 group-hover:scale-110 transition-transform" />
                <span className="font-medium">Sécurisé et conforme RGPD</span>
              </div>
              <div className="flex items-center group">
                <Zap className="h-5 w-5 text-green-500 mr-2 group-hover:scale-110 transition-transform" />
                <span className="font-medium">Déploiement instantané</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section
        id="features"
        className="py-24 bg-white relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-b from-gray-50/50 to-white"></div>
        <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center mb-20">
            <h2 className="text-5xl font-bold tracking-tight text-gray-900 mb-6">
              Pourquoi choisir{' '}
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Documo
              </span>{' '}
              ?
            </h2>
            <p className="text-xl text-gray-600 leading-relaxed">
              Une solution complète qui simplifie la gestion documentaire tout
              en garantissant la sécurité maximale
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature cards with enhanced design */}
            <div className="group relative p-8 bg-gradient-to-br from-blue-50 to-blue-100 rounded-3xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-blue-100">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-400/10 to-blue-600/10 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative">
                <div className="h-14 w-14 rounded-2xl bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-200">
                  <Shield className="h-7 w-7 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-blue-900 transition-colors">
                  Sécurité maximale
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Chiffrement end-to-end, authentification sécurisée et
                  conformité RGPD pour protéger vos données sensibles.
                </p>
              </div>
            </div>

            <div className="group relative p-8 bg-gradient-to-br from-green-50 to-green-100 rounded-3xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-green-100">
              <div className="absolute inset-0 bg-gradient-to-br from-green-400/10 to-green-600/10 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative">
                <div className="h-14 w-14 rounded-2xl bg-gradient-to-r from-green-500 to-green-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-200">
                  <Mail className="h-7 w-7 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-green-900 transition-colors">
                  Demandes par email
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Envoyez des demandes de documents personnalisées par email
                  avec des liens sécurisés pour le téléchargement.
                </p>
              </div>
            </div>

            <div className="group relative p-8 bg-gradient-to-br from-purple-50 to-purple-100 rounded-3xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-purple-100">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-400/10 to-purple-600/10 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative">
                <div className="h-14 w-14 rounded-2xl bg-gradient-to-r from-purple-500 to-purple-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-200">
                  <FolderOpen className="h-7 w-7 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-purple-900 transition-colors">
                  Organisation intelligente
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Créez des types de dossiers personnalisés et organisez vos
                  documents selon vos processus métier.
                </p>
              </div>
            </div>

            <div className="group relative p-8 bg-gradient-to-br from-orange-50 to-orange-100 rounded-3xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-orange-100">
              <div className="absolute inset-0 bg-gradient-to-br from-orange-400/10 to-orange-600/10 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative">
                <div className="h-14 w-14 rounded-2xl bg-gradient-to-r from-orange-500 to-orange-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-200">
                  <Clock className="h-7 w-7 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-orange-900 transition-colors">
                  Gain de temps
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Automatisez vos processus de collecte de documents et réduisez
                  le temps de traitement de 80%.
                </p>
              </div>
            </div>

            <div className="group relative p-8 bg-gradient-to-br from-teal-50 to-teal-100 rounded-3xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-teal-100">
              <div className="absolute inset-0 bg-gradient-to-br from-teal-400/10 to-teal-600/10 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative">
                <div className="h-14 w-14 rounded-2xl bg-gradient-to-r from-teal-500 to-teal-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-200">
                  <Users className="h-7 w-7 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-teal-900 transition-colors">
                  Collaboration fluide
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Facilitez les échanges entre équipes et avec vos usagers grâce
                  à une interface intuitive.
                </p>
              </div>
            </div>

            <div className="group relative p-8 bg-gradient-to-br from-rose-50 to-rose-100 rounded-3xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-rose-100">
              <div className="absolute inset-0 bg-gradient-to-br from-rose-400/10 to-rose-600/10 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative">
                <div className="h-14 w-14 rounded-2xl bg-gradient-to-r from-rose-500 to-rose-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-200">
                  <Zap className="h-7 w-7 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-rose-900 transition-colors">
                  Déploiement rapide
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Mettez en place votre solution en quelques minutes. Aucune
                  infrastructure complexe requise.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section className="py-24 bg-gradient-to-br from-gray-50 to-blue-50 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-1/4 right-0 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
          <div className="absolute bottom-1/4 left-0 w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
        </div>

        <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center mb-20">
            <h2 className="text-5xl font-bold tracking-tight text-gray-900 mb-6">
              Comment ça marche ?
            </h2>
            <p className="text-xl text-gray-600 leading-relaxed">
              Un processus simple en 3 étapes pour révolutionner votre gestion
              documentaire
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="relative text-center group">
              <div className="mx-auto h-24 w-24 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center mb-8 shadow-xl group-hover:shadow-2xl transform group-hover:scale-110 transition-all duration-300">
                <FolderOpen className="h-12 w-12 text-white" />
              </div>
              {/* Connection line */}
              <div className="absolute top-12 left-full w-12 h-0.5 bg-gradient-to-r from-blue-300 to-purple-300 hidden lg:block transform translate-x-6"></div>
              <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">
                  <span className="bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent">
                    1.
                  </span>{' '}
                  Configurez vos types de dossiers
                </h3>
                <p className="text-lg text-gray-600 leading-relaxed">
                  Définissez quels documents sont nécessaires pour chaque
                  processus de votre organisation.
                </p>
              </div>
            </div>

            <div className="relative text-center group">
              <div className="mx-auto h-24 w-24 rounded-full bg-gradient-to-r from-green-500 to-green-600 flex items-center justify-center mb-8 shadow-xl group-hover:shadow-2xl transform group-hover:scale-110 transition-all duration-300">
                <Mail className="h-12 w-12 text-white" />
              </div>
              {/* Connection line */}
              <div className="absolute top-12 left-full w-12 h-0.5 bg-gradient-to-r from-green-300 to-purple-300 hidden lg:block transform translate-x-6"></div>
              <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">
                  <span className="bg-gradient-to-r from-green-600 to-green-700 bg-clip-text text-transparent">
                    2.
                  </span>{' '}
                  Envoyez des demandes sécurisées
                </h3>
                <p className="text-lg text-gray-600 leading-relaxed">
                  Créez un dossier et envoyez des emails personnalisés avec des
                  liens de téléchargement sécurisés.
                </p>
              </div>
            </div>

            <div className="relative text-center group">
              <div className="mx-auto h-24 w-24 rounded-full bg-gradient-to-r from-purple-500 to-purple-600 flex items-center justify-center mb-8 shadow-xl group-hover:shadow-2xl transform group-hover:scale-110 transition-all duration-300">
                <FileText className="h-12 w-12 text-white" />
              </div>
              <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">
                  <span className="bg-gradient-to-r from-purple-600 to-purple-700 bg-clip-text text-transparent">
                    3.
                  </span>{' '}
                  Recevez et organisez
                </h3>
                <p className="text-lg text-gray-600 leading-relaxed">
                  Les documents arrivent automatiquement organisés et sécurisés
                  dans votre tableau de bord.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-700 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-72 h-72 bg-white rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse"></div>
          <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse delay-1000"></div>
        </div>

        <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-4xl text-center">
            <h2 className="text-5xl font-bold text-white mb-8">
              Prêt à moderniser votre gestion documentaire ?
            </h2>
            <p className="text-xl text-blue-100 mb-16 max-w-3xl mx-auto leading-relaxed">
              Rejoignez les organisations qui ont choisi Documo pour simplifier
              leurs processus et sécuriser leurs échanges.
            </p>

            <div className="flex items-center justify-center gap-8 flex-wrap mb-20">
              {!hasFolderTypes ? (
                <HoverCard>
                  <HoverCardTrigger>
                    <Button
                      size="lg"
                      disabled={!hasFolderTypes}
                      className="bg-white text-blue-600 hover:bg-gray-50 px-10 py-4 text-lg font-bold shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-200"
                      onClick={() => router.push(ROUTES.FOLDERS.NEW)}
                    >
                      <Plus className="mr-2 h-5 w-5" />
                      Créer votre premier dossier
                    </Button>
                  </HoverCardTrigger>
                  <HoverCardContent className="w-80">
                    <p className="text-sm text-gray-500">
                      Commencez par créer un type de dossier pour définir vos
                      processus
                    </p>
                  </HoverCardContent>
                </HoverCard>
              ) : (
                <Button
                  size="lg"
                  className="bg-white text-blue-600 hover:bg-gray-50 px-10 py-4 text-lg font-bold shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-200"
                  onClick={() => router.push(ROUTES.FOLDERS.NEW)}
                >
                  <Plus className="mr-2 h-5 w-5" />
                  Créer votre premier dossier
                </Button>
              )}

              <Button
                size="lg"
                variant="outline"
                className="border-2 border-white text-white hover:bg-white hover:text-blue-600 px-10 py-4 text-lg font-semibold shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-200"
                onClick={() => router.push(ROUTES.FOLDER_TYPES.NEW)}
              >
                <FolderOpen className="mr-2 h-5 w-5" />
                Configurer vos types de dossiers
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              <div className="group">
                <div className="text-4xl font-bold text-white mb-2 group-hover:scale-110 transition-transform">
                  100%
                </div>
                <div className="text-blue-100 font-medium">Sécurisé</div>
              </div>
              <div className="group">
                <div className="text-4xl font-bold text-white mb-2 group-hover:scale-110 transition-transform">
                  -80%
                </div>
                <div className="text-blue-100 font-medium">
                  Temps de traitement
                </div>
              </div>
              <div className="group">
                <div className="text-4xl font-bold text-white mb-2 group-hover:scale-110 transition-transform">
                  0€
                </div>
                <div className="text-blue-100 font-medium">Pour commencer</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Indicators */}
      <section className="py-20 bg-white border-t border-gray-200 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-gray-50/50 via-white to-gray-50/50"></div>
        <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
          <div className="text-center mb-16">
            <p className="text-lg font-medium text-gray-500 mb-12">
              Ils nous font confiance pour sécuriser leurs échanges
              documentaires
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
              <div className="flex flex-col items-center group">
                <div className="h-16 w-16 rounded-2xl bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-200 shadow-lg">
                  <Shield className="h-8 w-8 text-white" />
                </div>
                <span className="font-semibold text-gray-700 group-hover:text-blue-600 transition-colors">
                  RGPD Compliant
                </span>
              </div>
              <div className="flex flex-col items-center group">
                <div className="h-16 w-16 rounded-2xl bg-gradient-to-r from-green-500 to-green-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-200 shadow-lg">
                  <Lock className="h-8 w-8 text-white" />
                </div>
                <span className="font-semibold text-gray-700 group-hover:text-green-600 transition-colors">
                  Chiffrement SSL
                </span>
              </div>
              <div className="flex flex-col items-center group">
                <div className="h-16 w-16 rounded-2xl bg-gradient-to-r from-purple-500 to-purple-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-200 shadow-lg">
                  <CheckCircle className="h-8 w-8 text-white" />
                </div>
                <span className="font-semibold text-gray-700 group-hover:text-purple-600 transition-colors">
                  ISO 27001
                </span>
              </div>
              <div className="flex flex-col items-center group">
                <div className="h-16 w-16 rounded-2xl bg-gradient-to-r from-orange-500 to-orange-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-200 shadow-lg">
                  <Star className="h-8 w-8 text-white" />
                </div>
                <span className="font-semibold text-gray-700 group-hover:text-orange-600 transition-colors">
                  99.9% Uptime
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {isLoading && (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      )}
    </div>
  );
}
