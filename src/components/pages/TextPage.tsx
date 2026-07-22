'use client';

import { motion } from 'framer-motion';
import { Download, ExternalLink, FileText } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { TextPageConfig } from '@/types/page';

interface TextPageProps {
    config: TextPageConfig;
    content: string;
    embedded?: boolean;
}

export default function TextPage({ config, content, embedded = false }: TextPageProps) {
    return (
        <motion.div
            className={`animate-fade-up ${embedded ? "" : "max-w-3xl mx-auto"}`}
            style={{ animationDelay: '0.4s' }}
        >
            <h1 className={`${embedded ? "text-2xl" : "text-4xl"} font-serif font-bold text-primary mb-4`}>{config.title}</h1>
            {config.description && (
                <p className={`${embedded ? "text-base" : "text-lg"} text-neutral-600 dark:text-neutral-500 mb-8 max-w-2xl`}>
                    {config.description}
                </p>
            )}
            {config.pdf && (
                <div className="mb-6">
                    <div className="mb-4 flex flex-col gap-4 rounded-2xl border border-neutral-200/90 bg-gradient-to-br from-white via-white to-neutral-50/75 p-4 shadow-[0_12px_35px_-24px_rgba(15,23,42,0.3)] sm:flex-row sm:items-center sm:justify-between dark:border-white/10 dark:from-neutral-900 dark:via-neutral-900 dark:to-neutral-800/80">
                        <div className="flex min-w-0 items-center gap-3.5">
                            <span className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-accent/10 text-accent-dark ring-1 ring-inset ring-accent/10 dark:text-accent">
                                <FileText className="h-5 w-5" />
                            </span>
                            <span className="min-w-0">
                                <span className="block font-semibold text-primary">Boxuan Zhang — Curriculum Vitae</span>
                                <span className="mt-1 block text-xs text-neutral-500">
                                    PDF document{config.updated ? ` · Last updated ${config.updated}` : ''}
                                </span>
                            </span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            <a
                                href={config.pdf}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 rounded-lg bg-primary px-3.5 py-2 text-xs font-semibold text-background transition-all hover:-translate-y-0.5 hover:bg-accent hover:text-white"
                            >
                                <ExternalLink className="h-3.5 w-3.5" />
                                Open CV
                            </a>
                            <a
                                href={config.pdf}
                                download
                                className="inline-flex items-center gap-2 rounded-lg border border-neutral-200 bg-white px-3.5 py-2 text-xs font-semibold text-neutral-600 transition-all hover:-translate-y-0.5 hover:border-accent/35 hover:text-accent-dark dark:border-white/10 dark:bg-white/[0.04] dark:text-neutral-500 dark:hover:text-accent"
                            >
                                <Download className="h-3.5 w-3.5" />
                                Download
                            </a>
                        </div>
                    </div>
                    <object
                        data={config.pdf}
                        type="application/pdf"
                        className="hidden h-[80vh] w-full rounded-xl border border-neutral-200 sm:block dark:border-neutral-800"
                    >
                        <p className="text-sm text-neutral-600 dark:text-neutral-400">
                            Your browser cannot display PDFs. <a className="text-accent underline" href={config.pdf}>Click here to download.</a>
                        </p>
                    </object>
                </div>
            )}
            {content.trim() && <div className="text-neutral-700 dark:text-neutral-600 leading-relaxed">
                <ReactMarkdown
                    components={{
                        h1: ({ children }) => <h1 className="text-3xl font-serif font-bold text-primary mt-8 mb-4">{children}</h1>,
                        h2: ({ children }) => <h2 className="text-2xl font-serif font-bold text-primary mt-8 mb-4 border-b border-neutral-200 dark:border-neutral-800 pb-2">{children}</h2>,
                        h3: ({ children }) => <h3 className="text-xl font-semibold text-primary mt-6 mb-3">{children}</h3>,
                        p: ({ children }) => <p className="mb-4 last:mb-0">{children}</p>,
                        ul: ({ children }) => <ul className="list-disc list-inside mb-4 space-y-1 ml-4">{children}</ul>,
                        ol: ({ children }) => <ol className="list-decimal list-inside mb-4 space-y-1 ml-4">{children}</ol>,
                        li: ({ children }) => <li className="mb-1">{children}</li>,
                        a: ({ ...props }) => (
                            <a
                                {...props}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-accent font-medium transition-all duration-200 rounded hover:bg-accent/10 hover:shadow-sm"
                            />
                        ),
                        blockquote: ({ children }) => (
                            <blockquote className="border-l-4 border-accent/50 pl-4 italic my-4 text-neutral-600 dark:text-neutral-500">
                                {children}
                            </blockquote>
                        ),
                        strong: ({ children }) => <strong className="font-semibold text-primary">{children}</strong>,
                        em: ({ children }) => <em className="italic text-neutral-600 dark:text-neutral-500">{children}</em>,
                    }}
                >
                    {content}
                </ReactMarkdown>
            </div>}
        </motion.div>
    );
}
