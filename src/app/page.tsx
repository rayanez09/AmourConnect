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
  FileText,
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
    price: '$35',
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

const marqueeImages = [
  "/photos/Cute Black Guy.jpg",
  "/photos/télécharger (10).jpg",
  "/photos/télécharger (8).jpg",
  "/photos/télécharger (15).jpg",
  "/photos/Tresse africaine _ 20 modèles tendances en fonction de la longueur de vos cheveux.jpg",
  "/photos/télécharger (14).jpg",
  "/photos/télécharger (6).jpg",
  "/photos/Handsome Man.jpg",
  "/photos/télécharger (11).jpg",
  "/photos/télécharger (4).jpg",
  "/photos/télécharger (13).jpg",
  "/photos/télécharger (7).jpg",
  "/photos/where_🔍.jpg",
  "/photos/télécharger (5).jpg",
  "/photos/télécharger (16).jpg",
  "/photos/télécharger (9).jpg",
  "/photos/télécharger (12).jpg",
]

export default function HomePage() {
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-slate-800/80 bg-slate-950/90 backdrop-blur-xl shadow-lg shadow-slate-900/20">
        <div className="max-w-7xl mx-auto px-4 lg:px-8 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 sm:gap-3 group">
            <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-xl sm:rounded-2xl bg-gradient-to-br from-rose-500 to-pink-600 flex items-center justify-center shadow-lg shadow-rose-500/40 group-hover:scale-105 transition-transform">
              <Heart className="h-4 w-4 sm:h-5 sm:w-5 text-white fill-white" />
            </div>
            <span className="text-lg sm:text-2xl font-black tracking-tight">Ecoute et <span className="text-rose-500">Orientation</span></span>
          </Link>
          <div className="flex items-center gap-3 sm:gap-6">
            <Button variant="primary" asChild className="text-sm sm:text-base px-4 py-2 sm:px-6 sm:py-3 h-auto font-bold shadow-lg shadow-rose-500/20 hover:shadow-rose-500/40 bg-gradient-to-r from-rose-500 to-pink-600 text-white border-none">
              <Link href="/auth/login">Se connecter</Link>
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-24 pb-16 sm:pt-32 sm:pb-24 px-4 relative overflow-hidden min-h-[95vh] flex flex-col items-center justify-center z-10">
        {/* Background glow */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden flex items-center justify-center z-0">
          <div className="absolute top-1/4 left-1/4 h-[600px] w-[600px] bg-rose-500/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
          <div className="absolute top-1/3 right-1/4 h-[500px] w-[500px] bg-pink-500/10 rounded-full blur-3xl translate-x-1/2" />
        </div>

        {/* Free-floating Mockup Cards (Tinder Style) placed behind the text */}
        <div className="absolute inset-0 pointer-events-none z-0 overflow-visible">
          {/* Left Card */}
          <div className="absolute top-[5%] sm:top-[15%] left-[-15%] sm:left-[5%] md:left-[10%] lg:left-[15%] w-40 sm:w-64 md:w-72 aspect-[3/4] rounded-xl sm:rounded-2xl md:rounded-3xl border border-slate-700/50 bg-slate-900 overflow-hidden transform -rotate-12 shadow-[0_0_50px_rgba(244,63,94,0.3)] opacity-80 sm:opacity-90 transition-transform duration-1000">
            <img src="/photos/p1.jpg" alt="Profil 1" className="w-full h-full object-cover object-top" />
            <div className="absolute bottom-0 inset-x-0 h-1/2 bg-gradient-to-t from-slate-950 to-transparent p-2 sm:p-4 flex flex-col justify-end">
              <div className="flex gap-1 sm:gap-2 mb-1 sm:mb-2 justify-center">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-slate-800 flex items-center justify-center text-rose-500 shadow-lg shadow-rose-500/20"><Heart className="w-4 h-4 sm:w-5 sm:h-5 fill-current" /></div>
              </div>
            </div>
          </div>

          {/* Right Card */}
          <div className="absolute top-[15%] sm:top-[25%] lg:top-[30%] right-[-15%] sm:right-[5%] md:right-[10%] lg:right-[15%] w-40 sm:w-64 md:w-72 aspect-[3/4] rounded-xl sm:rounded-2xl md:rounded-3xl border border-slate-700/50 bg-slate-900 overflow-hidden transform rotate-12 shadow-[0_0_50px_rgba(236,72,153,0.3)] opacity-80 sm:opacity-90 transition-transform duration-1000">
            <img src="/photos/p2.jpg" alt="Profil 2" className="w-full h-full object-cover object-top" />
            <div className="absolute bottom-0 inset-x-0 h-1/2 bg-gradient-to-t from-slate-950 to-transparent p-2 sm:p-4 flex flex-col justify-end">
              <div className="flex gap-1 sm:gap-2 mb-1 sm:mb-2 justify-center">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-slate-800 flex items-center justify-center text-rose-500 shadow-lg shadow-rose-500/20"><Heart className="w-4 h-4 sm:w-5 sm:h-5 fill-current" /></div>
              </div>
            </div>
          </div>

          {/* Center Top Card */}
          <div className="absolute top-[-5%] sm:top-[-10%] md:top-[0%] left-1/2 -translate-x-1/2 w-56 sm:w-64 md:w-80 aspect-[3/4] rounded-2xl md:rounded-3xl border border-slate-700/50 bg-slate-900 overflow-hidden transform rotate-[-6deg] shadow-[0_0_50px_rgba(0,0,0,0.6)] opacity-80 transition-transform duration-1000 hidden sm:block">
            <img src="/photos/p3.jpg" alt="Profil 3" className="w-full h-full object-cover object-[center_30%]" />
            <div className="absolute bottom-0 inset-x-0 h-1/2 bg-gradient-to-t from-slate-950 to-transparent" />
          </div>
        </div>

        {/* Central Text Content */}
        <div className="relative max-w-4xl mx-auto text-center z-20 p-4 sm:p-8 mt-32 sm:mt-16 w-full">
          <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full border border-rose-500/40 bg-rose-500/20 text-rose-300 text-[10px] sm:text-sm font-semibold mb-6 backdrop-blur-md shadow-lg whitespace-nowrap">
            <Zap className="h-4 w-4" />
            Le 1er réseau de rencontres en Afrique
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black leading-tight mb-4 sm:mb-6 tracking-tight">
            Vivez l'<span className="bg-gradient-to-r from-rose-400 to-pink-500 bg-clip-text text-transparent drop-shadow-sm">Amour Vrai</span>
            <br />près de chez vous
          </h1>

          <p className="text-base sm:text-lg md:text-xl text-slate-300 max-w-2xl mx-auto mb-6 sm:mb-8 font-medium px-2">
            Rencontrez des personnes authentiques au Togo et dans toute l'Afrique. Glissez. Matchez. Discutez. C'est aussi simple que ça.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center w-full px-4 sm:px-0">
            <Button size="lg" asChild className="text-base sm:text-lg w-full sm:w-auto px-6 sm:px-10 py-5 sm:py-6 h-auto shadow-[0_0_40px_rgba(244,63,94,0.3)] hover:shadow-[0_0_60px_rgba(244,63,94,0.5)] transition-shadow">
              <Link href="/auth/register" className="gap-2 font-bold justify-center">
                Créer mon compte
                <ArrowRight className="h-5 w-5 sm:h-6 sm:w-6" />
              </Link>
            </Button>
            <Button variant="primary" size="lg" asChild className="text-base sm:text-lg w-full sm:w-auto px-6 sm:px-10 py-5 sm:py-6 h-auto bg-gradient-to-r from-rose-500 to-pink-600 border-none shadow-[0_0_40px_rgba(244,63,94,0.3)] hover:shadow-[0_0_60px_rgba(244,63,94,0.5)] transition-all">
              <Link href="/auth/login" className="font-bold text-white justify-center">Se connecter</Link>
            </Button>
          </div>

          <p className="mt-6 text-sm text-slate-400 font-medium tracking-wide uppercase">
            Inscrivez-vous gratuitement • Rencontres Sécurisées
          </p>
        </div>
      </section>

      {/* How it works */}
      <section className="py-24 px-4 bg-slate-900/40 relative overflow-hidden">
        {/* Floating background photos for ambiance */}
        <div className="absolute top-10 left-10 w-32 h-32 rounded-3xl overflow-hidden opacity-20 transform -rotate-6 blur-[1px] hidden lg:block">
          <img src="/photos/Cute Black Guy.jpg" alt="Ambiance" className="w-full h-full object-cover" />
        </div>
        <div className="absolute bottom-10 right-10 w-40 h-40 rounded-full overflow-hidden opacity-20 transform rotate-12 blur-[1px] hidden lg:block">
          <img src="/photos/Handsome Man.jpg" alt="Ambiance" className="w-full h-full object-cover" />
        </div>

        <div className="max-w-5xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-black text-white mb-4">Comment ça marche ?</h2>
          </div>
          <div className="grid sm:grid-cols-3 gap-8 relative">
            {/* Connecting line for desktop */}
            <div className="hidden sm:block absolute top-[40px] left-[15%] right-[15%] h-0.5 bg-gradient-to-r from-transparent via-rose-500/30 to-transparent -z-10" />

            {[
              { step: '1', title: 'Créez votre profil', desc: 'Inscrivez-vous gratuitement et remplissez votre profil en quelques minutes.', icon: FileText, img: '/photos/télécharger (9).jpg' },
              { step: '2', title: 'Découvrez des profils', desc: 'Parcourez les profils près de vous et likez ceux qui vous correspondent.', icon: Heart, img: '/photos/télécharger (13).jpg' },
              { step: '3', title: 'Discutez et rencontrez', desc: 'Quand l\'intérêt est réciproque, c\'est un match ! Commencez à échanger.', icon: MessageCircle, img: '/photos/télécharger (15).jpg' },
            ].map(({ step, title, desc, icon: Icon, img }) => (
              <div key={step} className="text-center group relative">
                <div className="relative inline-block mb-6">
                  <div className="h-20 w-20 rounded-3xl bg-slate-900 border border-slate-700/50 flex items-center justify-center text-3xl overflow-hidden group-hover:scale-110 transition-transform shadow-xl z-20 relative">
                    <img src={img} alt={`Étape ${step}`} className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity" />
                    <div className="absolute inset-0 bg-slate-950/40 group-hover:bg-slate-950/20 transition-colors" />
                    <div className="relative z-10 p-4 rounded-2xl bg-slate-900/50 backdrop-blur-sm border border-white/10">
                      <Icon className="h-8 w-8 text-rose-500" />
                    </div>
                  </div>
                  <div className="absolute -inset-2 bg-gradient-to-tr from-rose-500/20 to-pink-500/20 rounded-[2rem] blur-xl -z-10 group-hover:bg-rose-500/40 transition-colors" />
                </div>
                <div className="text-sm font-black text-rose-400 uppercase tracking-widest mb-3">Étape {step}</div>
                <h3 className="text-2xl font-bold text-white mb-3">{title}</h3>
                <p className="text-slate-400 text-base">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 px-4 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-rose-500/5 rounded-full blur-[100px] pointer-events-none" />
        {/* Subtle background collage */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none grid grid-cols-4 grid-rows-2 gap-4 -z-10 transform scale-110">
          <img src="/photos/télécharger (4).jpg" className="w-full h-full object-cover rounded-3xl" alt="" />
          <img src="/photos/télécharger (5).jpg" className="w-full h-full object-cover rounded-3xl" alt="" />
          <img src="/photos/télécharger (6).jpg" className="w-full h-full object-cover rounded-3xl" alt="" />
          <img src="/photos/télécharger (8).jpg" className="w-full h-full object-cover rounded-3xl" alt="" />
        </div>
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-black text-white mb-4">
              Tout ce qu'il vous faut pour rencontrer
            </h2>
            <p className="text-slate-400 text-lg sm:text-xl px-4">
              Des outils pensés pour vous aider à trouver la bonne personne.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((f) => (
              <Card key={f.title} glass hover className={`border ${f.border} bg-slate-900/50 backdrop-blur-xl`}>
                <CardContent className="pt-8 pb-8 px-6">
                  <div className={`h-14 w-14 rounded-2xl ${f.bg} border ${f.border} flex items-center justify-center mb-6`}>
                    <f.icon className={`h-7 w-7 ${f.color}`} />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">{f.title}</h3>
                  <p className="text-slate-400 text-base leading-relaxed">{f.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 px-4 bg-slate-900/40 border-y border-slate-800/50 relative overflow-hidden">
        {/* Subtle photo blur background */}
        <div className="absolute top-0 left-0 w-full h-[300px] bg-[url('/photos/télécharger%20(15).jpg')] bg-cover bg-center opacity-5 blur-3xl pointer-events-none" />
        <div className="max-w-5xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-black text-white mb-4">Ils ont trouvé l'amour</h2>
          </div>
          <div className="grid sm:grid-cols-3 gap-6">
            {[
              { name: "Sophie M.", age: 32, city: "Lomé", text: "J'ai rencontré mon compagnon sur Ecoute et Orientation il y a 8 mois. L'interface est tellement intuitive et les profils sont sérieux !", img: "/photos/télécharger (10).jpg" },
              { name: "Thomas R.", age: 28, city: "Cotonou", text: "Ce que j'apprécie c'est la qualité des membres. On sent que les gens sont vraiment là pour une relation sérieuse.", img: "/photos/Handsome Man.jpg" },
              { name: "Camille L.", age: 35, city: "Abidjan", text: "La sécurité du site m'a donné confiance dès le départ. Je recommande à toutes mes amies célibataires !", img: "/photos/télécharger (11).jpg" }
            ].map((t, i) => (
              <Card key={t.name} glass className="bg-slate-950/60 overflow-hidden relative group">
                {/* Decorative image background on hover */}
                <div className="absolute inset-x-0 top-0 h-24 opacity-20 group-hover:opacity-40 transition-opacity">
                  <img src={t.img} alt="" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent to-slate-950" />
                </div>
                <CardContent className="p-8 relative z-10 pt-12">
                  <div className="flex text-amber-400 mb-6 relative">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className="h-5 w-5 fill-amber-400" />
                    ))}
                  </div>
                  <p className="text-slate-300 text-lg italic leading-relaxed mb-6">"{t.text}"</p>
                  <div className="flex items-center gap-4">
                    <div className="h-14 w-14 rounded-full bg-slate-800 flex items-center justify-center text-lg font-bold text-white shadow-lg shadow-rose-500/20 overflow-hidden border-2 border-slate-700">
                      <img src={t.img} alt={t.name} className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <p className="text-base font-bold text-white">{t.name}</p>
                      <p className="text-sm text-slate-400">{t.age} ans · {t.city}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-24 px-4 relative overflow-hidden">
        {/* Subtle photo ambiance */}
        <div className="absolute top-1/2 right-0 w-[600px] h-[600px] bg-[url('/photos/where_🔍.jpg')] bg-cover bg-center opacity-[0.02] transform -translate-y-1/2 blur-sm pointer-events-none" />

        <div className="max-w-4xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-black text-white mb-4">Choisissez votre offre</h2>
            <p className="text-slate-400 text-lg sm:text-xl px-4">Commencez gratuitement, passez Premium quand vous le souhaitez.</p>
          </div>
          <div className="grid sm:grid-cols-2 gap-8">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`relative rounded-3xl border p-10 ${plan.popular
                  ? 'border-rose-500/50 bg-gradient-to-br from-rose-900/20 to-pink-900/20 shadow-2xl shadow-rose-500/10'
                  : 'border-slate-800 bg-slate-900/80 backdrop-blur-sm'
                  }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <span className="px-5 py-1.5 rounded-full bg-gradient-to-r from-rose-500 to-pink-600 text-white text-sm font-bold shadow-lg">
                      ⭐ Recommandé
                    </span>
                  </div>
                )}
                <div className="mb-8">
                  <div className="flex items-center gap-3 mb-4">
                    {plan.popular ? <Crown className="h-6 w-6 text-amber-400" /> : <Star className="h-6 w-6 text-slate-400" />}
                    <h3 className="text-2xl font-black text-white">{plan.name}</h3>
                  </div>
                  <div className="flex items-baseline gap-1 mb-2">
                    <span className="text-5xl font-black text-white">{plan.price}</span>
                    <span className="text-xl text-slate-400 font-medium">{plan.period}</span>
                  </div>
                  <p className="text-slate-400 text-base">{plan.description}</p>
                </div>
                <ul className="space-y-4 mb-10">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-center gap-3 text-base">
                      <CheckCircle className="h-5 w-5 text-emerald-400 flex-shrink-0" />
                      <span className="text-slate-200 font-medium">{f}</span>
                    </li>
                  ))}
                </ul>
                <Button variant={plan.variant} className="w-full text-base sm:text-lg py-4 sm:py-6 h-auto font-bold" asChild>
                  <Link href={plan.href}>{plan.cta}</Link>
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Infinite Scroll Photo Marquee */}
      <section className="py-16 border-t border-slate-800/50 bg-slate-950 relative overflow-hidden">
        <style dangerouslySetInnerHTML={{
          __html: `
          @keyframes marquee {
            0% { transform: translateX(0); }
            100% { transform: translateX(calc(-50% - 0.5rem)); }
          }
          .animate-marquee {
            animation: marquee 50s linear infinite;
          }
          `
        }} />
        <div className="flex w-max animate-marquee hover:[animation-play-state:paused] gap-4">
          {[...marqueeImages, ...marqueeImages].map((img, i) => (
            <div key={i} className="w-[160px] sm:w-[240px] shrink-0 aspect-[3/4] rounded-2xl overflow-hidden shadow-2xl border border-slate-700/50 hover:border-rose-500/50 transition-colors opacity-90 hover:opacity-100">
              <img src={img} alt="Profil africain" className="w-full h-full object-cover object-top" />
            </div>
          ))}
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 border-y border-slate-800 bg-slate-900 relative">
        <div className="max-w-5xl mx-auto px-4 relative z-10">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 text-center">
            {stats.map(({ value, label }) => (
              <div key={label}>
                <div className="text-4xl font-black text-white mb-2">{value}</div>
                <div className="text-slate-400 text-base font-medium uppercase tracking-wider">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-4 bg-slate-900/20">
        <div className="max-w-3xl mx-auto text-center font-sans tracking-tight">
          <div className="inline-flex p-3 rounded-2xl bg-rose-500/10 border border-rose-500/20 mb-6 group-hover:bg-rose-500/20 transition-colors cursor-pointer">
            <Heart className="h-8 w-8 text-rose-400 fill-rose-400 animate-pulse" />
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-white mb-4 sm:mb-6 leading-tight">
            Prêt(e) à trouver l'amour ?
          </h2>
          <p className="text-slate-400 text-lg sm:text-xl font-medium mb-8 sm:mb-10 px-4">
            Rejoignez des milliers de célibataires sérieux en Afrique. Inscription rapide et gratuite.
          </p>
          <Button size="lg" asChild className="text-sm sm:text-lg w-full sm:w-auto px-6 sm:px-8 py-4 sm:py-5 h-auto shadow-[0_0_30px_rgba(244,63,94,0.3)] hover:shadow-[0_0_50px_rgba(244,63,94,0.5)] transition-shadow">
            <Link href="/auth/register" className="gap-2 font-bold uppercase tracking-wider justify-center">
              Commencer gratuitement
              <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5" />
            </Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800/50 bg-slate-950 py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid sm:grid-cols-4 gap-12 mb-12">
            <div>
              <div className="flex items-center gap-2 sm:gap-3 mb-6">
                <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-xl bg-gradient-to-br from-rose-500 to-pink-600 flex items-center justify-center shadow-lg shadow-rose-500/20">
                  <Heart className="h-4 w-4 sm:h-5 sm:w-5 text-white fill-white" />
                </div>
                <span className="text-lg sm:text-xl font-black text-white tracking-tight">Ecoute et <span className="text-rose-500">Orientation</span></span>
              </div>
              <p className="text-slate-400 text-sm sm:text-base leading-relaxed">Le site de rencontres conçu pour les célibataires sérieux au Togo et en Afrique.</p>
            </div>
            <div>
              <h4 className="font-bold text-white text-lg mb-5 uppercase tracking-wide">Plateforme</h4>
              <ul className="space-y-3 text-base text-slate-400">
                <li><Link href="/auth/register" className="hover:text-rose-400 transition-colors">S'inscrire</Link></li>
                <li><Link href="/auth/login" className="hover:text-rose-400 transition-colors">Se connecter</Link></li>
                <li><Link href="/premium" className="hover:text-rose-400 transition-colors">Premium</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-white text-lg mb-5 uppercase tracking-wide">Légal</h4>
              <ul className="space-y-3 text-base text-slate-400">
                <li><Link href="/legal/privacy" className="hover:text-rose-400 transition-colors">Confidentialité</Link></li>
                <li><Link href="/legal/terms" className="hover:text-rose-400 transition-colors">CGU</Link></li>
                <li><Link href="/legal/cookies" className="hover:text-rose-400 transition-colors">Cookies</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-white text-lg mb-5 uppercase tracking-wide">Sécurité</h4>
              <div className="flex items-start gap-3 p-4 rounded-xl bg-slate-900 border border-slate-800 text-sm text-slate-300">
                <Lock className="h-5 w-5 text-emerald-400 flex-shrink-0" />
                <span>Données chiffrées et protégées selon le RGPD. Confidentialité garantie.</span>
              </div>
            </div>
          </div>
          <div className="border-t border-slate-800/50 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-slate-500 text-sm">© {new Date().getFullYear()} Ecoute et Orientation. Tous droits réservés.</p>
            <p className="text-slate-500 text-sm flex items-center gap-2 font-medium">
              Réservé aux adultes de 18 ans et plus
              <Shield className="h-4 w-4 text-slate-600" />
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
