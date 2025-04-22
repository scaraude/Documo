'use client'
import Link from 'next/link'
import { useState } from 'react'
import { ROUTES } from '@/constants'

const navLinks = [
    { href: ROUTES.HOME, label: 'Demandes' },
    { href: ROUTES.REQUESTS.HOME, label: 'Modèles' },
    { href: ROUTES.DOCUMENTS.HOME, label: 'Documents' }
]

export const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false)

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen)

    return (
        <nav className="bg-white shadow-md">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    {/* Logo */}
                    <Link href="/" className="flex items-center">
                        <span className="text-xl font-bold text-blue-600">DocumentTransfer</span>
                    </Link>

                    {/* Desktop navigation */}
                    <div className="hidden md:flex items-center space-x-8">
                        {navLinks.map(link => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className="text-gray-600 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium"
                            >
                                {link.label}
                            </Link>
                        ))}
                    </div>

                    {/* Mobile menu button */}
                    <button
                        className="md:hidden p-2 rounded-md text-gray-600 hover:text-blue-600 hover:bg-gray-100 focus:outline-none"
                        aria-expanded={isMenuOpen}
                        onClick={toggleMenu}
                    >
                        <svg
                            className="h-6 w-6"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            {isMenuOpen
                                ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            }
                        </svg>
                    </button>
                </div>
            </div>

            {/* Mobile menu */}
            {isMenuOpen && (
                <div className="md:hidden border-t">
                    <div className="px-2 pt-2 pb-3 space-y-1">
                        {navLinks.map(link => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className="block text-gray-600 hover:text-blue-600 hover:bg-gray-50 px-3 py-2 rounded-md text-base font-medium"
                                onClick={toggleMenu}
                            >
                                {link.label}
                            </Link>
                        ))}
                    </div>
                </div>
            )}
        </nav>
    )
}