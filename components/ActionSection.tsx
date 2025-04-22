import Link from 'next/link'

export const ActionSection = () =>
    <div className="w-full flex-1 h-64 sm:h-auto flex items-center justify-center p-6">
        <Link href="/nouvelle-requete">
            <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-45 text-xl rounded-lg shadow-lg transition duration-300 ease-in-out transform hover:scale-105">
                Nouvelle Demande
            </button>
        </Link>
    </div>