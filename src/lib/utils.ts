import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

export function formatDate(date: string | Date): string {
    const d = new Date(date)
    return new Intl.DateTimeFormat('fr-FR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    }).format(d)
}

export function formatRelativeTime(date: string | Date): string {
    const d = new Date(date)
    const now = new Date()
    const diffMs = now.getTime() - d.getTime()
    const diffSec = Math.floor(diffMs / 1000)
    const diffMin = Math.floor(diffSec / 60)
    const diffHour = Math.floor(diffMin / 60)
    const diffDay = Math.floor(diffHour / 24)

    if (diffSec < 60) return "À l'instant"
    if (diffMin < 60) return `Il y a ${diffMin} min`
    if (diffHour < 24) return `Il y a ${diffHour}h`
    if (diffDay < 7) return `Il y a ${diffDay}j`
    return formatDate(d)
}

export function calculateAge(birthdate: string | Date): number {
    const birth = new Date(birthdate)
    const today = new Date()
    let age = today.getFullYear() - birth.getFullYear()
    const m = today.getMonth() - birth.getMonth()
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--
    return age
}

export function getInitials(name: string | null | undefined): string {
    if (!name) return '?'
    return name
        .split(' ')
        .map((part) => part.charAt(0).toUpperCase())
        .slice(0, 2)
        .join('')
}

export function getAvatarFallbackUrl(name: string | null | undefined, size = 150): string {
    const n = name || 'User'
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(n)}&size=${size}&background=e11d48&color=fff&bold=true`
}

export function truncate(str: string, maxLength: number): string {
    if (str.length <= maxLength) return str
    return str.slice(0, maxLength) + '...'
}

export function slugify(str: string): string {
    return str
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '')
}

export function calculateDistance(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
): number {
    const R = 6371
    const dLat = toRad(lat2 - lat1)
    const dLon = toRad(lon2 - lon1)
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(toRad(lat1)) *
        Math.cos(toRad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    return Math.round(R * c)
}

function toRad(deg: number): number {
    return (deg * Math.PI) / 180
}

export function formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

export const GENDER_LABELS: Record<string, string> = {
    homme: 'Homme',
    femme: 'Femme',
    autre: 'Autre',
}

export const LOOKING_FOR_LABELS: Record<string, string> = {
    homme: 'Des hommes',
    femme: 'Des femmes',
    'les deux': 'Les deux',
}
