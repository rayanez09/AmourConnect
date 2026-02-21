'use client'

import * as React from 'react'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from './Button'

interface ModalProps {
    isOpen: boolean
    onClose: () => void
    title?: string
    description?: string
    children: React.ReactNode
    size?: 'sm' | 'md' | 'lg' | 'xl'
    className?: string
}

const sizes = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-2xl',
}

export function Modal({
    isOpen,
    onClose,
    title,
    description,
    children,
    size = 'md',
    className,
}: ModalProps) {
    React.useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden'
        } else {
            document.body.style.overflow = ''
        }
        return () => { document.body.style.overflow = '' }
    }, [isOpen])

    React.useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose()
        }
        window.addEventListener('keydown', handleEsc)
        return () => window.removeEventListener('keydown', handleEsc)
    }, [onClose])

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div
                className="absolute inset-0 bg-black/70 backdrop-blur-sm"
                onClick={onClose}
            />
            <div
                className={cn(
                    'relative z-10 w-full rounded-2xl border border-slate-700 bg-slate-900 shadow-2xl',
                    'animate-in zoom-in-95 fade-in duration-200',
                    sizes[size],
                    className
                )}
            >
                {(title || description) && (
                    <div className="flex items-start justify-between p-6 pb-4">
                        <div>
                            {title && (
                                <h2 className="text-xl font-bold text-white">{title}</h2>
                            )}
                            {description && (
                                <p className="text-sm text-slate-400 mt-1">{description}</p>
                            )}
                        </div>
                        <button
                            onClick={onClose}
                            className="text-slate-400 hover:text-white transition-colors ml-4"
                        >
                            <X className="h-5 w-5" />
                        </button>
                    </div>
                )}
                <div className="p-6 pt-0">{children}</div>
            </div>
        </div>
    )
}

interface ConfirmModalProps {
    isOpen: boolean
    onClose: () => void
    onConfirm: () => void
    title: string
    message: string
    confirmLabel?: string
    cancelLabel?: string
    variant?: 'danger' | 'primary'
    isLoading?: boolean
}

export function ConfirmModal({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
    confirmLabel = 'Confirmer',
    cancelLabel = 'Annuler',
    variant = 'danger',
    isLoading,
}: ConfirmModalProps) {
    return (
        <Modal isOpen={isOpen} onClose={onClose} title={title} size="sm">
            <p className="text-slate-300 mb-6">{message}</p>
            <div className="flex gap-3 justify-end">
                <Button variant="ghost" onClick={onClose} disabled={isLoading}>
                    {cancelLabel}
                </Button>
                <Button variant={variant} onClick={onConfirm} isLoading={isLoading}>
                    {confirmLabel}
                </Button>
            </div>
        </Modal>
    )
}
