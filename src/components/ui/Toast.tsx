'use client'

import * as React from 'react'
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react'
import { cn } from '@/lib/utils'

type ToastType = 'success' | 'error' | 'info' | 'warning'

interface Toast {
    id: string
    type: ToastType
    title: string
    message?: string
}

interface ToastContextValue {
    addToast: (toast: Omit<Toast, 'id'>) => void
    success: (title: string, message?: string) => void
    error: (title: string, message?: string) => void
    info: (title: string, message?: string) => void
    warning: (title: string, message?: string) => void
}

const ToastContext = React.createContext<ToastContextValue | null>(null)

const icons: Record<ToastType, React.ReactNode> = {
    success: <CheckCircle className="h-5 w-5 text-emerald-400" />,
    error: <AlertCircle className="h-5 w-5 text-red-400" />,
    info: <Info className="h-5 w-5 text-blue-400" />,
    warning: <AlertTriangle className="h-5 w-5 text-amber-400" />,
}

const borderColors: Record<ToastType, string> = {
    success: 'border-l-emerald-400',
    error: 'border-l-red-400',
    info: 'border-l-blue-400',
    warning: 'border-l-amber-400',
}

function ToastItem({ toast, onRemove }: { toast: Toast; onRemove: (id: string) => void }) {
    React.useEffect(() => {
        const timer = setTimeout(() => onRemove(toast.id), 4500)
        return () => clearTimeout(timer)
    }, [toast.id, onRemove])

    return (
        <div
            className={cn(
                'flex items-start gap-3 rounded-xl border border-slate-700 border-l-4 bg-slate-900 p-4',
                'shadow-2xl shadow-black/50 animate-in slide-in-from-right-full fade-in duration-300',
                'max-w-sm w-full',
                borderColors[toast.type]
            )}
        >
            <div className="flex-shrink-0 pt-0.5">{icons[toast.type]}</div>
            <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-white">{toast.title}</p>
                {toast.message && (
                    <p className="text-sm text-slate-400 mt-0.5">{toast.message}</p>
                )}
            </div>
            <button
                onClick={() => onRemove(toast.id)}
                className="flex-shrink-0 text-slate-500 hover:text-white transition-colors"
            >
                <X className="h-4 w-4" />
            </button>
        </div>
    )
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
    const [toasts, setToasts] = React.useState<Toast[]>([])

    const addToast = React.useCallback((toast: Omit<Toast, 'id'>) => {
        const id = Math.random().toString(36).slice(2, 9)
        setToasts((prev) => [...prev.slice(-4), { ...toast, id }])
    }, [])

    const removeToast = React.useCallback((id: string) => {
        setToasts((prev) => prev.filter((t) => t.id !== id))
    }, [])

    const success = React.useCallback(
        (title: string, message?: string) => addToast({ type: 'success', title, message }),
        [addToast]
    )
    const error = React.useCallback(
        (title: string, message?: string) => addToast({ type: 'error', title, message }),
        [addToast]
    )
    const info = React.useCallback(
        (title: string, message?: string) => addToast({ type: 'info', title, message }),
        [addToast]
    )
    const warning = React.useCallback(
        (title: string, message?: string) => addToast({ type: 'warning', title, message }),
        [addToast]
    )

    return (
        <ToastContext.Provider value={{ addToast, success, error, info, warning }}>
            {children}
            <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2 pointer-events-none">
                {toasts.map((toast) => (
                    <div key={toast.id} className="pointer-events-auto">
                        <ToastItem toast={toast} onRemove={removeToast} />
                    </div>
                ))}
            </div>
        </ToastContext.Provider>
    )
}

export function useToast() {
    const ctx = React.useContext(ToastContext)
    if (!ctx) throw new Error('useToast must be used within ToastProvider')
    return ctx
}
