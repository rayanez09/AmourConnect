'use client'

import { useState } from 'react'
import Script from 'next/script'
import { useRouter } from 'next/navigation'
import { Crown, Check, Zap, Heart, Star, Shield, Eye, MessageCircle } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { useAuth } from '@/hooks/useAuth'
import { toast } from 'sonner'

declare global {
    interface Window {
        FedaPay: any;
    }
}

const premiumFeatures = [
    { icon: Eye, label: 'Voir qui vous a liké', desc: 'Découvrez tous ceux qui ont liké votre profil.' },
    { icon: Heart, label: 'Likes illimités', desc: 'Aimez autant de profils que vous le souhaitez.' },
    { icon: Zap, label: 'Priorité dans les recherches', desc: 'Votre profil apparaît en premier dans les résultats.' },
    { icon: Shield, label: 'Badge vérifié', desc: 'Un badge de confiance sur votre profil.' },
    { icon: Star, label: 'Filtres avancés', desc: 'Affinez votre recherche : distance, style de vie, etc.' },
    { icon: MessageCircle, label: 'Accusés de lecture', desc: 'Sachez quand vos messages ont été lus.' },
]

export default function PremiumClient() {
    const { profile } = useAuth()
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)

    const handleSubscribe = (amount: number, planName: string) => {
        if (!profile) {
            toast.error("Veuillez vous connecter pour vous abonner")
            router.push('/auth/login')
            return
        }

        if (typeof window.FedaPay === 'undefined') {
            toast.error("Le module de paiement n'est pas encore prêt. Veuillez réessayer dans un instant.")
            return
        }

        const widget = window.FedaPay.init({
            public_key: process.env.NEXT_PUBLIC_FEDAPAY_PUBLIC_KEY,
            transaction: {
                amount: amount,
                description: `Abonnement Premium - ${planName}`,
            },
            customer: {
                firstname: profile.full_name || 'Utilisateur',
                lastname: 'AmourConnect'
            },
            onComplete: async function (resp: any) {
                if (resp.reason === 'CHECKOUT COMPLETE') {
                    setIsLoading(true)
                    toast.info("Vérification du paiement en cours...")
                    
                    try {
                        const res = await fetch('/api/fedapay/verify', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                                transaction_id: resp.transaction.id,
                                user_id: profile.user_id,
                                plan: 'premium'
                            })
                        })
                        
                        if (res.ok) {
                            toast.success("Paiement réussi ! Vous êtes maintenant Premium.")
                            router.push('/dashboard')
                            router.refresh()
                        } else {
                            toast.error("Erreur lors de la vérification du paiement sur le serveur.")
                        }
                    } catch (e) {
                        console.error(e)
                        toast.error("Erreur système lors de la vérification.")
                    } finally {
                        setIsLoading(false)
                    }
                } else {
                    toast.error("Le paiement n'a pas été finalisé.")
                }
            }
        })
        
        widget.open()
    }

    return (
        <div className="max-w-3xl mx-auto px-4 py-12">
            <Script src="https://checkout.fedapay.com/js/checkout.js" strategy="lazyOnload" />
            
            {/* Header */}
            <div className="text-center mb-12">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-sm font-medium mb-4">
                    <Crown className="h-4 w-4" />
                    Passer Premium
                </div>
                <h1 className="text-4xl font-bold text-slate-900 mb-4">
                    Maximisez vos chances de rencontre
                </h1>
                <p className="text-slate-500 text-lg">
                    Déverrouillez toutes les fonctionnalités et trouvez l'âme sœur plus rapidement.
                </p>
            </div>

            {/* Features grid */}
            <div className="grid sm:grid-cols-2 gap-4 mb-12">
                {premiumFeatures.map((f) => (
                    <div
                        key={f.label}
                        className="flex items-start gap-4 p-4 rounded-2xl border border-slate-100 bg-white shadow-sm"
                    >
                        <div className="h-10 w-10 rounded-xl bg-rose-50 flex items-center justify-center flex-shrink-0">
                            <f.icon className="h-5 w-5 text-rose-500" />
                        </div>
                        <div>
                            <p className="font-semibold text-slate-900">{f.label}</p>
                            <p className="text-sm text-slate-500 mt-0.5">{f.desc}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Pricing cards */}
            <div className="grid sm:grid-cols-3 gap-4 mb-8">
                {[
                    { period: '1 mois', amount: 20000, price: '20 000 FCFA', pricePerMonth: '20 000 FCFA/mois', badge: null },
                    { period: '3 mois', amount: 50000, price: '50 000 FCFA', pricePerMonth: '16 500 FCFA/mois', badge: 'Populaire', icon: Zap, save: 'Économisez 20%' },
                    { period: '6 mois', amount: 90000, price: '90 000 FCFA', pricePerMonth: '15 000 FCFA/mois', badge: 'Meilleur prix', icon: Star, save: 'Économisez 30%' },
                ].map((plan) => (
                    <div
                        key={plan.period}
                        className={`relative rounded-2xl border p-6 text-center shadow-sm ${plan.badge
                            ? 'border-amber-200 bg-gradient-to-br from-white to-amber-50'
                            : 'border-slate-100 bg-white'
                            }`}
                    >
                        {plan.badge && (
                            <div className="absolute -top-3 left-1/2 -translate-x-1/2 whitespace-nowrap">
                                <span className="px-3 py-1 rounded-full bg-gradient-to-r from-amber-500 to-yellow-600 text-white text-xs font-bold flex items-center gap-1.5">
                                    {plan.icon && <plan.icon className="h-3 w-3" />}
                                    {plan.badge}
                                </span>
                            </div>
                        )}
                        <div className="text-sm text-slate-500 mb-2">{plan.period}</div>
                        <div className="text-3xl font-bold text-slate-900 mb-1">{plan.price}</div>
                        <div className="text-sm text-slate-500 mb-1">{plan.pricePerMonth}</div>
                        {plan.save && (
                            <div className="text-xs text-emerald-400 font-medium mb-4">{plan.save}</div>
                        )}
                        <Button 
                            variant={plan.badge ? 'primary' : 'secondary'} 
                            className="w-full mt-4" 
                            size="sm"
                            disabled={isLoading}
                            onClick={() => handleSubscribe(plan.amount, plan.period)}
                        >
                            Choisir
                        </Button>
                    </div>
                ))}
            </div>

            {/* Simulation notice */}
            <div className="rounded-2xl border border-blue-100 bg-blue-50 p-4 text-center">
                <p className="text-blue-600 text-sm">
                    💡 <strong>Paiements sécurisés</strong> — Les transactions sont traitées de manière sécurisée par FedaPay (Mobile Money & Cartes).
                </p>
            </div>
        </div>
    )
}
