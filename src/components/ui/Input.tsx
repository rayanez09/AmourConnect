import * as React from 'react'
import { cn } from '@/lib/utils'

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string
    error?: string
    hint?: string
    leftIcon?: React.ReactNode
    rightIcon?: React.ReactNode
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
    ({ className, label, error, hint, leftIcon, rightIcon, id, ...props }, ref) => {
        const generatedId = React.useId()
        const inputId = id || `input-${generatedId}`

        return (
            <div className="w-full space-y-1.5">
                {label && (
                    <label
                        htmlFor={inputId}
                        className="block text-sm font-medium text-slate-300"
                    >
                        {label}
                        {props.required && <span className="text-rose-400 ml-1">*</span>}
                    </label>
                )}
                <div className="relative">
                    {leftIcon && (
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                            {leftIcon}
                        </div>
                    )}
                    <input
                        ref={ref}
                        id={inputId}
                        className={cn(
                            'w-full rounded-xl border bg-slate-800/60 px-4 py-2.5 text-sm text-white placeholder:text-slate-500',
                            'transition-all duration-200 outline-none',
                            'border-slate-700 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20',
                            error && 'border-red-500 focus:border-red-500 focus:ring-red-500/20',
                            leftIcon && 'pl-10',
                            rightIcon && 'pr-10',
                            className
                        )}
                        {...props}
                    />
                    {rightIcon && (
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
                            {rightIcon}
                        </div>
                    )}
                </div>
                {error && (
                    <p className="text-xs text-red-400 flex items-center gap-1">
                        <span>⚠</span> {error}
                    </p>
                )}
                {hint && !error && (
                    <p className="text-xs text-slate-500">{hint}</p>
                )}
            </div>
        )
    }
)

Input.displayName = 'Input'
export { Input }

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
    label?: string
    error?: string
    hint?: string
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
    ({ className, label, error, hint, id, ...props }, ref) => {
        const generatedId = React.useId()
        const inputId = id || `textarea-${generatedId}`

        return (
            <div className="w-full space-y-1.5">
                {label && (
                    <label
                        htmlFor={inputId}
                        className="block text-sm font-medium text-slate-300"
                    >
                        {label}
                        {props.required && <span className="text-rose-400 ml-1">*</span>}
                    </label>
                )}
                <textarea
                    ref={ref}
                    id={inputId}
                    className={cn(
                        'w-full rounded-xl border bg-slate-800/60 px-4 py-3 text-sm text-white placeholder:text-slate-500',
                        'transition-all duration-200 outline-none resize-none',
                        'border-slate-700 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20',
                        error && 'border-red-500 focus:border-red-500 focus:ring-red-500/20',
                        className
                    )}
                    {...props}
                />
                {error && (
                    <p className="text-xs text-red-400 flex items-center gap-1">
                        <span>⚠</span> {error}
                    </p>
                )}
                {hint && !error && (
                    <p className="text-xs text-slate-500">{hint}</p>
                )}
            </div>
        )
    }
)

Textarea.displayName = 'Textarea'
