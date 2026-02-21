'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Heart, X, MessageCircle, MapPin, Shield } from 'lucide-react'
import { cn, getAvatarFallbackUrl, GENDER_LABELS } from '@/lib/utils'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import type { Profile } from '@/types'

interface ProfileCardProps {
    profile: Profile
    currentUserId?: string
    onLike?: (profileId: string) => Promise<void>
    onDislike?: (profileId: string) => void
    showActions?: boolean
    compact?: boolean
    isLiked?: boolean
    isMatched?: boolean
    matchId?: string
}

export function ProfileCard({
    profile,
    currentUserId,
    onLike,
    onDislike,
    showActions = true,
    compact = false,
    isLiked = false,
    isMatched = false,
    matchId,
}: ProfileCardProps) {
    const [liked, setLiked] = useState(isLiked)
    const [likeLoading, setLikeLoading] = useState(false)
    const [imgError, setImgError] = useState(false)

    const avatarSrc = imgError || !profile.avatar_url
        ? getAvatarFallbackUrl(profile.full_name)
        : profile.avatar_url

    const handleLike = async () => {
        if (!onLike || likeLoading) return
        setLikeLoading(true)
        await onLike(profile.id)
        setLiked(true)
        setLikeLoading(false)
    }

    if (compact) {
        return (
            <Link
                href={`/profile/${profile.id}`}
                className={cn(
                    'flex items-center gap-3 p-3 rounded-xl border border-slate-800 bg-slate-900',
                    'hover:border-rose-500/40 hover:bg-slate-800/50 transition-all duration-200'
                )}
            >
                <div className="relative h-12 w-12 rounded-full overflow-hidden flex-shrink-0 ring-2 ring-slate-700">
                    <Image src={avatarSrc} alt={profile.full_name || 'Profil'} fill className="object-cover" onError={() => setImgError(true)} />
                </div>
                <div className="flex-1 min-w-0">
                    <p className="font-semibold text-white truncate">{profile.full_name}</p>
                    <p className="text-sm text-slate-400 truncate">
                        {profile.age} ans · {profile.city}
                    </p>
                </div>
                {isMatched && (
                    <Badge variant="success" size="sm">Match 💕</Badge>
                )}
            </Link>
        )
    }

    return (
        <div
            className={cn(
                'group rounded-2xl border border-slate-800 bg-slate-900 overflow-hidden',
                'transition-all duration-300 hover:border-rose-500/40 hover:shadow-xl hover:shadow-rose-500/10',
                'flex flex-col'
            )}
        >
            {/* Photo */}
            <Link href={`/profile/${profile.id}`} className="relative block aspect-[3/4] overflow-hidden bg-slate-800">
                <Image
                    src={avatarSrc}
                    alt={profile.full_name || 'Profil'}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    onError={() => setImgError(true)}
                />
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-transparent to-transparent" />

                {/* Badges */}
                <div className="absolute top-3 left-3 flex gap-2">
                    {profile.is_premium && <Badge variant="premium">👑 Premium</Badge>}
                    {profile.is_verified && (
                        <span className="flex items-center gap-1 text-xs bg-blue-500/80 text-white px-2 py-1 rounded-lg backdrop-blur-sm">
                            <Shield className="h-3 w-3" /> Vérifié
                        </span>
                    )}
                </div>

                {isMatched && (
                    <div className="absolute top-3 right-3">
                        <Badge variant="success">Match 💕</Badge>
                    </div>
                )}

                {/* Name overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-4">
                    <h3 className="text-lg font-bold text-white">
                        {profile.full_name}, {profile.age}
                    </h3>
                    <div className="flex items-center gap-1 text-slate-300 text-sm mt-0.5">
                        <MapPin className="h-3 w-3 flex-shrink-0" />
                        <span className="truncate">{profile.city}</span>
                    </div>
                </div>
            </Link>

            {/* Content */}
            <div className="p-4 flex-1 flex flex-col gap-3">
                {profile.bio && (
                    <p className="text-sm text-slate-400 line-clamp-2">{profile.bio}</p>
                )}
                <div className="flex flex-wrap gap-1.5">
                    <Badge variant="default">{GENDER_LABELS[profile.gender || 'autre']}</Badge>
                    {profile.postal_code && (
                        <Badge variant="default">{profile.postal_code}</Badge>
                    )}
                </div>

                {/* Actions */}
                {showActions && currentUserId && (
                    <div className="flex gap-2 mt-auto pt-2">
                        {isMatched && matchId ? (
                            <Button
                                variant="primary"
                                size="sm"
                                className="flex-1 gap-2"
                                asChild
                            >
                                <Link href={`/messages/${matchId}`}>
                                    <MessageCircle className="h-4 w-4" />
                                    Envoyer un message
                                </Link>
                            </Button>
                        ) : liked ? (
                            <div className="flex-1 flex items-center justify-center gap-2 py-2 rounded-xl bg-rose-500/10 border border-rose-500/30">
                                <Heart className="h-4 w-4 text-rose-400 fill-rose-400" />
                                <span className="text-rose-400 text-sm font-medium">Liké !</span>
                            </div>
                        ) : (
                            <>
                                {onDislike && (
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => onDislike(profile.id)}
                                        className="border border-slate-700 hover:border-red-500/50 hover:text-red-400"
                                    >
                                        <X className="h-4 w-4" />
                                    </Button>
                                )}
                                <Button
                                    variant="primary"
                                    size="sm"
                                    className="flex-1 gap-2"
                                    onClick={handleLike}
                                    isLoading={likeLoading}
                                    disabled={liked}
                                >
                                    <Heart className="h-4 w-4" />
                                    {liked ? "Liké !" : "J'aime"}
                                </Button>
                            </>
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}
