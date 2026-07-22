'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { Github, Globe } from 'lucide-react';
import { BookOpenIcon, ClipboardDocumentIcon } from '@heroicons/react/24/outline';
import { Publication } from '@/types/publication';
import { cn } from '@/lib/utils';
import { useMessages } from '@/lib/i18n/useMessages';
import FormattedBibTeXText from '@/components/publications/FormattedBibTeXText';
import { ArxivIcon } from '@/components/ui/Icons';

interface SelectedPublicationsProps {
    publications: Publication[];
    title?: string;
    enableOnePageMode?: boolean;
    delay?: number;
}

function getCompactVenue(publication: Publication): { label: string; full: string } {
    const full = publication.journal || publication.conference || '';

    if (/fagen/i.test(full)) {
        return { label: 'FAGEN @ ICML', full };
    }

    if (/arxiv/i.test(full)) {
        return { label: 'arXiv', full };
    }

    const parentheticalLabels = Array.from(full.matchAll(/\(([^)]+)\)/g))
        .map((match) => match[1].trim())
        .filter((label) => label.length <= 18);

    if (parentheticalLabels.length > 0) {
        return { label: parentheticalLabels[parentheticalLabels.length - 1], full };
    }

    const knownVenue = full.match(/\b(NeurIPS|ICML|ICLR|ACL|CVPR|ICCV|ECCV|ICME|AAAI|IJCAI|KDD|WWW)\b/i)?.[0];
    return { label: knownVenue || full, full };
}

