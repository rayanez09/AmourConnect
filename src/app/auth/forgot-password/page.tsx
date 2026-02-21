'use client'

import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Mail, Heart, ArrowLeft, CheckCircle } from 'lucide-react'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { forgotPasswordSchema, type ForgotPasswordInput } from '@/lib/validations'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { useToast } from '@/components/ui/Toast'

export default function ForgotPasswordPage() {
    const { error } = useToast()
    const [emailSent, setEmailSent] = useState(false)

    const {
        register,
        handleSubmit,
        getValues,
        formState: { errors, isSubmitting },
    } = useForm<ForgotPasswordInput>({
        resolver: zodResolver(forgotPasswordSchema),
    })

    const onSubmit = async (data: ForgotPasswordInput) => {
        const supabase = createClient()
        const { error: err } = await supabase.auth.resetPasswordForEmail(
            data.email,
            { redirectTo: `${window.location.origin}/auth/reset-password` }
        )

        if (err) {
            error('Erreur', err.message)
            return
        }

        setEmailSent(true)
    }

    if (emailSent) {
        return (
            <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6">
                <div className="w-full max-w-md text-center space-y-6">
                    <div className="h-20 w-20 rounded-full bg-rose-500/20 border border-rose-500/30 flex items-center justify-center mx-auto">
                        <CheckCircle className="h-10 w-10 text-rose-400" />
                    </div>
                    <h1 className="text-3xl font-bold text-white">Email envoyé !</h1>
                    <p className="text-slate-400">
                        Si un compte existe avec l'adresse <strong className="text-white">{getValues('email')}</strong>,
                        vous recevrez un email avec un lien pour réinitialiser votre mot de passe.
                    </p>
                    <Link href="/auth/login">
                        <Button variant="outline" className="w-full gap-2">
                            <ArrowLeft className="h-4 w-4" />
                            Retour à la connexion
                        </Button>
                    </Link>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6">
            <div className="w-full max-w-md space-y-8">
                <div className="text-center">
                    <Link href="/" className="inline-flex items-center gap-3 mb-6">
                        <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-rose-500 to-pink-600 flex items-center justify-center">
                            <Heart className="h-6 w-6 text-white fill-white" />
                        </div>
                    </Link>
                    <h1 className="text-3xl font-bold text-white">Mot de passe oublié</h1>
                    <p className="text-slate-400 mt-2">
                        Entrez votre email pour recevoir un lien de réinitialisation.
                    </p>
                </div>

                <div className="bg-slate-900 rounded-2xl border border-slate-800 p-8 space-y-5">
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
                    <Button
                        type="submit"
                        size="lg"
                        className="w-full"
                        isLoading={isSubmitting}
                        onClick={handleSubmit(onSubmit)}
                    >
                        Envoyer le lien
                    </Button>
                </div>

                <Link
                    href="/auth/login"
                    className="flex items-center justify-center gap-2 text-slate-400 hover:text-white transition-colors"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Retour à la connexion
                </Link>
            </div>
        </div>
    )
}
