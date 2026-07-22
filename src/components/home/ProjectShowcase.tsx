'use client';

import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowUpRight, ChevronLeft, ChevronRight } from 'lucide-react';
import type { ProjectItem } from '@/types/page';

interface ProjectShowcaseProps {
    projects: ProjectItem[];
    title?: string;
    delay?: number;
}

const cardVariants = {
    enter: (direction: number) => ({
        opacity: 0,
        x: direction > 0 ? 42 : -42,
        scale: 0.985,
    }),
    center: {
        opacity: 1,
        x: 0,
        scale: 1,
    },
    exit: (direction: number) => ({
        opacity: 0,
        x: direction > 0 ? -42 : 42,
        scale: 0.985,
    }),
};

export default function ProjectShowcase({ projects, title = 'Recent Projects', delay = 0.4 }: ProjectShowcaseProps) {
    const [[activeIndex, direction], setActive] = useState<[number, number]>([0, 1]);

    if (projects.length === 0) return null;

    const activeProject = projects[activeIndex];

    const selectProject = (nextIndex: number) => {
        if (nextIndex === activeIndex) return;
        setActive([nextIndex, nextIndex > activeIndex ? 1 : -1]);
    };

    const paginate = (step: number) => {
        const nextIndex = (activeIndex + step + projects.length) % projects.length;
        setActive([nextIndex, step]);
    };

    return (
        <motion.section
            className="animate-fade-up"
            style={{ animationDelay: `${delay}s` }}
            aria-roledescription="project carousel"
        >
            <div className="mb-4 flex items-end justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-serif font-bold text-primary">{title}</h2>
                    <p className="mt-1 text-sm text-neutral-500">
                        Selected work — click through to explore each project.
                    </p>
                </div>

                <div className="hidden sm:flex items-center gap-2">
                    <span className="mr-1 text-[11px] font-medium tabular-nums text-neutral-400">
                        {String(activeIndex + 1).padStart(2, '0')} / {String(projects.length).padStart(2, '0')}
                    </span>
                    <button
                        type="button"
                        onClick={() => paginate(-1)}
                        className="group flex h-9 w-9 items-center justify-center rounded-full border border-neutral-200 bg-white text-neutral-500 shadow-sm transition-all duration-200 hover:-translate-x-0.5 hover:border-accent/40 hover:text-accent hover:shadow-md dark:border-white/10 dark:bg-neutral-900 dark:text-neutral-400"
                        aria-label="Previous project"
                    >
                        <ChevronLeft className="h-4 w-4 transition-transform group-active:-translate-x-0.5" />
                    </button>
                    <button
                        type="button"
                        onClick={() => paginate(1)}
                        className="group flex h-9 w-9 items-center justify-center rounded-full border border-neutral-200 bg-white text-neutral-500 shadow-sm transition-all duration-200 hover:translate-x-0.5 hover:border-accent/40 hover:text-accent hover:shadow-md dark:border-white/10 dark:bg-neutral-900 dark:text-neutral-400"
                        aria-label="Next project"
                    >
                        <ChevronRight className="h-4 w-4 transition-transform group-active:translate-x-0.5" />
                    </button>
                </div>
            </div>

            <div className="group/showcase relative">
                <div className="pointer-events-none absolute -inset-3 rounded-[1.75rem] bg-gradient-to-r from-accent/10 via-transparent to-primary/5 opacity-0 blur-2xl transition-opacity duration-500 sm:group-hover/showcase:opacity-100 dark:to-accent/5" />

                <AnimatePresence initial={false} custom={direction} mode="wait">
                    <motion.a
                        key={activeProject.title}
                        custom={direction}
                        variants={cardVariants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
                        href={activeProject.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group relative block overflow-hidden rounded-2xl border border-neutral-200/90 bg-white shadow-[0_10px_35px_-16px_rgba(15,23,42,0.25)] ring-1 ring-black/[0.02] transition-[transform,box-shadow,border-color] duration-300 hover:-translate-y-1 hover:border-accent/35 hover:shadow-[0_22px_50px_-20px_rgba(15,23,42,0.35)] dark:border-white/10 dark:bg-neutral-900 dark:ring-white/[0.03]"
                    >
                        <div className="relative aspect-[5511/1500] overflow-hidden bg-white">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                                src={activeProject.image}
                                alt={`${activeProject.title} project poster`}
                                className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.018]"
                            />
                            <span className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-white/5 opacity-40" />
                            <span className="pointer-events-none absolute -left-1/3 top-0 h-full w-1/5 -skew-x-12 bg-gradient-to-r from-transparent via-white/45 to-transparent opacity-0 blur-sm transition-all duration-1000 ease-out group-hover:left-[115%] group-hover:opacity-100" />
                        </div>

                        <div className="relative flex flex-col gap-4 border-t border-neutral-100 bg-gradient-to-br from-white via-white to-neutral-50/80 px-5 py-4 sm:flex-row sm:items-center sm:justify-between dark:border-white/10 dark:from-neutral-900 dark:via-neutral-900 dark:to-neutral-800/80">
                            <div className="min-w-0">
                                <div className="mb-1.5 flex flex-wrap items-center gap-2">
                                    <span className="rounded-full bg-accent/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-accent-dark dark:text-accent">
                                        {activeProject.category}
                                    </span>
                                    <span className="text-[11px] font-medium tabular-nums text-neutral-400 dark:text-neutral-500">
                                        {activeProject.year}
                                    </span>
                                </div>
                                <div className="flex min-w-0 flex-wrap items-baseline gap-x-2">
                                    <h3 className="text-lg font-bold text-primary">{activeProject.title}</h3>
                                    <span className="text-sm text-neutral-500">
                                        {activeProject.subtitle}
                                    </span>
                                </div>
                            </div>

                            <span className="flex flex-shrink-0 items-center gap-2 text-xs font-semibold text-primary transition-colors group-hover:text-accent">
                                Explore Project
                                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-background transition-all duration-300 group-hover:rotate-6 group-hover:bg-accent group-hover:text-white">
                                    <ArrowUpRight className="h-4 w-4" />
                                </span>
                            </span>
                        </div>
                    </motion.a>
                </AnimatePresence>
            </div>

            <div className="mt-3 grid grid-cols-3 gap-1.5 sm:grid-cols-6" role="tablist" aria-label="Select project">
                {projects.map((project, index) => {
                    const isActive = index === activeIndex;
                    return (
                        <button
                            key={project.title}
                            type="button"
                            role="tab"
                            aria-selected={isActive}
                            onClick={() => selectProject(index)}
                            className={`group/tab relative overflow-hidden rounded-lg px-2 py-2.5 text-left transition-all duration-200 ${
                                isActive
                                    ? 'bg-neutral-100 text-primary shadow-sm ring-1 ring-neutral-200 dark:bg-neutral-800 dark:ring-white/10'
                                    : 'text-neutral-400 hover:bg-neutral-50 hover:text-primary dark:text-neutral-500 dark:hover:bg-neutral-800/50'
                            }`}
                        >
                            {isActive && (
                                <motion.span
                                    layoutId="active-project-tab"
                                    className="absolute inset-x-2 top-0 h-px bg-gradient-to-r from-transparent via-accent to-transparent"
                                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                                />
                            )}
                            <span className="block text-[9px] font-medium tabular-nums opacity-60">
                                {String(index + 1).padStart(2, '0')}
                            </span>
                            <span className="mt-0.5 block truncate text-[11px] font-semibold">
                                {project.title}
                            </span>
                        </button>
                    );
                })}
            </div>

            <div className="mt-3 flex items-center justify-center gap-2 sm:hidden">
                <button
                    type="button"
                    onClick={() => paginate(-1)}
                    className="flex h-9 w-12 items-center justify-center rounded-full border border-neutral-200 bg-white text-neutral-500 shadow-sm dark:border-white/10 dark:bg-neutral-900"
                    aria-label="Previous project"
                >
                    <ChevronLeft className="h-4 w-4" />
                </button>
                <span className="text-[11px] font-medium tabular-nums text-neutral-400">
                    {String(activeIndex + 1).padStart(2, '0')} / {String(projects.length).padStart(2, '0')}
                </span>
                <button
                    type="button"
                    onClick={() => paginate(1)}
                    className="flex h-9 w-12 items-center justify-center rounded-full border border-neutral-200 bg-white text-neutral-500 shadow-sm dark:border-white/10 dark:bg-neutral-900"
                    aria-label="Next project"
                >
                    <ChevronRight className="h-4 w-4" />
                </button>
            </div>
        </motion.section>
    );
}
