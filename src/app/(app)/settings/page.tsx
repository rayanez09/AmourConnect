import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Settings as SettingsIcon, Shield, Bell, User, Lock, Heart, LogOut } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/Card'

export const metadata = { title: 'Paramètres' }

export default async function SettingsPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect('/auth/login')
    }

    return (
        <div className="max-w-3xl mx-auto px-4 py-8">
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                    <SettingsIcon className="h-6 w-6 text-rose-500" />
                    Paramètres
                </h1>
                <p className="text-slate-400 mt-1">Gérez vos préférences et paramètres de compte.</p>
            </div>

            <div className="space-y-4">
                {/* Account Section */}
                <Card className="bg-slate-900 border-slate-800">
                    <CardContent className="p-0">
                        <Link href="/profile/setup" className="flex items-center justify-between p-4 hover:bg-slate-800/50 transition-colors border-b border-slate-800">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-slate-800 rounded-lg"><User className="h-5 w-5 text-slate-300" /></div>
                                <div>
                                    <h3 className="text-white font-medium">Modifier le profil</h3>
                                    <p className="text-sm text-slate-400">Modifier vos photos, description et infos</p>
                                </div>
                            </div>
                        </Link>

                        <div className="flex items-center justify-between p-4 hover:bg-slate-800/50 transition-colors border-b border-slate-800 cursor-pointer">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-slate-800 rounded-lg"><Lock className="h-5 w-5 text-slate-300" /></div>
                                <div>
                                    <h3 className="text-white font-medium">Mot de passe & Sécurité</h3>
                                    <p className="text-sm text-slate-400">Changer de mot de passe, adresse e-mail</p>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center justify-between p-4 hover:bg-slate-800/50 transition-colors cursor-pointer">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-slate-800 rounded-lg"><Bell className="h-5 w-5 text-slate-300" /></div>
                                <div>
                                    <h3 className="text-white font-medium">Notifications</h3>
                                    <p className="text-sm text-slate-400">Alertes par email et sur mobile</p>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <h2 className="text-lg font-bold text-white mt-8 mb-4">Abonnement & Légal</h2>

                <Card className="bg-slate-900 border-slate-800">
                    <CardContent className="p-0">
                        <Link href="/premium" className="flex items-center justify-between p-4 hover:bg-slate-800/50 transition-colors border-b border-slate-800">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-amber-500/10 rounded-lg"><Heart className="h-5 w-5 text-amber-500" /></div>
                                <div>
                                    <h3 className="text-white font-medium">AmourConnect Premium</h3>
                                    <p className="text-sm text-slate-400">Gérer votre abonnement exclusif</p>
                                </div>
                            </div>
                        </Link>

                        <div className="flex items-center justify-between p-4 hover:bg-slate-800/50 transition-colors cursor-pointer">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-slate-800 rounded-lg"><Shield className="h-5 w-5 text-slate-300" /></div>
                                <div>
                                    <h3 className="text-white font-medium">Confidentialité</h3>
                                    <p className="text-sm text-slate-400">Bloquer des utilisateurs et gérer votre visibilité</p>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Log Out Box */}
                <div className="pt-8">
                    <p className="text-sm text-slate-500 text-center mb-4">Version 0.1.0 — AmourConnect</p>
                </div>
            </div>
        </div>
    )
}
