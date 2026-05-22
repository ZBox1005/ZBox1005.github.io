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

export default function SelectedPublications({ publications, title, enableOnePageMode = false, delay = 0.4 }: SelectedPublicationsProps) {
    const messages = useMessages();
    const resolvedTitle = title || messages.home.selectedPublications;
    const [expandedBibtexId, setExpandedBibtexId] = useState<string | null>(null);

    return (
        <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay }}
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
                {publications.map((pub, index) => (
                    <motion.div
                        key={pub.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: 0.1 * index }}
                        className="bg-neutral-50 dark:bg-neutral-800 p-4 rounded-lg shadow-sm border border-neutral-200 dark:border-[rgba(148,163,184,0.24)] hover:shadow-lg transition-all duration-200"
                    >
                        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                            {pub.preview && (
                                <div className="w-full sm:w-52 flex-shrink-0">
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img
                                        src={`/papers/${pub.preview}`}
                                        alt={pub.title}
                                        className="block w-full h-auto rounded-md"
                                    />
                                </div>
                            )}
                            <div className="flex-grow min-w-0">
                                <h3 className="font-semibold text-primary mb-1 leading-tight">
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
                                <p className="text-sm font-medium text-neutral-700 dark:text-neutral-400 mb-2">
                                    {pub.journal || pub.conference} {pub.year}
                                    {pub.award && (
                                        <span className="ml-2 inline-flex items-center text-xs font-semibold text-amber-700 dark:text-amber-400">
                                            🏆 {pub.award}
                                        </span>
                                    )}
                                </p>
                                {pub.description && (
                                    <p className="text-sm text-neutral-500 dark:text-neutral-500 mb-3 line-clamp-3">
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
                    </motion.div>
                ))}
            </div>
        </motion.section>
    );
}
