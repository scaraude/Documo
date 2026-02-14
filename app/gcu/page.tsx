import { APP_ICON_PATH, ROUTES } from '@/shared/constants';
import { AlertCircle, ArrowLeft, FileText, Shield, Users } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export const metadata = {
  title: "Conditions Générales d'Utilisation - Documo",
  description:
    "Conditions générales d'utilisation de la plateforme Documo pour l'échange de documents sécurisé.",
};

export default function GCUPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="mx-auto max-w-4xl px-6 py-4">
          <div className="flex items-center justify-between">
            <Link
              href={ROUTES.HOME}
              className="flex items-center gap-3 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <Image
                src={APP_ICON_PATH}
                alt="Documo Logo"
                width={32}
                height={32}
                className="rounded-lg"
              />
              <span className="font-semibold text-lg bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Documo
              </span>
            </Link>
            <Link
              href={ROUTES.HOME}
              className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Retour à l&apos;accueil
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-4xl px-6 py-12">
        {/* Title Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center h-16 w-16 rounded-2xl bg-gradient-to-r from-blue-500 to-blue-600 mb-6">
            <FileText className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Conditions Générales d&apos;Utilisation
          </h1>
          <p className="text-gray-600">
            Dernière mise à jour : 21 décembre 2024
          </p>
        </div>

        {/* Content */}
        <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12 space-y-10">
          {/* Introduction */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
              <span className="h-8 w-8 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600 text-sm font-bold">
                1
              </span>
              Objet
            </h2>
            <p className="text-gray-600 leading-relaxed">
              Les présentes Conditions Générales d&apos;Utilisation (ci-après
              &quot;CGU&quot;) ont pour objet de définir les modalités et
              conditions d&apos;utilisation de la plateforme Documo (ci-après
              &quot;le Service&quot;), accessible à l&apos;adresse documo.fr,
              ainsi que de définir les droits et obligations des parties dans ce
              cadre.
            </p>
            <p className="text-gray-600 leading-relaxed mt-4">
              Documo est une plateforme de gestion et d&apos;échange de
              documents sécurisés permettant aux organisations de collecter des
              documents auprès de leurs usagers de manière simple et sécurisée.
            </p>
          </section>

          {/* Acceptance */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
              <span className="h-8 w-8 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600 text-sm font-bold">
                2
              </span>
              Acceptation des CGU
            </h2>
            <p className="text-gray-600 leading-relaxed">
              L&apos;utilisation du Service implique l&apos;acceptation pleine
              et entière des présentes CGU. En créant un compte ou en utilisant
              le Service, vous reconnaissez avoir lu, compris et accepté
              l&apos;intégralité des présentes conditions.
            </p>
            <p className="text-gray-600 leading-relaxed mt-4">
              Documo se réserve le droit de modifier les présentes CGU à tout
              moment. Les utilisateurs seront informés de toute modification par
              email ou par notification sur la plateforme. La poursuite de
              l&apos;utilisation du Service après modification vaut acceptation
              des nouvelles conditions.
            </p>
          </section>

          {/* Access and Registration */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
              <span className="h-8 w-8 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600 text-sm font-bold">
                3
              </span>
              Accès au Service et inscription
            </h2>
            <div className="space-y-4">
              <p className="text-gray-600 leading-relaxed">
                L&apos;accès au Service nécessite la création d&apos;un compte
                utilisateur. L&apos;utilisateur s&apos;engage à fournir des
                informations exactes et à jour lors de son inscription et à les
                maintenir à jour.
              </p>
              <p className="text-gray-600 leading-relaxed">
                L&apos;utilisateur est responsable de la confidentialité de ses
                identifiants de connexion et s&apos;engage à ne pas les
                communiquer à des tiers. Toute utilisation du Service effectuée
                avec les identifiants de l&apos;utilisateur sera réputée avoir
                été effectuée par celui-ci.
              </p>
              <p className="text-gray-600 leading-relaxed">
                Documo se réserve le droit de suspendre ou de supprimer tout
                compte en cas de violation des présentes CGU ou d&apos;activité
                suspecte.
              </p>
            </div>
          </section>

          {/* Services Description */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
              <span className="h-8 w-8 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600 text-sm font-bold">
                4
              </span>
              Description du Service
            </h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              Documo propose les fonctionnalités suivantes :
            </p>
            <ul className="space-y-3 text-gray-600">
              <li className="flex items-start gap-3">
                <Shield className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
                <span>
                  Création et gestion de dossiers personnalisés pour la collecte
                  de documents
                </span>
              </li>
              <li className="flex items-start gap-3">
                <Shield className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
                <span>
                  Envoi de demandes de documents sécurisées par email avec liens
                  uniques
                </span>
              </li>
              <li className="flex items-start gap-3">
                <Shield className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
                <span>
                  Réception et stockage sécurisé des documents téléchargés
                </span>
              </li>
              <li className="flex items-start gap-3">
                <Shield className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
                <span>
                  Suivi en temps réel de l&apos;état des demandes de documents
                </span>
              </li>
              <li className="flex items-start gap-3">
                <Shield className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
                <span>
                  Organisation des documents par modèles de dossiers
                  configurables
                </span>
              </li>
            </ul>
          </section>

          {/* User Obligations */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
              <span className="h-8 w-8 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600 text-sm font-bold">
                5
              </span>
              Obligations de l&apos;utilisateur
            </h2>
            <div className="space-y-4">
              <p className="text-gray-600 leading-relaxed">
                L&apos;utilisateur s&apos;engage à :
              </p>
              <ul className="space-y-2 text-gray-600 list-disc list-inside ml-4">
                <li>
                  Utiliser le Service de manière loyale et conformément à sa
                  destination
                </li>
                <li>
                  Ne pas utiliser le Service à des fins illicites ou contraires
                  aux bonnes mœurs
                </li>
                <li>
                  Respecter les droits de propriété intellectuelle de Documo et
                  des tiers
                </li>
                <li>
                  Ne pas tenter de porter atteinte au fonctionnement technique
                  du Service
                </li>
                <li>
                  Garantir qu&apos;il dispose des droits nécessaires sur les
                  documents qu&apos;il collecte
                </li>
                <li>
                  Respecter la réglementation applicable en matière de
                  protection des données personnelles
                </li>
              </ul>
            </div>
          </section>

          {/* Data Protection */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
              <span className="h-8 w-8 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600 text-sm font-bold">
                6
              </span>
              Protection des données personnelles
            </h2>
            <div className="bg-blue-50 rounded-xl p-6 mb-4">
              <div className="flex items-start gap-3">
                <Users className="h-6 w-6 text-blue-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-gray-700 font-medium mb-2">
                    Conformité RGPD
                  </p>
                  <p className="text-gray-600 text-sm">
                    Documo s&apos;engage à respecter le Règlement Général sur la
                    Protection des Données (RGPD) et la loi Informatique et
                    Libertés.
                  </p>
                </div>
              </div>
            </div>
            <p className="text-gray-600 leading-relaxed">
              Les données personnelles collectées dans le cadre de
              l&apos;utilisation du Service sont traitées conformément à notre
              politique de confidentialité. Documo met en œuvre les mesures
              techniques et organisationnelles appropriées pour assurer la
              sécurité et la confidentialité des données.
            </p>
            <p className="text-gray-600 leading-relaxed mt-4">
              L&apos;utilisateur dispose d&apos;un droit d&apos;accès, de
              rectification, de suppression et de portabilité de ses données,
              ainsi que d&apos;un droit d&apos;opposition et de limitation du
              traitement.
            </p>
          </section>

          {/* Intellectual Property */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
              <span className="h-8 w-8 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600 text-sm font-bold">
                7
              </span>
              Propriété intellectuelle
            </h2>
            <p className="text-gray-600 leading-relaxed">
              L&apos;ensemble des éléments composant le Service (textes,
              graphiques, logiciels, photographies, images, sons, plans, logos,
              marques, etc.) est la propriété exclusive de Documo ou de ses
              partenaires, et est protégé par les lois relatives à la propriété
              intellectuelle.
            </p>
            <p className="text-gray-600 leading-relaxed mt-4">
              Toute reproduction, représentation, modification, publication ou
              adaptation de tout ou partie des éléments du Service, quel que
              soit le moyen ou le procédé utilisé, est interdite sans
              l&apos;autorisation écrite préalable de Documo.
            </p>
          </section>

          {/* Liability */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
              <span className="h-8 w-8 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600 text-sm font-bold">
                8
              </span>
              Responsabilité
            </h2>
            <div className="bg-amber-50 rounded-xl p-6 mb-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-6 w-6 text-amber-600 mt-0.5 flex-shrink-0" />
                <p className="text-gray-700 text-sm">
                  Documo s&apos;efforce d&apos;assurer la disponibilité du
                  Service 24h/24 et 7j/7, mais ne peut garantir une
                  disponibilité permanente et ininterrompue.
                </p>
              </div>
            </div>
            <p className="text-gray-600 leading-relaxed">
              Documo ne pourra être tenu responsable des dommages directs ou
              indirects résultant de l&apos;utilisation du Service, notamment en
              cas de perte de données, d&apos;interruption du Service, ou de
              tout autre incident lié à l&apos;utilisation du Service.
            </p>
            <p className="text-gray-600 leading-relaxed mt-4">
              L&apos;utilisateur est seul responsable de l&apos;utilisation
              qu&apos;il fait du Service et des documents qu&apos;il collecte et
              stocke via la plateforme.
            </p>
          </section>

          {/* Termination */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
              <span className="h-8 w-8 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600 text-sm font-bold">
                9
              </span>
              Résiliation
            </h2>
            <p className="text-gray-600 leading-relaxed">
              L&apos;utilisateur peut résilier son compte à tout moment en
              contactant le support ou via les paramètres de son compte. La
              résiliation entraîne la suppression définitive du compte et des
              données associées après le délai légal de conservation.
            </p>
            <p className="text-gray-600 leading-relaxed mt-4">
              Documo se réserve le droit de résilier l&apos;accès au Service de
              tout utilisateur en cas de violation des présentes CGU, sans
              préavis ni indemnité.
            </p>
          </section>

          {/* Applicable Law */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
              <span className="h-8 w-8 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600 text-sm font-bold">
                10
              </span>
              Droit applicable et juridiction
            </h2>
            <p className="text-gray-600 leading-relaxed">
              Les présentes CGU sont régies par le droit français. En cas de
              litige relatif à l&apos;interprétation ou à l&apos;exécution des
              présentes CGU, les parties s&apos;efforceront de trouver une
              solution amiable.
            </p>
            <p className="text-gray-600 leading-relaxed mt-4">
              À défaut d&apos;accord amiable, les tribunaux français seront
              seuls compétents pour connaître du litige.
            </p>
          </section>

          {/* Contact */}
          <section className="border-t border-gray-200 pt-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Contact</h2>
            <p className="text-gray-600 leading-relaxed">
              Pour toute question concernant les présentes CGU ou le Service,
              vous pouvez nous contacter à l&apos;adresse suivante :{' '}
              <a
                href="mailto:contact@documo.fr"
                className="text-blue-600 hover:text-blue-700 underline"
              >
                contact@documo.fr
              </a>
            </p>
          </section>
        </div>

        {/* Back to Home */}
        <div className="text-center mt-12">
          <Link
            href={ROUTES.HOME}
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Retour à l&apos;accueil
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-8 mt-12">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <p className="text-sm text-gray-500">
            © {new Date().getFullYear()} Documo. Tous droits réservés.
          </p>
        </div>
      </footer>
    </div>
  );
}
