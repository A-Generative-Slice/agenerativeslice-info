import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Menu, X, ExternalLink, 
    Boxes, Zap, Bot, Cpu, Presentation, 
    FolderKanban, GraduationCap, ChevronRight,
    Terminal
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import logoImg from '../assets/logo.jpg';
import { detailedProducts } from '../data/productsData';

export const Navbar = () => {
    const [scrolled, setScrolled] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const location = useLocation();

    // Close mobile menu on route change
    useEffect(() => {
        setMobileOpen(false);
    }, [location.pathname]);

    // Handle scroll elevation
    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    // Prevent background scroll when mobile drawer is open
    useEffect(() => {
        if (mobileOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [mobileOpen]);

    const getProductIcon = (id: string, className = "w-4 h-4") => {
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

    return (
        <>
            {/* Top Fixed Header Bar */}
            <header className="fixed top-0 left-0 right-0 z-50 px-3 sm:px-8 pt-2.5 sm:pt-4 transition-all duration-200">
                <div className="max-w-6xl mx-auto flex items-center justify-between">
                    {/* Brand Identity / Home Link */}
                    <Link 
                        to="/" 
                        className={`flex items-center gap-2.5 sm:gap-3 px-3 sm:px-3.5 py-1.5 sm:py-2 rounded-2xl border transition-all duration-200 ${
                            scrolled
                                ? 'bg-white/95 border-black/10 shadow-md backdrop-blur-xl'
                                : 'bg-white/80 border-black/5 backdrop-blur-md'
                        }`}
                    >
                        <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl overflow-hidden border border-black/10 shrink-0 shadow-sm">
                            <img src={logoImg} alt="A Generative Slice" className="w-full h-full object-cover" />
                        </div>
                        <div className="flex items-center gap-1.5">
                            <span className="font-extrabold text-[11px] sm:text-xs tracking-wider uppercase text-[#0F172A] font-heading">
                                A GENERATIVE SLICE
                            </span>
                            <span className="text-[#FF5C00] font-mono text-[10px] font-bold">.info</span>
                        </div>
                    </Link>

                    {/* Desktop Navigation Links */}
                    <nav className="hidden lg:flex items-center gap-1 px-3 py-1.5 rounded-2xl border bg-white/90 border-black/10 shadow-sm backdrop-blur-xl">
                        <Link
                            to="/"
                            className={`px-3 py-1.5 rounded-xl text-xs font-semibold uppercase tracking-wider transition-colors ${
                                location.pathname === '/' 
                                    ? 'text-[#FF5C00] bg-[#FF5C00]/10 font-bold' 
                                    : 'text-[#64748B] hover:text-[#FF5C00] hover:bg-black/5'
                            }`}
                        >
                            Hub
                        </Link>

                        {detailedProducts.map((p) => (
                            <Link
                                key={p.id}
                                to={p.path}
                                className={`px-2.5 py-1.5 rounded-xl text-xs font-semibold uppercase tracking-wider transition-colors ${
                                    location.pathname === p.path 
                                        ? 'text-[#FF5C00] bg-[#FF5C00]/10 font-bold' 
                                        : 'text-[#64748B] hover:text-[#FF5C00] hover:bg-black/5'
                                }`}
                            >
                                {p.name.replace('Slice', '')}
                            </Link>
                        ))}
                    </nav>

                    {/* Right Action Group */}
                    <div className="flex items-center gap-2">
                        {/* Corporate Gateway Link (Desktop) */}
                        <a
                            href="https://agenerativeslice.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-[#FF5C00] bg-[#FF5C00]/10 hover:bg-[#FF5C00]/15 border border-[#FF5C00]/25 transition-all font-heading min-h-[40px]"
                            title="Visit Corporate Headquarters"
                        >
                            <span>agenerativeslice.com</span>
                            <ExternalLink className="w-3.5 h-3.5" />
                        </a>

                        {/* Mobile Hamburger / Close Button (Min 44x44px touch target) */}
                        <button 
                            onClick={() => setMobileOpen(!mobileOpen)}
                            className="lg:hidden w-11 h-11 rounded-xl flex items-center justify-center border border-black/10 bg-white/90 text-[#0F172A] hover:text-[#FF5C00] transition-colors shadow-sm cursor-pointer"
                            aria-label={mobileOpen ? "Close menu" : "Open navigation menu"}
                            aria-expanded={mobileOpen}
                        >
                            {mobileOpen ? (
                                <X className="w-5 h-5 text-[#FF5C00]" />
                            ) : (
                                <Menu className="w-5 h-5" />
                            )}
                        </button>
                    </div>
                </div>
            </header>

            {/* Mobile Drawer Navigation (High-Touch Mobile UX) */}
            <AnimatePresence>
                {mobileOpen && (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="fixed inset-0 z-40 lg:hidden bg-black/40 backdrop-blur-sm flex flex-col justify-end"
                        onClick={() => setMobileOpen(false)}
                    >
                        <motion.div
                            initial={{ y: "100%" }}
                            animate={{ y: 0 }}
                            exit={{ y: "100%" }}
                            transition={{ type: "spring", damping: 28, stiffness: 300 }}
                            className="bg-white border-t border-black/10 rounded-t-3xl p-5 sm:p-6 max-h-[88vh] overflow-y-auto flex flex-col shadow-2xl pb-8"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Drawer Drag Bar */}
                            <div className="w-12 h-1.5 bg-black/10 rounded-full mx-auto mb-4" />

                            {/* Drawer Header */}
                            <div className="flex items-center justify-between pb-3 border-b border-black/5 mb-3">
                                <div>
                                    <span className="text-[10px] font-mono uppercase tracking-widest text-[#FF5C00] font-bold block">
                                        | Navigation Menu
                                    </span>
                                    <h3 className="text-base font-black text-[#0F172A] font-heading">
                                        Slice Suite Workspaces
                                    </h3>
                                </div>
                                <span className="text-xs font-mono text-[#64748B]">
                                    7 Sandboxes
                                </span>
                            </div>

                            {/* Hub Link */}
                            <Link
                                to="/"
                                onClick={() => setMobileOpen(false)}
                                className={`flex items-center justify-between p-3.5 rounded-2xl border mb-2 transition-all min-h-[50px] ${
                                    location.pathname === '/'
                                        ? 'border-[#FF5C00] bg-[#FF5C00]/10 text-[#FF5C00]'
                                        : 'border-black/5 bg-black/[0.02] text-[#0F172A]'
                                }`}
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-xl bg-[#FF5C00]/10 text-[#FF5C00] flex items-center justify-center">
                                        <Terminal className="w-4 h-4" />
                                    </div>
                                    <div>
                                        <span className="font-bold text-sm block font-heading">Platform Hub</span>
                                        <span className="text-[11px] text-[#64748B]">Spotlight Search &amp; Overview</span>
                                    </div>
                                </div>
                                <ChevronRight className="w-4 h-4 text-[#64748B]" />
                            </Link>

                            {/* 7 Workspaces List */}
                            <div className="space-y-1.5 mb-5">
                                {detailedProducts.map((p) => {
                                    const active = location.pathname === p.path;
                                    return (
                                        <Link
                                            key={p.id}
                                            to={p.path}
                                            onClick={() => setMobileOpen(false)}
                                            className={`flex items-center justify-between p-3 rounded-2xl border transition-all min-h-[50px] ${
                                                active
                                                    ? 'border-[#FF5C00] bg-[#FF5C00]/10 text-[#FF5C00]'
                                                    : 'border-black/5 bg-black/[0.02] text-[#0F172A] hover:border-[#FF5C00]/30'
                                            }`}
                                        >
                                            <div className="flex items-center gap-3 min-w-0">
                                                <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                                                    active ? 'bg-[#FF5C00] text-white' : 'bg-black/5 text-[#FF5C00]'
                                                }`}>
                                                    {getProductIcon(p.id, "w-4 h-4")}
                                                </div>
                                                <div className="min-w-0">
                                                    <span className="font-bold text-sm block font-heading truncate">{p.name}</span>
                                                    <span className="text-[11px] text-[#64748B] block truncate">{p.tagline}</span>
                                                </div>
                                            </div>
                                            <ChevronRight className="w-4 h-4 text-[#64748B] shrink-0" />
                                        </Link>
                                    );
                                })}
                            </div>

                            {/* External Links & Corporate Bridge */}
                            <div className="pt-3 border-t border-black/5 space-y-2">
                                <a
                                    href="https://agenerativeslice.com"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center justify-between p-3.5 rounded-2xl border border-[#FF5C00]/30 bg-[#FF5C00]/5 text-[#FF5C00] font-bold text-xs uppercase tracking-wider min-h-[48px]"
                                >
                                    <span>Corporate Studio: agenerativeslice.com</span>
                                    <ExternalLink className="w-4 h-4" />
                                </a>

                                <a
                                    href="https://github.com/A-Generative-Slice"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center justify-between p-3.5 rounded-2xl border border-black/10 bg-black/5 text-[#0F172A] font-mono text-xs min-h-[48px]"
                                >
                                    <span>github.com/A-Generative-Slice</span>
                                    <ChevronRight className="w-4 h-4 text-[#64748B]" />
                                </a>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};
