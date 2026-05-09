'use client'

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
import { ThemeToggle } from '@/components/ui/ThemeToggle'

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
            window.location.href = '/'
        }
    }

    return (
        <>
            {/* Desktop Sidebar */}
            <aside className="hidden lg:flex flex-col fixed left-0 top-0 h-full w-64 bg-white border-r border-slate-100 shadow-sm z-40 p-4">
                <a href="/" className="flex items-center gap-3 px-2 mb-8 group">
                    <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-rose-500 to-pink-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                        <Heart className="h-6 w-6 text-white fill-white" />
                    </div>
                    <span className="text-xl font-bold text-[#020617] dark:text-white">Amour<span className="text-rose-500">Connect</span></span>
                </a>

                <div className="flex items-center justify-between mb-6 px-2 lg:hidden">
                    <span className="text-lg font-bold text-slate-900">Menu</span>
                    <ThemeToggle />
                </div>

                <div className="hidden lg:flex items-center justify-between mb-6 px-2">
                    <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Navigation</span>
                    <ThemeToggle />
                </div>

                {/* Nav links */}
                <nav className="flex-1 space-y-1">
                    {navLinks.map(({ href, label, icon: Icon }) => {
                        const isActive = pathname === href || pathname.startsWith(href + '/')
                        return (
                            <a
                                key={href}
                                href={href}
                                className={cn(
                                    'flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group',
                                    isActive
                                        ? 'bg-rose-50 text-rose-600 font-semibold'
                                        : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
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
                            </a>
                        )
                    })}
                </nav>

                {/* Profile section */}
                <div className="border-t border-slate-100 pt-4 mt-4 space-y-1">
                    {profile?.is_premium ? (
                        <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-amber-50 border border-amber-200">
                            <Crown className="h-4 w-4 text-amber-600" />
                            <span className="text-amber-700 text-sm font-medium">Premium</span>
                        </div>
                    ) : (
                        <a
                            href="/premium"
                            className="flex items-center gap-2 px-3 py-2 rounded-xl bg-amber-50 border border-amber-200 hover:bg-amber-100 transition-all"
                        >
                            <Crown className="h-4 w-4 text-amber-600" />
                            <span className="text-amber-700 text-sm font-medium">Passer Premium</span>
                        </a>
                    )}

                    <a
                        href="/settings"
                        className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-500 hover:bg-slate-50 hover:text-slate-900 transition-all"
                    >
                        <Settings className="h-5 w-5" />
                        <span className="font-medium">Paramètres</span>
                    </a>

                    <button
                        onClick={handleSignOut}
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-500 hover:bg-rose-50 hover:text-rose-600 transition-all"
                    >
                        <LogOut className="h-5 w-5" />
                        <span className="font-medium">Déconnexion</span>
                    </button>

                    {/* User profile */}
                    <div className="flex items-center gap-3 px-3 py-3 mt-2">
                        <Avatar src={profile?.avatar_url} name={profile?.full_name} size="sm" premium={profile?.is_premium} />
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-slate-900 truncate">{profile?.full_name || 'Mon profil'}</p>
                            <p className="text-xs text-slate-500 truncate">{profile?.city || ''}</p>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Mobile Bottom Navigation */}
            <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-100 flex items-center justify-between px-4">
                <div className="flex items-center justify-around flex-1 py-2">
                    {navLinks.map(({ href, label, icon: Icon }) => {
                        const isActive = pathname === href || pathname.startsWith(href + '/')
                        return (
                            <a
                                key={href}
                                href={href}
                                className={cn(
                                    'flex flex-col items-center gap-1 px-3 py-2 rounded-xl transition-all',
                                    isActive ? 'text-rose-600' : 'text-slate-500'
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
                            </a>
                        )
                    })}
                </div>
                <div className="flex px-2 border-l border-slate-100/50">
                    <ThemeToggle />
                </div>
            </nav>
        </>
    )
}
