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
        <div className="min-h-[82vh] flex flex-col justify-between pt-20 sm:pt-28 pb-14 px-3 sm:px-6 max-w-4xl mx-auto w-full">
            {/* HERO SECTION: Minimal, Modern Business Intro */}
            <div className="space-y-6 sm:space-y-8 my-auto w-full">
                <div className="text-center space-y-3 px-2">
                    {/* Editorial Kicker */}
                    <div className="inline-flex items-center gap-2 text-[11px] sm:text-xs font-bold uppercase tracking-widest text-[#FF5C00] font-heading">
                        <span className="font-mono text-[#FF5C00]">|</span>
                        <span>A GENERATIVE SLICE • SYSTEMS LAB</span>
                    </div>

                    <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black text-[#0F172A] font-heading tracking-tight leading-tight max-w-2xl mx-auto">
                        Proprietary Software Systems &amp; <span className="text-[#FF5C00]">Interactive Sandboxes</span>
                    </h1>

                    <p className="text-xs sm:text-sm text-[#64748B] max-w-lg mx-auto leading-relaxed">
                        Search and launch dedicated browser sandboxes, WebGL runtimes, and autonomous agent systems engineered in Chennai, India.
                    </p>
                </div>

                {/* SPOTLIGHT COMMAND SEARCH BAR */}
                <div className="space-y-3 w-full">
                    <div className="relative group w-full">
                        <div className="absolute inset-y-0 left-3.5 sm:left-4 flex items-center pointer-events-none text-[#64748B] group-focus-within:text-[#FF5C00] transition-colors">
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
                            placeholder="Search 7 enterprise systems (3D, leads, email, CRM, PPT, vault, LMS)..."
                            className="w-full pl-11 sm:pl-12 pr-12 py-3.5 sm:py-4 rounded-2xl border-2 border-black/10 bg-white text-[#0F172A] placeholder-[#64748B]/60 text-sm sm:text-base font-medium shadow-md focus:border-[#FF5C00] focus:ring-4 focus:ring-[#FF5C00]/10 outline-none transition-all min-h-[50px] sm:min-h-[56px]"
                            autoComplete="off"
                            spellCheck={false}
                        />

                        {/* Right Shortcuts / Clear Button */}
                        <div className="absolute inset-y-0 right-3 flex items-center gap-1.5">
                            {searchQuery ? (
                                <button
                                    onClick={handleClearSearch}
                                    className="p-1.5 rounded-lg text-[#64748B] hover:text-[#0F172A] hover:bg-black/5 transition-colors cursor-pointer"
                                    title="Clear search"
                                    aria-label="Clear search input"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            ) : (
                                <div className="hidden sm:flex items-center gap-1 px-2 py-0.5 rounded-md border border-black/10 bg-black/[0.03] text-[10px] font-mono text-[#64748B]">
                                    <Command className="w-3 h-3" />
                                    <span>K</span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Quick Category Chips: Edge-to-Edge Touch Scroll on Mobile */}
                    <div className="-mx-3 px-3 sm:mx-0 sm:px-0 flex items-center gap-1.5 overflow-x-auto pb-1 touch-scroll no-scrollbar">
                        {QUICK_FILTERS.map((filter) => {
                            const isSelected = activeFilter === filter.label || (filter.query === '' && searchQuery === '');
                            return (
                                <button
                                    key={filter.label}
                                    onClick={() => handleSelectFilter(filter.label, filter.query)}
                                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer min-h-[38px] flex items-center ${
                                        isSelected
                                            ? 'bg-[#FF5C00] text-white shadow-sm'
                                            : 'bg-white border border-black/10 text-[#64748B] hover:border-[#FF5C00]/40'
                                    }`}
                                >
                                    {filter.label}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* LIVE SEARCH RESULTS & PRODUCT DIRECTORY */}
                <div className="space-y-3 w-full">
                    <div className="flex items-center justify-between text-xs font-mono text-[#64748B] px-1">
                        <span>
                            {filteredProducts.length} {filteredProducts.length === 1 ? 'Product Sandbox' : 'Product Sandboxes'}
                        </span>
                        <span className="hidden sm:inline">Opens full experience in new tab</span>
                    </div>

                    {filteredProducts.length > 0 ? (
                        <div className="space-y-3">
                            {filteredProducts.map((product) => (
                                <div
                                    key={product.id}
                                    className="p-4 sm:p-5 rounded-2xl border border-black/10 bg-white shadow-sm hover:border-[#FF5C00]/50 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 group"
                                >
                                    {/* Left: Icon & Meta */}
                                    <div className="flex items-start sm:items-center gap-3.5 flex-1 min-w-0">
                                        <div className="w-11 h-11 rounded-xl bg-[#FF5C00] flex items-center justify-center shadow-sm shrink-0 mt-0.5 sm:mt-0">
                                            {getProductIcon(product.id)}
                                        </div>

                                        <div className="space-y-1 min-w-0 flex-1">
                                            <div className="flex items-center gap-2 flex-wrap">
                                                <h3 className="font-extrabold text-base text-[#0F172A] font-heading">
                                                    {product.name}
                                                </h3>
                                                <span className="text-[10px] font-mono uppercase tracking-wider text-[#FF5C00] font-bold">
                                                    | {product.category}
                                                </span>
                                                <span className="px-2 py-0.5 rounded-md text-[10px] font-mono bg-black/5 text-[#64748B]">
                                                    {product.badge}
                                                </span>
                                            </div>

                                            <p className="text-xs text-[#64748B] line-clamp-1 leading-relaxed">
                                                {product.tagline}
                                            </p>

                                            <div className="text-[11px] font-mono text-[#64748B] flex items-center gap-2 pt-0.5">
                                                <span className="text-[#FF5C00] font-medium">{product.specs[0]?.label}: {product.specs[0]?.value}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Right: Actions (Mobile Responsive 44px+ touch area) */}
                                    <div className="flex items-center gap-2 w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-black/5 shrink-0">
                                        <a
                                            href={`https://github.com/A-Generative-Slice/${product.repoName}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="hidden md:inline-flex px-3 py-2 rounded-xl border border-black/10 bg-black/[0.02] text-xs font-mono text-[#64748B] hover:text-[#FF5C00] hover:border-[#FF5C00]/30 transition-all items-center gap-1.5 min-h-[44px]"
                                            title="View GitHub Repository"
                                        >
                                            <GitBranch className="w-3.5 h-3.5 text-[#FF5C00]" />
                                            <span>{product.repoName}</span>
                                        </a>

                                        {/* Primary Launch Action in New Tab */}
                                        <a
                                            href={product.path}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-[#FF5C00] hover:bg-[#FF8C1A] text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-sm font-heading min-h-[46px]"
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
                        <div className="text-center py-12 px-6 rounded-2xl border border-dashed border-black/10 bg-black/[0.01] space-y-3">
                            <Sparkles className="w-8 h-8 text-[#FF5C00] mx-auto opacity-60" />
                            <h4 className="font-bold text-sm text-[#0F172A] font-heading">
                                No software sandboxes found matching "{searchQuery}"
                            </h4>
                            <p className="text-xs text-[#64748B] max-w-sm mx-auto">
                                Try searching for "3D", "leads", "email", "CRM", "slides", "vault", or "LMS".
                            </p>
                            <button
                                onClick={handleClearSearch}
                                className="px-4 py-2.5 rounded-xl bg-[#FF5C00] text-white text-xs font-bold hover:bg-[#FF8C1A] transition-all cursor-pointer min-h-[42px]"
                            >
                                Reset Search Filter
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* MINIMAL FOOTER BRIDGE: Single Clean Line */}
            <div className="pt-8 border-t border-black/5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#64748B] w-full">
                <div className="flex items-center gap-2">
                    <span className="font-semibold text-[#0F172A]">A Generative Slice</span>
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
