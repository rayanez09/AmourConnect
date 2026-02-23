import Link from 'next/link'
import {
  Heart,
  Shield,
  Search,
  MessageCircle,
  Star,
  ArrowRight,
  CheckCircle,
  Crown,
  Zap,
  Lock,
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Card, CardContent } from '@/components/ui/Card'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Ecoute et Orientation – Rencontres sérieuses en ligne',
  description: 'Trouvez votre âme sœur sur Ecoute et Orientation. Plateforme de rencontres sécurisée et sérieuse pour adultes en France.',
}

const features = [
  {
    icon: Search,
    title: 'Recherche personnalisée',
    description: 'Filtrez par âge, ville, et préférences pour trouver les profils qui vous correspondent vraiment.',
    color: 'text-violet-400',
    bg: 'bg-violet-500/10',
    border: 'border-violet-500/20',
  },
  {
    icon: Heart,
    title: 'Système de matching',
    description: "Likez les profils qui vous plaisent. Quand c'est mutuel, c'est un match et vous pouvez discuter !",
    color: 'text-rose-400',
    bg: 'bg-rose-500/10',
    border: 'border-rose-500/20',
  },
  {
    icon: MessageCircle,
    title: 'Messagerie temps réel',
    description: 'Échangez en toute sécurité via notre messagerie chiffrée accessible uniquement entre matchs.',
    color: 'text-blue-400',
    bg: 'bg-blue-500/10',
    border: 'border-blue-500/20',
  },
  {
    icon: Shield,
    title: 'Sécurité maximale',
    description: 'Vos données sont protégées, les profils sont vérifiés et des politiques strictes s\'appliquent.',
    color: 'text-emerald-400',
    bg: 'bg-emerald-500/10',
    border: 'border-emerald-500/20',
  },
]

const plans = [
  {
    name: 'Gratuit',
    price: '0€',
    period: '/mois',
    description: 'Pour commencer à découvrir',
    features: [
      '10 likes par jour',
      'Messagerie avec vos matchs',
      'Profil visible',
      'Recherche de base',
    ],
    cta: 'Commencer gratuitement',
    href: '/auth/register',
    variant: 'secondary' as const,
    popular: false,
  },
  {
    name: 'Premium',
    price: '19,90€',
    period: '/mois',
    description: 'Pour maximiser vos chances',
    features: [
      'Likes illimités',
      'Voir qui vous a liké',
      'Filtres avancés',
      'Badge profil vérifié',
      'Priorité dans les recherches',
      'Messagerie avec accusés de lecture',
    ],
    cta: 'Essai gratuit 7 jours',
    href: '/auth/register?plan=premium',
    variant: 'primary' as const,
    popular: true,
  },
]

const stats = [
  { value: '50 000+', label: 'Membres actifs' },
  { value: '12 000+', label: 'Couples formés' },
  { value: '94%', label: 'Satisfaction' },
  { value: '100%', label: 'Sécurisé' },
]

const testimonials = [
  {
    name: 'Sophie M.',
    age: 32,
    city: 'Lyon',
    text: "J'ai rencontré mon compagnon sur Ecoute et Orientation il y a 8 mois. L'interface est tellement intuitive et les profils sont sérieux !",
  },
  {
    name: 'Thomas R.',
    age: 28,
    city: 'Paris',
    text: "Ce que j'apprécie c'est la qualité des membres. On sent que les gens sont vraiment là pour une relation sérieuse.",
  },
  {
    name: 'Camille L.',
    age: 35,
    city: 'Bordeaux',
    text: "La sécurité du site m'a donné confiance dès le départ. Je recommande à toutes mes amies célibataires !",
  },
]

