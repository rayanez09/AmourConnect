// @ts-nocheck
'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { Heart, MessageCircle, Star, Clock } from 'lucide-react'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { EmptyState } from '@/components/ui/Skeleton'
import { createClient } from '@/lib/supabase/client'
import { useAuthStore, useNotificationStore } from '@/store'
import { getAvatarFallbackUrl, formatDate } from '@/lib/utils'

interface EnrichedMatch {
    id: string
    otherProfile: {
        id: string
        full_name: string | null
        avatar_url: string | null
        city: string | null
        is_premium: boolean
        age: number | null
    } | null
    lastMsg: { content: string; created_at: string } | null
}

interface LikerProfile {
    id: string
    full_name: string | null
    avatar_url: string | null
    is_premium: boolean
    age: number | null
    city: string | null
}

export default function MatchesPage() {
    const { profile } = useAuthStore()
    const unreadPerMatch = useNotificationStore((s) => s.unreadPerMatch)
    const router = useRouter()

    const [matches, setMatches] = useState<EnrichedMatch[]>([])
    const [likerProfiles, setLikerProfiles] = useState<LikerProfile[]>([])
    const [isPremium, setIsPremium] = useState(false)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        if (!profile) return

        async function load() {
            setIsLoading(true)
            const supabase = createClient()

            // Confirm premium status
            const { data: me } = await supabase
                .from('profiles')
                .select('id, is_premium')
                .eq('user_id', profile.user_id)
                .single()

            if (!me) { router.push('/profile/setup'); return }
            setIsPremium(me.is_premium)

            // Fetch matches
            const { data: rawMatches } = await supabase
                .from('matches')
                .select('*')
                .or(`user1_id.eq.${me.id},user2_id.eq.${me.id}`)
                .order('created_at', { ascending: false })

            // Enrich each match (other profile + last message)
            const enriched: EnrichedMatch[] = await Promise.all(
                (rawMatches ?? []).map(async (match) => {
                    const otherId = match.user1_id === me.id ? match.user2_id : match.user1_id

                    const { data: otherProfile } = await supabase
                        .from('profiles')
                        .select('id, full_name, avatar_url, city, is_premium, age')
                        .eq('id', otherId)
                        .single()

                    const { data: lastMsg } = await supabase
                        .from('messages')
                        .select('content, created_at')
                        .eq('match_id', match.id)
                        .order('created_at', { ascending: false })
                        .limit(1)
                        .single()

                    return { id: match.id, otherProfile, lastMsg: lastMsg ?? null }
                })
            )
            setMatches(enriched)

            // Who liked me (premium)
            const { data: whoLikedMe } = await supabase
                .from('likes')
                .select('sender_id, created_at')
                .eq('receiver_id', me.id)
                .order('created_at', { ascending: false })
                .limit(6)

            const likers: LikerProfile[] = await Promise.all(
                (whoLikedMe ?? []).map(async (like) => {
                    const { data: liker } = await supabase
                        .from('profiles')
                        .select('id, full_name, avatar_url, age, city, is_premium')
                        .eq('id', like.sender_id)
                        .single()
                    return liker
                })
            )
            setLikerProfiles(likers.filter(Boolean))
            setIsLoading(false)
        }

        load()
    }, [profile, router])

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="h-10 w-10 rounded-full border-2 border-slate-700 border-t-rose-500 animate-spin" />
            </div>
        )
    }

    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                    <Heart className="h-6 w-6 text-rose-500 fill-rose-500" />
                    Mes Matchs
                </h1>
                <p className="text-slate-400 mt-1">
                    {matches.length} match{matches.length !== 1 ? 's' : ''} — Commencez à discuter !
                </p>
            </div>

            {/* Who liked me */}
            <section className="mb-8">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-bold text-white flex items-center gap-2">
                        <Star className="h-5 w-5 text-amber-400" />
                        Qui m'a liké
                    </h2>
                    {!isPremium && (
                        <Badge variant="premium">👑 Premium</Badge>
                    )}
                </div>

                {likerProfiles.length === 0 ? (
                    <div className="rounded-xl border border-dashed border-slate-700 p-6 text-center text-slate-500 text-sm">
                        Personne ne vous a encore liké. Continuez à explorer !
                    </div>
                ) : (
                    <div className="relative">
                        <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
                            {likerProfiles.map((liker, idx) => {
                                if (!liker) return null
                                const isBlurred = !isPremium && idx >= 1
                                return (
                                    <div key={liker.id} className="relative">
                                        <div className={`aspect-square rounded-2xl overflow-hidden border border-slate-800 ${isBlurred ? 'cursor-not-allowed' : ''}`}>
                                            <div className={isBlurred ? 'filter blur-sm scale-110' : ''}>
                                                <Image
                                                    src={liker.avatar_url || getAvatarFallbackUrl(liker.full_name)}
                                                    alt="Liké"
                                                    width={120}
                                                    height={120}
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                            {isBlurred && (
                                                <div className="absolute inset-0 flex items-center justify-center bg-slate-900/60">
                                                    <span className="text-2xl">👑</span>
                                                </div>
                                            )}
                                        </div>
                                        {!isBlurred && (
                                            <p className="text-xs text-center text-slate-400 mt-1 truncate">
                                                {liker.full_name?.split(' ')[0]}
                                            </p>
                                        )}
                                    </div>
                                )
                            })}
                        </div>
                        {!isPremium && likerProfiles.length > 1 && (
                            <div className="mt-4 flex justify-center">
                                <Button variant="outline" size="sm" asChild>
                                    <Link href="/premium" className="gap-2">
                                        <Star className="h-4 w-4" />
                                        Voir qui vous a liké avec Premium
                                    </Link>
                                </Button>
                            </div>
                        )}
                    </div>
                )}
            </section>

            {/* Conversations */}
            <section>
                <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                    <MessageCircle className="h-5 w-5 text-rose-400" />
                    Conversations
                    <span className="ml-1 flex items-center gap-1 text-xs text-slate-500 font-normal">
                        <Clock className="h-3 w-3" />
                        messages supprimés après 24h
                    </span>
                </h2>

                {matches.length === 0 ? (
                    <EmptyState
                        emoji="💕"
                        title="Pas encore de match"
                        description="Explorez des profils et likez ceux qui vous plaisent. Quand c'est mutuel, c'est un match !"
                        action={
                            <Button variant="primary" asChild>
                                <Link href="/search">Découvrir des profils</Link>
                            </Button>
                        }
                    />
                ) : (
                    <div className="space-y-3">
                        {matches.map(({ id, otherProfile, lastMsg }) => {
                            if (!otherProfile) return null
                            const unread = unreadPerMatch[id] ?? 0
                            return (
                                <Link
                                    key={id}
                                    href={`/messages/${id}`}
                                    className="flex items-center gap-4 p-4 rounded-2xl border border-slate-800 bg-slate-900 hover:border-rose-500/40 hover:bg-slate-800/50 transition-all duration-200 group"
                                >
                                    {/* Avatar + unread badge */}
                                    <div className="relative flex-shrink-0">
                                        <div className="h-14 w-14 rounded-full overflow-hidden ring-2 ring-slate-700 group-hover:ring-rose-500/50 transition-all">
                                            <Image
                                                src={otherProfile.avatar_url || getAvatarFallbackUrl(otherProfile.full_name)}
                                                alt={otherProfile.full_name || ''}
                                                width={56}
                                                height={56}
                                                className="object-cover w-full h-full"
                                            />
                                        </div>
                                        {unread > 0 && (
                                            <span className="absolute -top-1 -right-1 min-w-[20px] h-5 px-1 rounded-full bg-rose-500 text-white text-xs font-bold flex items-center justify-center animate-pulse ring-2 ring-slate-900">
                                                {unread > 9 ? '9+' : unread}
                                            </span>
                                        )}
                                    </div>

                                    {/* Info */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between">
                                            <p className={`font-semibold truncate ${unread > 0 ? 'text-white' : 'text-slate-200'}`}>
                                                {otherProfile.full_name}
                                            </p>
                                            <p className="text-xs text-slate-500 flex-shrink-0 ml-2">
                                                {lastMsg ? formatDate(lastMsg.created_at) : ''}
                                            </p>
                                        </div>
                                        <p className={`text-sm truncate mt-0.5 ${unread > 0 ? 'text-white font-medium' : 'text-slate-400'}`}>
                                            {lastMsg?.content || `💕 Match avec ${otherProfile.full_name?.split(' ')[0]} !`}
                                        </p>
                                    </div>

                                    {/* Icon */}
                                    <MessageCircle className={`h-5 w-5 flex-shrink-0 ${unread > 0 ? 'text-rose-400' : 'text-slate-600'} group-hover:text-rose-400 transition-colors`} />
                                </Link>
                            )
                        })}
                    </div>
                )}
            </section>
        </div>
    )
}
