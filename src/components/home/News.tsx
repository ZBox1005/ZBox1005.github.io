'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { useMessages } from '@/lib/i18n/useMessages';

export interface NewsItem {
    date: string;
    content: string;
}

interface NewsProps {
    items: NewsItem[];
    title?: string;
    delay?: number;
}

const newsMarkdownComponents = {
    p: ({ children }: React.ComponentProps<'p'>) => <>{children}</>,
    a: ({ ...props }: React.ComponentProps<'a'>) => (
        <a
            {...props}
            target="_blank"
            rel="noopener noreferrer"
            className="text-accent font-medium transition-all duration-200 rounded hover:bg-accent/10 hover:shadow-sm"
        />
    ),
    strong: ({ children }: React.ComponentProps<'strong'>) => <strong className="font-semibold text-primary">{children}</strong>,
    em: ({ children }: React.ComponentProps<'em'>) => <em className="italic text-neutral-600 dark:text-neutral-400">{children}</em>,
    code: ({ children }: React.ComponentProps<'code'>) => (
        <code className="px-1 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 text-[0.95em]">{children}</code>
    ),
};

export default function News({ items, title, delay = 0.3 }: NewsProps) {
    const messages = useMessages();
    const resolvedTitle = title || messages.home.news;
    const [expanded, setExpanded] = useState(false);
    const visibleItems = expanded ? items : items.slice(0, 5);
    const hasMoreItems = items.length > 5;

    return (
        <motion.section
            className="animate-fade-up"
            style={{ animationDelay: `${delay}s` }}
        >
            <h2 className="text-2xl font-serif font-bold text-primary mb-4">{resolvedTitle}</h2>
            <div>
                {visibleItems.map((item, index) => {
                    const isLatest = index === 0;
                    const isLast = index === visibleItems.length - 1;

                    return (
                        <motion.div
                            key={`${item.date}-${index}`}
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: Math.min(index * 0.035, 0.2), duration: 0.25 }}
                            className="grid grid-cols-[3.5rem_1rem_minmax(0,1fr)] gap-2 sm:grid-cols-[4rem_1.25rem_minmax(0,1fr)] sm:gap-3"
                        >
                            <time className={`pt-2.5 text-[10px] font-medium tabular-nums sm:text-xs ${
                                isLatest ? 'text-accent-dark dark:text-accent' : 'text-neutral-400'
                            }`}>
                                {item.date}
                            </time>
                            <span className="relative flex justify-center" aria-hidden="true">
                                {!isLast && (
                                    <span className="absolute bottom-[-0.5rem] top-4 w-px bg-gradient-to-b from-neutral-200 to-neutral-100 dark:from-neutral-700 dark:to-neutral-800" />
                                )}
                                <span className={`relative mt-3 h-2 w-2 rounded-full ring-4 ${
                                    isLatest
                                        ? 'bg-accent shadow-[0_0_8px_var(--accent)] ring-accent/15'
                                        : 'bg-neutral-300 ring-background dark:bg-neutral-600'
                                }`} />
                            </span>
                            <div className={`mb-2 rounded-xl px-3 py-2 text-sm leading-relaxed transition-colors sm:px-3.5 ${
                                isLatest
                                    ? 'border border-accent/15 bg-gradient-to-r from-accent/[0.08] to-transparent text-neutral-700 dark:text-neutral-400'
                                    : 'border border-transparent text-neutral-600 hover:border-neutral-200/70 hover:bg-neutral-50/60 dark:text-neutral-400 dark:hover:border-white/[0.06] dark:hover:bg-white/[0.02]'
                            }`}>
                                <ReactMarkdown components={newsMarkdownComponents}>
                                    {item.content}
                                </ReactMarkdown>
                            </div>
                        </motion.div>
                    );
                })}

                {hasMoreItems && (
                    <div className="mt-2 flex justify-center">
                        <button
                            type="button"
                            onClick={() => setExpanded((current) => !current)}
                            aria-expanded={expanded}
                            className="group inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-white px-4 py-2 text-xs font-semibold text-neutral-500 shadow-sm transition-all hover:border-accent/35 hover:text-accent-dark hover:shadow-md dark:border-white/10 dark:bg-neutral-900 dark:text-neutral-400 dark:hover:text-accent"
                        >
                            {expanded ? 'Show Less' : `Show More (${items.length - 5})`}
                            <ChevronDown className={`h-3.5 w-3.5 transition-transform duration-200 ${expanded ? 'rotate-180' : ''}`} />
                        </button>
                    </div>
                )}
            </div>
        </motion.section>
    );
}
