import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
    Search, X, ArrowUpRight, Boxes, Zap, 
    Bot, Cpu, Presentation, FolderKanban, GraduationCap,
    GitBranch, Command, Sparkles, ExternalLink
} from 'lucide-react';
import { detailedProducts } from '../data/productsData';

// Filter tags for rapid one-tap discovery
const QUICK_FILTERS = [
    { label: 'All Products', query: '' },
    { label: '3D WebGL', query: '3d' },
    { label: 'Lead Engine', query: 'leads' },
    { label: 'Smart Outreach', query: 'outreach' },
    { label: 'CRM Triage', query: 'inbox' },
    { label: 'Boardroom PPT', query: 'presentation' },
    { label: 'Document Vault', query: 'vault' },
    { label: 'Studio LMS', query: 'lms' },
] as const;

export const HomePage: React.FC = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [activeFilter, setActiveFilter] = useState('All Products');
    const searchInputRef = useRef<HTMLInputElement | null>(null);

    // Global keyboard shortcut: Cmd+K / Ctrl+K or '/' to focus search
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
                e.preventDefault();
                searchInputRef.current?.focus();
            } else if (e.key === '/' && document.activeElement !== searchInputRef.current) {
                e.preventDefault();
                searchInputRef.current?.focus();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    // Filter products based on search query
    const filteredProducts = useMemo(() => {
        const query = searchQuery.trim().toLowerCase();
        if (!query) return detailedProducts;

        return detailedProducts.filter((product) => {
            const searchableText = [
                product.name,
                product.category,
                product.tagline,
                product.description,
                product.repoName,
                product.badge,
                ...product.specs.map(s => `${s.label} ${s.value}`),
                ...product.features.map(f => `${f.title} ${f.description}`)
            ].join(' ').toLowerCase();

            return searchableText.includes(query);
        });
    }, [searchQuery]);

    const getProductIcon = (id: string, className = "w-5 h-5 text-white") => {
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

    const handleSelectFilter = (filterLabel: string, query: string) => {
        setActiveFilter(filterLabel);
        setSearchQuery(query);
        searchInputRef.current?.focus();
    };

    const handleClearSearch = () => {
        setSearchQuery('');
        setActiveFilter('All Products');
        searchInputRef.current?.focus();
    };

    return (
        <div className="min-h-[82vh] flex flex-col justify-between pt-24 sm:pt-32 pb-16 px-4 sm:px-6 max-w-5xl mx-auto">
            {/* HERO SECTION: Minimal, Modern Business Intro */}
            <div className="space-y-8 sm:space-y-10 my-auto">
                <div className="text-center space-y-4">
                    {/* Editorial Kicker */}
                    <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#FF5C00] font-heading">
                        <span className="font-mono text-[#FF5C00]">|</span>
                        <span>A GENERATIVE SLICE • SYSTEMS LABORATORY</span>
                    </div>

                    <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-[#0F172A] dark:text-white font-heading tracking-tight leading-[1.12] max-w-2xl mx-auto">
                        Explore Proprietary <span className="text-[#FF5C00]">Software Systems</span>
                    </h1>

                    <p className="text-xs sm:text-sm text-[#64748B] dark:text-[#94A3B8] max-w-xl mx-auto leading-relaxed">
                        Search and launch dedicated interactive sandboxes, WebGL runtimes, and autonomous agent tools engineered in Chennai, India.
                    </p>
                </div>

                {/* SPOTLIGHT COMMAND SEARCH BAR */}
                <div className="max-w-2xl mx-auto space-y-3">
                    <div className="relative group">
                        <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-[#64748B] dark:text-white/40 group-focus-within:text-[#FF5C00] transition-colors">
                            <Search className="w-5 h-5" />
                        </div>

                        <input
                            ref={searchInputRef}
                            type="text"
                            value={searchQuery}
                            onChange={(e) => {
                                setSearchQuery(e.target.value);
                                setActiveFilter('');
                            }}
                            placeholder="Search products, technologies, or keywords (e.g. 3D WebGL, leads, email, CRM)..."
                            className="w-full pl-12 pr-24 py-4 sm:py-4.5 rounded-2xl border-2 border-black/10 dark:border-white/10 bg-white/90 dark:bg-[#0c0f17]/90 text-[#0F172A] dark:text-white placeholder-[#64748B]/60 text-sm sm:text-base font-medium shadow-xl backdrop-blur-xl focus:border-[#FF5C00] focus:ring-4 focus:ring-[#FF5C00]/10 outline-none transition-all"
                            autoComplete="off"
                            spellCheck={false}
                        />

                        {/* Right Shortcuts / Clear Button */}
                        <div className="absolute inset-y-0 right-3.5 flex items-center gap-1.5">
                            {searchQuery ? (
                                <button
                                    onClick={handleClearSearch}
                                    className="p-1.5 rounded-lg text-[#64748B] dark:text-white/50 hover:text-[#0F172A] dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5 transition-colors cursor-pointer"
                                    title="Clear search"
                                    aria-label="Clear search input"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            ) : (
                                <div className="hidden sm:flex items-center gap-1 px-2 py-1 rounded-md border border-black/10 dark:border-white/10 bg-black/[0.03] dark:bg-white/[0.04] text-[10px] font-mono text-[#64748B] dark:text-white/40">
                                    <Command className="w-3 h-3" />
                                    <span>K</span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Quick Category Chips */}
                    <div className="flex items-center gap-1.5 overflow-x-auto pb-1 touch-scroll no-scrollbar">
                        {QUICK_FILTERS.map((filter) => {
                            const isSelected = activeFilter === filter.label || (filter.query === '' && searchQuery === '');
                            return (
                                <button
                                    key={filter.label}
                                    onClick={() => handleSelectFilter(filter.label, filter.query)}
                                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                                        isSelected
                                            ? 'bg-[#FF5C00] text-white shadow-sm'
                                            : 'bg-white/80 dark:bg-[#0c0f17]/80 border border-black/5 dark:border-white/10 text-[#64748B] dark:text-white/70 hover:border-[#FF5C00]/40'
                                    }`}
                                >
                                    {filter.label}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* LIVE SEARCH RESULTS & PRODUCT DIRECTORY */}
                <div className="max-w-3xl mx-auto space-y-3">
                    <div className="flex items-center justify-between text-xs font-mono text-[#64748B] dark:text-white/40 px-1">
                        <span>
                            {filteredProducts.length} {filteredProducts.length === 1 ? 'Product Sandbox' : 'Product Sandboxes'}
                        </span>
                        <span>Click to launch full experience in new tab</span>
                    </div>

                    {filteredProducts.length > 0 ? (
                        <div className="space-y-3">
                            {filteredProducts.map((product) => (
                                <div
                                    key={product.id}
                                    className="p-4 sm:p-5 rounded-2xl border border-black/10 dark:border-white/10 bg-white/90 dark:bg-[#0c0f17]/90 shadow-sm hover:border-[#FF5C00]/50 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 group"
                                >
                                    {/* Left: Icon & Meta */}
                                    <div className="flex items-start sm:items-center gap-3.5 flex-1 min-w-0">
                                        <div className="w-11 h-11 rounded-xl bg-[#FF5C00] flex items-center justify-center shadow-sm shrink-0">
                                            {getProductIcon(product.id)}
                                        </div>

                                        <div className="space-y-1 min-w-0 flex-1">
                                            <div className="flex items-center gap-2 flex-wrap">
                                                <h3 className="font-extrabold text-base text-[#0F172A] dark:text-white font-heading">
                                                    {product.name}
                                                </h3>
                                                <span className="text-[10px] font-mono uppercase tracking-wider text-[#FF5C00] font-bold">
                                                    | {product.category}
                                                </span>
                                                <span className="px-2 py-0.5 rounded-md text-[10px] font-mono bg-black/5 dark:bg-white/10 text-[#64748B] dark:text-white/60">
                                                    {product.badge}
                                                </span>
                                            </div>

                                            <p className="text-xs text-[#64748B] dark:text-[#94A3B8] line-clamp-1">
                                                {product.tagline}
                                            </p>

                                            <div className="text-[11px] font-mono text-[#64748B] dark:text-white/40 flex items-center gap-2 pt-0.5">
                                                <span className="text-[#FF5C00] font-medium">{product.specs[0]?.label}: {product.specs[0]?.value}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Right: Actions */}
                                    <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                                        <a
                                            href={`https://github.com/A-Generative-Slice/${product.repoName}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="px-3 py-2 rounded-xl border border-black/10 dark:border-white/10 bg-black/[0.02] dark:bg-white/[0.02] text-xs font-mono text-[#64748B] dark:text-white/60 hover:text-[#FF5C00] hover:border-[#FF5C00]/30 transition-all flex items-center gap-1.5 min-h-[42px]"
                                            title="View GitHub Repository"
                                        >
                                            <GitBranch className="w-3.5 h-3.5 text-[#FF5C00]" />
                                            <span className="hidden md:inline">{product.repoName}</span>
                                        </a>

                                        {/* Open in New Tab for full product experience with trial & templates */}
                                        <a
                                            href={product.path}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="px-4 py-2.5 rounded-xl bg-[#FF5C00] hover:bg-[#FF8C1A] text-white text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm font-heading min-h-[42px]"
                                            title={`Open ${product.name} interactive sandbox in new tab`}
                                        >
                                            <span>Launch Full Experience</span>
                                            <ArrowUpRight className="w-4 h-4" />
                                        </a>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12 px-6 rounded-2xl border border-dashed border-black/10 dark:border-white/10 bg-black/[0.01] dark:bg-white/[0.01] space-y-3">
                            <Sparkles className="w-8 h-8 text-[#FF5C00] mx-auto opacity-60" />
                            <h4 className="font-bold text-sm text-[#0F172A] dark:text-white font-heading">
                                No software sandboxes found matching "{searchQuery}"
                            </h4>
                            <p className="text-xs text-[#64748B] dark:text-white/50 max-w-sm mx-auto">
                                Try searching for "3D", "leads", "email", "CRM", "slides", "vault", or "LMS".
                            </p>
                            <button
                                onClick={handleClearSearch}
                                className="px-4 py-2 rounded-xl bg-[#FF5C00] text-white text-xs font-bold hover:bg-[#FF8C1A] transition-all cursor-pointer"
                            >
                                Reset Search Filter
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* MINIMAL FOOTER BRIDGE: Single Clean Line */}
            <div className="pt-8 border-t border-black/5 dark:border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#64748B] dark:text-white/40">
                <div className="flex items-center gap-2">
                    <span className="font-semibold text-[#0F172A] dark:text-white">A Generative Slice</span>
                    <span>•</span>
                    <span>Corporate Studio at</span>
                    <a
                        href="https://agenerativeslice.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#FF5C00] hover:underline font-bold inline-flex items-center gap-1"
                    >
                        <span>agenerativeslice.com</span>
                        <ExternalLink className="w-3 h-3" />
                    </a>
                </div>

                <div className="flex items-center gap-3 font-mono text-[11px]">
                    <a
                        href="https://github.com/A-Generative-Slice"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-[#FF5C00] transition-colors flex items-center gap-1"
                    >
                        <GitBranch className="w-3.5 h-3.5 text-[#FF5C00]" />
                        <span>github.com/A-Generative-Slice</span>
                    </a>
                </div>
            </div>
        </div>
    );
};
