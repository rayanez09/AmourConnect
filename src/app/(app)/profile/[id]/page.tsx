// @ts-nocheck
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Info, MessageCircle } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { ProfileActions } from '@/components/profile/ProfileActions'
import { EditableCover } from '@/components/profile/EditableCover'
import { Button } from '@/components/ui/Button'

export default async function ProfilePage({ params }: { params: Promise<{ id: string }> }) {
    const supabase = await createClient()
    const { id: profileId } = await params

    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return notFound()
    }

    const { data: currentUserProfile } = await supabase
        .from('profiles')
        .select('id, is_premium')
        .eq('user_id', user.id)
        .single()

    const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', profileId)
        .eq('is_active', true)
        .single()

    if (!profile) {
        return notFound()
    }

    // Check match status
    const { data: matchData } = await supabase
        .from('matches')
        .select('id')
        .or(`and(user1_id.eq.${currentUserProfile?.id},user2_id.eq.${profile.id}),and(user1_id.eq.${profile.id},user2_id.eq.${currentUserProfile?.id})`)
        .single()

    const isMatched = !!matchData

    return (
        <div className="max-w-3xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header / Cover */}
            <EditableCover
                profile={profile}
                currentUserId={currentUserProfile?.id}
                authUserId={user.id}
            />

            {/* Content */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2 space-y-6">
                    <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800">
                        <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                            <Info className="h-5 w-5 text-rose-500" />
                            À propos
                        </h2>
                        <p className="text-slate-300 leading-relaxed whitespace-pre-wrap">
                            {profile.bio || "Ce membre n'a pas encore rédigé de description."}
                        </p>
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 sticky top-24">
                        {isMatched ? (
                            <Link href={`/messages/${matchData.id}`}>
                                <Button className="w-full gap-2" size="lg">
                                    <MessageCircle className="h-5 w-5" />
                                    Envoyer un message
                                </Button>
                            </Link>
                        ) : currentUserProfile?.id === profile.id ? (
                            <Button variant="outline" className="w-full gap-2" size="lg" disabled>
                                C'est votre profil
                            </Button>
                        ) : (
                            <div className="space-y-4 text-center">
                                <p className="text-sm text-slate-400">
                                    Discutez avec {profile.full_name?.split(' ')[0]} pour en découvrir plus.
                                </p>
                                <ProfileActions
                                    currentUserId={currentUserProfile.id}
                                    targetProfileId={profile.id}
                                    targetName={profile.full_name?.split(' ')[0] || 'ce membre'}
                                />
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
