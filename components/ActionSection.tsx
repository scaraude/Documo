import Link from 'next/link'

export const ActionSection = () => {
    return (
        <div className="w-full flex-1 py-6 sm:py-8 md:py-12 lg:h-64 flex items-center justify-center px-4 sm:px-6">
            <Link href="/nouvelle-requete">
                <button className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 sm:px-8 md:px-10 text-base sm:text-lg md:text-xl rounded-lg shadow-lg transition duration-300 ease-in-out transform hover:scale-105">
                    Nouvelle Demande
                </button>
            </Link>
        </div>
    )
}