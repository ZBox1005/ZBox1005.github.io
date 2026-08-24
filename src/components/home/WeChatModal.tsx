'use client';

import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import Image from 'next/image';
import { AnimatePresence, motion } from 'framer-motion';
import { ScanLine, X } from 'lucide-react';
import { useMessages } from '@/lib/i18n/useMessages';
import { WeChatIcon } from '@/components/ui/Icons';

interface WeChatModalProps {
    open: boolean;
    qrSrc: string;
    onClose: () => void;
}

export default function WeChatModal({ open, qrSrc, onClose }: WeChatModalProps) {
    const messages = useMessages();
    const closeButtonRef = useRef<HTMLButtonElement>(null);

    useEffect(() => {
        if (!open) return;

        const previousOverflow = document.body.style.overflow;
        const previousFocus = document.activeElement instanceof HTMLElement
            ? document.activeElement
            : null;
        document.body.style.overflow = 'hidden';
        closeButtonRef.current?.focus();

        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', handleKeyDown);

        return () => {
            document.body.style.overflow = previousOverflow;
            window.removeEventListener('keydown', handleKeyDown);
            previousFocus?.focus();
        };
    }, [onClose, open]);

    if (typeof document === 'undefined') return null;

    return createPortal(
        <AnimatePresence>
            {open && (
                <motion.div
                    className="fixed inset-0 z-[1100] flex items-center justify-center overflow-y-auto bg-slate-950/65 px-4 py-6 backdrop-blur-md"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    onMouseDown={(event) => {
                        if (event.target === event.currentTarget) onClose();
                    }}
                >
                    <motion.section
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="wechat-dialog-title"
                        aria-describedby="wechat-dialog-description"
                        initial={{ opacity: 0, y: 18, scale: 0.96 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 12, scale: 0.97 }}
                        transition={{ type: 'spring', stiffness: 340, damping: 28 }}
                        onMouseDown={(event) => event.stopPropagation()}
                        className="relative w-full max-w-[23rem] overflow-hidden rounded-[1.75rem] border border-white/80 bg-white/95 p-4 shadow-[0_35px_100px_-28px_rgba(0,0,0,0.75)] ring-1 ring-black/5 dark:border-white/10 dark:bg-neutral-900/95"
                    >
                        <div className="pointer-events-none absolute -right-16 -top-20 h-44 w-44 rounded-full bg-accent/20 blur-3xl" />
                        <div className="pointer-events-none absolute -bottom-20 -left-16 h-44 w-44 rounded-full bg-emerald-400/10 blur-3xl" />

                        <header className="relative flex items-start justify-between gap-4 px-1 pb-3 pt-1">
                            <div className="flex min-w-0 items-center gap-3">
                                <span className="flex h-10 w-10 flex-none items-center justify-center rounded-2xl bg-emerald-500/[0.12] text-emerald-600 ring-1 ring-inset ring-emerald-500/15 dark:text-emerald-400">
                                    <WeChatIcon className="h-5 w-5" />
                                </span>
                                <div className="min-w-0">
                                    <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-accent-dark dark:text-accent">
                                        Let&apos;s connect
                                    </p>
                                    <h2 id="wechat-dialog-title" className="mt-0.5 truncate font-serif text-xl font-bold text-primary">
                                        {messages.profile.wechatTitle}
                                    </h2>
                                </div>
                            </div>
                            <button
                                ref={closeButtonRef}
                                type="button"
                                onClick={onClose}
                                aria-label={messages.profile.closeWechat}
                                className="flex h-9 w-9 flex-none items-center justify-center rounded-full border border-neutral-200/80 text-neutral-500 transition-colors hover:border-accent/35 hover:bg-accent/[0.07] hover:text-accent dark:border-white/10 dark:text-neutral-400"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        </header>

                        <div className="relative overflow-hidden rounded-2xl bg-white p-1.5 shadow-[0_14px_36px_-18px_rgba(15,23,42,0.42)] ring-1 ring-black/[0.06]">
                            <Image
                                src={qrSrc}
                                alt={messages.profile.wechatQrAlt}
                                width={888}
                                height={1191}
                                priority
                                className="block h-auto w-full rounded-xl"
                            />
                        </div>

                        <p
                            id="wechat-dialog-description"
                            className="relative mt-3 flex items-center justify-center gap-2 px-2 pb-1 text-center text-[11px] leading-relaxed text-neutral-500 dark:text-neutral-400"
                        >
                            <ScanLine className="h-3.5 w-3.5 flex-none text-accent" />
                            <span className="min-w-0">{messages.profile.wechatHint}</span>
                        </p>
                    </motion.section>
                </motion.div>
            )}
        </AnimatePresence>,
        document.body
    );
}
