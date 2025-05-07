'use client'
import { ReactNode } from 'react'

export const HeroSection = (): ReactNode => {
    return (
        <div className="w-full py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto text-center">
                <h2 className="text-3xl sm:text-4xl text-blue-600 font-medium my-10">
                    Bienvenue sur SecurDoc
                </h2>
                <h1 className="text-xl font-bold text-gray-900 mb-4">
                    Simplifiez vos transferts de documents
                </h1>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                    Accédez facilement aux documents administratifs dont vous avez besoin grâce à notre solution sécurisée.
                    Créez une demande grâces à un code d&apos;identification et recevez les documents en toute simplicité.
                </p>
            </div>
        </div>
    )
}