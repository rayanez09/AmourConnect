'use client'

import * as React from 'react'
import { Moon, Sun } from 'lucide-react'
import { useTheme } from 'next-themes'
import { Button } from '@/components/ui/Button'

export function ThemeToggle({ className }: { className?: string }) {
    const { theme, setTheme } = useTheme()
    const [mounted, setMounted] = React.useState(false)

    // Avoid hydration mismatch
    React.useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted) {
        return (
            <Button variant="ghost" size="sm" className={className} disabled>
                <Sun className="h-5 w-5" />
            </Button>
        )
    }

    return (
        <Button
            variant="ghost"
            size="sm"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className={className}
            title={theme === 'dark' ? 'Passer au mode clair' : 'Passer au mode sombre'}
        >
            {theme === 'dark' ? (
                <Sun className="h-5 w-5 text-amber-400 fill-amber-400" />
            ) : (
                <Moon className="h-5 w-5 text-slate-500 fill-slate-500" />
            )}
            <span className="sr-only">Changer le thème</span>
        </Button>
    )
}
