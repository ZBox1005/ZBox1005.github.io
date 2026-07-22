'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import {
    EnvelopeIcon,
    AcademicCapIcon,
    MapPinIcon
} from '@heroicons/react/24/outline';
import { MapPinIcon as MapPinSolidIcon, EnvelopeIcon as EnvelopeSolidIcon } from '@heroicons/react/24/solid';
import { ChevronRight, Github, Linkedin, Pin } from 'lucide-react';
import type { SiteConfig } from '@/lib/config';
import type { CardItem, PageSectionLink } from '@/types/page';
import { useMessages } from '@/lib/i18n/useMessages';
import { XIcon } from '@/components/ui/Icons';

// Custom ORCID icon component
const OrcidIcon = ({ className }: { className?: string }) => (
    <svg
        viewBox="0 0 24 24"
        fill="currentColor"
        className={className}
        xmlns="http://www.w3.org/2000/svg"
    >
        <path d="M12 0C5.372 0 0 5.372 0 12s5.372 12 12 12 12-5.372 12-12S18.628 0 12 0zM7.369 4.378c.525 0 .947.431.947.947s-.422.947-.947.947a.95.95 0 0 1-.947-.947c0-.525.422-.947.947-.947zm-.722 3.038h1.444v10.041H6.647V7.416zm3.562 0h3.9c3.712 0 5.344 2.653 5.344 5.025 0 2.578-2.016 5.025-5.325 5.025h-3.919V7.416zm1.444 1.303v7.444h2.297c3.272 0 4.022-2.484 4.022-3.722 0-2.016-1.284-3.722-4.097-3.722h-2.222z" />
    </svg>
);

interface ProfileProps {
    author: SiteConfig['author'];
    social: SiteConfig['social'];
    features: SiteConfig['features'];
    researchInterests?: string[];
    currentRoles?: CardItem[];
    sectionLinks?: PageSectionLink[];
}

