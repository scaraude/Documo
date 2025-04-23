'use client'
import { useRouter } from "next/navigation";
import { ReactNode } from "react";
import { ROUTES } from "@/shared/constants";

export const ButtonCreateNewModel = (): ReactNode => {
    const router = useRouter();

    return (
        <div className="w-full flex flex-col items-center justify-center">
            <p className="text-sm text-gray-500 py-3">Aucun modèle disponible</p>
            <button
                onClick={() => router.push(ROUTES.REQUESTS.HOME)}
                className="px-26 py-2 my-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            > Créer un modèle </button>
        </div>
    )
}