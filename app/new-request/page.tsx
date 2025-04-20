'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function NewRequest() {
    const [id, setId] = useState('')
    const router = useRouter()

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        // In a real app, you would send this to your API
        console.log('New request for ID:', id)
        // Redirect back to home page after submission
        router.push('/')
    }

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
            <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-lg">
                <div>
                    <h2 className="text-center text-3xl font-extrabold text-gray-900">
                        Nouvelle Demande
                    </h2>
                </div>
                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor="id" className="block text-sm font-medium text-gray-700">
                            ID
                        </label>
                        <input
                            id="id"
                            name="id"
                            type="text"
                            required
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            value={id}
                            onChange={(e) => setId(e.target.value)}
                            placeholder="Entrez l'ID"
                        />
                    </div>
                    <div className="flex justify-between">
                        <Link href="/">
                            <button
                                type="button"
                                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md"
                            >
                                Retour
                            </button>
                        </Link>
                        <button
                            type="submit"
                            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md"
                        >
                            Soumettre
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}