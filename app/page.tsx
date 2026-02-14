import { APP_ICON_PATH, ROUTES } from '@/shared/constants';
import {
  ArrowRight,
  CheckCircle,
  Clock,
  FileText,
  FolderOpen,
  Mail,
  RefreshCw,
  Shield,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100">
        <div className="mx-auto max-w-6xl px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-3">
              <Image
                src={APP_ICON_PATH}
                alt="Documo"
                width={32}
                height={32}
                className="rounded-md"
              />
              <span className="text-xl font-semibold text-[var(--documo-blue)]">
                Documo
              </span>
            </Link>
            <nav className="flex items-center gap-6">
              <a
                href="#fonctionnalites"
                className="text-sm text-[var(--documo-text-secondary)] hover:text-[var(--documo-black)] transition-colors"
              >
                Fonctionnalités
              </a>
              <a
                href="#comment-ca-marche"
                className="text-sm text-[var(--documo-text-secondary)] hover:text-[var(--documo-black)] transition-colors"
              >
                Comment ça marche
              </a>
              <Link
                href={ROUTES.AUTH.LOGIN}
                className="text-sm font-medium text-[var(--documo-blue)] hover:text-[var(--documo-blue-deep)] transition-colors"
              >
                Se connecter
              </Link>
              <Link
                href={ROUTES.AUTH.SIGNUP}
                className="inline-flex items-center justify-center bg-[var(--documo-blue)] hover:bg-[var(--documo-blue-deep)] text-white px-4 py-2 text-sm font-medium rounded-md transition-colors"
              >
                Commencer
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-24 bg-white">
        <div className="mx-auto max-w-6xl px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <div className="flex items-center justify-center gap-4 mb-8">
              <Image
                src={APP_ICON_PATH}
                alt="Documo"
                width={64}
                height={64}
                className="rounded-lg"
              />
              <h1 className="text-5xl font-bold text-[var(--documo-blue)]">
                Documo
              </h1>
            </div>

            <p className="text-2xl font-medium text-[var(--documo-text-secondary)] mb-6">
              L&apos;échange de documents à l&apos;ère moderne
            </p>

            <p className="text-lg text-[var(--documo-text-secondary)] mb-10 max-w-2xl mx-auto leading-relaxed">
              Documo automatise la collecte : demande, relance, centralisation.
              Tout se fait par email, sans que tes clients aient besoin
              d&apos;installer quoi que ce soit.
            </p>

            <div className="flex items-center justify-center gap-4 mb-12">
              <Link
                href={ROUTES.AUTH.SIGNUP}
                className="inline-flex items-center justify-center bg-[var(--documo-blue)] hover:bg-[var(--documo-blue-deep)] text-white px-6 py-3 text-base font-medium rounded-md transition-colors"
              >
                Commencer gratuitement
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
              <a
                href="#fonctionnalites"
                className="inline-flex items-center justify-center px-6 py-3 text-base font-medium border border-gray-200 hover:border-gray-300 rounded-md text-[var(--documo-text-secondary)] hover:text-[var(--documo-black)] transition-colors"
              >
                En savoir plus
              </a>
            </div>

            <div className="flex items-center justify-center gap-8 text-sm text-[var(--documo-text-tertiary)]">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-[var(--documo-success)]" />
                <span>Gratuit pour débuter</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-[var(--documo-success)]" />
                <span>Conforme RGPD</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section
        id="fonctionnalites"
        className="py-24 bg-[var(--documo-bg-light)]"
      >
        <div className="mx-auto max-w-6xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center mb-16">
            <h2 className="text-3xl font-bold text-[var(--documo-black)] mb-4">
              Pourquoi <span className="text-[var(--documo-blue)]">Documo</span>{' '}
              ?
            </h2>
            <p className="text-lg text-[var(--documo-text-secondary)]">
              Moins de relances, moins de dossiers incomplets, plus de temps
              pour ce qui compte.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-100">
              <div className="h-12 w-12 rounded-lg bg-[var(--documo-blue-light)] flex items-center justify-center mb-6">
                <Mail className="h-6 w-6 text-[var(--documo-blue)]" />
              </div>
              <h3 className="text-lg font-semibold text-[var(--documo-black)] mb-3">
                Workflow par email
              </h3>
              <p className="text-[var(--documo-text-secondary)] leading-relaxed">
                Tes clients reçoivent un email avec un lien sécurisé. Ils
                déposent leurs documents sans créer de compte. Simple.
              </p>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-100">
              <div className="h-12 w-12 rounded-lg bg-[var(--documo-blue-light)] flex items-center justify-center mb-6">
                <RefreshCw className="h-6 w-6 text-[var(--documo-blue)]" />
              </div>
              <h3 className="text-lg font-semibold text-[var(--documo-black)] mb-3">
                Relances automatiques
              </h3>
              <p className="text-[var(--documo-text-secondary)] leading-relaxed">
                Plus besoin de courir après les documents manquants. Les
                relances partent toutes seules jusqu&apos;à réception.
              </p>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-100">
              <div className="h-12 w-12 rounded-lg bg-[var(--documo-blue-light)] flex items-center justify-center mb-6">
                <FolderOpen className="h-6 w-6 text-[var(--documo-blue)]" />
              </div>
              <h3 className="text-lg font-semibold text-[var(--documo-black)] mb-3">
                Centralisation sécurisée
              </h3>
              <p className="text-[var(--documo-text-secondary)] leading-relaxed">
                Tout est au même endroit, pour tout le monde. Fini les pièces
                jointes perdues dans les emails.
              </p>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-100">
              <div className="h-12 w-12 rounded-lg bg-[var(--documo-blue-light)] flex items-center justify-center mb-6">
                <Clock className="h-6 w-6 text-[var(--documo-blue)]" />
              </div>
              <h3 className="text-lg font-semibold text-[var(--documo-black)] mb-3">
                Dossiers complets
              </h3>
              <p className="text-[var(--documo-text-secondary)] leading-relaxed">
                Définis les documents requis une fois. Documo vérifie que chaque
                dossier est complet avant de te notifier.
              </p>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-100">
              <div className="h-12 w-12 rounded-lg bg-[var(--documo-blue-light)] flex items-center justify-center mb-6">
                <Shield className="h-6 w-6 text-[var(--documo-blue)]" />
              </div>
              <h3 className="text-lg font-semibold text-[var(--documo-black)] mb-3">
                Sécurité maximale
              </h3>
              <p className="text-[var(--documo-text-secondary)] leading-relaxed">
                Chiffrement, authentification sécurisée, conformité RGPD. Les
                documents sensibles sont protégés.
              </p>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-100">
              <div className="h-12 w-12 rounded-lg bg-[var(--documo-blue-light)] flex items-center justify-center mb-6">
                <FileText className="h-6 w-6 text-[var(--documo-blue)]" />
              </div>
              <h3 className="text-lg font-semibold text-[var(--documo-black)] mb-3">
                Prise en main rapide
              </h3>
              <p className="text-[var(--documo-text-secondary)] leading-relaxed">
                Crée un dossier, envoie la demande, attends la réponse.
                C&apos;est tout. Pas de formation nécessaire.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section id="comment-ca-marche" className="py-24 bg-white">
        <div className="mx-auto max-w-6xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center mb-16">
            <h2 className="text-3xl font-bold text-[var(--documo-black)] mb-4">
              Comment ça marche ?
            </h2>
            <p className="text-lg text-[var(--documo-text-secondary)]">
              Trois étapes pour ne plus jamais relancer à la main.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="text-center">
              <div className="mx-auto h-16 w-16 rounded-full bg-[var(--documo-blue-light)] flex items-center justify-center mb-6">
                <span className="text-2xl font-bold text-[var(--documo-blue)]">
                  1
                </span>
              </div>
              <h3 className="text-xl font-semibold text-[var(--documo-black)] mb-4">
                Crée un type de dossier
              </h3>
              <p className="text-[var(--documo-text-secondary)] leading-relaxed">
                Définis les documents nécessaires pour chaque type de demande.
                Par exemple : dossier locatif, dossier d&apos;achat, demande de
                vente.
              </p>
            </div>

            <div className="text-center">
              <div className="mx-auto h-16 w-16 rounded-full bg-[var(--documo-blue-light)] flex items-center justify-center mb-6">
                <span className="text-2xl font-bold text-[var(--documo-blue)]">
                  2
                </span>
              </div>
              <h3 className="text-xl font-semibold text-[var(--documo-black)] mb-4">
                Envoie la demande
              </h3>
              <p className="text-[var(--documo-text-secondary)] leading-relaxed">
                Ton client reçoit un email avec un lien sécurisé. Il dépose ses
                documents depuis n&apos;importe quel appareil. Pas de compte à
                créer.
              </p>
            </div>

            <div className="text-center">
              <div className="mx-auto h-16 w-16 rounded-full bg-[var(--documo-blue-light)] flex items-center justify-center mb-6">
                <span className="text-2xl font-bold text-[var(--documo-blue)]">
                  3
                </span>
              </div>
              <h3 className="text-xl font-semibold text-[var(--documo-black)] mb-4">
                C&apos;est prêt
              </h3>
              <p className="text-[var(--documo-text-secondary)] leading-relaxed">
                Les documents arrivent organisés dans ton tableau de bord. Tu es
                notifié quand le dossier est complet. Les relances sont
                automatiques.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-[var(--documo-blue)]">
        <div className="mx-auto max-w-6xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold text-white mb-6">
              Prêt à gagner du temps ?
            </h2>
            <p className="text-lg text-blue-100 mb-10">
              Rejoins les professionnels qui ont automatisé leur collecte de
              documents.
            </p>

            <Link
              href={ROUTES.AUTH.SIGNUP}
              className="inline-flex items-center justify-center bg-white hover:bg-gray-50 text-[var(--documo-blue)] px-8 py-4 text-base font-semibold rounded-md transition-colors"
            >
              Commencer gratuitement
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>

            <div className="grid grid-cols-3 gap-8 mt-16 max-w-lg mx-auto">
              <div className="text-center">
                <div className="text-3xl font-bold text-white mb-1">100%</div>
                <div className="text-sm text-blue-100">Sécurisé</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-white mb-1">0</div>
                <div className="text-sm text-blue-100">Relance manuelle</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-white mb-1">0€</div>
                <div className="text-sm text-blue-100">Pour commencer</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 bg-[var(--documo-bg-light)]">
        <div className="mx-auto max-w-6xl px-6 lg:px-8">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 max-w-2xl mx-auto">
            <div className="text-center">
              <div className="mx-auto h-14 w-14 rounded-full bg-[var(--documo-blue-light)] flex items-center justify-center mb-6">
                <Mail className="h-7 w-7 text-[var(--documo-blue)]" />
              </div>
              <h2 className="text-2xl font-bold text-[var(--documo-black)] mb-3">
                Une question ?
              </h2>
              <p className="text-[var(--documo-text-secondary)] mb-8 max-w-md mx-auto">
                Notre équipe est disponible pour répondre à toutes tes questions
                et t&apos;accompagner dans ta prise en main.
              </p>
              <a
                href="mailto:support@documo.fr"
                className="inline-flex items-center justify-center gap-2 bg-[var(--documo-blue)] hover:bg-[var(--documo-blue-deep)] text-white px-6 py-3 text-base font-medium rounded-md transition-colors"
              >
                <Mail className="h-5 w-5" />
                Nous contacter
              </a>
              <p className="mt-4 text-sm text-[var(--documo-text-tertiary)]">
                support@documo.fr
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 bg-white border-t border-gray-100">
        <div className="mx-auto max-w-6xl px-6 lg:px-8">
          <div className="flex items-center justify-center">
            <div className="flex items-center gap-3">
              <Image
                src={APP_ICON_PATH}
                alt="Documo"
                width={24}
                height={24}
                className="rounded"
              />
              <span className="text-sm text-[var(--documo-text-tertiary)]">
                © 2026 Documo. Tous droits réservés.
              </span>
            </div>
            {/* <div className="flex items-end gap-6">
              <Link
                href="/gcu"
                className="text-sm text-[var(--documo-text-tertiary)] hover:text-[var(--documo-text-secondary)] transition-colors"
              >
                CGU
              </Link>
            </div> */}
          </div>
        </div>
      </footer>
    </div>
  );
}
