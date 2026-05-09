'use client'

import { useState } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { User, MapPin, Camera, Loader2 } from 'lucide-react'
import { uploadAvatar, updateProfile } from '@/services/profiles'
import { useToast } from '@/components/ui/Toast'
import { useAuthStore } from '@/store'

interface EditableCoverProps {
    profile: {
        id: string
        full_name: string
        avatar_url: string | null
        age: number | null
        city: string | null
        is_premium: boolean
    }
    currentUserId: string | undefined
    authUserId?: string
}

export function EditableCover({ profile, currentUserId, authUserId }: EditableCoverProps) {
    const isCurrentUser = profile.id === currentUserId
    const { success, error } = useToast()
    const router = useRouter()
    const { profile: authProfile, setProfile: setAuthProfile } = useAuthStore()

    const [isUploading, setIsUploading] = useState(false)
    const [previewUrl, setPreviewUrl] = useState<string | null>(profile.avatar_url)

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file || !isCurrentUser || !authUserId) return

        setIsUploading(true)

        // Optimistic preview
        const objectUrl = URL.createObjectURL(file)
        setPreviewUrl(objectUrl)

        try {
            // Upload to Supabase Storage using Auth User ID
            const { url, error: uploadErr } = await uploadAvatar(authUserId, file)

            if (uploadErr || !url) {
                throw new Error(uploadErr || "Erreur de téléchargement")
            }

            // Update Profile Record
            const { error: updateErr } = await updateProfile(profile.id, {
                avatar_url: url
            })

            if (updateErr) {
                throw new Error(updateErr)
            }

            // Sync with global store if needed
            if (authProfile) {
                setAuthProfile({ ...authProfile, avatar_url: url })
            }

            success('Photo mise à jour', 'Votre profil a été actualisé')
            router.refresh()

        } catch (err: any) {
            error('Erreur', err.message || 'Impossible de mettre à jour la photo')
            setPreviewUrl(profile.avatar_url) // Revert preview
        } finally {
            setIsUploading(false)
        }
    }

    return (
        <div className="relative h-64 sm:h-80 rounded-3xl overflow-hidden bg-slate-100 border border-slate-100 group shadow-sm">
            {/* Background Image */}
            {previewUrl ? (
                <Image
                    src={previewUrl}
                    alt={profile.full_name || 'Profil'}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    unoptimized={previewUrl.startsWith('blob:')}
                />
            ) : (
                <div className="absolute inset-0 bg-gradient-to-br from-rose-500 to-pink-600 flex items-center justify-center">
                    <User className="h-32 w-32 text-white/20" />
                </div>
            )}

            {/* Removed gradient overlay as per user request */}

            {/* Editable overlay when hovering on own profile */}
            {isCurrentUser && (
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center pointer-events-none">
                    <div className="bg-slate-900/80 backdrop-blur-sm px-6 py-3 rounded-2xl flex flex-col items-center gap-2 pointer-events-auto cursor-pointer shadow-xl border border-white/10 hover:bg-slate-800/80 transition-colors">
                        {isUploading ? (
                            <Loader2 className="h-6 w-6 text-rose-500 animate-spin" />
                        ) : (
                            <Camera className="h-6 w-6 text-white" />
                        )}
                        <span className="text-white font-medium text-sm">
                            {isUploading ? 'Téléchargement...' : 'Modifier la photo'}
                        </span>

                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                            disabled={isUploading}
                            className="absolute inset-0 opacity-0 cursor-pointer"
                        />
                    </div>
                </div>
            )}

            {/* Footer informations */}
            <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between pointer-events-none">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                        {profile.full_name}
                        {profile.is_premium && (
                            <span className="bg-amber-500/20 text-amber-400 text-xs px-2.5 py-1 rounded-full border border-amber-500/20 font-medium">
                                Premium
                            </span>
                        )}
                    </h1>
                    <div className="flex flex-wrap items-center gap-4 text-sm text-white/90">
                        {profile.age && (
                            <span className="flex items-center gap-1.5">
                                <User className="h-4 w-4" />
                                {profile.age} ans
                            </span>
                        )}
                        {profile.city && (
                            <span className="flex items-center gap-1.5">
                                <MapPin className="h-4 w-4" />
                                {profile.city}
                            </span>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
