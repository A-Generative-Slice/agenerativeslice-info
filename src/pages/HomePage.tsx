import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
    Search, X, ArrowUpRight, Boxes, Zap, Bot, Cpu, Presentation, FolderKanban,
    GraduationCap, Command, GitBranch, Sparkles, ExternalLink, CornerDownLeft
} from 'lucide-react';
import { detailedProducts } from '../data/productsData';

const getProductIcon = (id: string, className = 'w-5 h-5') => {
    switch (id) {
        case 'slice-3d': return <Boxes className={className} />;
        case 'slice-leads': return <Zap className={className} />;
        case 'slice-mail': return <Bot className={className} />;
        case 'slice-inbox': return <Cpu className={className} />;
        case 'slice-ppt': return <Presentation className={className} />;
        case 'slice-dam': return <FolderKanban className={className} />;
        case 'slice-class': return <GraduationCap className={className} />;
        default: return <Boxes className={className} />;
    }
};

const MARQUEE_ITEMS = [
    'WebGL 3D', 'Agentic AI', 'Lead Engines', 'Cold Outreach', 'Inbox Triage',
    'Deck Automation', 'Document Vault', 'Studio LMS', 'Chennai, IN'
];

export const HomePage: React.FC = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const searchInputRef = useRef<HTMLInputElement | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
                e.preventDefault();
                searchInputRef.current?.focus();
            } else if (e.key === '/' && document.activeElement !== searchInputRef.current && !(document.activeElement instanceof HTMLInputElement)) {
                e.preventDefault();
                searchInputRef.current?.focus();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    const query = searchQuery.trim().toLowerCase();

    const filteredProducts = useMemo(() => {
        if (!query) return detailedProducts;
        return detailedProducts.filter((product) => {
            const haystack = [
                product.name,
                product.category,
                product.tagline,
                product.description,
                product.repoName,
                product.badge,
                ...product.specs.map((s) => `${s.label} ${s.value}`),
                ...product.features.map((f) => `${f.title} ${f.description}`)
            ].join(' ').toLowerCase();
            return haystack.includes(query);
        });
    }, [query]);

    return (
        <div className="relative">
            {/* ================= HERO ================= */}
            <section className="relative min-h-[86svh] flex items-center px-4 sm:px-6 pt-32 sm:pt-36 pb-20 sm:pb-24">
                <div className="mx-auto w-full max-w-5xl">
                    <div className="text-center space-y-7">
                        <p className="kicker reveal justify-center reveal-delay-1">
                            Systems laboratory · Chennai, India
                        </p>

                        <h1 className="headline reveal reveal-delay-2 text-[clamp(2.6rem,7.6vw,5.4rem)] text-[#0F172A]">
                            The <span className="gradient-text">Slice</span> Suite.
                            <span className="block mt-2 text-[clamp(1.05rem,2.4vw,1.6rem)] font-heading font-bold tracking-[-0.01em] text-[#64748B]">
                                Seven live systems. One search bar.
                            </span>
                        </h1>

                        <p className="reveal reveal-delay-3 mx-auto max-w-2xl text-[13px] sm:text-[15px] leading-relaxed text-[#64748B]">
                            Production-grade sandboxes engineered in Chennai — 3D spatial experiences, autonomous lead
                            engines, outreach, inbox triage, decks, document vaults and studio LMS. All running live in
                            your browser, no installs.
                        </p>

                        {/* THE single search bar */}
                        <div className="reveal reveal-delay-4 mx-auto w-full max-w-2xl pt-1">
                            <div className="search-shell flex items-center gap-3 px-4 sm:px-5">
                                <Search className="w-[18px] h-[18px] shrink-0 text-[#FF5C00]" />
                                <input
                                    ref={searchInputRef}
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter' && filteredProducts.length > 0) {
                                            navigate(filteredProducts[0].path);
                                        }
                                    }}
                                    placeholder="Search the suite — 3D, leads, mail…"
                                    autoComplete="off"
                                    spellCheck={false}
                                    aria-label="Search the Slice Suite"
                                    className="flex-1 min-w-0 bg-transparent border-0 outline-none py-4 sm:py-[18px] text-[13px] sm:text-[15px] font-medium text-[#0F172A]"
                                />
                                {searchQuery ? (
                                    <button
                                        onClick={() => {
                                            setSearchQuery('');
                                            searchInputRef.current?.focus();
                                        }}
                                        className="grid place-items-center w-8 h-8 rounded-lg text-[#94A3B8] hover:text-[#0F172A] hover:bg-black/5 transition-colors shrink-0"
                                        aria-label="Clear search"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                ) : (
                                    <kbd className="hidden sm:flex items-center gap-1 rounded-lg border border-black/[0.08] bg-black/[0.03] px-2 py-1 font-mono text-[10px] text-[#94A3B8] shrink-0">
                                        <Command className="w-3 h-3" /> K
                                    </kbd>
                                )}
                            </div>

                            <div className="mt-3 flex items-center justify-between px-1 font-mono text-[10px] uppercase tracking-[0.14em] text-[#94A3B8]">
                                <span>
                                    {query
                                        ? `${filteredProducts.length} result${filteredProducts.length === 1 ? '' : 's'}`
                                        : `${filteredProducts.length} sandboxes in the suite`}
                                </span>
                                <span className="hidden sm:inline-flex items-center gap-1.5 truncate">
                                    {query && filteredProducts.length > 0 ? (
                                        <>
                                            <CornerDownLeft className="w-3 h-3 shrink-0" />
                                            <span className="normal-case tracking-normal">Enter opens {filteredProducts[0].name}</span>
                                        </>
                                    ) : query ? (
                                        <span>no match — try “3D”</span>
                                    ) : (
                                        <>
                                            <CornerDownLeft className="w-3 h-3 shrink-0" /> press / to focus
                                        </>
                                    )}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ================= MARQUEE ================= */}
            <div className="relative border-y border-black/[0.06] bg-white/40 backdrop-blur-sm overflow-hidden" aria-hidden="true">
                <div className="marquee py-3.5">
                    {[0, 1].map((group) => (
                        <div key={group} className="flex items-center shrink-0">
                            {MARQUEE_ITEMS.map((item) => (
                                <span key={`${group}-${item}`} className="flex items-center gap-8 pr-8 font-mono text-[10px] uppercase tracking-[0.22em] text-[#64748B]">
                                    <span>{item}</span>
                                    <span className="text-[#FF8C1A]">✦</span>
                                </span>
                            ))}
                        </div>
                    ))}
                </div>
            </div>

            {/* ================= DIRECTORY ================= */}
            <section className="px-4 sm:px-6 py-16 sm:py-24" id="directory">
                <div className="mx-auto max-w-6xl">
                    <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 sm:mb-10">
                        <div>
                            <p className="kicker">{query ? 'Search results' : 'Live sandboxes'}</p>
                            <h2 className="section-title mt-2.5 text-[#0F172A]">
                                {query ? `Matching “${searchQuery.trim()}”` : 'Choose a system to explore'}
                            </h2>
                        </div>
                        <p className="section-subtitle sm:max-w-[320px] sm:text-right text-[12px] sm:text-[13px]">
                            Every workspace opens a full interactive environment with its own demo, specs and deployment brief.
                        </p>
                    </div>

                    {filteredProducts.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
                            {filteredProducts.map((product, index) => (
                                <Link
                                    key={product.id}
                                    to={product.path}
                                    className="surface-card group relative flex flex-col gap-5 p-5 sm:p-6 reveal"
                                    style={{ animationDelay: `${Math.min(index, 6) * 60}ms` }}
                                >
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="flex items-center gap-3.5 min-w-0">
                                            <span className="grid place-items-center w-12 h-12 rounded-2xl bg-gradient-to-br from-[#FF5C00] to-[#FF8C1A] text-white shadow-[0_10px_24px_-10px_rgba(255,92,0,0.65)] shrink-0">
                                                {getProductIcon(product.id)}
                                            </span>
                                            <div className="min-w-0">
                                                <h3 className="font-heading font-extrabold text-[15px] sm:text-base text-[#0F172A] leading-tight">
                                                    {product.name}
                                                </h3>
                                                <p className="mt-1 font-mono text-[9px] uppercase tracking-[0.16em] text-[#FF5C00] truncate">
                                                    {product.category}
                                                </p>
                                            </div>
                                        </div>
                                        <span className="grid place-items-center w-9 h-9 rounded-full border border-black/[0.08] text-[#94A3B8] group-hover:border-[#FF5C00] group-hover:bg-[#FF5C00] group-hover:text-white transition-all duration-300 shrink-0">
                                            <ArrowUpRight className="w-4 h-4" />
                                        </span>
                                    </div>

                                    <p className="text-[12px] sm:text-[13px] leading-relaxed text-[#64748B] line-clamp-2">
                                        {product.tagline}
                                    </p>

                                    <div className="mt-auto flex items-center justify-between gap-3 border-t border-black/[0.06] pt-3.5">
                                        <span className="flex items-center gap-1.5 font-mono text-[9px] uppercase tracking-[0.14em] text-[#94A3B8] min-w-0 truncate">
                                            <GitBranch className="w-3 h-3 text-[#FF8C1A] shrink-0" />
                                            <span className="truncate">{product.repoName}</span>
                                        </span>
                                        <span className="hidden sm:inline font-mono text-[9px] uppercase tracking-[0.14em] text-[#94A3B8] truncate max-w-[55%] text-right">
                                            {product.specs[0]?.label}
                                        </span>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <div className="surface-card flex flex-col items-center text-center gap-3 px-6 py-16">
                            <span className="grid place-items-center w-12 h-12 rounded-2xl bg-[#FF5C00]/10 text-[#FF5C00]">
                                <Sparkles className="w-5 h-5" />
                            </span>
                            <h3 className="font-heading font-bold text-base text-[#0F172A]">No sandbox matches “{searchQuery.trim()}”</h3>
                            <p className="text-[12px] text-[#64748B] max-w-sm">
                                Try “3D”, “leads”, “email”, “CRM”, “slides”, “vault” or “LMS” — or clear the search to browse all seven.
                            </p>
                            <button
                                onClick={() => {
                                    setSearchQuery('');
                                    searchInputRef.current?.focus();
                                }}
                                className="btn-primary mt-2"
                            >
                                Clear search
                            </button>
                        </div>
                    )}
                </div>
            </section>

            {/* ================= CTA ================= */}
            <section className="px-4 sm:px-6 pb-20 sm:pb-28">
                <div className="mx-auto max-w-6xl">
                    <div className="relative overflow-hidden rounded-[26px] border border-black/[0.07] bg-gradient-to-br from-[#FFF7F2] via-white to-[#FFF4ED] px-6 py-10 sm:px-10 sm:py-12">
                        <div className="absolute -right-16 -top-20 h-56 w-56 rounded-full bg-[#FF5C00]/10 blur-3xl" aria-hidden="true" />
                        <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-6">
                            <div className="space-y-2">
                                <p className="kicker">Custom systems</p>
                                <h2 className="font-heading font-black text-xl sm:text-2xl tracking-tight text-[#0F172A]">
                                    Need something that isn’t on the shelf?
                                </h2>
                                <p className="text-[12px] sm:text-[13px] text-[#64748B] max-w-xl leading-relaxed">
                                    The lab builds bespoke AI systems, 3D web apps and internal tooling for studios and enterprises.
                                    Specs, sandboxes and deployments all start with one conversation.
                                </p>
                            </div>
                            <div className="flex flex-wrap items-center gap-2.5 shrink-0">
                                <a
                                    href="https://agenerativeslice.com"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="btn-primary"
                                >
                                    Visit the studio
                                    <ExternalLink className="w-3.5 h-3.5" />
                                </a>
                                <a
                                    href="https://wa.me/917812891494"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="btn-secondary"
                                >
                                    WhatsApp us
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};
