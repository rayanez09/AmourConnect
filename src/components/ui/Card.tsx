import * as React from 'react'
import { cn } from '@/lib/utils'

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
    glass?: boolean
    hover?: boolean
}

export function Card({ className, glass, hover, children, ...props }: CardProps) {
    return (
        <div
            className={cn(
                'rounded-2xl border',
                glass
                    ? 'bg-white/5 backdrop-blur-sm border-white/10'
                    : 'bg-slate-900 border-slate-800',
                hover && 'transition-all duration-300 hover:border-rose-500/50 hover:shadow-lg hover:shadow-rose-500/10 cursor-pointer',
                className
            )}
            {...props}
        >
            {children}
        </div>
    )
}

export function CardHeader({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
    return (
        <div className={cn('p-6 pb-0', className)} {...props}>
            {children}
        </div>
    )
}

export function CardContent({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
    return (
        <div className={cn('p-6', className)} {...props}>
            {children}
        </div>
    )
}

export function CardFooter({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
    return (
        <div className={cn('px-6 pb-6 pt-0', className)} {...props}>
            {children}
        </div>
    )
}

export function CardTitle({ className, children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
    return (
        <h3 className={cn('text-xl font-bold text-white', className)} {...props}>
            {children}
        </h3>
    )
}

export function CardDescription({ className, children, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
    return (
        <p className={cn('text-sm text-slate-400', className)} {...props}>
            {children}
        </p>
    )
}