export default function SelectedPublications({ publications, title, enableOnePageMode = false, delay = 0.4 }: SelectedPublicationsProps) {
    const messages = useMessages();
    const resolvedTitle = title || messages.home.selectedPublications;
    const [expandedBibtexId, setExpandedBibtexId] = useState<string | null>(null);

    return (
        <motion.section
            className="animate-fade-up"
            style={{ animationDelay: `${delay}s` }}
        >
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-serif font-bold text-primary">{resolvedTitle}</h2>
                <Link
                    href={enableOnePageMode ? "/#publications" : "/publications"}
                    prefetch={true}
                    className="text-accent hover:text-accent-dark text-sm font-medium transition-all duration-200 rounded hover:bg-accent/10 hover:shadow-sm"
                >
                    {messages.home.viewAll} →
                </Link>
            </div>
            <div className="space-y-4">
                {publications.map((pub, index) => {
                    const venue = getCompactVenue(pub);

                    return (
                        <motion.article
                            key={pub.id}
                            className="group/publication relative overflow-hidden rounded-xl border border-neutral-200/90 bg-gradient-to-br from-white via-white to-neutral-50/75 p-4 shadow-[0_5px_22px_-15px_rgba(15,23,42,0.24)] transition-all duration-300 hover:-translate-y-1 hover:border-accent/35 hover:shadow-[0_18px_45px_-20px_rgba(15,23,42,0.35)] dark:border-[rgba(148,163,184,0.22)] dark:from-neutral-900 dark:via-neutral-900 dark:to-neutral-800/80 animate-fade-up"
                            style={{ animationDelay: `${0.1 * index}s` }}
                        >
                            <span className="pointer-events-none absolute inset-y-3 left-0 w-0.5 origin-center scale-y-0 rounded-r-full bg-gradient-to-b from-transparent via-accent to-transparent transition-transform duration-300 group-hover/publication:scale-y-100" />
                            <span className="pointer-events-none absolute -right-10 -top-12 h-28 w-28 rounded-full bg-accent/0 blur-2xl transition-colors duration-500 group-hover/publication:bg-accent/10" />

                            <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center">
                                {pub.preview && (
                                    <div className="relative w-full flex-shrink-0 overflow-hidden rounded-lg bg-white shadow-sm ring-1 ring-black/[0.05] sm:w-52 dark:ring-white/10">
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img
                                            src={`/papers/${pub.preview}`}
                                            alt={pub.title}
                                            className="block h-auto w-full transition-transform duration-500 ease-out group-hover/publication:scale-[1.025]"
                                        />
                                        <span className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-white/5 opacity-0 transition-opacity duration-300 group-hover/publication:opacity-100" />
                                    </div>
                                )}
                                <div className="min-w-0 flex-grow">
                                    <div className="mb-2.5 flex flex-wrap items-center gap-2 pr-12">
                                        <span
                                            title={venue.full}
                                            className="inline-flex max-w-full items-center rounded-full bg-accent/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.1em] text-accent-dark ring-1 ring-inset ring-accent/10 dark:text-accent"
                                        >
                                            <span className="mr-1.5 h-1 w-1 rounded-full bg-accent shadow-[0_0_5px_var(--accent)]" />
                                            <span className="truncate">{venue.label}</span>
                                        </span>
                                        <span className="text-[11px] font-semibold tabular-nums text-neutral-400 dark:text-neutral-500">
                                            {pub.year}
                                        </span>
                                        {pub.award && (
                                            <span className="inline-flex items-center rounded-full bg-amber-50 px-2 py-1 text-[10px] font-semibold text-amber-700 ring-1 ring-inset ring-amber-200/60 dark:bg-amber-400/10 dark:text-amber-400 dark:ring-amber-400/15">
                                                🏆 {pub.award}
                                            </span>
                                        )}
                                    </div>

                                    <span className="absolute right-1 top-0 font-serif text-3xl font-bold tabular-nums text-neutral-200/80 transition-colors duration-300 group-hover/publication:text-accent/25 dark:text-neutral-700/60">
                                        {String(index + 1).padStart(2, '0')}
                                    </span>

                                    <h3 className="mb-1.5 font-semibold leading-tight text-primary transition-colors duration-200 group-hover/publication:text-accent-dark dark:group-hover/publication:text-accent">
                                        <FormattedBibTeXText nodes={pub.titleNodes} fallback={pub.title} />
                                    </h3>
                                <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-1">
                                    {pub.authors.map((author, idx) => (
                                        <span key={idx}>
                                            <span className={author.isHighlighted ? 'font-semibold text-accent' : ''}>
                                                {author.name}
                                            </span>
                                            {author.isCoAuthor && (
                                                <sup className={`ml-0 ${author.isHighlighted ? 'text-accent' : 'text-neutral-600 dark:text-neutral-400'}`}>*</sup>
                                            )}
                                            {author.isCorresponding && (
                                                <sup className={`ml-0 ${author.isHighlighted ? 'text-accent' : 'text-neutral-600 dark:text-neutral-400'}`}>†</sup>
                                            )}
                                            {idx < pub.authors.length - 1 && ', '}
                                        </span>
                                    ))}
                                </p>
                                {pub.description && (
                                    <p className="mb-3 line-clamp-2 text-sm leading-relaxed text-neutral-500">
                                        {pub.description}
                                    </p>
                                )}
                                <div className="flex flex-wrap gap-2">
                                    {pub.url && (
                                        <a
                                            href={pub.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-neutral-100 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-300 hover:bg-accent hover:text-white transition-colors"
                                        >
                                            <ArxivIcon className="h-3.5 w-3.5 mr-1.5" />
                                            Paper
                                        </a>
                                    )}
                                    {pub.code && (
                                        <a
                                            href={pub.code}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-neutral-100 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-300 hover:bg-accent hover:text-white transition-colors"
                                        >
                                            <Github className="h-3.5 w-3.5 mr-1.5" />
                                            Code
                                        </a>
                                    )}
                                    {pub.project && (
                                        <a
                                            href={pub.project}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-neutral-100 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-300 hover:bg-accent hover:text-white transition-colors"
                                        >
                                            <Globe className="h-3.5 w-3.5 mr-1.5" />
                                            Project
                                        </a>
                                    )}
                                    {pub.bibtex && (
                                        <button
                                            onClick={() => setExpandedBibtexId(expandedBibtexId === pub.id ? null : pub.id)}
                                            className={cn(
                                                "inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium transition-colors",
                                                expandedBibtexId === pub.id
                                                    ? "bg-accent text-white"
                                                    : "bg-neutral-100 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-300 hover:bg-accent hover:text-white"
                                            )}
                                        >
                                            <BookOpenIcon className="h-3.5 w-3.5 mr-1.5" />
                                            BibTeX
                                        </button>
                                    )}
                                </div>
                                <AnimatePresence>
                                    {expandedBibtexId === pub.id && pub.bibtex ? (
                                        <motion.div
                                            key="bibtex"
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: 'auto' }}
                                            exit={{ opacity: 0, height: 0 }}
                                            className="overflow-hidden mt-3"
                                        >
                                            <div className="relative bg-white dark:bg-neutral-900 rounded-lg p-3 border border-neutral-200 dark:border-neutral-700">
                                                <pre className="text-xs text-neutral-600 dark:text-neutral-400 overflow-x-auto whitespace-pre-wrap font-mono">
                                                    {pub.bibtex}
                                                </pre>
                                                <button
                                                    onClick={() => navigator.clipboard.writeText(pub.bibtex || '')}
                                                    className="absolute top-2 right-2 p-1.5 rounded-md bg-white dark:bg-neutral-700 text-neutral-500 hover:text-accent shadow-sm border border-neutral-200 dark:border-neutral-600 transition-colors"
                                                    title={messages.common.copyToClipboard}
                                                >
                                                    <ClipboardDocumentIcon className="h-4 w-4" />
                                                </button>
                                            </div>
                                        </motion.div>
                                    ) : null}
                                </AnimatePresence>
                            </div>
                            </div>
                        </motion.article>
                    );
                })}
            </div>
        </motion.section>
    );
}
