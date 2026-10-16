import React, { useState } from 'react';
import { 
    ChevronLeft, ChevronRight, Download, 
    Sparkles, RefreshCw, CheckCircle2 
} from 'lucide-react';
import logoImg from '../../assets/logo.jpg';

interface Slide {
    number: number;
    title: string;
    subtitle: string;
    content: React.ReactNode;
}

export const SlicePPTShowcase: React.FC = () => {
    const [activeSlide, setActiveSlide] = useState(0);
    const [isGenerating, setIsGenerating] = useState(false);
    const [rawNotes, setRawNotes] = useState('Client: Ultra-Luxury Living\nDeliverable: 3D Configurator & Client Portal\nTimeline: 14 business days\nROI: 300% boost in buyer engagement');

    const slides: Slide[] = [
        {
            number: 1,
            title: 'AGS Enterprise Proposal',
            subtitle: 'Bespoke AI Architecture & 3D Interactive Client Solutions',
            content: (
                <div className="flex flex-col justify-center h-full text-center space-y-4">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FF5C00]/20 text-[#FF5C00] text-xs font-semibold mx-auto border border-[#FF5C00]/30">
                        <Sparkles className="w-3.5 h-3.5" /> Prepared by A Generative Slice
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-black text-white font-heading tracking-tight">
                        Next-Gen 3D Interactive & AI Workflow Blueprint
                    </h2>
                    <p className="text-xs sm:text-sm text-white/60 max-w-lg mx-auto">
                        Turning traditional static catalogues and manual paperwork into high-conversion automated web systems.
                    </p>
                    <div className="pt-4 flex items-center justify-center gap-4 text-xs text-white/40 font-mono">
                        <span>Confidential Client Deck</span>
                        <span>•</span>
                        <span>Chennai Headquarters</span>
                        <span>•</span>
                        <span className="text-[#FF5C00]">16:9 Executive PDF</span>
                    </div>
                </div>
            )
        },
        {
            number: 2,
            title: 'The Challenge & Operational Friction',
            subtitle: 'Where modern brands lose customers during consideration',
            content: (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-full items-center">
                    <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 space-y-2">
                        <div className="w-8 h-8 rounded-xl bg-red-500/20 text-red-400 flex items-center justify-center font-bold text-xs">
                            01
                        </div>
                        <h4 className="text-sm font-bold text-white">Flat 2D Photos</h4>
                        <p className="text-xs text-white/60 leading-relaxed">
                            Customers cannot inspect textures, finishes, or scale on their phone, leading to hesitation and 65% drop-offs.
                        </p>
                    </div>

                    <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 space-y-2">
                        <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-xs">
                            02
                        </div>
                        <h4 className="text-sm font-bold text-white">Manual Document Churn</h4>
                        <p className="text-xs text-white/60 leading-relaxed">
                            Staff waste 15+ hours weekly formatting invoices, NDAs, and proposals manually in Word and PowerPoint.
                        </p>
                    </div>

                    <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 space-y-2">
                        <div className="w-8 h-8 rounded-xl bg-red-500/20 text-red-400 flex items-center justify-center font-bold text-xs">
                            03
                        </div>
                        <h4 className="text-sm font-bold text-white">Inconsistent Outreach</h4>
                        <p className="text-xs text-white/60 leading-relaxed">
                            Sales teams either spray generic spam that lands in spam folders, or send zero follow-up to existing clients.
                        </p>
                    </div>
                </div>
            )
        },
        {
            number: 3,
            title: 'The Slice Suite Architecture',
            subtitle: 'Proprietary, self-hosted modular software engineered for scale',
            content: (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-full items-center">
                    <div className="p-5 rounded-2xl bg-[#FF5C00]/10 border border-[#FF5C00]/30 space-y-2">
                        <span className="text-[10px] font-mono text-[#FF5C00] uppercase font-bold">Front-Office Velocity</span>
                        <h4 className="text-base font-bold text-white font-heading">Slice3D + SliceLeads</h4>
                        <p className="text-xs text-white/70 leading-relaxed">
                            Zero-download 360° product exploration right in phone browsers, paired with verified local lead discovery to fill sales pipelines.
                        </p>
                    </div>

                    <div className="p-5 rounded-2xl bg-white/[0.04] border border-white/10 space-y-2">
                        <span className="text-[10px] font-mono text-emerald-400 uppercase font-bold">Operational Command</span>
                        <h4 className="text-base font-bold text-white font-heading">SliceMail + SliceDAM</h4>
                        <p className="text-xs text-white/70 leading-relaxed">
                            400 customized emails daily keeping prospects and clients informed, with tamper-proof digital contracts and automated GST billing.
                        </p>
                    </div>
                </div>
            )
        },
        {
            number: 4,
            title: '14-Day Rapid Deployment Roadmap',
            subtitle: 'From asset ingestion to live deployment without engineering delays',
            content: (
                <div className="space-y-3 h-full flex flex-col justify-center">
                    <div className="flex items-center gap-4 p-3 rounded-xl bg-white/[0.02] border border-white/5">
                        <div className="w-7 h-7 rounded-lg bg-[#FF5C00] text-white flex items-center justify-center font-bold text-xs shrink-0">
                            D1
                        </div>
                        <div>
                            <div className="text-xs font-bold text-white">Architecture Scoping & Asset Optimization</div>
                            <div className="text-[11px] text-white/50">Ingest models, company branding guidelines, and domain records.</div>
                        </div>
                    </div>

                    <div className="flex items-center gap-4 p-3 rounded-xl bg-white/[0.02] border border-white/5">
                        <div className="w-7 h-7 rounded-lg bg-[#FF5C00] text-white flex items-center justify-center font-bold text-xs shrink-0">
                            D7
                        </div>
                        <div>
                            <div className="text-xs font-bold text-white">Interactive Sandbox & Pipeline Staging</div>
                            <div className="text-[11px] text-white/50">Deploy staging environment on sub-domain for stakeholder review.</div>
                        </div>
                    </div>

                    <div className="flex items-center gap-4 p-3 rounded-xl bg-white/[0.02] border border-white/5">
                        <div className="w-7 h-7 rounded-lg bg-emerald-500 text-white flex items-center justify-center font-bold text-xs shrink-0">
                            D14
                        </div>
                        <div>
                            <div className="text-xs font-bold text-white">Production Launch & Staff Enablement</div>
                            <div className="text-[11px] text-white/50">Full DNS cutover, team onboarding, and continuous health monitoring.</div>
                        </div>
                    </div>
                </div>
            )
        }
    ];

    const handleRegenerate = () => {
        setIsGenerating(true);
        setTimeout(() => {
            setIsGenerating(false);
            setActiveSlide(0);
        }, 800);
    };

    return (
        <div className="w-full rounded-3xl border border-white/10 bg-[#0F172A] overflow-hidden shadow-2xl flex flex-col">
            {/* Header */}
            <div className="px-5 py-4 border-b border-white/10 bg-[#0B0F17]/90 backdrop-blur flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center gap-3">
                    <img src={logoImg} alt="AGS Logo" className="w-8 h-8 rounded-full border border-[#FF5C00]/40 object-cover" />
                    <div>
                        <div className="flex items-center gap-2">
                            <span className="font-bold text-sm text-white font-heading">SlicePPT Deck Synthesizer</span>
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#FF5C00]/20 text-[#FF5C00] border border-[#FF5C00]/30">
                                16:9 PDF Generator
                            </span>
                        </div>
                        <p className="text-[11px] text-white/50">Transforms rough notes and sheets into executive presentation decks</p>
                    </div>
                </div>

                <div className="flex items-center gap-2 text-xs font-mono text-white/70">
                    <span className="flex items-center gap-1.5 text-emerald-400">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Pixel-Perfect 16:9
                    </span>
                    <span className="text-white/20">|</span>
                    <span>Zero PPT Formatting</span>
                </div>
            </div>

            {/* Ingestion & Slide Preview Grid */}
            <div className="p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 bg-[#0B0F17]/40">
                {/* Notes Input Panel */}
                <div className="lg:col-span-4 space-y-3">
                    <div className="text-xs font-bold uppercase tracking-wider text-white/60 font-heading">
                        Raw Notes / Outline Input
                    </div>
                    <textarea
                        rows={7}
                        value={rawNotes}
                        onChange={(e) => setRawNotes(e.target.value)}
                        placeholder="Type bullet points or paste spreadsheet values..."
                        className="w-full bg-[#0F172A] border border-white/15 rounded-2xl p-3.5 text-xs text-white focus:outline-none focus:border-[#FF5C00] font-mono leading-relaxed"
                    />

                    <button
                        onClick={handleRegenerate}
                        disabled={isGenerating}
                        className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-[#FF5C00] to-[#FF8C1A] text-white font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-lg shadow-[#FF5C00]/20 disabled:opacity-50"
                    >
                        {isGenerating ? (
                            <>
                                <RefreshCw className="w-4 h-4 animate-spin" /> Synthesizing Layouts...
                            </>
                        ) : (
                            <>
                                <Sparkles className="w-4 h-4" /> Synthesize Executive Slides
                            </>
                        )}
                    </button>
                </div>

                {/* 16:9 Slide Viewport */}
                <div className="lg:col-span-8 flex flex-col justify-between">
                    <div className="relative aspect-[16/9] w-full rounded-2xl border border-white/15 bg-gradient-to-br from-[#0F172A] to-[#0B0F17] p-6 sm:p-8 flex flex-col justify-between shadow-2xl overflow-hidden">
                        {/* Slide Top Branding */}
                        <div className="flex items-center justify-between border-b border-white/10 pb-3">
                            <div className="flex items-center gap-2">
                                <img src={logoImg} alt="AGS" className="w-5 h-5 rounded-full object-cover" />
                                <span className="text-[11px] font-bold text-white font-heading">A Generative Slice</span>
                            </div>
                            <span className="text-[10px] font-mono text-[#FF5C00]">
                                Slide 0{slides[activeSlide].number} / 0{slides.length}
                            </span>
                        </div>

                        {/* Slide Dynamic Body */}
                        <div className="flex-grow py-3 flex flex-col justify-center">
                            {slides[activeSlide].content}
                        </div>

                        {/* Slide Bottom Bar */}
                        <div className="flex items-center justify-between border-t border-white/10 pt-2 text-[10px] text-white/40 font-mono">
                            <span>AGS Proprietary • Chennai, India</span>
                            <span>Confidential Strategic Brief</span>
                        </div>
                    </div>

                    {/* Slide Navigation Controls */}
                    <div className="mt-4 flex items-center justify-between flex-wrap gap-3">
                        <div className="flex items-center gap-1.5">
                            {slides.map((s, idx) => (
                                <button
                                    key={s.number}
                                    onClick={() => setActiveSlide(idx)}
                                    className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-colors ${
                                        activeSlide === idx
                                            ? 'bg-[#FF5C00] text-white font-bold'
                                            : 'bg-white/5 text-white/50 hover:bg-white/10 hover:text-white'
                                    }`}
                                >
                                    0{s.number}
                                </button>
                            ))}
                        </div>

                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => setActiveSlide(prev => Math.max(prev - 1, 0))}
                                disabled={activeSlide === 0}
                                className="p-2 rounded-xl bg-white/5 text-white border border-white/10 hover:bg-white/10 disabled:opacity-30"
                            >
                                <ChevronLeft className="w-4 h-4" />
                            </button>
                            <button
                                onClick={() => setActiveSlide(prev => Math.min(prev + 1, slides.length - 1))}
                                disabled={activeSlide === slides.length - 1}
                                className="p-2 rounded-xl bg-white/5 text-white border border-white/10 hover:bg-white/10 disabled:opacity-30"
                            >
                                <ChevronRight className="w-4 h-4" />
                            </button>

                            <button
                                onClick={() => alert('Demo deck ready: ags_executive_deck.pdf')}
                                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#FF5C00] text-white text-xs font-bold hover:bg-[#FF8C1A] transition-all ml-2"
                            >
                                <Download className="w-3.5 h-3.5" /> Export PDF Deck
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
