'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Flag, ShieldAlert } from 'lucide-react'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import { Textarea } from '@/components/ui/Input'
import { reportSchema, type ReportInput } from '@/lib/validations'
import { reportUser, blockUser } from '@/services/moderation'
import { useToast } from '@/components/ui/Toast'
import { cn } from '@/lib/utils'

const REASONS = [
    { value: 'spam', label: '🚫 Spam', description: 'Messages non désirés ou publicité' },
    { value: 'fake_profile', label: '👤 Faux profil', description: 'Profil trompeur ou non authentique' },
    { value: 'harassment', label: '😡 Harcèlement', description: 'Comportement abusif ou intimidation' },
    { value: 'inappropriate_content', label: '🔞 Contenu inapproprié', description: 'Photos ou messages inappropriés' },
    { value: 'other', label: '⚠️ Autre', description: 'Autre raison non listée' },
] as const

interface ReportModalProps {
    isOpen: boolean
    onClose: () => void
    reporterId: string
    reportedId: string
    reportedName?: string
}

export function ReportModal({
    isOpen,
    onClose,
    reporterId,
    reportedId,
    reportedName,
}: ReportModalProps) {
    const [step, setStep] = useState<1 | 2>(1)
    const [isBlocking, setIsBlocking] = useState(false)
    const { success, error } = useToast()

    const {
        register,
        handleSubmit,
        watch,
        setValue,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<ReportInput>({
        resolver: zodResolver(reportSchema),
    })

    const selectedReason = watch('reason')

    const onSubmit = async (data: ReportInput) => {
        const { error: err } = await reportUser({
            reporter_id: reporterId,
            reported_id: reportedId,
            reason: data.reason,
            description: data.description,
        })

        if (err) {
            error('Erreur', 'Impossible d\'envoyer le signalement')
            return
        }

        if (isBlocking) {
            await blockUser(reporterId, reportedId)
        }

        success('Signalement envoyé', 'Notre équipe examinera votre signalement.')
        reset()
        setStep(1)
        onClose()
    }

    const handleClose = () => {
        reset()
        setStep(1)
        onClose()
    }

    return (
        <Modal
            isOpen={isOpen}
            onClose={handleClose}
            title={step === 1 ? "Confirmation" : "Signaler un profil"}
            description={step === 1 ? undefined : (reportedName ? `Signaler ${reportedName}` : undefined)}
            size="md"
        >
            {step === 1 ? (
                <div className="space-y-6 pt-2">
                    <p className="text-slate-300 text-center text-lg">
                        Voulez-vous vraiment signaler <strong>{reportedName || 'cet utilisateur'}</strong> ?
                    </p>
                    <div className="flex gap-4 justify-center pt-4">
                        <Button variant="ghost" onClick={handleClose} className="w-32">
                            Non
                        </Button>
                        <Button variant="danger" onClick={() => setStep(2)} className="w-32 gap-2">
                            <ShieldAlert className="h-4 w-4" />
                            Oui
                        </Button>
                    </div>
                </div>
            ) : (
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div className="space-y-2">
                        <p className="text-sm font-medium text-slate-300">Motif du signalement *</p>
                        <div className="space-y-2">
                            {REASONS.map((reason) => (
                                <button
                                    key={reason.value}
                                    type="button"
                                    onClick={() => setValue('reason', reason.value, { shouldValidate: true })}
                                    className={cn(
                                        'w-full text-left p-3 rounded-xl border transition-all duration-200',
                                        selectedReason === reason.value
                                            ? 'border-rose-500 bg-rose-500/10 text-white'
                                            : 'border-slate-700 bg-slate-800/50 text-slate-300 hover:border-slate-600'
                                    )}
                                >
                                    <div className="font-medium text-sm">{reason.label}</div>
                                    <div className="text-xs text-slate-400 mt-0.5">{reason.description}</div>
                                </button>
                            ))}
                        </div>
                        {errors.reason && (
                            <p className="text-xs text-red-400">⚠ {errors.reason.message}</p>
                        )}
                    </div>

                    <Textarea
                        label="Description (optionnel)"
                        placeholder="Décrivez le problème en détail..."
                        rows={3}
                        {...register('description')}
                        error={errors.description?.message}
                    />

                    <div className="flex items-center gap-3 p-3 rounded-xl bg-red-500/5 border border-red-500/20">
                        <input
                            type="checkbox"
                            id="block-user"
                            checked={isBlocking}
                            onChange={(e) => setIsBlocking(e.target.checked)}
                            className="h-4 w-4 accent-rose-500"
                        />
                        <label htmlFor="block-user" className="text-sm text-slate-300">
                            Bloquer également cet utilisateur
                        </label>
                    </div>

                    <div className="flex gap-3 pt-2">
                        <Button variant="ghost" type="button" onClick={() => setStep(1)} className="flex-1">
                            Retour
                        </Button>
                        <Button
                            variant="danger"
                            type="submit"
                            isLoading={isSubmitting}
                            className="flex-1 gap-2"
                        >
                            <Flag className="h-4 w-4" />
                            Signaler définitivement
                        </Button>
                    </div>
                </form>
            )}
        </Modal>
    )
}
