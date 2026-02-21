import { cn } from '@/lib/utils'

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> { }

export function Skeleton({ className, ...props }: SkeletonProps) {
    return (
        <div
            className={cn('animate-pulse rounded-xl bg-slate-800', className)}
            {...props}
        />
    )
}

export function ProfileCardSkeleton() {
    return (
        <div className="rounded-2xl border border-slate-800 bg-slate-900 overflow-hidden">
            <Skeleton className="h-48 w-full rounded-none" />
            <div className="p-4 space-y-3">
                <Skeleton className="h-5 w-2/3" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <div className="flex gap-2 pt-2">
                    <Skeleton className="h-9 flex-1" />
                    <Skeleton className="h-9 w-9" />
                </div>
            </div>
        </div>
    )
}

export function MessageSkeleton() {
    return (
        <div className="flex gap-3 px-4 py-2">
            <Skeleton className="h-9 w-9 rounded-full flex-shrink-0" />
            <div className="space-y-2 flex-1">
                <Skeleton className="h-4 w-1/4" />
                <Skeleton className="h-10 w-2/3 rounded-2xl" />
            </div>
        </div>
    )
}

export function MatchCardSkeleton() {
    return (
        <div className="flex items-center gap-3 p-4 rounded-xl border border-slate-800">
            <Skeleton className="h-12 w-12 rounded-full flex-shrink-0" />
            <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-1/3" />
                <Skeleton className="h-3 w-2/3" />
            </div>
            <Skeleton className="h-5 w-5 rounded-full" />
        </div>
    )
}

export function PageLoader() {
    return (
        <div className="min-h-screen bg-slate-950 flex items-center justify-center">
            <div className="flex flex-col items-center gap-4">
                <div className="relative">
                    <div className="h-16 w-16 rounded-full border-4 border-slate-800 border-t-rose-500 animate-spin" />
                    <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-2xl">💕</span>
                    </div>
                </div>
                <p className="text-slate-400 text-sm font-medium">Chargement...</p>
            </div>
        </div>
    )
}

export function EmptyState({
    emoji = '🔍',
    title,
    description,
    action,
}: {
    emoji?: string
    title: string
    description?: string
    action?: React.ReactNode
}) {
    return (
        <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
            <div className="text-6xl mb-4">{emoji}</div>
            <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
            {description && <p className="text-slate-400 mb-6 max-w-sm">{description}</p>}
            {action}
        </div>
    )
}
