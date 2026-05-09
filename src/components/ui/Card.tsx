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
                    ? 'bg-white/70 dark:bg-slate-900/40 backdrop-blur-md border-white/20 dark:border-slate-800/50 shadow-sm'
                    : 'bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800 shadow-sm',
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
        <h3 className={cn('text-xl font-bold text-slate-900', className)} {...props}>
            {children}
        </h3>
    )
}

export function CardDescription({ className, children, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
    return (
        <p className={cn('text-sm text-slate-500', className)} {...props}>
            {children}
        </p>
    )
}
