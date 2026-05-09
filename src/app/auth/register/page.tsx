'use client'

import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Eye, EyeOff, Mail, Lock, Heart, CheckCircle } from 'lucide-react'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { registerSchema, type RegisterInput } from '@/lib/validations'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { useToast } from '@/components/ui/Toast'

export default function RegisterPage() {
    const router = useRouter()
    const { success, error } = useToast()
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirm, setShowConfirm] = useState(false)
    const [emailSent, setEmailSent] = useState(false)

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<RegisterInput>({
        resolver: zodResolver(registerSchema),
    })

    const onSubmit = async (data: RegisterInput) => {
        const supabase = createClient()
        const { error: err } = await supabase.auth.signUp({
            email: data.email,
            password: data.password,
            options: {
                emailRedirectTo: `${window.location.origin}/auth/callback`,
            },
        })

        if (err) {
            if (err.message.includes('User already registered')) {
                error('Email déjà utilisé', 'Cet email est déjà associé à un compte.')
            } else {
                error('Erreur d\'inscription', err.message)
            }
            return
        }

        setEmailSent(true)
        success('Compte créé !', 'Vérifiez votre boîte mail pour confirmer votre adresse.')
    }

    if (emailSent) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center p-6">
                <div className="w-full max-w-md text-center space-y-6">
                    <div className="h-20 w-20 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center mx-auto">
                        <CheckCircle className="h-10 w-10 text-emerald-500" />
                    </div>
                    <h1 className="text-3xl font-bold text-slate-900">Vérifiez votre email</h1>
                    <p className="text-slate-600">
                        Nous avons envoyé un lien de confirmation à votre adresse email. Cliquez sur le lien pour activer votre compte.
                    </p>
                    <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                        <p className="text-sm text-slate-600">
                            💡 Si vous ne trouvez pas l'email, vérifiez votre dossier spam.
                        </p>
                    </div>
                    <Button variant="ghost" onClick={() => router.push('/auth/login')} className="w-full">
                        Retour à la connexion
                    </Button>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-white flex items-center justify-center p-6 py-12">
            <div className="w-full max-w-md space-y-8">
                <div className="text-center">
                    <a href="/" className="inline-flex items-center gap-3 mb-6">
                        <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-rose-500 to-pink-600 flex items-center justify-center shadow-lg">
                            <Heart className="h-6 w-6 text-white fill-white" />
                        </div>
                        <span className="text-2xl font-bold text-slate-900">Ecoute et <span className="text-rose-500">Orientation</span></span>
                    </a>
                    <h1 className="text-3xl font-bold text-slate-900">Créer un compte</h1>
                    <p className="text-slate-500 mt-2">
                        Déjà membre ?{' '}
                        <a href="/auth/login" className="text-rose-600 hover:text-rose-700 font-medium transition-colors">
                            Se connecter
                        </a>
                    </p>
                </div>

                <div className="bg-white rounded-2xl border border-slate-100 p-8 space-y-5 shadow-sm">
                    <Input
                        label="Adresse email"
                        type="email"
                        placeholder="vous@exemple.fr"
                        autoComplete="email"
                        required
                        leftIcon={<Mail className="h-4 w-4" />}
                        error={errors.email?.message}
                        {...register('email')}
                    />
                    <Input
                        label="Mot de passe"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="8 caractères minimum"
                        autoComplete="new-password"
                        required
                        leftIcon={<Lock className="h-4 w-4" />}
                        rightIcon={
                            <button type="button" onClick={() => setShowPassword(!showPassword)}>
                                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </button>
                        }
                        hint="Au moins 8 caractères, une majuscule et un chiffre"
                        error={errors.password?.message}
                        {...register('password')}
                    />
                    <Input
                        label="Confirmer le mot de passe"
                        type={showConfirm ? 'text' : 'password'}
                        placeholder="••••••••"
                        autoComplete="new-password"
                        required
                        leftIcon={<Lock className="h-4 w-4" />}
                        rightIcon={
                            <button type="button" onClick={() => setShowConfirm(!showConfirm)}>
                                {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </button>
                        }
                        error={errors.confirmPassword?.message}
                        {...register('confirmPassword')}
                    />

                    <div className="space-y-3 pt-2">
                        <label className="flex items-start gap-3 cursor-pointer group">
                            <input
                                type="checkbox"
                                className="mt-0.5 h-4 w-4 accent-rose-500"
                                {...register('isAdult')}
                            />
                            <span className="text-sm text-slate-600 group-hover:text-slate-900 transition-colors">
                                Je certifie avoir 18 ans ou plus
                            </span>
                        </label>
                        {errors.isAdult && <p className="text-xs text-red-400 ml-7">⚠ {errors.isAdult.message}</p>}

                        <label className="flex items-start gap-3 cursor-pointer group">
                            <input
                                type="checkbox"
                                className="mt-0.5 h-4 w-4 accent-rose-500"
                                {...register('acceptTerms')}
                            />
                            <span className="text-sm text-slate-600 group-hover:text-slate-900 transition-colors">
                                J'accepte les{' '}
                                <a href="/legal/terms" className="text-rose-400 hover:underline">
                                    Conditions d'utilisation
                                </a>{' '}
                                et la{' '}
                                <a href="/legal/privacy" className="text-rose-400 hover:underline">
                                    Politique de confidentialité
                                </a>
                            </span>
                        </label>
                        {errors.acceptTerms && <p className="text-xs text-red-400 ml-7">⚠ {errors.acceptTerms.message}</p>}
                    </div>

                    <Button
                        type="submit"
                        size="lg"
                        className="w-full"
                        isLoading={isSubmitting}
                        onClick={handleSubmit(onSubmit)}
                    >
                        Créer mon compte gratuitement
                    </Button>
                </div>
            </div>
        </div>
    )
}
