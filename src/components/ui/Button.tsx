import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cn } from '@/lib/utils'

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'
    size?: 'sm' | 'md' | 'lg' | 'icon'
    isLoading?: boolean
    asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = 'primary', size = 'md', isLoading, children, disabled, asChild = false, ...props }, ref) => {
        const Comp = asChild ? Slot : 'button'

        const base =
            'inline-flex items-center justify-center rounded-xl font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none'

        const variants = {
            primary:
                'bg-gradient-to-r from-rose-500 to-pink-600 text-white hover:from-rose-600 hover:to-pink-700 shadow-lg hover:shadow-rose-500/30 active:scale-[0.98]',
            secondary:
                'bg-slate-800 text-white hover:bg-slate-700 border border-slate-700',
            outline:
                'border-2 border-rose-500 text-rose-500 hover:bg-rose-500 hover:text-white',
            ghost:
                'text-slate-300 hover:bg-slate-800 hover:text-white',
            danger:
                'bg-red-600 text-white hover:bg-red-700 shadow-lg hover:shadow-red-500/30',
        }

        const sizes = {
            sm: 'h-8 px-3 text-sm gap-1.5',
            md: 'h-10 px-4 text-sm gap-2',
            lg: 'h-12 px-6 text-base gap-2',
            icon: 'h-10 w-10 p-0',
        }

        return (
            <Comp
                ref={ref as React.Ref<HTMLButtonElement>}
                className={cn(base, variants[variant], sizes[size], className)}
                disabled={!asChild ? (disabled || isLoading) : undefined}
                {...props}
            >
                {isLoading ? (
                    <>
                        <svg
                            className="animate-spin h-4 w-4"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                        >
                            <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                            />
                            <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                            />
                        </svg>
                        <span>Chargement...</span>
                    </>
                ) : (
                    children
                )}
            </Comp>
        )
    }
)

Button.displayName = 'Button'
export { Button }
