'use client'

import { useState } from 'react'
import { Heart, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { sendLike } from '@/services/likes'
import { useToast } from '@/components/ui/Toast'
import { useRouter } from 'next/navigation'

export function ProfileActions({
    currentUserId,
    targetProfileId,
    targetName
}: {
    currentUserId: string
    targetProfileId: string
    targetName: string
}) {
    const [isLoading, setIsLoading] = useState(false)
    const [hasLiked, setHasLiked] = useState(false)
    const { success, error } = useToast()
    const router = useRouter()

    const handleLike = async () => {
        setIsLoading(true)
        const { matched, error: err } = await sendLike(currentUserId, targetProfileId)
        setIsLoading(false)

        if (err) {
            if (err.includes('déjà')) {
                setHasLiked(true)
                success('Déjà liké', `Vous avez déjà envoyé un like à ${targetName}`)
            } else {
                error('Erreur', err)
            }
            return
        }

        setHasLiked(true)

        if (matched) {
            success('C\'est un Match ! 🎉', `Vous pouvez maintenant discuter avec ${targetName}`)
            router.refresh() // Refresh the page to show the "Envoyer un message" button
        } else {
            success('Like envoyé !', `${targetName} a été notifié(e) de votre like.`)
        }
    }

    return (
        <Button
            className="w-full gap-2"
            size="lg"
            onClick={handleLike}
            disabled={isLoading || hasLiked}
        >
            {isLoading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
                <Heart className={`h-5 w-5 ${hasLiked ? 'fill-rose-500 text-rose-500' : 'fill-current'}`} />
            )}
            {hasLiked ? 'Like Envoyé' : 'Envoyer un Like'}
        </Button>
    )
}
