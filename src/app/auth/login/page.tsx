'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Eye, EyeOff, Mail, Lock, Heart } from 'lucide-react'
import { useState, Suspense } from 'react'
import { createClient } from '@/lib/supabase/client'
import { loginSchema, type LoginInput } from '@/lib/validations'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { useToast } from '@/components/ui/Toast'

function LoginForm() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const redirectTo = searchParams.get('redirectedFrom') || '/dashboard'
    const { success, error } = useToast()
    const [showPassword, setShowPassword] = useState(false)

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<LoginInput>({
        resolver: zodResolver(loginSchema),
    })

    const onSubmit = async (data: LoginInput) => {
        const supabase = createClient()
        const { error: err } = await supabase.auth.signInWithPassword({
            email: data.email,
            password: data.password,
        })

        if (err) {
            if (err.message.includes('Invalid login credentials')) {
                error('Connexion échouée', 'Email ou mot de passe incorrect')
            } else if (err.message.includes('Email not confirmed')) {
                error('Email non vérifié', 'Vérifiez votre boîte mail et confirmez votre adresse email')
            } else {
                error('Erreur', err.message)
            }
            return
        }

        router.push(redirectTo)
        success('Connexion réussie', 'Bienvenue !')
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
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
                placeholder="••••••••"
                autoComplete="current-password"
                required
                leftIcon={<Lock className="h-4 w-4" />}
                rightIcon={
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="hover:text-white transition-colors">
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                }
                error={errors.password?.message}
                {...register('password')}
            />

            <div className="flex justify-end">
                <a href="/auth/forgot-password" className="text-sm text-rose-400 hover:text-rose-300 transition-colors">
                    Mot de passe oublié ?
                </a>
            </div>

            <Button type="submit" size="lg" className="w-full" isLoading={isSubmitting}>
                Se connecter
            </Button>
        </form>
    )
}

export default function LoginPage() {
    return (
        <div className="min-h-screen bg-white flex">
            {/* Left decorative panel */}
            <div className="hidden lg:flex flex-col justify-between w-1/2 bg-gradient-to-br from-rose-50 to-white lg:from-rose-50 lg:via-white lg:to-rose-50 p-12 border-r border-slate-100">
                <a href="/" className="flex items-center gap-3 mb-10">
                    <div className="h-10 w-10 rounded-xl bg-rose-500 flex items-center justify-center">
                        <Heart className="h-6 w-6 text-white fill-white" />
                    </div>
                    <span className="text-2xl font-bold text-slate-900">Ecoute et <span className="text-rose-500">Orientation</span></span>
                </a>

                <div className="space-y-6">
                    <h2 className="text-5xl font-bold text-slate-900 leading-tight">
                        Votre histoire <br />
                        <span className="text-rose-500">d'amour</span> <br />
                        commence ici.
                    </h2>
                    <p className="text-slate-600 text-lg max-w-md">
                        Rejoignez des milliers de célibataires sérieux et trouvez votre âme sœur en toute confiance.
                    </p>

                    <div className="flex gap-8">
                        {[
                            { label: 'Membres actifs', value: '50K+' },
                            { label: 'Couples formés', value: '12K+' },
                            { label: 'Satisfaction', value: '94%' },
                        ].map((stat) => (
                            <div key={stat.label}>
                                <div className="text-2xl font-bold text-slate-900">{stat.value}</div>
                                <div className="text-sm text-slate-500">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>

                <p className="text-slate-500 text-sm">
                    Sécurisé · Confidentiel · Sérieux
                </p>
            </div>

            {/* Right form panel */}
            <div className="flex-1 flex items-center justify-center p-6">
                <div className="w-full max-w-md space-y-8">
                    {/* Mobile logo */}
                    <div className="lg:hidden flex justify-center">
                        <a href="/" className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-rose-500 to-pink-600 flex items-center justify-center">
                                <Heart className="h-6 w-6 text-white fill-white" />
                            </div>
                            <span className="text-2xl font-bold text-slate-900">Ecoute et <span className="text-rose-500">Orientation</span></span>
                        </a>
                    </div>

                    <div className="text-center lg:text-left">
                        <h1 className="text-3xl font-bold text-slate-900">Connexion</h1>
                        <p className="text-slate-500 mt-2">
                            Pas encore membre ?{' '}
                            <a href="/auth/register" className="text-rose-400 hover:text-rose-300 font-medium transition-colors">
                                Créer un compte
                            </a>
                        </p>
                    </div>

                    <Suspense>
                        <LoginForm />
                    </Suspense>

                    <p className="text-center text-xs text-slate-500">
                        En vous connectant, vous acceptez nos{' '}
                        <a href="/legal/terms" className="text-rose-400 hover:underline">CGU</a>
                        {' '}et notre{' '}
                        <a href="/legal/privacy" className="text-rose-400 hover:underline">Politique de confidentialité</a>.
                    </p>
                </div>
            </div>
        </div>
    )
}
