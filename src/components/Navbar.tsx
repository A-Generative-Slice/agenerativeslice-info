import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Menu, X, ExternalLink, ChevronDown, ArrowUpRight,
    Boxes, Zap, Bot, Cpu, Presentation, FolderKanban, GraduationCap, Terminal
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import logoImg from '../assets/logo.jpg';
import { detailedProducts } from '../data/productsData';

const getProductIcon = (id: string, className = 'w-4 h-4') => {
    switch (id) {
        case 'slice-3d': return <Boxes className={className} />;
        case 'slice-leads': return <Zap className={className} />;
        case 'slice-mail': return <Bot className={className} />;
        case 'slice-inbox': return <Cpu className={className} />;
        case 'slice-ppt': return <Presentation className={className} />;
        case 'slice-dam': return <FolderKanban className={className} />;
        case 'slice-class': return <GraduationCap className={className} />;
        default: return <Terminal className={className} />;
    }
};

export const Navbar = () => {
    const [scrolled, setScrolled] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const [suiteOpen, setSuiteOpen] = useState(false);
    const suiteRef = useRef<HTMLDivElement | null>(null);
    const location = useLocation();

    useEffect(() => {
        setMobileOpen(false);
        setSuiteOpen(false);
    }, [location.pathname]);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 16);
        onScroll();
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    useEffect(() => {
        if (!suiteOpen) return;
        const onPointerDown = (event: PointerEvent) => {
            if (!suiteRef.current?.contains(event.target as Node)) setSuiteOpen(false);
        };
        const onKey = (event: KeyboardEvent) => {
            if (event.key === 'Escape') setSuiteOpen(false);
        };
        window.addEventListener('pointerdown', onPointerDown);
        window.addEventListener('keydown', onKey);
        return () => {
            window.removeEventListener('pointerdown', onPointerDown);
            window.removeEventListener('keydown', onKey);
        };
    }, [suiteOpen]);

    useEffect(() => {
        document.body.style.overflow = mobileOpen ? 'hidden' : '';
        return () => {
            document.body.style.overflow = '';
        };
    }, [mobileOpen]);

    const activeProduct = detailedProducts.find((p) => p.path === location.pathname);

    return (
        <>
            <header className="fixed inset-x-0 top-0 z-50 px-3 sm:px-6 pt-3">
                <div className="mx-auto max-w-6xl">
                    <div
                        className={`flex items-center justify-between gap-2 rounded-[1.35rem] border px-2.5 py-2 transition-all duration-500 ${
                            scrolled
                                ? 'bg-white/85 border-black/[0.08] shadow-[0_12px_40px_-16px_rgba(15,23,42,0.25)] backdrop-blur-xl'
                                : 'bg-white/55 border-white/70 backdrop-blur-lg'
                        }`}
                    >
                        <Link to="/" className="flex items-center gap-3 pl-1 pr-2 py-0.5 shrink-0" aria-label="A Generative Slice — home">
                            <span className="grid place-items-center w-9 h-9 rounded-xl overflow-hidden border border-black/[0.08] shadow-sm bg-white">
                                <img src={logoImg} alt="" className="w-full h-full object-cover" />
                            </span>
                            <span className="flex flex-col leading-none">
                                <span className="font-heading font-extrabold text-[10px] sm:text-[11px] tracking-[0.18em] text-[#0F172A]">
                                    A GENERATIVE SLICE
                                    <span className="ml-1.5 font-mono text-[9px] tracking-normal text-[#FF5C00]">.info</span>
                                </span>
                                <span className="mt-1 font-mono text-[8px] sm:text-[9px] uppercase tracking-[0.2em] text-[#94A3B8]">
                                    Systems Laboratory
                                </span>
                            </span>
                        </Link>

                        <nav className="hidden md:flex items-center gap-0.5">
                            <Link
                                to="/"
                                className={`px-3.5 py-2 rounded-xl text-[10px] font-heading font-bold uppercase tracking-[0.16em] transition-colors ${
                                    location.pathname === '/'
                                        ? 'text-[#FF5C00] bg-[#FF5C00]/[0.08]'
                                        : 'text-[#64748B] hover:text-[#0F172A] hover:bg-black/[0.04]'
                                }`}
                            >
                                Hub
                            </Link>

                            <div className="relative" ref={suiteRef}>
                                <button
                                    type="button"
                                    onClick={() => setSuiteOpen((open) => !open)}
                                    aria-expanded={suiteOpen}
                                    className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-[10px] font-heading font-bold uppercase tracking-[0.16em] transition-colors ${
                                        activeProduct || suiteOpen
                                            ? 'text-[#FF5C00] bg-[#FF5C00]/[0.08]'
                                            : 'text-[#64748B] hover:text-[#0F172A] hover:bg-black/[0.04]'
                                    }`}
                                >
                                    Suite
                                    <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-300 ${suiteOpen ? 'rotate-180' : ''}`} />
                                </button>

                                <AnimatePresence>
                                    {suiteOpen && (
                                        <motion.div
                                            initial={{ opacity: 0, y: -6, scale: 0.98 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            exit={{ opacity: 0, y: -6, scale: 0.98 }}
                                            transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
                                            className="absolute left-1/2 -translate-x-1/2 top-[calc(100%+12px)] w-[340px] rounded-2xl border border-black/[0.08] bg-white/95 backdrop-blur-xl shadow-[0_30px_70px_-20px_rgba(15,23,42,0.35)] p-2"
                                        >
                                            <p className="px-3 pt-2 pb-1.5 font-mono text-[9px] uppercase tracking-[0.2em] text-[#94A3B8]">
                                                Seven live sandboxes
                                            </p>
                                            {detailedProducts.map((product) => (
                                                <Link
                                                    key={product.id}
                                                    to={product.path}
                                                    className={`flex items-center gap-3 rounded-xl px-2.5 py-2 transition-colors ${
                                                        location.pathname === product.path ? 'bg-[#FF5C00]/[0.08]' : 'hover:bg-black/[0.04]'
                                                    }`}
                                                >
                                                    <span className="grid place-items-center w-8 h-8 rounded-lg bg-[#FF5C00]/[0.1] text-[#FF5C00] shrink-0">
                                                        {getProductIcon(product.id)}
                                                    </span>
                                                    <span className="min-w-0 flex-1">
                                                        <span className="block font-heading font-bold text-[11px] text-[#0F172A]">{product.name}</span>
                                                        <span className="block text-[10px] text-[#94A3B8] truncate">{product.category}</span>
                                                    </span>
                                                    <ArrowUpRight className="w-3.5 h-3.5 text-[#CBD5E1] shrink-0" />
                                                </Link>
                                            ))}
                                            <div className="mt-1 border-t border-black/[0.06] px-2.5 py-2">
                                                <span className="font-mono text-[9px] uppercase tracking-[0.16em] text-[#94A3B8]">
                                                    All systems · GitHub-synced
                                                </span>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </nav>

                        <div className="flex items-center gap-1.5">
                            <a
                                href="https://github.com/A-Generative-Slice"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="hidden sm:grid place-items-center w-9 h-9 rounded-xl border border-black/[0.08] bg-white/70 text-[#64748B] hover:text-[#0F172A] hover:bg-white transition-colors"
                                aria-label="GitHub organization"
                                title="GitHub"
                            >
                                <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor" aria-hidden="true">
                                    <path d="M12 .5C5.7.5.5 5.7.5 12c0 5.1 3.3 9.4 7.9 10.9.6.1.8-.2.8-.6v-2c-3.2.7-3.9-1.5-3.9-1.5-.5-1.3-1.3-1.7-1.3-1.7-1-.7.1-.7.1-.7 1.1.1 1.7 1.1 1.7 1.1 1 1.7 2.6 1.2 3.2.9.1-.7.4-1.2.7-1.5-2.6-.3-5.3-1.3-5.3-5.7 0-1.3.5-2.3 1.2-3.1-.1-.3-.5-1.5.1-3.1 0 0 1-.3 3.2 1.2a11 11 0 0 1 5.8 0c2.2-1.5 3.2-1.2 3.2-1.2.6 1.6.2 2.8.1 3.1.8.8 1.2 1.8 1.2 3.1 0 4.4-2.7 5.4-5.3 5.7.4.4.8 1.1.8 2.2v3.3c0 .3.2.7.8.6 4.6-1.5 7.9-5.8 7.9-10.9C23.5 5.7 18.3.5 12 .5z" />
                                </svg>
                            </a>

                            <a
                                href="https://agenerativeslice.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="hidden lg:inline-flex items-center gap-1.5 rounded-xl border border-[#FF5C00]/25 bg-[#FF5C00]/[0.07] px-3.5 py-2 font-heading text-[10px] font-bold text-[#FF5C00] hover:bg-[#FF5C00] hover:text-white transition-all"
                            >
                                agenerativeslice.com
                                <ExternalLink className="w-3 h-3" />
                            </a>

                            <button
                                onClick={() => setMobileOpen(true)}
                                className="md:hidden grid place-items-center w-10 h-10 rounded-xl border border-black/[0.08] bg-white/80 text-[#0F172A] hover:text-[#FF5C00] transition-colors"
                                aria-label="Open navigation menu"
                            >
                                <Menu className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            <AnimatePresence>
                {mobileOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="fixed inset-0 z-[60] md:hidden bg-[#0F172A]/40 backdrop-blur-sm flex flex-col justify-end"
                        onClick={() => setMobileOpen(false)}
                    >
                        <motion.div
                            initial={{ y: '100%' }}
                            animate={{ y: 0 }}
                            exit={{ y: '100%' }}
                            transition={{ type: 'spring', damping: 30, stiffness: 320 }}
                            className="bg-[#FAFAFA] rounded-t-[28px] p-5 pb-8 max-h-[90vh] overflow-y-auto shadow-2xl border-t border-white/60"
                            onClick={(event) => event.stopPropagation()}
                        >
                            <div className="w-11 h-1.5 rounded-full bg-black/10 mx-auto mb-5" />

                            <div className="flex items-start justify-between mb-4">
                                <div>
                                    <p className="kicker">Navigation</p>
                                    <h3 className="font-heading font-black text-lg text-[#0F172A] mt-1.5">Slice Suite workspaces</h3>
                                </div>
                                <button
                                    onClick={() => setMobileOpen(false)}
                                    className="grid place-items-center w-9 h-9 rounded-xl border border-black/[0.08] bg-white text-[#64748B]"
                                    aria-label="Close menu"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>

                            <Link
                                to="/"
                                className={`flex items-center justify-between rounded-2xl border px-3.5 py-3 mb-2 ${
                                    location.pathname === '/' ? 'border-[#FF5C00]/40 bg-[#FF5C00]/[0.06]' : 'border-black/[0.07] bg-white'
                                }`}
                            >
                                <span className="flex items-center gap-3">
                                    <span className="grid place-items-center w-9 h-9 rounded-xl bg-[#FF5C00] text-white">
                                        <Terminal className="w-4 h-4" />
                                    </span>
                                    <span>
                                        <span className="block font-heading font-bold text-[13px] text-[#0F172A]">Platform hub</span>
                                        <span className="block text-[11px] text-[#94A3B8]">Search all seven sandboxes</span>
                                    </span>
                                </span>
                                <ArrowUpRight className="w-4 h-4 text-[#FF5C00]" />
                            </Link>

                            <div className="space-y-1.5 mb-4">
                                {detailedProducts.map((product) => {
                                    const active = location.pathname === product.path;
                                    return (
                                        <Link
                                            key={product.id}
                                            to={product.path}
                                            className={`flex items-center justify-between rounded-2xl border px-3.5 py-2.5 ${
                                                active ? 'border-[#FF5C00]/40 bg-[#FF5C00]/[0.06]' : 'border-black/[0.07] bg-white'
                                            }`}
                                        >
                                            <span className="flex items-center gap-3 min-w-0">
                                                <span className={`grid place-items-center w-8 h-8 rounded-lg shrink-0 ${active ? 'bg-[#FF5C00] text-white' : 'bg-[#FF5C00]/10 text-[#FF5C00]'}`}>
                                                    {getProductIcon(product.id)}
                                                </span>
                                                <span className="min-w-0">
                                                    <span className="block font-heading font-bold text-[12px] text-[#0F172A]">{product.name}</span>
                                                    <span className="block text-[10px] text-[#94A3B8] truncate">{product.category}</span>
                                                </span>
                                            </span>
                                            <ArrowUpRight className="w-3.5 h-3.5 text-[#CBD5E1] shrink-0" />
                                        </Link>
                                    );
                                })}
                            </div>

                            <a
                                href="https://agenerativeslice.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center justify-between rounded-2xl border border-[#FF5C00]/30 bg-[#FF5C00]/[0.06] px-3.5 py-3 font-heading text-[11px] font-bold text-[#FF5C00]"
                            >
                                <span>Corporate studio · agenerativeslice.com</span>
                                <ExternalLink className="w-3.5 h-3.5" />
                            </a>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};
