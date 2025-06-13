'use client'
import Link from 'next/link'
import { useState } from 'react'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { ROUTES } from '@/shared/constants'
import { UserMenu } from '@/features/auth'

const navLinks = [
    { href: ROUTES.HOME, label: 'Accueil' },
    { href: ROUTES.FOLDERS.HOME, label: 'Dossiers' },
    { href: ROUTES.REQUESTS.HOME, label: 'Demandes' }
]

export const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const pathname = usePathname()

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen)

    return (
        <nav className="bg-white border-b border-gray-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    {/* Logo */}
                    <Link href="/" className="flex items-center">
                        <span className="text-2xl font-bold text-blue-600">Centradoc</span>
                    </Link>

                    {/* Desktop navigation */}
                    <div className="hidden md:flex items-center space-x-8">
                        {navLinks.map(link => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={cn(
                                    "px-3 py-2 rounded-md text-sm font-medium transition-colors",
                                    pathname === link.href
                                        ? "bg-blue-50 text-blue-600"
                                        : "text-gray-600 hover:text-blue-600 hover:bg-gray-50"
                                )}
                            >
                                {link.label}
                            </Link>
                        ))}
                        <UserMenu />
                    </div>

                    {/* Mobile navigation */}
                    <div className="md:hidden flex items-center space-x-4">
                        <UserMenu />
                        <button
                            className="p-2 rounded-md text-gray-600 hover:text-blue-600 hover:bg-gray-100 focus:outline-none"
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
            </div>

            {/* Mobile menu */}
            {isMenuOpen && (
                <div className="md:hidden border-t">
                    <div className="px-2 pt-2 pb-3 space-y-1">
                        {navLinks.map(link => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={cn(
                                    "block px-3 py-2 rounded-md text-base font-medium transition-colors",
                                    pathname === link.href
                                        ? "bg-blue-50 text-blue-600"
                                        : "text-gray-600 hover:text-blue-600 hover:bg-gray-50"
                                )}
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