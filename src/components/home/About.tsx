'use client';

import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import { useMessages } from '@/lib/i18n/useMessages';

type HastNode = {
    type: string;
    tagName?: string;
    value?: string;
    children?: HastNode[];
};

function isMediaAstNode(node: HastNode | undefined): boolean {
    if (!node || node.type !== 'element') return false;
    if (node.tagName === 'img') return true;
    if (node.tagName === 'a') {
        const inner = (node.children || []).filter((c) => !(c.type === 'text' && (c.value || '').trim() === ''));
        return inner.length > 0 && inner.every(isMediaAstNode);
    }
    return false;
}

function isMediaParagraphNode(node: HastNode | undefined): boolean {
    if (!node || !node.children) return false;
    const items = node.children.filter((c) => !(c.type === 'text' && (c.value || '').trim() === ''));
    return items.length > 0 && items.every(isMediaAstNode);
}

interface AboutProps {
    content: string;
    title?: string;
    delay?: number;
}

export default function About({ content, title, delay = 0.2 }: AboutProps) {
    const messages = useMessages();
    const resolvedTitle = title || messages.home.about;

    return (
        <motion.section
            className="animate-fade-up"
            style={{ animationDelay: `${delay}s` }}
        >
            <h2 className="text-2xl font-serif font-bold text-primary mb-4">{resolvedTitle}</h2>
            <div className="text-neutral-700 dark:text-neutral-600 leading-relaxed">
                <ReactMarkdown
                    components={{
                        h1: ({ children }) => <h1 className="text-3xl font-serif font-bold text-primary mt-8 mb-4">{children}</h1>,
                        h2: ({ children }) => <h2 className="text-2xl font-serif font-bold text-primary mt-8 mb-4 border-b border-neutral-200 dark:border-neutral-800 pb-2">{children}</h2>,
                        h3: ({ children }) => <h3 className="text-xl font-semibold text-primary mt-6 mb-3">{children}</h3>,
                        p: ({ children, node }) => isMediaParagraphNode(node as HastNode | undefined)
                            ? <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-4 w-4/5">{children}</div>
                            : <p className="mb-4 last:mb-0">{children}</p>,
                        ul: ({ children }) => <ul className="list-disc list-inside mb-4 space-y-1 ml-4">{children}</ul>,
                        ol: ({ children }) => <ol className="list-decimal list-inside mb-4 space-y-1 ml-4">{children}</ol>,
                        li: ({ children }) => <li className="mb-1">{children}</li>,
                        a: ({ children, node, ...props }) => {
                            const astNode = node as HastNode | undefined;
                            const onlyChild = (astNode?.children || []).find((c) => !(c.type === 'text' && (c.value || '').trim() === ''));
                            const wrapsImage = onlyChild?.type === 'element' && onlyChild.tagName === 'img';
                            if (wrapsImage) {
                                return (
                                    <a
                                        {...props}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="group relative block overflow-hidden rounded-xl bg-white dark:bg-neutral-800 shadow-[0_2px_8px_-2px_rgba(15,23,42,0.08),0_8px_24px_-6px_rgba(15,23,42,0.10)] ring-1 ring-black/[0.06] dark:ring-white/10 hover:shadow-[0_8px_16px_-4px_rgba(15,23,42,0.15),0_20px_40px_-10px_rgba(15,23,42,0.20)] hover:-translate-y-1 hover:ring-accent/40 transition-all duration-300 ease-out"
                                    >
                                        {children}
                                        <span aria-hidden className="pointer-events-none absolute inset-0 rounded-xl bg-gradient-to-t from-black/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                    </a>
                                );
                            }
                            return (
                                <a
                                    {...props}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-accent font-medium transition-all duration-200 rounded hover:bg-accent/10 hover:shadow-sm"
                                >
                                    {children}
                                </a>
                            );
                        },
                        blockquote: ({ children }) => (
                            <blockquote className="border-l-4 border-accent/50 pl-4 italic my-4 text-neutral-600 dark:text-neutral-500">
                                {children}
                            </blockquote>
                        ),
                        strong: ({ children }) => <strong className="font-semibold text-primary">{children}</strong>,
                        em: ({ children }) => <em className="italic text-neutral-600 dark:text-neutral-500">{children}</em>,
                        img: ({ src, alt, ...rest }) => (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                                src={typeof src === 'string' ? src : ''}
                                alt={alt || ''}
                                {...rest}
                                className="block w-full h-auto object-cover transition-transform duration-500 ease-out group-hover:scale-[1.06]"
                            />
                        ),
                    }}
                >
                    {content}
                </ReactMarkdown>
            </div>
        </motion.section>
    );
}
