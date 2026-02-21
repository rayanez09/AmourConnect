import { cn } from '@/lib/utils'

interface BadgeProps {
    children: React.ReactNode
    variant?: 'default' | 'premium' | 'success' | 'warning' | 'danger' | 'outline'
    size?: 'sm' | 'md'
    className?: string
}

export function Badge({ children, variant = 'default', size = 'md', className }: BadgeProps) {
    const variants = {
        default: 'bg-slate-700 text-slate-300',
        premium: 'bg-gradient-to-r from-amber-500 to-yellow-600 text-white',
        success: 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30',
        warning: 'bg-amber-500/20 text-amber-400 border border-amber-500/30',
        danger: 'bg-red-500/20 text-red-400 border border-red-500/30',
        outline: 'border border-rose-500/50 text-rose-400',
    }

    const sizes = {
        sm: 'text-xs px-2 py-0.5 rounded-md',
        md: 'text-xs px-2.5 py-1 rounded-lg',
    }

    return (
        <span className={cn('inline-flex items-center font-medium', variants[variant], sizes[size], className)}>
            {children}
        </span>
    )
}

interface CountBadgeProps {
    count: number
    max?: number
    className?: string
}

export function CountBadge({ count, max = 99, className }: CountBadgeProps) {
    if (count <= 0) return null
    return (
        <span
            className={cn(
                'inline-flex items-center justify-center min-w-[1.25rem] h-5 px-1 rounded-full',
                'bg-rose-500 text-white text-xs font-bold',
                className
            )}
        >
            {count > max ? `${max}+` : count}
        </span>
    )
}
