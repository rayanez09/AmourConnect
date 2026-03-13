'use client'

import { useState, useCallback, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { Search, SlidersHorizontal, X, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { ProfileCard } from '@/components/profile/ProfileCard'
import { ProfileCardSkeleton, EmptyState } from '@/components/ui/Skeleton'
import { searchProfiles } from '@/services/profiles'
import { sendLike } from '@/services/likes'
import { useAuthStore } from '@/store'
import { useToast } from '@/components/ui/Toast'
import { useDebounce } from '@/hooks/useUtils'
import { cn } from '@/lib/utils'
import type { Profile, SearchFilters } from '@/types'

const GENDER_OPTIONS = [
    { value: '', label: 'Tous' },
    { value: 'homme', label: 'Hommes' },
    { value: 'femme', label: 'Femmes' },
    { value: 'autre', label: 'Autre' },
]

export default function SearchPage() {
    const { profile: currentProfile, isLoading: authLoading } = useAuthStore()
    const { success, error, info } = useToast()
    const router = useRouter()

    const [profiles, setProfiles] = useState<Profile[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [total, setTotal] = useState(0)
    const [page, setPage] = useState(1)
    const [hasMore, setHasMore] = useState(false)
    const [showFilters, setShowFilters] = useState(false)
    const [likedIds, setLikedIds] = useState<Set<string>>(new Set())

    // Filters
    const [filters, setFilters] = useState<SearchFilters>({})
    const [cityInput, setCityInput] = useState('')
    const [genderFilter, setGenderFilter] = useState('')
    const [minAge, setMinAge] = useState('')
    const [maxAge, setMaxAge] = useState('')

    const debouncedCity = useDebounce(cityInput, 600)

    const doSearch = useCallback(
        async (pageNum = 1, reset = false) => {
            if (!currentProfile) return
            setIsLoading(true)

            try {
                const activeFilters: SearchFilters = {
                    ...(genderFilter && { gender: genderFilter as any }),
                    ...(minAge && { min_age: parseInt(minAge) }),
                    ...(maxAge && { max_age: parseInt(maxAge) }),
                    ...(debouncedCity && { city: debouncedCity }),
                }

                const result = await searchProfiles(currentProfile.user_id, activeFilters, pageNum)

                if (reset || pageNum === 1) {
                    setProfiles(result.data)
                } else {
                    setProfiles((prev) => [...prev, ...result.data])
                }

                setTotal(result.count)
                setHasMore(pageNum < result.total_pages)
                setPage(pageNum)
            } catch (err) {
                console.error('Search error:', err)
                error('Erreur', 'Impossible de charger les résultats')
            } finally {
                setIsLoading(false)
            }
        },
        [currentProfile, genderFilter, minAge, maxAge, debouncedCity]
    )

    useEffect(() => {
        if (authLoading) return

        if (!currentProfile) {
            router.push('/profile/setup')
            return
        }

        doSearch(1, true)
    }, [currentProfile, authLoading, doSearch, router])

    const handleLike = async (profileId: string) => {
        if (!currentProfile) return
        const { matched, error: err } = await sendLike(currentProfile.id, profileId)

        if (err) {
            error('Erreur', err)
            return
        }

        setLikedIds((prev) => new Set([...prev, profileId]))
        if (matched) {
            success('🎉 Nouveau match !', "Vous pouvez maintenant vous envoyer des messages !")
        } else {
            info('❤️ Like envoyé', 'Si la personne vous like aussi, c\'est un match !')
        }
    }

    const handleDislike = (profileId: string) => {
        setProfiles((prev) => prev.filter((p) => p.id !== profileId))
    }

    const clearFilters = () => {
        setGenderFilter('')
        setMinAge('')
        setMaxAge('')
        setCityInput('')
    }

    const hasActiveFilters = genderFilter || minAge || maxAge || cityInput

    return (
        <main className="max-w-6xl mx-auto px-4 py-8 space-y-8 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-white">Découvrir</h1>
                    <p className="text-slate-400 text-sm mt-0.5">
                        {isLoading || authLoading ? 'Recherche...' : `${total} profil${total !== 1 ? 's' : ''} trouvé${total !== 1 ? 's' : ''}`}
                    </p>
                </div>
                <div className="flex gap-2">
                    <Button
                        variant={hasActiveFilters ? 'primary' : 'secondary'}
                        size="sm"
                        onClick={() => setShowFilters(!showFilters)}
                        className="gap-2"
                    >
                        <SlidersHorizontal className="h-4 w-4" />
                        Filtres
                        {hasActiveFilters && (
                            <span className="h-5 w-5 rounded-full bg-white/20 text-xs flex items-center justify-center">
                                {[genderFilter, minAge, maxAge, cityInput].filter(Boolean).length}
                            </span>
                        )}
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => doSearch(1, true)}>
                        <RefreshCw className="h-4 w-4" />
                    </Button>
                </div>
            </div>

            {/* Filters panel */}
            {showFilters && (
                <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5 mb-6 animate-in fade-in duration-200">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="font-semibold text-white">Filtrer les résultats</h2>
                        {hasActiveFilters && (
                            <button
                                onClick={clearFilters}
                                className="flex items-center gap-1 text-sm text-rose-400 hover:text-rose-300"
                            >
                                <X className="h-3 w-3" /> Effacer
                            </button>
                        )}
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        {/* Gender */}
                        <div className="space-y-1.5">
                            <label className="text-sm font-medium text-slate-300">Genre</label>
                            <select
                                value={genderFilter}
                                onChange={(e) => setGenderFilter(e.target.value)}
                                className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3 py-2.5 text-sm text-white focus:border-rose-500 focus:outline-none"
                            >
                                {GENDER_OPTIONS.map((opt) => (
                                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                                ))}
                            </select>
                        </div>
                        {/* Min age */}
                        <div className="space-y-1.5">
                            <label className="text-sm font-medium text-slate-300">Âge min</label>
                            <input
                                type="number"
                                value={minAge}
                                onChange={(e) => setMinAge(e.target.value)}
                                placeholder="18"
                                min={18}
                                max={99}
                                className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3 py-2.5 text-sm text-white focus:border-rose-500 focus:outline-none"
                            />
                        </div>
                        {/* Max age */}
                        <div className="space-y-1.5">
                            <label className="text-sm font-medium text-slate-300">Âge max</label>
                            <input
                                type="number"
                                value={maxAge}
                                onChange={(e) => setMaxAge(e.target.value)}
                                placeholder="99"
                                min={18}
                                max={99}
                                className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3 py-2.5 text-sm text-white focus:border-rose-500 focus:outline-none"
                            />
                        </div>
                        {/* City */}
                        <div className="space-y-1.5">
                            <label className="text-sm font-medium text-slate-300">Ville</label>
                            <input
                                type="text"
                                value={cityInput}
                                onChange={(e) => setCityInput(e.target.value)}
                                placeholder="Paris, Lyon..."
                                className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3 py-2.5 text-sm text-white focus:border-rose-500 focus:outline-none"
                            />
                        </div>
                    </div>
                </div>
            )}

            {/* Results */}
            {(isLoading || authLoading) && profiles.length === 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {Array.from({ length: 8 }).map((_, i) => (
                        <ProfileCardSkeleton key={i} />
                    ))}
                </div>
            ) : profiles.length === 0 ? (
                <EmptyState
                    emoji="🔍"
                    title="Aucun profil trouvé"
                    description="Essayez de modifier vos filtres pour voir plus de résultats."
                    action={
                        <Button variant="outline" onClick={clearFilters}>
                            Réinitialiser les filtres
                        </Button>
                    }
                />
            ) : (
                <>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                        {profiles.map((profile) => (
                            <ProfileCard
                                key={profile.id}
                                profile={profile}
                                currentUserId={currentProfile?.user_id}
                                onLike={handleLike}
                                onDislike={handleDislike}
                                isLiked={likedIds.has(profile.id)}
                            />
                        ))}
                    </div>

                    {hasMore && (
                        <div className="flex justify-center mt-8">
                            <Button
                                variant="secondary"
                                onClick={() => doSearch(page + 1)}
                                isLoading={isLoading}
                                className="gap-2"
                            >
                                Charger plus de profils
                            </Button>
                        </div>
                    )}
                </>
            )}
        </main>
    )
}
