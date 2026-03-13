import { AppNavbar } from '@/components/layout/AppNavbar'
import { AppInitializer } from '@/components/layout/AppInitializer'

export default function AppLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-screen bg-slate-950">
            <AppInitializer />
            <AppNavbar />
            {/* Desktop: offset for sidebar */}
            <main className="lg:pl-64 pb-20 lg:pb-0 min-h-screen">
                {children}
            </main>
        </div>
    )
}
