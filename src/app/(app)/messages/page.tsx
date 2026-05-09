import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { MessageCircle, Heart, Search } from 'lucide-react'
import { Avatar } from '@/components/ui/Avatar'
import { Card, CardContent } from '@/components/ui/Card'
import { formatDistanceToNow } from 'date-fns'
import { fr } from 'date-fns/locale'

interface MatchRecord {
    id: string
    user1_id: string
    user2_id: string
    created_at: string
}

interface ProfileRecord {
    id: string
    full_name: string | null
    avatar_url: string | null
    is_premium: boolean
}

interface MessageRecord {
    content: string
    created_at: string
    sender_id: string
}

export default async function MessagesPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) redirect('/auth/login')

    const { data: profile } = await supabase
        .from('profiles')
        .select('id')
        .eq('user_id', user.id)
        .single()

    if (!profile) redirect('/profile/setup')

    const myProfileId = (profile as { id: string }).id

    // Fetch matches with other profile info and last message
    // Note: This is an async component, we fetch server-side
    const { data: rawMatches } = await supabase
        .from('matches')
        .select('id, user1_id, user2_id, created_at')
        .or(`user1_id.eq.${myProfileId},user2_id.eq.${myProfileId}`)
        .order('created_at', { ascending: false })

    // Enrich matches
    const matches = await Promise.all(
        ((rawMatches as MatchRecord[]) ?? []).map(async (m) => {
            const otherId = m.user1_id === myProfileId ? m.user2_id : m.user1_id

            const [otherRes, msgRes] = await Promise.all([
                supabase.from('profiles')
                    .select('id, full_name, avatar_url, is_premium')
                    .eq('id', otherId)
                    .single(),
                supabase.from('messages')
                    .select('content, created_at, sender_id')
                    .eq('match_id', m.id)
                    .order('created_at', { ascending: false })
                    .limit(1)
                    .maybeSingle()
            ])

            return {
                matchId: m.id,
                profile: otherRes.data as ProfileRecord | null,
                lastMessage: msgRes.data as MessageRecord | null
            }
        })
    )

    // Filter out matches where profile doesn't exist (safety)
    const validMatches = matches.filter(m => m.profile)

    return (
        <main className="max-w-3xl mx-auto px-4 py-8 space-y-8 animate-in fade-in duration-500">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                        <MessageCircle className="h-6 w-6 text-rose-500" />
                        Messages
                    </h1>
                    <p className="text-slate-500 text-sm mt-0.5">
                        Vos conversations avec vos matchs
                    </p>
                </div>
            </div>

            <div className="space-y-3">
                {validMatches.length === 0 ? (
                    <Card className="p-12 text-center bg-white border-slate-100 shadow-sm">
                        <CardContent className="p-0 flex flex-col items-center gap-4">
                            <div className="h-20 w-20 rounded-3xl bg-slate-50 border border-slate-100 flex items-center justify-center">
                                <Heart className="h-10 w-10 text-slate-300" />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-slate-900">Pas encore de messages</h3>
                                <p className="text-slate-500 mt-1 max-w-sm">
                                    Commencez à liker des profils ! Dès que vous matchez, vous pourrez discuter ici.
                                </p>
                            </div>
                            <a href="/search" className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-rose-500 to-pink-600 text-white font-semibold hover:shadow-lg hover:shadow-rose-500/20 active:scale-95 transition-all flex items-center gap-2">
                                <Search className="h-4 w-4" />
                                Découvrir des profils
                            </a>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="grid grid-cols-1 gap-3">
                        {validMatches.map((m) => (
                            <a key={m.matchId} href={`/messages/${m.matchId}`}>
                                <Card className="hover:bg-slate-50 hover:border-rose-100 transition-all cursor-pointer border-slate-100 bg-white shadow-sm overflow-hidden group">
                                    <CardContent className="p-4 flex items-center gap-4">
                                        <Avatar
                                            src={m.profile?.avatar_url}
                                            name={m.profile?.full_name ?? 'Utilisateur'}
                                            premium={m.profile?.is_premium}
                                        />
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center justify-between mb-0.5">
                                                <h3 className="font-bold text-slate-900 truncate group-hover:text-rose-600 transition-colors">
                                                    {m.profile?.full_name ?? 'Utilisateur'}
                                                </h3>
                                                {m.lastMessage && (
                                                    <span className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">
                                                        {formatDistanceToNow(new Date(m.lastMessage.created_at), { addSuffix: true, locale: fr })}
                                                    </span>
                                                )}
                                            </div>
                                            <p className="text-sm text-slate-500 truncate">
                                                {m.lastMessage
                                                    ? (m.lastMessage.sender_id === myProfileId ? 'Vous: ' : '') + m.lastMessage.content
                                                    : 'Dites bonjour ! 👋'}
                                            </p>
                                        </div>
                                    </CardContent>
                                </Card>
                            </a>
                        ))}
                    </div>
                )}
            </div>
        </main>
    )
}
