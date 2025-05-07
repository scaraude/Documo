import Link from 'next/link'
import { ROUTES } from '@/shared/constants'

export const ButtonNewRequest = () => {
    return (
        <Link href={ROUTES.REQUESTS.NEW}>
            <button className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 sm:px-8 md:px-10 text-base sm:text-lg md:text-xl rounded-lg shadow-lg transition duration-300 ease-in-out transform hover:scale-105">
                Nouvelle Demande
            </button>
        </Link>
    )
}