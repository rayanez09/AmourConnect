'use client'

import * as React from 'react'
import Image from 'next/image'
import { cn, getInitials, getAvatarFallbackUrl } from '@/lib/utils'

interface AvatarProps {
    src?: string | null
    alt?: string
    name?: string | null
    size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl'
    className?: string
    online?: boolean
    premium?: boolean
}

const sizeMap = {
    xs: { container: 'h-7 w-7', text: 'text-xs', indicator: 'h-2 w-2' },
    sm: { container: 'h-9 w-9', text: 'text-xs', indicator: 'h-2.5 w-2.5' },
    md: { container: 'h-12 w-12', text: 'text-sm', indicator: 'h-3 w-3' },
    lg: { container: 'h-16 w-16', text: 'text-base', indicator: 'h-3.5 w-3.5' },
    xl: { container: 'h-24 w-24', text: 'text-xl', indicator: 'h-4 w-4' },
    '2xl': { container: 'h-32 w-32', text: 'text-3xl', indicator: 'h-5 w-5' },
}

export function Avatar({
    src,
    alt,
    name,
    size = 'md',
    className,
    online,
    premium,
}: AvatarProps) {
    const [imgError, setImgError] = React.useState(false)
    const s = sizeMap[size]
    const fallbackUrl = getAvatarFallbackUrl(name)

    const showImage = src && !imgError

    return (
        <div className={cn('relative flex-shrink-0', className)}>
            <div
                className={cn(
                    s.container,
                    'rounded-full overflow-hidden ring-2',
                    premium ? 'ring-amber-400' : 'ring-slate-700',
                    'bg-slate-800'
                )}
            >
                {showImage ? (
                    <img
                        src={src as string}
                        alt={alt || name || 'Avatar'}
                        className="h-full w-full object-cover"
                        onError={() => setImgError(true)}
                    />
                ) : (
                    <div className="h-full w-full flex items-center justify-center bg-gradient-to-br from-rose-500 to-pink-600">
                        <span className={cn(s.text, 'font-bold text-white')}>
                            {getInitials(name)}
                        </span>
                    </div>
                )}
            </div>

            {online !== undefined && (
                <span
                    className={cn(
                        'absolute bottom-0 right-0 rounded-full border-2 border-slate-900',
                        s.indicator,
                        online ? 'bg-emerald-400' : 'bg-slate-500'
                    )}
                />
            )}

            {premium && (
                <span className="absolute -top-1 -right-1 text-xs">👑</span>
            )}
        </div>
    )
}
