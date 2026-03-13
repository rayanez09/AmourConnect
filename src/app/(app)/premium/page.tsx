import Link from 'next/link'
import { Crown, Check, Zap, Heart, Star, Shield, Eye, MessageCircle } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Premium – Ecoute et Orientation' }

const premiumFeatures = [
    { icon: Eye, label: 'Voir qui vous a liké', desc: 'Découvrez tous ceux qui ont liké votre profil.' },
    { icon: Heart, label: 'Likes illimités', desc: 'Aimez autant de profils que vous le souhaitez.' },
    { icon: Zap, label: 'Priorité dans les recherches', desc: 'Votre profil apparaît en premier dans les résultats.' },
    { icon: Shield, label: 'Badge vérifié', desc: 'Un badge de confiance sur votre profil.' },
    { icon: Star, label: 'Filtres avancés', desc: 'Affinez votre recherche : distance, style de vie, etc.' },
    { icon: MessageCircle, label: 'Accusés de lecture', desc: 'Sachez quand vos messages ont été lus.' },
]

export default function PremiumPage() {
    return (
        <div className="max-w-3xl mx-auto px-4 py-12">
            {/* Header */}
            <div className="text-center mb-12">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-sm font-medium mb-4">
                    <Crown className="h-4 w-4" />
                    Passer Premium
                </div>
                <h1 className="text-4xl font-bold text-white mb-4">
                    Maximisez vos chances de rencontre
                </h1>
                <p className="text-slate-400 text-lg">
                    Déverrouillez toutes les fonctionnalités et trouvez l'âme sœur plus rapidement.
                </p>
            </div>

            {/* Features grid */}
            <div className="grid sm:grid-cols-2 gap-4 mb-12">
                {premiumFeatures.map((f) => (
                    <div
                        key={f.label}
                        className="flex items-start gap-4 p-4 rounded-2xl border border-amber-500/20 bg-amber-500/5"
                    >
                        <div className="h-10 w-10 rounded-xl bg-amber-500/20 flex items-center justify-center flex-shrink-0">
                            <f.icon className="h-5 w-5 text-amber-400" />
                        </div>
                        <div>
                            <p className="font-semibold text-white">{f.label}</p>
                            <p className="text-sm text-slate-400 mt-0.5">{f.desc}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Pricing cards */}
            <div className="grid sm:grid-cols-3 gap-4 mb-8">
                {[
                    { period: '1 mois', price: '$35', pricePerMonth: '$35/mois', badge: null },
                    { period: '3 mois', price: '$85', pricePerMonth: '$28/mois', badge: 'Populaire', icon: Zap, save: 'Économisez 20%' },
                    { period: '6 mois', price: '$150', pricePerMonth: '$25/mois', badge: 'Meilleur prix', icon: Star, save: 'Économisez 30%' },
                ].map((plan) => (
                    <div
                        key={plan.period}
                        className={`relative rounded-2xl border p-6 text-center ${plan.badge
                            ? 'border-amber-500/50 bg-gradient-to-br from-amber-900/20 to-yellow-900/10'
                            : 'border-slate-800 bg-slate-900'
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
                        <div className="text-sm text-slate-400 mb-2">{plan.period}</div>
                        <div className="text-3xl font-bold text-white mb-1">{plan.price}</div>
                        <div className="text-sm text-slate-400 mb-1">{plan.pricePerMonth}</div>
                        {plan.save && (
                            <div className="text-xs text-emerald-400 font-medium mb-4">{plan.save}</div>
                        )}
                        <Button variant={plan.badge ? 'primary' : 'secondary'} className="w-full mt-4" size="sm">
                            Choisir
                        </Button>
                    </div>
                ))}
            </div>

            {/* Simulation notice */}
            <div className="rounded-2xl border border-blue-500/30 bg-blue-500/5 p-4 text-center">
                <p className="text-blue-400 text-sm">
                    💡 <strong>Mode simulation</strong> — Le paiement Stripe sera intégré prochainement.
                    Pour activer Premium en test, contactez l'administration.
                </p>
            </div>
        </div>
    )
}
