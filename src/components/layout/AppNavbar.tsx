'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
    Heart,
    Search,
    MessageCircle,
    User,
    Home,
    Settings,
    LogOut,
    Crown,
    Bell,
    Menu,
    X,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Avatar } from '@/components/ui/Avatar'
import { CountBadge } from '@/components/ui/Badge'
import { useAuthStore, useNotificationStore } from '@/store'
import { createClient } from '@/lib/supabase/client'
import { useState } from 'react'
import { useToast } from '@/components/ui/Toast'
import { useRouter } from 'next/navigation'

const navLinks = [
    { href: '/dashboard', label: 'Accueil', icon: Home },
    { href: '/search', label: 'Découvrir', icon: Search },
    { href: '/matches', label: 'Matchs', icon: Heart },
    { href: '/messages', label: 'Messages', icon: MessageCircle },
    { href: '/profile', label: 'Profil', icon: User },
]

export function AppNavbar() {
    const pathname = usePathname()
    const { profile } = useAuthStore()
    const unreadMessages = useNotificationStore((s) => s.totalUnread())
    const { success, error } = useToast()
    const router = useRouter()
    const [mobileOpen, setMobileOpen] = useState(false)

    const handleSignOut = async () => {
        const supabase = createClient()
        const { error: err } = await supabase.auth.signOut()
        if (err) {
            error('Erreur', 'Impossible de se déconnecter')
        } else {
            success('À bientôt !', 'Vous avez été déconnecté')
            router.push('/')
            router.refresh()
        }
    }

    return (
        <>
            {/* Desktop Sidebar */}
            <aside className="hidden lg:flex flex-col fixed left-0 top-0 h-full w-64 bg-slate-900 border-r border-slate-800 z-40 p-4">
                {/* Logo */}
                <Link href="/dashboard" className="flex items-center gap-3 px-3 py-4 mb-6">
                    <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-rose-500 to-pink-600 flex items-center justify-center shadow-lg shadow-rose-500/30">
                        <Heart className="h-5 w-5 text-white fill-white" />
                    </div>
                    <span className="text-xl font-bold text-white">Amour<span className="text-rose-500">Connect</span></span>
                </Link>

                {/* Nav links */}
                <nav className="flex-1 space-y-1">
                    {navLinks.map(({ href, label, icon: Icon }) => {
                        const isActive = pathname === href || pathname.startsWith(href + '/')
                        return (
                            <Link
                                key={href}
                                href={href}
                                className={cn(
                                    'flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group',
                                    isActive
                                        ? 'bg-gradient-to-r from-rose-500/20 to-pink-600/20 text-rose-400 border border-rose-500/30'
                                        : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                                )}
                            >
                                <div className="relative">
                                    <Icon className={cn('h-5 w-5', isActive && 'text-rose-400')} />
                                    {href === '/messages' && unreadMessages > 0 && (
                                        <CountBadge
                                            count={unreadMessages}
                                            className="absolute -top-2 -right-2 scale-75"
                                        />
                                    )}
                                </div>
                                <span className="font-medium">{label}</span>
                                {isActive && (
                                    <div className="ml-auto w-1.5 h-1.5 rounded-full bg-rose-500" />
                                )}
                            </Link>
                        )
                    })}
                </nav>

                {/* Profile section */}
                <div className="border-t border-slate-800 pt-4 mt-4 space-y-1">
                    {profile?.is_premium ? (
                        <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-amber-500/10 border border-amber-500/20">
                            <Crown className="h-4 w-4 text-amber-400" />
                            <span className="text-amber-400 text-sm font-medium">Premium</span>
                        </div>
                    ) : (
                        <Link
                            href="/premium"
                            className="flex items-center gap-2 px-3 py-2 rounded-xl bg-gradient-to-r from-amber-500/10 to-yellow-500/10 border border-amber-500/20 hover:border-amber-500/50 transition-all"
                        >
                            <Crown className="h-4 w-4 text-amber-400" />
                            <span className="text-amber-400 text-sm font-medium">Passer Premium</span>
                        </Link>
                    )}

                    <Link
                        href="/settings"
                        className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-400 hover:bg-slate-800 hover:text-white transition-all"
                    >
                        <Settings className="h-5 w-5" />
                        <span className="font-medium">Paramètres</span>
                    </Link>

                    <button
                        onClick={handleSignOut}
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-400 hover:bg-red-500/10 hover:text-red-400 transition-all"
                    >
                        <LogOut className="h-5 w-5" />
                        <span className="font-medium">Déconnexion</span>
                    </button>

                    {/* User profile */}
                    <div className="flex items-center gap-3 px-3 py-3 mt-2">
                        <Avatar src={profile?.avatar_url} name={profile?.full_name} size="sm" premium={profile?.is_premium} />
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-white truncate">{profile?.full_name || 'Mon profil'}</p>
                            <p className="text-xs text-slate-400 truncate">{profile?.city || ''}</p>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Mobile Bottom Navigation */}
            <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-slate-900/95 backdrop-blur-md border-t border-slate-800">
                <div className="flex items-center justify-around px-2 py-2">
                    {navLinks.map(({ href, label, icon: Icon }) => {
                        const isActive = pathname === href || pathname.startsWith(href + '/')
                        return (
                            <Link
                                key={href}
                                href={href}
                                className={cn(
                                    'flex flex-col items-center gap-1 px-3 py-2 rounded-xl transition-all',
                                    isActive ? 'text-rose-400' : 'text-slate-400'
                                )}
                            >
                                <div className="relative">
                                    <Icon className="h-5 w-5" />
                                    {href === '/messages' && unreadMessages > 0 && (
                                        <CountBadge
                                            count={unreadMessages}
                                            className="absolute -top-2 -right-2 scale-75"
                                        />
                                    )}
                                </div>
                                <span className="text-xs font-medium">{label}</span>
                            </Link>
                        )
                    })}
                </div>
            </nav>
        </>
    )
}
