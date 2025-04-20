import Link from 'next/link'

export const ActionSection = () =>
    <div className="w-full sm:w-1/2 h-64 sm:h-auto flex items-center justify-center p-6">
        <Link href="/new-request">
            <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg shadow-lg transition duration-300 ease-in-out transform hover:scale-105">
                Nouvelle Demande
            </button>
        </Link>
    </div>