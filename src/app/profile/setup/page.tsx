// @ts-nocheck
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Heart, Upload, MapPin, User, FileText, Eye } from 'lucide-react'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/client'
import { profileSchema, type ProfileInput } from '@/lib/validations'
import { updateProfile, uploadAvatar } from '@/services/profiles'
import { Button } from '@/components/ui/Button'
import { Input, Textarea } from '@/components/ui/Input'
import { useToast } from '@/components/ui/Toast'
import { useAuthStore } from '@/store'
import { getAvatarFallbackUrl } from '@/lib/utils'

const STEPS = [
    { id: 1, label: 'Identité', icon: User },
    { id: 2, label: 'Localisation', icon: MapPin },
    { id: 3, label: 'Présentation', icon: FileText },
    { id: 4, label: 'Photo', icon: Upload },
]

const SELECT_CLASS = "w-full rounded-xl border border-slate-700 bg-slate-800/60 px-4 py-2.5 text-sm text-white focus:border-rose-500 focus:outline-none focus:ring-2 focus:ring-rose-500/20 transition-all"

export default function ProfileSetupPage() {
    const router = useRouter()
    const { profile, setProfile } = useAuthStore()
    const { success, error } = useToast()
    const [step, setStep] = useState(1)
    const [avatarFile, setAvatarFile] = useState<File | null>(null)
    const [avatarPreview, setAvatarPreview] = useState<string | null>(null)
    const [isSubmitting, setIsSubmitting] = useState(false)

    const {
        register,
        handleSubmit,
        getValues,
        trigger,
        formState: { errors },
    } = useForm<ProfileInput>({
        resolver: zodResolver(profileSchema),
        defaultValues: {
            full_name: profile?.full_name ?? '',
            age: profile?.age ?? undefined,
            gender: profile?.gender ?? undefined,
            looking_for: profile?.looking_for ?? undefined,
            city: profile?.city ?? '',
            postal_code: profile?.postal_code ?? '',
            bio: profile?.bio ?? '',
            visibility: profile?.visibility ?? 'public',
        },
    })

    const nextStep = async () => {
        const fieldsPerStep: Record<number, (keyof ProfileInput)[]> = {
            1: ['full_name', 'age', 'gender', 'looking_for'],
            2: ['city'],
            3: ['bio'],
        }
        if (fieldsPerStep[step]) {
            const valid = await trigger(fieldsPerStep[step])
            if (!valid) return
        }
        setStep((s) => Math.min(s + 1, 4))
    }

    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return
        setAvatarFile(file)
        setAvatarPreview(URL.createObjectURL(file))
    }

    const onSubmit = async (data: ProfileInput) => {
        setIsSubmitting(true)

        const supabase = createClient()
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
            error('Session expirée', 'Veuillez vous reconnecter')
            router.push('/auth/login')
            setIsSubmitting(false)
            return
        }

        const { data: currentProfile } = await supabase
            .from('profiles')
            .select('*')
            .eq('user_id', user.id)
            .single()

        if (!currentProfile) {
            error('Erreur', 'Profil introuvable')
            setIsSubmitting(false)
            return
        }

        let avatarUrl = currentProfile.avatar_url || ''

        if (avatarFile) {
            const { url, error: uploadErr } = await uploadAvatar(user.id, avatarFile)
            if (uploadErr) {
                error('Erreur photo', uploadErr)
                setIsSubmitting(false)
                return
            }
            if (url) avatarUrl = url
        }

        const { error: err } = await updateProfile(currentProfile.id, {
            ...data,
            avatar_url: avatarUrl,
        })

        if (err) {
            error('Erreur sauvegarde', err)
            setIsSubmitting(false)
            return
        }

        const { data: updated } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', currentProfile.id)
            .single()

        if (updated) {
            setProfile(updated)
        }

        success('Profil mis à jour !', 'Bienvenue sur AmourConnect 🎉')
        router.push('/dashboard')
    }

    return (
        <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
            <div className="w-full max-w-lg">
                {/* Logo */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center gap-3">
                        <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-rose-500 to-pink-600 flex items-center justify-center">
                            <Heart className="h-6 w-6 text-white fill-white" />
                        </div>
                        <span className="text-2xl font-bold text-white">Amour<span className="text-rose-500">Connect</span></span>
                    </div>
                    <p className="text-slate-400 mt-2">Créez votre profil en quelques étapes</p>
                </div>

                {/* Step indicator */}
                <div className="flex items-center justify-between mb-8">
                    {STEPS.map((s, idx) => (
                        <div key={s.id} className="flex items-center gap-2 flex-1">
                            <div className={`h-9 w-9 rounded-xl flex items-center justify-center text-sm font-bold transition-all ${step >= s.id ? 'bg-gradient-to-br from-rose-500 to-pink-600 text-white' : 'bg-slate-800 text-slate-500'}`}>
                                <s.icon className="h-4 w-4" />
                            </div>
                            <span className={`hidden sm:block text-xs font-medium transition-colors ${step >= s.id ? 'text-white' : 'text-slate-500'}`}>
                                {s.label}
                            </span>
                            {idx < STEPS.length - 1 && (
                                <div className={`flex-1 h-0.5 mx-2 rounded transition-colors ${step > s.id ? 'bg-rose-500' : 'bg-slate-800'}`} />
                            )}
                        </div>
                    ))}
                </div>

                <form
                    onSubmit={handleSubmit(onSubmit)}
                    onKeyDown={(e) => {
                        // Prevent auto-submit on Enter key, except for Textarea
                        if (e.key === 'Enter' && e.target instanceof HTMLInputElement) {
                            e.preventDefault()
                            // If not on the last step, go to next step instead
                            if (step < 4) {
                                nextStep()
                            }
                        }
                    }}
                >
                    <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6 space-y-5">
                        {/* Step 1: Identity */}
                        {step === 1 && (
                            <>
                                <h2 className="text-xl font-bold text-white">Votre identité</h2>
                                <Input
                                    label="Prénom"
                                    placeholder="Marie"
                                    required
                                    error={errors.full_name?.message}
                                    {...register('full_name')}
                                />
                                <Input
                                    label="Âge"
                                    type="number"
                                    placeholder="28"
                                    required
                                    error={errors.age?.message}
                                    {...register('age', { valueAsNumber: true })}
                                />
                                <div className="space-y-1.5">
                                    <label className="text-sm font-medium text-slate-300">Genre <span className="text-rose-400">*</span></label>
                                    <select className={SELECT_CLASS} {...register('gender')}>
                                        <option value="">Choisir...</option>
                                        <option value="homme">Homme</option>
                                        <option value="femme">Femme</option>
                                        <option value="autre">Autre</option>
                                    </select>
                                    {errors.gender && <p className="text-xs text-red-400">⚠ {errors.gender.message}</p>}
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-sm font-medium text-slate-300">Je recherche <span className="text-rose-400">*</span></label>
                                    <select className={SELECT_CLASS} {...register('looking_for')}>
                                        <option value="">Choisir...</option>
                                        <option value="homme">Des hommes</option>
                                        <option value="femme">Des femmes</option>
                                        <option value="les deux">Les deux</option>
                                    </select>
                                    {errors.looking_for && <p className="text-xs text-red-400">⚠ {errors.looking_for.message}</p>}
                                </div>
                            </>
                        )}

                        {/* Step 2: Location */}
                        {step === 2 && (
                            <>
                                <h2 className="text-xl font-bold text-white">Votre localisation</h2>
                                <p className="text-slate-400 text-sm">Votre ville permet de vous suggérer des profils proches.</p>
                                <Input
                                    label="Ville"
                                    placeholder="Paris"
                                    required
                                    leftIcon={<MapPin className="h-4 w-4" />}
                                    error={errors.city?.message}
                                    {...register('city')}
                                />
                                <Input
                                    label="Code postal (optionnel)"
                                    placeholder="75001"
                                    error={errors.postal_code?.message}
                                    {...register('postal_code')}
                                />
                                <div className="space-y-1.5">
                                    <label className="text-sm font-medium text-slate-300">Visibilité du profil</label>
                                    <select className={SELECT_CLASS} {...register('visibility')}>
                                        <option value="public">Public — Visible par tous</option>
                                        <option value="limited">Limité — Visible par les membres</option>
                                        <option value="private">Privé — Masqué des recherches</option>
                                    </select>
                                </div>
                            </>
                        )}

                        {/* Step 3: Bio */}
                        {step === 3 && (
                            <>
                                <h2 className="text-xl font-bold text-white">Parlez de vous</h2>
                                <p className="text-slate-400 text-sm">Votre description donne envie aux autres de vous connaître.</p>
                                <Textarea
                                    label="Description"
                                    placeholder="Bonjour ! Je suis passionné(e) de voyages, de cuisine et de randonnée. Je recherche une relation sérieuse et sincère..."
                                    rows={5}
                                    required
                                    hint={`${getValues('bio')?.length ?? 0}/500 caractères (minimum 20)`}
                                    error={errors.bio?.message}
                                    {...register('bio')}
                                />
                            </>
                        )}

                        {/* Step 4: Avatar */}
                        {step === 4 && (
                            <>
                                <h2 className="text-xl font-bold text-white">Votre photo de profil</h2>
                                <p className="text-slate-400 text-sm">Une photo augmente vos chances de 85%. Elle sera compressée automatiquement.</p>
                                <div className="flex flex-col items-center gap-4">
                                    <div className="relative h-32 w-32 rounded-full overflow-hidden ring-4 ring-rose-500/30 bg-slate-800">
                                        <Image
                                            src={avatarPreview || getAvatarFallbackUrl(getValues('full_name'))}
                                            alt="Aperçu"
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                    <label
                                        htmlFor="avatar-upload"
                                        className="cursor-pointer flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 border-dashed border-slate-600 hover:border-rose-500 text-slate-400 hover:text-rose-400 transition-all text-sm font-medium"
                                    >
                                        <Upload className="h-4 w-4" />
                                        Choisir une photo
                                    </label>
                                    <input
                                        id="avatar-upload"
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        onChange={handleAvatarChange}
                                    />
                                    <p className="text-xs text-slate-500">PNG, JPG, WEBP · Max 10MB</p>
                                </div>
                            </>
                        )}
                    </div>

                    {/* Navigation buttons */}
                    <div className="flex gap-3 mt-4">
                        {step > 1 && (
                            <Button
                                type="button"
                                variant="secondary"
                                className="flex-1"
                                onClick={() => setStep((s) => s - 1)}
                            >
                                Précédent
                            </Button>
                        )}
                        {step < 4 ? (
                            <Button type="button" className="flex-1" onClick={nextStep}>
                                Continuer
                            </Button>
                        ) : (
                            <Button type="submit" className="flex-1" isLoading={isSubmitting}>
                                Créer mon profil 🎉
                            </Button>
                        )}
                    </div>

                    {step === 4 && (
                        <button
                            type="button"
                            onClick={handleSubmit(onSubmit)}
                            className="w-full mt-2 text-sm text-slate-500 hover:text-slate-300 transition-colors"
                        >
                            Passer cette étape (sans photo)
                        </button>
                    )}
                </form>
            </div>
        </div>
    )
}
