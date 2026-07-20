"use client"
import { useAppContext } from '@/context/AppContext'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { FiUser, FiHome, FiPlus, FiLogIn, FiLogOut, FiSettings, FiMenu, FiX, FiChevronDown } from 'react-icons/fi'
import { BsSearch } from 'react-icons/bs'
import { useState, useRef, useEffect } from 'react'
import { useLogout } from '@/hooks/useAuth'

const navLinks = [
    { label: "Properties", href: "/properties", icon: <FiHome size={17} /> },
]

const Header = () => {
    const { user, isMobile } = useAppContext()
    const { mutate: logout } = useLogout()
    const router = useRouter()
    const pathname = usePathname()

    const [isDropdownOpen, setIsDropdownOpen] = useState(false)
    const [scrolled, setScrolled] = useState(false)
    const dropdownRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 10)
        onScroll()
        window.addEventListener('scroll', onScroll)
        return () => window.removeEventListener('scroll', onScroll)
    }, [])

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    useEffect(() => {
        setIsDropdownOpen(false)
    }, [pathname])

    const handleLogout = () => {
        setIsDropdownOpen(false)
        logout()
        router.push('/login')
    }

    const isActive = (href: string) => pathname === href

    return (
        <>
            {/* Threshold stripe — signature accent */}
            <div className="h-[3px] w-full grad-threshold" />

            <header
                className={`sticky top-0 z-50 transition-all duration-300 ${scrolled
                    ? 'bg-surface/90 backdrop-blur-md shadow-[0_4px_20px_-8px_rgba(0,0,0,0.12)] border-b border-border-light'
                    : 'bg-surface border-b border-transparent'
                    }`}
            >
                <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 px-4 md:px-8 h-16 md:h-[70px]">

                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-3 group shrink-0">
                        <div className="relative w-10 h-10 md:w-11 md:h-11 rounded-xl grad-logo-icon flex items-center justify-center shadow-sm transition-transform duration-300 group-hover:scale-105 group-hover:-rotate-2">
                            <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round">
                                <path d="M6 21V11a6 6 0 0 1 12 0v10" />
                                <path d="M4 21h16" />
                            </svg>
                        </div>
                        <div className="flex flex-col leading-none">
                            <span className="font-serif text-xl md:text-[22px] font-semibold text-primary-dark tracking-tight">
                                Estatio
                            </span>
                            <span className="hidden md:block text-[10px] font-medium tracking-[0.25em] text-text-muted uppercase mt-0.5">
                                Real Estate
                            </span>
                        </div>
                    </Link>

                    {/* Desktop nav */}
                    <nav className="hidden lg:flex items-center gap-1">
                        {navLinks.map((link) => (
                            <Link
                                key={link.label}
                                href={link.href}
                                className={`relative flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200 ${isActive(link.href)
                                    ? 'text-primary-dark'
                                    : 'text-text-muted hover:text-primary-dark'
                                    }`}
                            >
                                {isActive(link.href) && (
                                    <span className="absolute inset-0 bg-primary-subtle rounded-full" />
                                )}
                                <span className="relative flex items-center gap-2">
                                    {link.icon}
                                    {link.label}
                                </span>
                            </Link>
                        ))}
                    </nav>

                    {/* Right cluster */}
                    <div className="flex items-center gap-2 md:gap-3">

                        <Link
                            href="/properties"
                            className="hidden lg:flex items-center justify-center w-10 h-10 rounded-full text-text-muted hover:text-primary-dark hover:bg-primary-subtle transition-all duration-200"
                            title="Search properties"
                        >
                            <BsSearch size={16} />
                        </Link>
                        {!isMobile &&
                            <Link
                                href="/properties/new"
                                className="btn btn-secondary btn-sm"
                            >
                                <span className="flex items-center justify-center w-5 h-5 rounded-full bg-white/20">
                                    <FiPlus size={13} />
                                </span>
                                Post Property
                            </Link>
                        }
                        {!user ? (
                            <Link
                                href="/login"
                                className="flex items-center gap-2 px-4 md:px-5 py-2.5 rounded-full text-sm font-semibold text-primary-dark border-[1.5px] border-primary/25 hover:border-primary hover:bg-primary-subtle transition-all duration-200"
                            >
                                <FiLogIn size={16} />
                                <span className="hidden sm:inline">Login</span>
                            </Link>
                        ) : (
                            <div className="relative" ref={dropdownRef}>
                                <button
                                    onClick={() => setIsDropdownOpen((v) => !v)}
                                    className="flex items-center gap-2 pl-1 pr-2.5 py-1 rounded-full hover:bg-primary-subtle transition-all duration-200"
                                >
                                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-accent to-accent-dark p-[2px]">
                                        <div className="w-full h-full rounded-full bg-surface flex items-center justify-center">
                                            <FiUser size={15} className="text-accent-dark" />
                                        </div>
                                    </div>
                                    <span className="hidden sm:block text-sm font-medium text-text max-w-[100px] truncate">
                                        {user.name || 'User'}
                                    </span>
                                    <FiChevronDown
                                        size={14}
                                        className={`hidden sm:block text-text-muted transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`}
                                    />
                                </button>

                                {isDropdownOpen && (
                                    <div className="absolute right-0 top-full mt-3 w-64 bg-surface rounded-2xl border border-border-light shadow-xl overflow-hidden">
                                        <div className="px-4 py-4 grad-dropdown-head">
                                            <p className="text-sm font-semibold text-primary-dark truncate">{user.name || 'User'}</p>
                                            <p className="text-xs text-text-muted truncate mt-0.5">{user.email || 'user@email.com'}</p>
                                        </div>
                                        <div className="p-2">
                                            <Link
                                                href="/profile"
                                                onClick={() => setIsDropdownOpen(false)}
                                                className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-primary-subtle text-text transition-colors duration-150"
                                            >
                                                <FiSettings size={16} className="text-text-muted" />
                                                <span className="text-sm font-medium">Profile Settings</span>
                                            </Link>
                                            <Link
                                                href="/properties/new"
                                                onClick={() => setIsDropdownOpen(false)}
                                                className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-primary-subtle text-text transition-colors duration-150 md:hidden"
                                            >
                                                <FiPlus size={16} className="text-text-muted" />
                                                <span className="text-sm font-medium">Post Property</span>
                                            </Link>
                                            <button
                                                onClick={handleLogout}
                                                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-red-50 text-text hover:text-red-600 transition-colors duration-150"
                                            >
                                                <FiLogOut size={16} />
                                                <span className="text-sm font-medium">Logout</span>
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </header>
        </>
    )
}

export default Header