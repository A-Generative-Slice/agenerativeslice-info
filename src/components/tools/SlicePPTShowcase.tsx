import { useState } from 'react';
import { 
    ChevronLeft, ChevronRight, Download, 
    Sparkles, RefreshCw, Presentation
} from 'lucide-react';
import { RepoSyncBar } from '../RepoSyncBar';

interface Slide {
    number: number;
    title: string;
    subtitle: string;
    content: React.ReactNode;
}

export const SlicePPTShowcase: React.FC = () => {
    const [activeSlide, setActiveSlide] = useState(0);
    const [isGenerating, setIsGenerating] = useState(false);
    const [rawNotes, setRawNotes] = useState('Client: Thirumala Guest House & Resorts\nProject: Luminaire BOQ Schedule\nSpecification: Architectural 3D Rendering & Automated Proposals\nDeliverable: Executive 16:9 PDF Deck');

    const slides: Slide[] = [
        {
            number: 1,
            title: 'AGS Executive Proposal Deck',
            subtitle: 'Bespoke AI Architecture & 3D Interactive Client Solutions',
            content: (
                <div className="flex flex-col justify-center h-full text-center space-y-4">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FF5C00]/10 text-[#FF5C00] text-xs font-semibold mx-auto border border-[#FF5C00]/20">
                        <Sparkles className="w-3.5 h-3.5" /> Engineered by A Generative Slice
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-black text-[#0F172A] dark:text-white font-heading tracking-tight">
                        Next-Gen 3D Interactive & Automated Proposal Engine
                    </h2>
                    <p className="text-xs sm:text-sm text-[#64748B] dark:text-white/60 max-w-lg mx-auto">
                        Generated automatically from raw BOQ spreadsheets and design notes via <code className="font-mono text-[#FF5C00]">build_proposal.py</code>.
                    </p>
                    <div className="pt-4 flex items-center justify-center gap-4 text-xs text-[#64748B] dark:text-white/40 font-mono">
                        <span>Client Deliverable</span>
                        <span>•</span>
                        <span>Chennai Headquarters</span>
                        <span>•</span>
                        <span className="text-[#FF5C00] font-bold">16:9 Executive PDF</span>
                    </div>
                </div>
            )
        },
        {
            number: 2,
            title: 'BOQ Luminaire Schedule Breakdown',
            subtitle: 'Real project itemization derived from LLI_478 Thirumala Guest House specs',
            content: (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-full items-center">
                    <div className="p-4 rounded-2xl bg-black/[0.02] dark:bg-white/[0.03] border border-black/5 dark:border-white/10 space-y-2">
                        <div className="w-8 h-8 rounded-xl bg-orange-500/10 text-[#FF5C00] flex items-center justify-center font-bold text-xs font-mono">
                            01
                        </div>
                        <h4 className="text-sm font-bold text-[#0F172A] dark:text-white">Recessed Architectural COBs</h4>
                        <p className="text-xs text-[#64748B] dark:text-white/60 leading-relaxed">
                            3000K warm-white optics with 38° beam angle, integrated anti-glare baffle, and IP54 wet-zone rating for guest suites.
                        </p>
                    </div>

                    <div className="p-4 rounded-2xl bg-black/[0.02] dark:bg-white/[0.03] border border-black/5 dark:border-white/10 space-y-2">
                        <div className="w-8 h-8 rounded-xl bg-orange-500/10 text-[#FF5C00] flex items-center justify-center font-bold text-xs font-mono">
                            02
                        </div>
                        <h4 className="text-sm font-bold text-[#0F172A] dark:text-white">Linear Grazers & Coves</h4>
                        <p className="text-xs text-[#64748B] dark:text-white/60 leading-relaxed">
                            Continuous 24V DC silicone extruded flex lines for seamless perimeter illumination without hotspot banding.
                        </p>
                    </div>

                    <div className="p-4 rounded-2xl bg-black/[0.02] dark:bg-white/[0.03] border border-black/5 dark:border-white/10 space-y-2">
                        <div className="w-8 h-8 rounded-xl bg-orange-500/10 text-[#FF5C00] flex items-center justify-center font-bold text-xs font-mono">
                            03
                        </div>
                        <h4 className="text-sm font-bold text-[#0F172A] dark:text-white">Smart DALI Controllers</h4>
                        <p className="text-xs text-[#64748B] dark:text-white/60 leading-relaxed">
                            Centralized scene scheduling integrated with guest room keycard sensors for 42% energy savings.
                        </p>
                    </div>
                </div>
            )
        },
        {
            number: 3,
            title: 'The Slice Suite Architecture',
            subtitle: 'Modular, self-hosted software stack replacing fragmented SaaS',
            content: (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-full items-center">
                    <div className="p-5 rounded-2xl bg-[#FF5C00]/10 border border-[#FF5C00]/30 space-y-2">
                        <span className="text-[10px] font-mono text-[#FF5C00] uppercase font-bold">Client-Facing Experience</span>
                        <h4 className="text-base font-bold text-[#0F172A] dark:text-white font-heading">Slice3D + SliceLeads</h4>
                        <p className="text-xs text-[#64748B] dark:text-white/70 leading-relaxed">
                            Zero-download 360° product exploration right in phone browsers, paired with verified local lead discovery to fill sales pipelines.
                        </p>
                    </div>

                    <div className="p-5 rounded-2xl bg-black/[0.02] dark:bg-white/[0.04] border border-black/5 dark:border-white/10 space-y-2">
                        <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 uppercase font-bold">Operational Command</span>
                        <h4 className="text-base font-bold text-[#0F172A] dark:text-white font-heading">SliceMail + SliceDAM</h4>
                        <p className="text-xs text-[#64748B] dark:text-white/70 leading-relaxed">
                            Personalized high-deliverability outreach engine capable of 400+ customized emails per day, backed by an immutable asset vault.
                        </p>
                    </div>
                </div>
            )
        },
        {
            number: 4,
            title: 'Project Timeline & Delivery Schedule',
            subtitle: '14-day rapid deployment guarantee with milestone-based signoff',
            content: (
                <div className="flex flex-col justify-center h-full space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div className="p-4 rounded-2xl bg-black/[0.02] dark:bg-white/[0.03] border border-black/5 dark:border-white/10">
                            <span className="text-[10px] font-mono text-[#FF5C00] font-bold">Day 01 - 04</span>
                            <h5 className="font-bold text-xs text-[#0F172A] dark:text-white mt-1">Asset Ingestion & Clean</h5>
                            <p className="text-[11px] text-[#64748B] dark:text-white/50 mt-1">CAD decimation, texture baking, and lighting calibration.</p>
                        </div>
                        <div className="p-4 rounded-2xl bg-black/[0.02] dark:bg-white/[0.03] border border-black/5 dark:border-white/10">
                            <span className="text-[10px] font-mono text-[#FF5C00] font-bold">Day 05 - 10</span>
                            <h5 className="font-bold text-xs text-[#0F172A] dark:text-white mt-1">Sandbox Configuration</h5>
                            <p className="text-[11px] text-[#64748B] dark:text-white/50 mt-1">Custom interactive variants, pricing rules, and analytics.</p>
                        </div>
                        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20">
                            <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 font-bold">Day 11 - 14</span>
                            <h5 className="font-bold text-xs text-emerald-800 dark:text-emerald-200 mt-1">Staging & Production Handover</h5>
                            <p className="text-[11px] text-emerald-700/80 dark:text-emerald-300/80 mt-1">Zero-downtime deployment, staff training, and SHA-256 seal.</p>
                        </div>
                    </div>
                </div>
            )
        }
    ];

    const handleGenerateDeck = () => {
        setIsGenerating(true);
        setTimeout(() => {
            setIsGenerating(false);
            setActiveSlide(1);
        }, 600);
    };

    return (
        <div>
            {/* Live GitHub Repository Sync Bar */}
            <RepoSyncBar repoName="SlicePPT" />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                {/* 16:9 Presentation Canvas */}
                <div className="lg:col-span-8 rounded-3xl border border-black/10 dark:border-white/10 bg-white dark:bg-[#111] overflow-hidden shadow-2xl flex flex-col">
                    {/* Top Deck Bar */}
                    <div className="px-6 py-4 border-b border-black/5 dark:border-white/10 flex items-center justify-between bg-black/[0.02] dark:bg-white/[0.02]">
                        <div className="flex items-center gap-3">
                            <Presentation className="w-4 h-4 text-[#FF5C00]" />
                            <span className="text-xs font-bold text-[#0F172A] dark:text-white uppercase tracking-wider font-heading">
                                Slide {activeSlide + 1} of {slides.length}: {slides[activeSlide].title}
                            </span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-black/5 dark:bg-white/10 text-[#64748B] dark:text-white/60">
                                16:9 Executive PDF
                            </span>
                        </div>
                    </div>

                    {/* Slide Screen (16:9 aspect ratio) */}
                    <div className="relative w-full aspect-[16/9] p-8 sm:p-12 flex flex-col justify-between bg-gradient-to-br from-white via-slate-50 to-orange-50/20 dark:from-[#0F172A] dark:via-[#0B0F17] dark:to-[#16120D] transition-all">
                        {/* Slide Content */}
                        <div className="h-full">
                            {slides[activeSlide].content}
                        </div>

                        {/* Slide Footer */}
                        <div className="pt-4 border-t border-black/5 dark:border-white/10 flex items-center justify-between text-[11px] text-[#64748B] dark:text-white/40">
                            <span className="font-heading font-bold text-[#0F172A] dark:text-white">A Generative Slice Studio</span>
                            <span className="font-mono">Page {slides[activeSlide].number}</span>
                        </div>
                    </div>

                    {/* Navigation Controls */}
                    <div className="p-4 bg-black/[0.02] dark:bg-white/[0.02] border-t border-black/5 dark:border-white/10 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => setActiveSlide(prev => Math.max(prev - 1, 0))}
                                disabled={activeSlide === 0}
                                className="p-2 rounded-xl border border-black/10 dark:border-white/10 hover:bg-black/5 dark:hover:bg-white/5 disabled:opacity-30 transition-all text-[#0F172A] dark:text-white"
                                title="Previous slide"
                            >
                                <ChevronLeft className="w-4 h-4" />
                            </button>
                            <button
                                onClick={() => setActiveSlide(prev => Math.min(prev + 1, slides.length - 1))}
                                disabled={activeSlide === slides.length - 1}
                                className="p-2 rounded-xl border border-black/10 dark:border-white/10 hover:bg-black/5 dark:hover:bg-white/5 disabled:opacity-30 transition-all text-[#0F172A] dark:text-white"
                                title="Next slide"
                            >
                                <ChevronRight className="w-4 h-4" />
                            </button>
                            <span className="text-xs font-mono text-[#64748B] dark:text-white/50 ml-2">
                                Slide {activeSlide + 1} / {slides.length}
                            </span>
                        </div>

                        <a
                            href="https://github.com/A-Generative-Slice/SlicePPT"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-4 py-2 rounded-xl bg-[#FF5C00] text-white text-xs font-bold hover:bg-[#FF8C1A] transition-all flex items-center gap-2 shadow-sm"
                        >
                            <Download className="w-3.5 h-3.5" />
                            <span>Export PDF (Python Engine)</span>
                        </a>
                    </div>
                </div>

                {/* Right: Input Specs to Slide Generator */}
                <div className="lg:col-span-4 space-y-6">
                    <div className="rounded-3xl border border-black/10 dark:border-white/10 bg-white dark:bg-[#111] p-6 shadow-xl space-y-4">
                        <span className="text-xs font-bold uppercase tracking-wider text-[#FF5C00] block font-heading">
                            Auto-Generate Deck From Notes
                        </span>

                        <div>
                            <label className="text-[11px] font-semibold text-[#64748B] dark:text-white/60 block mb-1">
                                Raw BOQ Specs / Client Brief Notes
                            </label>
                            <textarea
                                value={rawNotes}
                                onChange={(e) => setRawNotes(e.target.value)}
                                rows={6}
                                className="w-full px-3.5 py-2.5 rounded-xl border border-black/10 dark:border-white/10 bg-black/[0.02] dark:bg-white/[0.03] text-xs text-[#0F172A] dark:text-white focus:outline-none focus:border-[#FF5C00] font-mono leading-relaxed"
                            />
                        </div>

                        <button
                            onClick={handleGenerateDeck}
                            disabled={isGenerating}
                            className="w-full py-3 rounded-xl bg-[#FF5C00] text-white text-xs font-bold hover:bg-[#FF8C1A] transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#FF5C00]/25"
                        >
                            {isGenerating ? (
                                <>
                                    <RefreshCw className="w-4 h-4 animate-spin" />
                                    <span>Compiling Slides via Python...</span>
                                </>
                            ) : (
                                <>
                                    <Sparkles className="w-4 h-4" />
                                    <span>Re-Compile Slide Deck</span>
                                </>
                            )}
                        </button>

                        <div className="pt-2 border-t border-black/5 dark:border-white/5 space-y-2 text-xs text-[#64748B] dark:text-white/50">
                            <div className="flex items-center justify-between">
                                <span className="font-mono">SlicePPT/build_proposal.py</span>
                                <span className="text-emerald-500 font-bold">Active</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="font-mono">BOQ Spreadsheet Parser</span>
                                <span className="text-emerald-500 font-bold">Loaded</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