export default function HomePage() {
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-slate-800/50 bg-slate-950/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-rose-500 to-pink-600 flex items-center justify-center shadow-lg shadow-rose-500/30">
              <Heart className="h-5 w-5 text-white fill-white" />
            </div>
            <span className="text-xl font-bold">Amour<span className="text-rose-500">Connect</span></span>
          </Link>
          <div className="flex items-center gap-3">
            <Link href="/auth/login" className="hidden sm:block text-slate-300 hover:text-white text-sm font-medium transition-colors">
              Connexion
            </Link>
            <Button variant="primary" size="sm" asChild>
              <Link href="/auth/register">Rejoindre gratuitement</Link>
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-20 px-4 relative overflow-hidden">
        {/* Background glow */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 h-96 w-96 bg-rose-500/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
          <div className="absolute top-1/3 right-1/4 h-80 w-80 bg-pink-500/10 rounded-full blur-3xl translate-x-1/2" />
        </div>

        <div className="relative max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-rose-500/30 bg-rose-500/10 text-rose-400 text-sm font-medium mb-6">
            <Zap className="h-4 w-4" />
            Nouvelle façon de rencontrer
          </div>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold leading-tight mb-6">
            Trouvez votre{' '}
            <span className="bg-gradient-to-r from-rose-400 to-pink-500 bg-clip-text text-transparent">
              âme sœur
            </span>
            <br />en toute confiance
          </h1>

          <p className="text-xl text-slate-400 max-w-2xl mx-auto mb-10">
            Ecoute et Orientation réunit des célibataires sérieux qui cherchent une vraie relation.
            Profils vérifiés, messagerie sécurisée et matching intelligent.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild className="text-base px-8">
              <Link href="/auth/register" className="gap-2">
                Créer mon profil gratuit
                <ArrowRight className="h-5 w-5" />
              </Link>
            </Button>
            <Button variant="secondary" size="lg" asChild className="text-base px-8">
              <Link href="/auth/login">Se connecter</Link>
            </Button>
          </div>

          <p className="mt-4 text-sm text-slate-500">
            Gratuit · Sans engagement · Données protégées
          </p>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 border-y border-slate-800 bg-slate-900/50">
        <div className="max-w-5xl mx-auto px-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 text-center">
            {stats.map(({ value, label }) => (
              <div key={label}>
                <div className="text-3xl font-bold text-white mb-1">{value}</div>
                <div className="text-slate-400 text-sm">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">
              Tout ce qu'il vous faut pour rencontrer
            </h2>
            <p className="text-slate-400 text-lg">
              Des outils pensés pour vous aider à trouver la bonne personne.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((f) => (
              <Card key={f.title} glass hover className={`border ${f.border}`}>
                <CardContent className="pt-6">
                  <div className={`h-12 w-12 rounded-2xl ${f.bg} border ${f.border} flex items-center justify-center mb-4`}>
                    <f.icon className={`h-6 w-6 ${f.color}`} />
                  </div>
                  <h3 className="font-bold text-white mb-2">{f.title}</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">{f.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-24 px-4 bg-slate-900/40">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">Comment ça marche ?</h2>
          </div>
          <div className="grid sm:grid-cols-3 gap-8">
            {[
              { step: '1', title: 'Créez votre profil', desc: 'Inscrivez-vous gratuitement et remplissez votre profil en quelques minutes.', emoji: '📝' },
              { step: '2', title: 'Découvrez des profils', desc: 'Parcourez les profils et likez ceux qui vous correspondent.', emoji: '❤️' },
              { step: '3', title: 'Discutez et rencontrez', desc: 'Quand c\'est mutuel, c\'est un match ! Commencez à échanger.', emoji: '💬' },
            ].map(({ step, title, desc, emoji }) => (
              <div key={step} className="text-center">
                <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-rose-500/20 to-pink-600/20 border border-rose-500/30 flex items-center justify-center text-2xl mx-auto mb-4">
                  {emoji}
                </div>
                <div className="text-xs font-bold text-rose-400 uppercase tracking-wider mb-2">Étape {step}</div>
                <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
                <p className="text-slate-400 text-sm">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-24 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">Choisissez votre offre</h2>
            <p className="text-slate-400">Commencez gratuitement, passez Premium quand vous le souhaitez.</p>
          </div>
          <div className="grid sm:grid-cols-2 gap-6">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`relative rounded-2xl border p-8 ${plan.popular
                  ? 'border-rose-500/50 bg-gradient-to-br from-rose-900/20 to-pink-900/20'
                  : 'border-slate-800 bg-slate-900'
                  }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="px-4 py-1 rounded-full bg-gradient-to-r from-rose-500 to-pink-600 text-white text-xs font-bold">
                      ⭐ Recommandé
                    </span>
                  </div>
                )}
                <div className="mb-6">
                  <div className="flex items-center gap-2 mb-2">
                    {plan.popular ? <Crown className="h-5 w-5 text-amber-400" /> : <Star className="h-5 w-5 text-slate-400" />}
                    <h3 className="text-xl font-bold text-white">{plan.name}</h3>
                  </div>
                  <div className="flex items-baseline gap-1 mb-1">
                    <span className="text-4xl font-bold text-white">{plan.price}</span>
                    <span className="text-slate-400">{plan.period}</span>
                  </div>
                  <p className="text-slate-400 text-sm">{plan.description}</p>
                </div>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm">
                      <CheckCircle className="h-4 w-4 text-emerald-400 flex-shrink-0" />
                      <span className="text-slate-300">{f}</span>
                    </li>
                  ))}
                </ul>
                <Button variant={plan.variant} className="w-full" asChild>
                  <Link href={plan.href}>{plan.cta}</Link>
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 px-4 bg-slate-900/40">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">Ils ont trouvé l'amour</h2>
          </div>
          <div className="grid sm:grid-cols-3 gap-6">
            {testimonials.map((t) => (
              <Card key={t.name} glass>
                <CardContent className="pt-6">
                  <div className="flex text-amber-400 mb-4">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-amber-400" />
                    ))}
                  </div>
                  <p className="text-slate-300 text-sm leading-relaxed mb-4">"{t.text}"</p>
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-full bg-gradient-to-br from-rose-500 to-pink-600 flex items-center justify-center text-xs font-bold text-white">
                      {t.name.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-white">{t.name}</p>
                      <p className="text-xs text-slate-400">{t.age} ans · {t.city}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex p-3 rounded-2xl bg-rose-500/10 border border-rose-500/20 mb-6">
            <Heart className="h-8 w-8 text-rose-400 fill-rose-400" />
          </div>
          <h2 className="text-4xl font-bold text-white mb-4">
            Prêt(e) à trouver l'amour ?
          </h2>
          <p className="text-slate-400 mb-8">
            Rejoignez des milliers de célibataires sérieux. Inscription gratuite en 2 minutes.
          </p>
          <Button size="lg" asChild className="text-base px-10">
            <Link href="/auth/register" className="gap-2">
              Commencer gratuitement
              <ArrowRight className="h-5 w-5" />
            </Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800 py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid sm:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-rose-500 to-pink-600 flex items-center justify-center">
                  <Heart className="h-4 w-4 text-white fill-white" />
                </div>
                <span className="font-bold text-white">Amour<span className="text-rose-500">Connect</span></span>
              </div>
              <p className="text-slate-400 text-sm">Rencontres sérieuses pour adultes en France.</p>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-3">Plateforme</h4>
              <ul className="space-y-2 text-sm text-slate-400">
                <li><Link href="/auth/register" className="hover:text-white transition-colors">S'inscrire</Link></li>
                <li><Link href="/auth/login" className="hover:text-white transition-colors">Se connecter</Link></li>
                <li><Link href="/premium" className="hover:text-white transition-colors">Premium</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-3">Légal</h4>
              <ul className="space-y-2 text-sm text-slate-400">
                <li><Link href="/legal/privacy" className="hover:text-white transition-colors">Confidentialité</Link></li>
                <li><Link href="/legal/terms" className="hover:text-white transition-colors">CGU</Link></li>
                <li><Link href="/legal/cookies" className="hover:text-white transition-colors">Cookies</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-3">Sécurité</h4>
              <div className="flex items-start gap-2 text-sm text-slate-400">
                <Lock className="h-4 w-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                <span>Données chiffrées et protégées selon le RGPD</span>
              </div>
            </div>
          </div>
          <div className="border-t border-slate-800 pt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-slate-500 text-sm">© 2024 Ecoute et Orientation. Tous droits réservés.</p>
            <p className="text-slate-500 text-sm flex items-center gap-1">
              Réservé aux adultes de 18 ans et plus
              <Shield className="h-4 w-4 text-slate-600" />
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
