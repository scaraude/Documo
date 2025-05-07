import Link from 'next/link'
import { ROUTES } from '@/shared/constants'

export const ButtonNewModel = () => {
    return (
        <Link href={ROUTES.REQUESTS.HOME}>
            <button className="w-full sm:w-auto bg-stone-300 hover:bg-stone-400 text-white font-bold py-3 px-6 sm:px-8 md:px-10 text-base sm:text-lg md:text-xl rounded-lg shadow-lg transition duration-300 ease-in-out transform hover:scale-105">
                Nouveau Modèle
            </button>
        </Link>
    )
}