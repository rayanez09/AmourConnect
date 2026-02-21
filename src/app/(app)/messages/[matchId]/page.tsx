// @ts-nocheck
'use client'

import { useEffect, useRef, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowLeft, Send, MapPin, MoreVertical, Flag, Ban, Clock } from 'lucide-react'
import { useRealtimeMessages } from '@/hooks/useRealtimeMessages'
import { sendMessage } from '@/services/messages'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/Button'
import { Avatar } from '@/components/ui/Avatar'
import { ReportModal } from '@/components/moderation/ReportModal'
import { ConfirmModal } from '@/components/ui/Modal'
import { blockUser, unblockUser, getBlockStatus } from '@/services/moderation'
import { useToast } from '@/components/ui/Toast'
import { useAuthStore, useNotificationStore } from '@/store'
import { formatRelativeTime } from '@/lib/utils'
import type { Profile } from '@/types'

export default function ConversationPage() {
    const { matchId } = useParams<{ matchId: string }>()
    const router = useRouter()
    const { profile: currentProfile } = useAuthStore()
    const { clearUnreadForMatch } = useNotificationStore()
    const { success, error } = useToast()

    const [otherProfile, setOtherProfile] = useState<Profile | null>(null)
    const [content, setContent] = useState('')
    const [isSending, setIsSending] = useState(false)
    const [showOptions, setShowOptions] = useState(false)
    const [showReport, setShowReport] = useState(false)
    const [showBlockConfirm, setShowBlockConfirm] = useState(false)

    // Block states
    const [blockStatus, setBlockStatus] = useState({
        isBlockedByMe: false,
        isBlockedByThem: false,
    })

    const messagesEndRef = useRef<HTMLDivElement>(null)
    const inputRef = useRef<HTMLTextAreaElement>(null)

    // Immediately clear unread badge when entering the conversation
    useEffect(() => {
        if (matchId) clearUnreadForMatch(matchId)
    }, [matchId, clearUnreadForMatch])

    const { messages, isLoading } = useRealtimeMessages(
        matchId,
        currentProfile?.user_id ?? ''
    )

    // Fetch the other user's profile
    useEffect(() => {
        if (!currentProfile || !matchId) return
        const supabase = createClient()

        supabase
            .from('matches' as any)
            .select('user1_id, user2_id')
            .eq('id', matchId)
            .maybeSingle()
            .then(async ({ data }: { data: any }) => {
                if (!data) return router.push('/matches')
                const myProfileId = currentProfile.id
                const otherId = data.user1_id === myProfileId ? data.user2_id : data.user1_id

                // Fetch profile
                const { data: profileData } = await supabase
                    .from('profiles')
                    .select('*')
                    .eq('id', otherId)
                    .single()

                if (profileData) {
                    setOtherProfile(profileData as Profile)

                    // Fetch block status (needs logic with user_id)
                    const status = await getBlockStatus(currentProfile.user_id, profileData.user_id)
                    setBlockStatus(status)
                }
            })
    }, [matchId, currentProfile, router])

    // Auto-scroll to latest message
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [messages])

    const handleSend = async () => {
        if (!content.trim() || !currentProfile || isSending) return
        const text = content.trim()
        setContent('')
        setIsSending(true)
        const { error: err } = await sendMessage(matchId, currentProfile.user_id, text)
        if (err) error('Erreur', 'Message non envoyé')
        setIsSending(false)
        inputRef.current?.focus()
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            handleSend()
        }
    }

    const handleBlock = async () => {
        if (!currentProfile || !otherProfile) return
        await blockUser(currentProfile.user_id, otherProfile.user_id)
        success('Utilisateur bloqué', 'Cet utilisateur ne peut plus vous contacter.')
        setShowBlockConfirm(false)
        setBlockStatus(prev => ({ ...prev, isBlockedByMe: true }))
    }

    const handleUnblock = async () => {
        if (!currentProfile || !otherProfile) return
        await unblockUser(currentProfile.user_id, otherProfile.user_id)
        success('Utilisateur débloqué', 'Vous pouvez à nouveau discuter.')
        setBlockStatus(prev => ({ ...prev, isBlockedByMe: false }))
    }

    return (
        <div className="flex flex-col h-[100dvh] lg:h-screen bg-slate-950">

            {/* ── Header ────────────────────────────────────────────────────── */}
            <div className="flex items-center gap-3 px-4 py-3 border-b border-slate-800 bg-slate-900 flex-shrink-0">
                <button
                    onClick={() => router.push('/matches')}
                    className="text-slate-400 hover:text-white transition-colors lg:hidden"
                >
                    <ArrowLeft className="h-5 w-5" />
                </button>
                <Link href={`/profile/${otherProfile?.id}`} className="flex items-center gap-3 flex-1 min-w-0">
                    <Avatar
                        src={otherProfile?.avatar_url}
                        name={otherProfile?.full_name}
                        size="md"
                        premium={otherProfile?.is_premium}
                    />
                    <div className="min-w-0">
                        <p className="font-semibold text-white truncate">{otherProfile?.full_name}</p>
                        <p className="text-xs text-slate-400 flex items-center gap-1 truncate">
                            <MapPin className="h-3 w-3" />
                            {otherProfile?.city || 'Localisation inconnue'}
                        </p>
                    </div>
                </Link>

                {/* Options menu */}
                <div className="relative flex-shrink-0">
                    <button
                        onClick={() => setShowOptions(!showOptions)}
                        className="text-slate-400 hover:text-white transition-colors p-1"
                    >
                        <MoreVertical className="h-5 w-5" />
                    </button>
                    {showOptions && (
                        <div className="absolute right-0 top-full mt-1 w-48 rounded-xl border border-slate-700 bg-slate-900 shadow-xl z-10">
                            <button
                                onClick={() => { setShowOptions(false); setShowReport(true) }}
                                className="flex items-center gap-3 w-full px-4 py-3 text-sm text-slate-300 hover:text-white hover:bg-slate-800 rounded-t-xl transition-colors"
                            >
                                <Flag className="h-4 w-4 text-amber-400" />
                                Signaler
                            </button>
                            {!blockStatus.isBlockedByMe && (
                                <button
                                    onClick={() => { setShowOptions(false); setShowBlockConfirm(true) }}
                                    className="flex items-center gap-3 w-full px-4 py-3 text-sm text-red-400 hover:text-red-300 hover:bg-slate-800 rounded-b-xl transition-colors"
                                >
                                    <Ban className="h-4 w-4" />
                                    Bloquer
                                </button>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* ── Messages area ─────────────────────────────────────────────── */}
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
                {isLoading ? (
                    <div className="flex items-center justify-center h-full">
                        <div className="h-8 w-8 rounded-full border-2 border-slate-700 border-t-rose-500 animate-spin" />
                    </div>
                ) : messages.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-center gap-3 px-4">
                        <div className="text-5xl">💕</div>
                        <p className="text-white font-semibold">C'est un match !</p>
                        <p className="text-slate-400 text-sm">
                            Commencez la conversation avec {otherProfile?.full_name?.split(' ')[0]}
                        </p>
                        {/* 24h notice */}
                        <div className="mt-4 flex items-center gap-2 bg-slate-800/60 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-slate-500">
                            <Clock className="h-3.5 w-3.5 flex-shrink-0 text-slate-600" />
                            Les messages sont automatiquement supprimés après 24h
                        </div>
                    </div>
                ) : (
                    <>
                        {messages.map((msg) => {
                            const isMe = msg.sender_id === currentProfile?.user_id
                            return (
                                <div
                                    key={msg.id}
                                    className={`flex gap-2 ${isMe ? 'flex-row-reverse' : 'flex-row'}`}
                                >
                                    {!isMe && (
                                        <Avatar
                                            src={msg.sender?.avatar_url}
                                            name={msg.sender?.full_name}
                                            size="xs"
                                            className="flex-shrink-0 self-end"
                                        />
                                    )}
                                    <div className={`group max-w-[70%] ${isMe ? 'items-end' : 'items-start'} flex flex-col gap-0.5`}>
                                        <div
                                            className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${isMe
                                                ? 'bg-gradient-to-br from-rose-500 to-pink-600 text-white rounded-br-sm'
                                                : 'bg-slate-800 text-slate-200 rounded-bl-sm'
                                                }`}
                                        >
                                            {msg.content}
                                        </div>
                                        <span className="text-xs text-slate-600 px-1 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                                            {formatRelativeTime(msg.created_at)}
                                            {isMe && msg.read_at && (
                                                <span className="text-rose-400">· Lu</span>
                                            )}
                                        </span>
                                    </div>
                                </div>
                            )
                        })}
                        {/* 24h notice at bottom when there are messages */}
                        <div className="flex justify-center pt-4">
                            <span className="flex items-center gap-1.5 text-xs text-slate-700 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-full">
                                <Clock className="h-3 w-3" />
                                Messages supprimés après 24h
                            </span>
                        </div>
                    </>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* ── Chat Input Area / Blocked Notices ─────────────────────────── */}
            <div className="p-4 bg-slate-900 border-t border-slate-800 flex-shrink-0">
                {blockStatus.isBlockedByMe ? (
                    <div className="flex flex-col items-center justify-center p-4 bg-slate-800/50 rounded-2xl border border-slate-700/50 gap-3">
                        <p className="text-slate-400 text-sm text-center">
                            Vous avez bloqué {otherProfile?.full_name?.split(' ')[0]}.
                        </p>
                        <Button variant="outline" size="sm" onClick={handleUnblock}>
                            Débloquer l'utilisateur
                        </Button>
                    </div>
                ) : blockStatus.isBlockedByThem ? (
                    <div className="p-4 bg-slate-800/50 rounded-2xl border border-slate-700/50 text-center">
                        <p className="text-slate-400 text-sm">
                            Impossible d'envoyer le message tant que l'utilisateur ne vous a pas débloqué.
                        </p>
                    </div>
                ) : (
                    <div className="flex bg-slate-800 rounded-2xl items-end relative overflow-hidden focus-within:ring-2 focus-within:ring-rose-500/50 transition-shadow">
                        <textarea
                            ref={inputRef}
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="Écrivez un message..."
                            className="flex-1 bg-transparent text-white px-5 py-4 min-h-[56px] max-h-[120px] resize-none focus:outline-none focus:ring-0 text-sm placeholder:text-slate-500 custom-scrollbar"
                            disabled={isSending}
                            rows={Math.min(3, content.split('\n').length || 1)}
                        />
                        <div className="p-2">
                            <button
                                onClick={handleSend}
                                disabled={!content.trim() || isSending}
                                className="h-10 w-10 flex items-center justify-center rounded-xl bg-gradient-to-br from-rose-500 to-pink-600 text-white disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 active:scale-95 transition-all shadow-md"
                            >
                                {isSending ? (
                                    <div className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                                ) : (
                                    <Send className="h-4 w-4 ml-0.5" />
                                )}
                            </button>
                        </div>
                    </div>
                )}
                <p className="text-xs text-slate-600 text-center mt-2">
                    Entrée pour envoyer · Shift+Entrée pour un saut de ligne
                </p>
            </div>

            {/* ── Modals ────────────────────────────────────────────────────── */}
            {otherProfile && currentProfile && (
                <>
                    <ReportModal
                        isOpen={showReport}
                        onClose={() => setShowReport(false)}
                        reporterId={currentProfile.user_id}
                        reportedId={otherProfile.user_id}
                        reportedName={otherProfile.full_name ?? undefined}
                    />
                    <ConfirmModal
                        isOpen={showBlockConfirm}
                        onClose={() => setShowBlockConfirm(false)}
                        onConfirm={handleBlock}
                        title="Bloquer cet utilisateur ?"
                        message={`Vous ne pourrez plus voir ${otherProfile.full_name} ni échanger des messages avec cette personne.`}
                        confirmLabel="Bloquer"
                        variant="danger"
                    />
                </>
            )}
        </div>
    )
}

