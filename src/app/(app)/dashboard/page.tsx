// @ts-nocheck
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Image from 'next/image'
import {
    Heart,
    Search,
    Star,
    TrendingUp,
    Users,
    MessageCircle,
    ArrowRight,
    Flame,
    Crown,
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Card, CardContent } from '@/components/ui/Card'
import { Avatar } from '@/components/ui/Avatar'
import { Badge } from '@/components/ui/Badge'
import { getAvatarFallbackUrl } from '@/lib/utils'
import type { Database } from '@/types/database.types'
import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Tableau de bord',
}

type Profile = Database['public']['Tables']['profiles']['Row']

export default async function DashboardPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) redirect('/auth/login')

    // Fetch current user profile
    const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user!.id)
        .single()

    if (!profile?.full_name) {
        redirect('/profile/setup')
    }

    const p = profile as Profile

    // Fetch stats
    const [likesRes, matchesRes, messagesRes] = await Promise.all([
        supabase.from('likes').select('id', { count: 'exact', head: true }).eq('sender_id', p.id),
        supabase.from('matches').select('id', { count: 'exact', head: true })
            .or(`user1_id.eq.${p.id},user2_id.eq.${p.id}`),
        supabase.from('messages').select('id', { count: 'exact', head: true })
            .neq('sender_id', user!.id).is('read_at', null),
    ])

    // 1. Fetch liked profiles to exclude them from suggestions
    const { data: likesData } = await supabase
        .from('likes')
        .select('receiver_id')
        .eq('sender_id', p.id)

    const likedIds = likesData?.map(l => l.receiver_id) || []

    // 2. Base query for suggestions (same city)
    let suggestionsQuery = supabase
        .from('profiles')
        .select('*')
        .neq('user_id', user!.id)
        .eq('is_active', true)
        .eq('city', p.city ?? '')
        .neq('visibility', 'private')

    if (likedIds.length > 0) {
        suggestionsQuery = suggestionsQuery.not('id', 'in', `(${likedIds.join(',')})`)
    }

    const { data: suggestionsRaw } = await suggestionsQuery.limit(6)

    let discoveryProfiles = (suggestionsRaw ?? []) as Profile[]

    // 3. If not enough from same city, fetch recent profiles
    if (discoveryProfiles.length < 4) {
        let recentQuery = supabase
            .from('profiles')
            .select('*')
            .neq('user_id', user!.id)
            .eq('is_active', true)
            .neq('visibility', 'private')
            .order('created_at', { ascending: false })

        if (likedIds.length > 0) {
            recentQuery = recentQuery.not('id', 'in', `(${likedIds.join(',')})`)
        }

        const { data: recent } = await recentQuery.limit(6)
        discoveryProfiles = (recent ?? []) as Profile[]
    }

    const stats = [
        { label: "J'aime envoyés", value: likesRes.count ?? 0, icon: Heart, color: 'text-rose-500' },
        { label: 'Matchs', value: matchesRes.count ?? 0, icon: Star, color: 'text-amber-500' },
        { label: 'Messages non lus', value: messagesRes.count ?? 0, icon: MessageCircle, color: 'text-blue-500' },
    ]

    return (
        <div className="max-w-6xl mx-auto px-4 py-8">
            {/* Welcome banner */}
            <div className="relative overflow-hidden rounded-2xl gradient-welcome border p-6 mb-8 shadow-sm">
                <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center gap-4">
                    <Avatar
                        src={p.avatar_url}
                        name={p.full_name}
                        size="xl"
                        premium={p.is_premium}
                    />
                    <div className="flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                            <h1 className="text-2xl font-bold text-slate-900">
                                Bonjour, {p.full_name?.split(' ')[0]} ! 👋
                            </h1>
                            {p.is_premium && <Badge variant="premium">👑 Premium</Badge>}
                        </div>
                        <p className="text-slate-500 mt-1">
                            {p.city ? `📍 ${p.city}` : 'Complétez votre profil pour de meilleures suggestions'}
                        </p>
                    </div>
                    <div className="flex gap-3 flex-wrap">
                        <Button variant="primary" size="sm" asChild>
                            <a href="/search" className="gap-2 bg-rose-500 text-white px-4 py-2 rounded-lg flex items-center hover:bg-rose-600 transition-colors">
                                <Search className="h-4 w-4" />
                                Découvrir
                            </a>
                        </Button>
                        {!p.is_premium && (
                            <Button variant="outline" size="sm" asChild>
                                <a href="/premium" className="gap-2 border border-slate-200 px-4 py-2 rounded-lg flex items-center hover:bg-slate-50 transition-colors">
                                    <Crown className="h-4 w-4" />
                                    Premium
                                </a>
                            </Button>
                        )}
                    </div>
                </div>
                {/* Decorative circles - Hide or change in dark mode */}
                <div className="absolute -top-20 -right-20 h-48 w-48 rounded-full bg-rose-500/10 blur-3xl dark:bg-blue-500/5" />
                <div className="absolute -bottom-10 right-20 h-32 w-32 rounded-full bg-pink-500/10 blur-2xl dark:bg-indigo-500/5" />
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 mb-8">
                {stats.map(({ label, value, icon: Icon, color }) => (
                    <Card key={label} glass className="p-4">
                        <CardContent className="p-0 flex flex-col items-center text-center gap-2">
                            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 stats-icon-bg">
                                <Icon className={`h-5 w-5 ${color}`} />
                            </div>
                            <span className="text-2xl font-bold text-slate-900">{value}</span>
                            <span className="text-xs text-slate-500 font-medium">{label}</span>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Profile completion banner */}
            {(!p.bio || !p.avatar_url || !p.age) && (
                <div className="rounded-2xl bg-amber-500/10 border border-amber-500/30 dark:bg-blue-500/10 dark:border-blue-500/30 p-4 mb-8 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-xl bg-amber-500/20 dark:bg-blue-500/20 flex items-center justify-center">
                            <TrendingUp className="h-5 w-5 text-amber-400 dark:text-blue-400" />
                        </div>
                        <div>
                            <p className="font-semibold text-slate-900 text-sm">Complétez votre profil</p>
                            <p className="text-xs text-slate-500">Un profil complet reçoit 5x plus de visites</p>
                        </div>
                    </div>
                    <Button variant="outline" size="sm" asChild>
                        <a href="/profile/edit">Compléter</a>
                    </Button>
                </div>
            )}

            {/* Suggestions */}
            <section>
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                        <Flame className="h-5 w-5 text-rose-500" />
                        Profils suggérés
                    </h2>
                    <a
                        href="/search"
                        className="flex items-center gap-1 text-sm text-rose-500 hover:text-rose-600 font-medium transition-colors"
                    >
                        Voir tout <ArrowRight className="h-4 w-4" />
                    </a>
                </div>

                {discoveryProfiles.length === 0 ? (
                    <Card className="p-12 text-center">
                        <CardContent className="p-0">
                            <div className="text-5xl mb-4">🌍</div>
                            <p className="text-slate-900 font-semibold">Pas encore de suggestions</p>
                            <p className="text-slate-500 text-sm mt-2">Complétez votre profil pour voir des suggestions</p>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        {discoveryProfiles.map((dp) => (
                            <a
                                key={dp.id}
                                href={`/profile/${dp.id}`}
                                className="group rounded-2xl border border-slate-100 bg-white overflow-hidden hover:border-rose-500/40 hover:shadow-lg hover:shadow-rose-500/5 transition-all duration-300 shadow-sm"
                            >
                                <div className="relative aspect-square bg-slate-50">
                                    <Image
                                        src={dp.avatar_url || getAvatarFallbackUrl(dp.full_name)}
                                        alt={dp.full_name || 'Profil'}
                                        fill
                                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                                        unoptimized
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-white/90 dark:from-transparent via-transparent to-transparent suggestion-overlay" />
                                    {dp.is_premium && (
                                        <div className="absolute top-2 left-2">
                                            <Badge variant="premium" size="sm">👑</Badge>
                                        </div>
                                    )}
                                    <div className="absolute bottom-0 left-0 right-0 p-3">
                                        <p className="font-bold text-slate-900 text-sm truncate">
                                            {dp.full_name?.split(' ')[0]}, {dp.age}
                                        </p>
                                        <p className="text-xs text-slate-600 truncate">📍 {dp.city}</p>
                                    </div>
                                </div>
                            </a>
                        ))}
                    </div>
                )}
            </section>

            {/* Quick access */}
            <section className="mt-8">
                <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                    <Users className="h-5 w-5 text-rose-500" />
                    Accès rapide
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {[
                        { href: '/matches', label: 'Mes matchs', icon: Heart, gradient: 'gradient-rose' },
                        { href: '/messages', label: 'Messages', icon: MessageCircle, gradient: 'gradient-blue' },
                        { href: '/search', label: 'Recherche', icon: Search, gradient: 'gradient-violet' },
                        { href: '/profile/edit', label: 'Mon profil', icon: Star, gradient: 'gradient-amber' },
                    ].map(({ href, label, icon: Icon, gradient }) => (
                        <a
                            key={href}
                            href={href}
                            className={`flex flex-col items-center gap-3 p-4 rounded-2xl bg-gradient-to-br ${gradient} gradient-quick-access border hover:scale-105 shadow-sm transition-all duration-200`}
                        >
                            <Icon className="h-8 w-8" />
                            <span className="text-sm font-semibold">{label}</span>
                        </a>
                    ))}
                </div>
            </section>
        </div>
    )
}