export default function Profile({
    author,
    social,
    researchInterests = [],
    currentRoles = [],
    sectionLinks = [],
}: ProfileProps) {
    const messages = useMessages();

    const [showAddress, setShowAddress] = useState(false);
    const [isAddressPinned, setIsAddressPinned] = useState(false);
    const [showEmail, setShowEmail] = useState(false);
    const [isEmailPinned, setIsEmailPinned] = useState(false);
    const [lastClickedTooltip, setLastClickedTooltip] = useState<'email' | 'address' | null>(null);
    const [activeSection, setActiveSection] = useState(sectionLinks[0]?.id || '');

    useEffect(() => {
        if (sectionLinks.length === 0) return;

        let animationFrame = 0;
        const updateActiveSection = () => {
            const marker = window.scrollY + Math.min(220, window.innerHeight * 0.3);
            let nextActive = sectionLinks[0].id;

            sectionLinks.forEach((section) => {
                const element = document.getElementById(section.id);
                if (element && element.offsetTop <= marker) {
                    nextActive = section.id;
                }
            });

            if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 8) {
                nextActive = sectionLinks[sectionLinks.length - 1].id;
            }

            setActiveSection(nextActive);
        };

        const handleScroll = () => {
            cancelAnimationFrame(animationFrame);
            animationFrame = requestAnimationFrame(updateActiveSection);
        };

        updateActiveSection();
        window.addEventListener('scroll', handleScroll, { passive: true });
        window.addEventListener('resize', handleScroll);

        return () => {
            cancelAnimationFrame(animationFrame);
            window.removeEventListener('scroll', handleScroll);
            window.removeEventListener('resize', handleScroll);
        };
    }, [sectionLinks]);

    const socialLinks = [
        ...(social.email ? [{
            name: messages.profile.email,
            href: `mailto:${social.email}`,
            icon: EnvelopeIcon,
            isEmail: true,
        }] : []),
        ...(social.location || social.location_details ? [{
            name: messages.profile.location,
            href: social.location_url || '#',
            icon: MapPinIcon,
            isLocation: true,
        }] : []),
        ...(social.google_scholar ? [{
            name: 'Google Scholar',
            href: social.google_scholar,
            icon: AcademicCapIcon,
        }] : []),
        ...(social.orcid ? [{
            name: 'ORCID',
            href: social.orcid,
            icon: OrcidIcon,
        }] : []),
        ...(social.github ? [{
            name: 'GitHub',
            href: social.github,
            icon: Github,
        }] : []),
        ...(social.linkedin ? [{
            name: 'LinkedIn',
            href: social.linkedin,
            icon: Linkedin,
        }] : []),
        ...(social.x ? [{
            name: 'X',
            href: social.x as string,
            icon: XIcon,
        }] : []),
    ];

    return (
        <motion.div
            className="sticky top-8 animate-fade-up"
        >
            {/* Profile Image */}
            <div className="w-64 h-64 mx-auto mb-6 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105">
                <Image
                    src={author.avatar}
                    alt={author.name}
                    width={256}
                    height={256}
                    className="w-full h-full object-cover object-[32%_center]"
                    priority
                />
            </div>

            {/* Name */}
            <div className="text-center mb-4">
                <h1 className="text-3xl font-serif font-bold text-primary">
                    {author.name}
                </h1>
            </div>

            {/* Research signature */}
            {researchInterests.length > 0 && (
                <div className="mx-auto mb-4 w-full max-w-[18rem]">
                    <div className="mb-2.5 flex items-center justify-center gap-2.5">
                        <span className="h-px w-7 bg-gradient-to-r from-transparent to-accent/45" />
                        <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-500 dark:text-neutral-400">
                            {messages.profile.researchInterests}
                        </h2>
                        <span className="h-px w-7 bg-gradient-to-l from-transparent to-accent/45" />
                    </div>
                    <div className="grid w-full grid-cols-2 gap-1.5">
                        {researchInterests.map((interest) => (
                            <motion.div
                                key={interest}
                                whileHover={{ y: -2, scale: 1.015 }}
                                transition={{ type: 'spring', stiffness: 360, damping: 24 }}
                                className="group/focus relative flex min-h-10 min-w-0 items-center gap-1.5 overflow-hidden rounded-full border border-neutral-200/80 bg-neutral-50/70 px-2 py-2 text-left shadow-[0_3px_12px_-8px_rgba(15,23,42,0.22)] transition-colors duration-200 hover:border-accent/30 hover:bg-accent/[0.06] dark:border-white/10 dark:bg-neutral-900/65"
                            >
                                <span className="pointer-events-none absolute -right-3 -top-3 h-8 w-8 rounded-full bg-accent/0 blur-xl transition-colors duration-300 group-hover/focus:bg-accent/20" />
                                <span className="relative flex h-2 w-2 flex-shrink-0 items-center justify-center">
                                    <span className="absolute h-2 w-2 rounded-full bg-accent/20 transition-transform duration-300 group-hover/focus:scale-[1.8]" />
                                    <span className="relative h-1 w-1 rounded-full bg-accent shadow-[0_0_6px_var(--accent)]" />
                                </span>
                                <span className="relative min-w-0 whitespace-nowrap text-[10px] font-medium leading-none text-neutral-600 dark:text-neutral-500">
                                    {interest}
                                </span>
                            </motion.div>
                        ))}
                    </div>
                </div>
            )}

            {/* Contact Links */}
            <div className="flex flex-wrap justify-center gap-3 sm:gap-4 mb-5 relative px-2">
                {socialLinks.map((link) => {
                    const IconComponent = link.icon;
                    if (link.isLocation) {
                        return (
                            <div key={link.name} className="relative">
                                <button
                                    onMouseEnter={() => {
                                        if (!isAddressPinned) setShowAddress(true);
                                        setLastClickedTooltip('address');
                                    }}
                                    onMouseLeave={() => !isAddressPinned && setShowAddress(false)}
                                    onClick={() => {
                                        setIsAddressPinned(!isAddressPinned);
                                        setShowAddress(!isAddressPinned);
                                        setLastClickedTooltip('address');
                                    }}
                                    className={`p-2 sm:p-2 transition-colors duration-200 ${isAddressPinned
                                        ? 'text-accent'
                                        : 'text-neutral-600 dark:text-neutral-400 hover:text-accent'
                                        }`}
                                    aria-label={link.name}
                                >
                                    {isAddressPinned ? (
                                        <MapPinSolidIcon className="h-5 w-5" />
                                    ) : (
                                        <MapPinIcon className="h-5 w-5" />
                                    )}
                                </button>

                                {/* Address tooltip */}
                                <AnimatePresence>
                                    {(showAddress || isAddressPinned) && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10, scale: 0.8 }}
                                            animate={{ opacity: 1, y: -10, scale: 1 }}
                                            exit={{ opacity: 0, y: -20, scale: 0.8 }}
                                            className={`absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-full bg-neutral-800 text-white px-4 py-3 rounded-lg text-sm font-medium shadow-lg max-w-[calc(100vw-2rem)] sm:max-w-none sm:whitespace-nowrap ${lastClickedTooltip === 'address' ? 'z-20' : 'z-10'
                                                }`}
                                            onMouseEnter={() => {
                                                if (!isAddressPinned) setShowAddress(true);
                                                setLastClickedTooltip('address');
                                            }}
                                            onMouseLeave={() => !isAddressPinned && setShowAddress(false)}
                                        >
                                            <div className="text-center">
                                                <div className="flex items-center justify-center space-x-2 mb-1">
                                                    <p className="font-semibold">{messages.profile.workAddress}</p>
                                                    {!isAddressPinned && (
                                                        <div className="flex items-center space-x-0.5 text-xs text-neutral-400 opacity-60">
                                                            <Pin className="h-2.5 w-2.5" />
                                                            <span className="hidden sm:inline">{messages.profile.click}</span>
                                                        </div>
                                                    )}
                                                </div>
                                                {social.location_details?.map((line, i) => (
                                                    <p key={i} className="break-words">{line}</p>
                                                ))}
                                                <div className="mt-2 flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2 justify-center">
                                                    {social.location_url && (
                                                        <a
                                                            href={social.location_url}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="inline-flex items-center justify-center space-x-2 bg-accent hover:bg-accent-dark text-white px-3 py-1 rounded-md text-xs font-medium transition-colors duration-200 w-full sm:w-auto"
                                                        >
                                                            <MapPinIcon className="h-4 w-4" />
                                                            <span>{messages.profile.googleMap}</span>
                                                        </a>
                                                    )}
                                                </div>

                                            </div>
                                            <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-neutral-800"></div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        );
                    }
                    if (link.isEmail) {
                        return (
                            <div key={link.name} className="relative">
                                <button
                                    onMouseEnter={() => {
                                        if (!isEmailPinned) setShowEmail(true);
                                        setLastClickedTooltip('email');
                                    }}
                                    onMouseLeave={() => !isEmailPinned && setShowEmail(false)}
                                    onClick={() => {
                                        setIsEmailPinned(!isEmailPinned);
                                        setShowEmail(!isEmailPinned);
                                        setLastClickedTooltip('email');
                                    }}
                                    className={`p-2 sm:p-2 transition-colors duration-200 ${isEmailPinned
                                        ? 'text-accent'
                                        : 'text-neutral-600 dark:text-neutral-400 hover:text-accent'
                                        }`}
                                    aria-label={link.name}
                                >
                                    {isEmailPinned ? (
                                        <EnvelopeSolidIcon className="h-5 w-5" />
                                    ) : (
                                        <EnvelopeIcon className="h-5 w-5" />
                                    )}
                                </button>

                                {/* Email tooltip */}
                                <AnimatePresence>
                                    {(showEmail || isEmailPinned) && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10, scale: 0.8 }}
                                            animate={{ opacity: 1, y: -10, scale: 1 }}
                                            exit={{ opacity: 0, y: -20, scale: 0.8 }}
                                            className={`absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-full bg-neutral-800 text-white px-4 py-3 rounded-lg text-sm font-medium shadow-lg max-w-[calc(100vw-2rem)] sm:max-w-none sm:whitespace-nowrap ${lastClickedTooltip === 'email' ? 'z-20' : 'z-10'
                                                }`}
                                            onMouseEnter={() => {
                                                if (!isEmailPinned) setShowEmail(true);
                                                setLastClickedTooltip('email');
                                            }}
                                            onMouseLeave={() => !isEmailPinned && setShowEmail(false)}
                                        >
                                            <div className="text-center">
                                                <div className="flex items-center justify-center space-x-2 mb-1">
                                                    <p className="font-semibold">{messages.profile.email}</p>
                                                    {!isEmailPinned && (
                                                        <div className="flex items-center space-x-0.5 text-xs text-neutral-400 opacity-60">
                                                            <Pin className="h-2.5 w-2.5" />
                                                            <span className="hidden sm:inline">{messages.profile.click}</span>
                                                        </div>
                                                    )}
                                                </div>
                                                <p className="break-words">{social.email?.replace('@', ' (at) ')}</p>
                                                <div className="mt-2">
                                                    <a
                                                        href={link.href}
                                                        className="inline-flex items-center justify-center space-x-2 bg-accent hover:bg-accent-dark text-white px-3 py-1 rounded-md text-xs font-medium transition-colors duration-200 w-full sm:w-auto"
                                                    >
                                                        <EnvelopeIcon className="h-4 w-4" />
                                                        <span className="sm:hidden">{messages.profile.send}</span>
                                                        <span className="hidden sm:inline">{messages.profile.sendEmail}</span>
                                                    </a>
                                                </div>
                                            </div>
                                            <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-neutral-800"></div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        );
                    }
                    return (
                        <a
                            key={link.name}
                            href={link.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 sm:p-2 text-neutral-600 dark:text-neutral-400 hover:text-accent transition-colors duration-200"
                            aria-label={link.name}
                        >
                            <IconComponent className="h-5 w-5" />
                        </a>
                    );
                })}
            </div>

            {(currentRoles.length > 0 || sectionLinks.length > 0) && (
                <motion.aside
                    whileHover={{ y: -3 }}
                    transition={{ type: 'spring', stiffness: 320, damping: 24 }}
                    className="group relative hidden lg:block w-full max-w-[18rem] mx-auto overflow-hidden rounded-2xl border border-neutral-200/80 dark:border-white/10 bg-white/85 dark:bg-neutral-900/85 shadow-[0_10px_35px_-18px_rgba(15,23,42,0.28)] dark:shadow-[0_14px_40px_-20px_rgba(0,0,0,0.75)] backdrop-blur-xl"
                >
                    <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent/80 to-transparent" />
                    <div className="pointer-events-none absolute -right-12 -top-12 h-28 w-28 rounded-full bg-accent/10 blur-2xl transition-colors duration-300 group-hover:bg-accent/20" />
                    <div className="pointer-events-none absolute -bottom-16 -left-12 h-32 w-32 rounded-full bg-primary/5 blur-3xl dark:bg-accent/5" />

                    <div className="relative p-4">
                        {currentRoles.length > 0 && (
                            <div>
                                <div className="mb-3 flex items-center justify-between">
                                    <h2 className="text-[11px] font-bold uppercase tracking-[0.18em] text-neutral-500 dark:text-neutral-400">
                                        {messages.profile.currently}
                                    </h2>
                                    <span className="flex items-center gap-1.5 text-[10px] font-medium text-emerald-600 dark:text-emerald-400">
                                        <span className="relative flex h-2 w-2">
                                            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
                                            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
                                        </span>
                                        {messages.profile.active}
                                    </span>
                                </div>

                                <div className="space-y-2">
                                    {currentRoles.map((role) => (
                                        <div
                                            key={`${role.title}-${role.subtitle}`}
                                            className="flex items-center gap-3 rounded-xl border border-transparent px-2 py-2 transition-all duration-200 hover:border-accent/20 hover:bg-accent/[0.06]"
                                        >
                                            {role.image && (
                                                <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-white p-1.5 shadow-sm ring-1 ring-black/[0.06] dark:ring-white/10">
                                                    <Image
                                                        src={role.image}
                                                        alt=""
                                                        width={32}
                                                        height={32}
                                                        className="h-full w-full object-contain"
                                                    />
                                                </span>
                                            )}
                                            <span className="min-w-0 flex-1">
                                                <span className="block truncate text-[13px] font-semibold leading-tight text-primary">
                                                    {role.title}
                                                </span>
                                                <span className="mt-1 block truncate text-[11px] text-neutral-500 dark:text-neutral-400">
                                                    {role.subtitle}
                                                </span>
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {currentRoles.length > 0 && sectionLinks.length > 0 && (
                            <div className="my-4 h-px bg-gradient-to-r from-transparent via-neutral-200 to-transparent dark:via-white/10" />
                        )}

                        {sectionLinks.length > 0 && (
                            <nav aria-label={messages.profile.onThisPage}>
                                <h2 className="mb-2 px-2 text-[11px] font-bold uppercase tracking-[0.18em] text-neutral-500 dark:text-neutral-400">
                                    {messages.profile.onThisPage}
                                </h2>
                                <div className="space-y-0.5">
                                    {sectionLinks.map((section, index) => {
                                        const isActive = activeSection === section.id;
                                        return (
                                            <a
                                                key={section.id}
                                                href={`#${section.id}`}
                                                onClick={() => setActiveSection(section.id)}
                                                aria-current={isActive ? 'location' : undefined}
                                                className={`relative flex items-center justify-between overflow-hidden rounded-lg px-2.5 py-2 text-[12px] font-medium transition-colors duration-200 ${
                                                    isActive
                                                        ? 'text-primary'
                                                        : 'text-neutral-500 hover:text-primary dark:text-neutral-400'
                                                }`}
                                            >
                                                {isActive && (
                                                    <motion.span
                                                        layoutId="profile-active-section"
                                                        className="absolute inset-0 rounded-lg bg-gradient-to-r from-accent/15 to-accent/[0.04] ring-1 ring-inset ring-accent/15"
                                                        transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                                                    />
                                                )}
                                                <span className="relative flex min-w-0 items-center gap-2.5">
                                                    <span className={`h-1.5 w-1.5 flex-shrink-0 rounded-full transition-all duration-200 ${
                                                        isActive ? 'bg-accent shadow-[0_0_8px_var(--accent)]' : 'bg-neutral-300 dark:bg-neutral-600'
                                                    }`} />
                                                    <span className="truncate">{section.label}</span>
                                                </span>
                                                <span className="relative flex items-center gap-1">
                                                    <span className={`text-[9px] tabular-nums transition-opacity ${isActive ? 'opacity-50' : 'opacity-0'}`}>
                                                        {String(index + 1).padStart(2, '0')}
                                                    </span>
                                                    <ChevronRight className={`h-3.5 w-3.5 transition-all duration-200 ${
                                                        isActive ? 'translate-x-0 text-accent opacity-100' : '-translate-x-1 opacity-0'
                                                    }`} />
                                                </span>
                                            </a>
                                        );
                                    })}
                                </div>
                            </nav>
                        )}
                    </div>
                </motion.aside>
            )}
        </motion.div>
    );
}
