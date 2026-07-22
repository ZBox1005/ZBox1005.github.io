'use client';

import { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import ReactMarkdown from 'react-markdown';
import { AnimatePresence, motion } from 'framer-motion';
import {
    BriefcaseBusiness,
    GraduationCap,
    Handshake,
    type LucideIcon,
} from 'lucide-react';
import type { ExperiencePageConfig } from '@/types/page';

interface ExperiencePageProps {
    config: ExperiencePageConfig;
    embedded?: boolean;
}

const groupIcons: Record<string, LucideIcon> = {
    research: BriefcaseBusiness,
    academic: GraduationCap,
    service: Handshake,
};

const markdownComponents = {
    p: ({ children }: React.ComponentProps<'p'>) => <p className="mb-1 last:mb-0">{children}</p>,
    ul: ({ children }: React.ComponentProps<'ul'>) => <ul className="mt-1 space-y-0.5">{children}</ul>,
    li: ({ children }: React.ComponentProps<'li'>) => (
        <li className="flex gap-2 before:mt-[0.55em] before:h-1 before:w-1 before:flex-shrink-0 before:rounded-full before:bg-accent/70">
            <span>{children}</span>
        </li>
    ),
    a: ({ ...props }: React.ComponentProps<'a'>) => (
        <a
            {...props}
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-accent transition-colors hover:text-accent-dark"
        />
    ),
    strong: ({ children }: React.ComponentProps<'strong'>) => (
        <strong className="font-semibold text-primary">{children}</strong>
    ),
};

export default function ExperiencePage({ config, embedded = false }: ExperiencePageProps) {
    const initialGroup = config.groups.some((group) => group.id === config.default_group)
        ? config.default_group as string
        : config.groups[0]?.id || '';
    const [activeGroupId, setActiveGroupId] = useState(initialGroup);

    useEffect(() => {
        if (!config.groups.some((group) => group.id === activeGroupId)) {
            setActiveGroupId(initialGroup);
        }
    }, [activeGroupId, config.groups, initialGroup]);

    const activeGroup = useMemo(
        () => config.groups.find((group) => group.id === activeGroupId) || config.groups[0],
        [activeGroupId, config.groups]
    );

    if (!activeGroup) return null;

    const ActiveGroupIcon = groupIcons[activeGroup.id] || BriefcaseBusiness;

    return (
        <motion.div
            className={`animate-fade-up ${embedded ? '' : 'mx-auto max-w-5xl'}`}
            style={{ animationDelay: '0.2s' }}
        >
            <header className={embedded ? 'mb-5' : 'mb-8'}>
                <div className="mb-3 flex items-center gap-3">
                    <span className="h-px w-8 bg-gradient-to-r from-accent to-transparent" />
                    <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-accent-dark dark:text-accent">
                        Career & Contributions
                    </span>
                </div>
                <h1 className={`${embedded ? 'text-2xl' : 'text-4xl'} mb-3 font-serif font-bold text-primary`}>
                    {config.title}
                </h1>
                {config.description && (
                    <p className={`${embedded ? 'text-base' : 'text-lg'} max-w-3xl leading-relaxed text-neutral-600 dark:text-neutral-500`}>
                        {config.description}
                    </p>
                )}
            </header>

            <div className="relative z-10 mb-7 rounded-2xl border border-neutral-200/90 bg-neutral-50/85 p-1.5 shadow-[0_8px_28px_-20px_rgba(15,23,42,0.3)] backdrop-blur-xl dark:border-white/10 dark:bg-neutral-900/85">
                <div className="grid grid-cols-3 gap-1" role="tablist" aria-label="Experience categories">
                    {config.groups.map((group) => {
                        const isActive = group.id === activeGroup.id;
                        const GroupIcon = groupIcons[group.id] || BriefcaseBusiness;

                        return (
                            <button
                                key={group.id}
                                type="button"
                                role="tab"
                                aria-selected={isActive}
                                onClick={() => setActiveGroupId(group.id)}
                                className={`group/tab relative min-w-0 overflow-hidden rounded-xl px-2 py-3 text-left transition-colors duration-200 sm:px-4 ${
                                    isActive
                                        ? 'text-primary'
                                        : 'text-neutral-500 hover:bg-white/60 hover:text-primary dark:text-neutral-400 dark:hover:bg-white/[0.04]'
                                }`}
                            >
                                {isActive && (
                                    <motion.span
                                        layoutId="experience-active-group"
                                        className="absolute inset-0 rounded-xl bg-white shadow-sm ring-1 ring-black/[0.05] dark:bg-neutral-800 dark:ring-white/10"
                                        transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                                    />
                                )}
                                <span className="relative flex items-center gap-2 sm:gap-3">
                                    <span className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg transition-colors ${
                                        isActive
                                            ? 'bg-accent/12 text-accent-dark dark:text-accent'
                                            : 'bg-neutral-100 text-neutral-400 group-hover/tab:text-accent dark:bg-neutral-800'
                                    }`}>
                                        <GroupIcon className="h-4 w-4" />
                                    </span>
                                    <span className="min-w-0 flex-1">
                                        <span className="block truncate text-xs font-semibold sm:hidden">
                                            {group.id === 'research' ? 'Research' : group.tab_label}
                                        </span>
                                        <span className="hidden truncate text-base font-semibold sm:block">
                                            {group.tab_label}
                                        </span>
                                    </span>
                                </span>
                            </button>
                        );
                    })}
                </div>
            </div>

            <AnimatePresence mode="wait" initial={false}>
                <motion.section
                    key={activeGroup.id}
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                    aria-labelledby={`experience-${activeGroup.id}`}
                >
                    <div className="mb-4 flex items-end justify-between gap-4">
                        <div>
                            <h2 id={`experience-${activeGroup.id}`} className="text-2xl font-serif font-bold text-primary">
                                {activeGroup.title}
                            </h2>
                            {activeGroup.description && (
                                <p className="mt-1 text-sm text-neutral-500">{activeGroup.description}</p>
                            )}
                        </div>
                    </div>

                    <div className="overflow-hidden rounded-2xl border border-neutral-200/90 bg-white shadow-[0_12px_35px_-24px_rgba(15,23,42,0.3)] dark:border-white/10 dark:bg-neutral-900">
                        {(activeGroup.items || []).map((item, index) => {
                            const isCurrent = /\bpresent\b|\bcurrent\b|至今|当前/i.test(item.date || '');

                            return (
                                <motion.article
                                    key={`${item.title}-${item.subtitle}`}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.045, duration: 0.25 }}
                                    className="group/item relative grid grid-cols-[44px_minmax(0,1fr)] gap-3 border-b border-neutral-100 px-4 py-4 transition-colors duration-200 last:border-b-0 hover:bg-accent/[0.035] sm:grid-cols-[52px_minmax(0,1fr)_auto] sm:gap-4 sm:px-5 dark:border-white/[0.07]"
                                >
                                    <span className="absolute inset-y-2 left-0 w-0.5 origin-center scale-y-0 rounded-r-full bg-accent transition-transform duration-300 group-hover/item:scale-y-100" />

                                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white p-1.5 shadow-sm ring-1 ring-black/[0.06] sm:h-12 sm:w-12 dark:ring-white/10">
                                        {item.image ? (
                                            <Image
                                                src={item.image}
                                                alt=""
                                                width={40}
                                                height={40}
                                                className="h-full w-full object-contain"
                                            />
                                        ) : (
                                            <ActiveGroupIcon className="h-5 w-5 text-accent" />
                                        )}
                                    </div>

                                    <div className="min-w-0">
                                        <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                                            <h3 className="font-semibold leading-tight text-primary transition-colors group-hover/item:text-accent-dark dark:group-hover/item:text-accent">
                                                {item.title}
                                            </h3>
                                            {isCurrent && (
                                                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wide text-emerald-700 dark:bg-emerald-400/10 dark:text-emerald-400">
                                                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                                                    Current
                                                </span>
                                            )}
                                        </div>
                                        {item.subtitle && (
                                            <p className="mt-1 text-sm font-medium text-accent-dark dark:text-accent">
                                                {item.subtitle}
                                            </p>
                                        )}
                                        {item.content && (
                                            <div className="mt-2 text-sm leading-relaxed text-neutral-500">
                                                <ReactMarkdown components={markdownComponents}>{item.content}</ReactMarkdown>
                                            </div>
                                        )}
                                        {item.tags && item.tags.length > 0 && (
                                            <div className="mt-2.5 flex flex-wrap gap-1.5">
                                                {item.tags.map((tag) => (
                                                    <span
                                                        key={tag}
                                                        className="rounded-full bg-neutral-100 px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wide text-neutral-500 dark:bg-neutral-800"
                                                    >
                                                        {tag}
                                                    </span>
                                                ))}
                                            </div>
                                        )}
                                    </div>

                                    {item.date && (
                                        <span className="col-start-2 row-start-2 mt-1 self-start whitespace-nowrap text-[10px] font-semibold tabular-nums text-neutral-400 sm:col-start-3 sm:row-start-1 sm:mt-0 sm:rounded-full sm:bg-neutral-50 sm:px-2.5 sm:py-1.5 dark:sm:bg-neutral-800">
                                            {item.date}
                                        </span>
                                    )}
                                </motion.article>
                            );
                        })}
                    </div>
                </motion.section>
            </AnimatePresence>
        </motion.div>
    );
}
