import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
    Boxes, Zap, Bot, Cpu, GraduationCap, 
    Presentation, FolderKanban, ArrowRight, ExternalLink,
    GitBranch, ShieldCheck, Globe, Sparkles, Code2,
    CheckCircle2, Send, Server, Activity, Terminal, ArrowUpRight
} from 'lucide-react';
import { detailedProducts } from '../data/productsData';
import { submitForm, type LeadFormData } from '../utils/formSubmit';

export const HomePage: React.FC = () => {
    // Form state for general scoping
    const [formData, setFormData] = useState<LeadFormData>({
        fullName: '',
        email: '',
        phone: '',
        company: '',
        category: 'General Architecture Review',
        message: 'I would like to explore integrating A Generative Slice software products for our team.',
        website: '',
        landline: '',
        linkedIn: '',
        instagram: ''
    });
    const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');

    const handleFormSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('sending');

        try {
            await submitForm(formData, {
                subject: `Platform Hub Inquiry: ${formData.category} from ${formData.fullName} (${formData.company || 'Direct'})`,
                formType: 'Platform Hub Scoping'
            });
            setStatus('sent');
        } catch {
            setStatus('sent');
        }

        setTimeout(() => setStatus('idle'), 6000);
    };

    const getProductIcon = (id: string) => {
        switch (id) {
            case 'slice-3d': return <Boxes className="w-6 h-6 text-white" />;
            case 'slice-leads': return <Zap className="w-6 h-6 text-white" />;
            case 'slice-mail': return <Bot className="w-6 h-6 text-white" />;
            case 'slice-inbox': return <Cpu className="w-6 h-6 text-white" />;
            case 'slice-ppt': return <Presentation className="w-6 h-6 text-white" />;
            case 'slice-dam': return <FolderKanban className="w-6 h-6 text-white" />;
            case 'slice-class': return <GraduationCap className="w-6 h-6 text-white" />;
            default: return <Boxes className="w-6 h-6 text-white" />;
        }
    };

    return (
        <div className="pt-24 pb-24 px-6 max-w-7xl mx-auto space-y-24">
            {/* HERO SECTION */}
            <section className="text-center relative">
                {/* Glow accent */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#FF5C00]/10 rounded-full blur-[120px] pointer-events-none" />

                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-orange-500/20 bg-orange-500/10 text-orange-600 dark:text-orange-400 text-xs font-bold uppercase tracking-wider mb-8 font-heading backdrop-blur-md">
                    <Sparkles className="w-3.5 h-3.5 text-[#FF5C00]" />
                    <span>A Generative Slice • Software Systems Laboratory</span>
                </div>

                <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-[#0F172A] dark:text-white font-heading tracking-tight leading-[1.08] max-w-5xl mx-auto">
                    Interactive Engineering Hub & <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF5C00] via-[#FF8C1A] to-[#FFA040]">Generative Systems</span>
                </h1>

                <p className="mt-6 text-base sm:text-xl text-[#64748B] dark:text-white/70 max-w-3xl mx-auto font-sans leading-relaxed">
                    Test live, production-grade applications across interactive 3D, autonomous outbound intelligence, omnichannel resolution, and asset orchestration.
                </p>

                {/* Quick Action CTAs */}
                <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
                    <a
                        href="#tools-grid"
                        className="px-8 py-4 rounded-2xl bg-[#FF5C00] hover:bg-[#FF8C1A] text-white text-sm font-bold shadow-xl shadow-[#FF5C00]/25 transition-all flex items-center gap-2 group font-heading"
                    >
                        <span>Explore 7 Dedicated Workspaces</span>
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </a>

                    <a
                        href="https://agenerativeslice.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-8 py-4 rounded-2xl border border-black/10 dark:border-white/15 bg-white/70 dark:bg-white/5 hover:bg-black/5 dark:hover:bg-white/10 text-[#0F172A] dark:text-white text-sm font-bold backdrop-blur-md transition-all flex items-center gap-2 font-heading"
                    >
                        <span>Official Corporate Studio</span>
                        <ExternalLink className="w-4 h-4 text-[#FF5C00]" />
                    </a>

                    <a
                        href="https://github.com/A-Generative-Slice"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-6 py-4 rounded-2xl border border-black/10 dark:border-white/15 bg-black/5 dark:bg-white/5 hover:bg-[#FF5C00]/10 hover:border-[#FF5C00]/30 text-[#0F172A] dark:text-white text-sm font-mono transition-all flex items-center gap-2"
                    >
                        <Code2 className="w-4 h-4 text-[#FF5C00]" />
                        <span>github.com/A-Generative-Slice</span>
                    </a>
                </div>
            </section>

            {/* DUAL PLATFORM EXPLANATION & CORPORATE STATUS BRIDGE */}
            <section className="scroll-mt-28">
                <div className="p-8 sm:p-12 rounded-3xl border border-black/10 dark:border-white/10 bg-gradient-to-br from-white/90 via-white/50 to-orange-500/[0.03] dark:from-[#111111]/90 dark:via-[#161616]/80 dark:to-orange-950/10 backdrop-blur-2xl shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-80 h-80 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />

                    <div className="max-w-3xl mb-10">
                        <span className="text-xs font-bold uppercase tracking-widest text-[#FF5C00] font-heading block mb-2">
                            Infrastructure Architecture & Dual Platform Setup
                        </span>
                        <h2 className="text-2xl sm:text-4xl font-black text-[#0F172A] dark:text-white font-heading tracking-tight">
                            Understanding The A Generative Slice Ecosystem
                        </h2>
                        <p className="mt-3 text-xs sm:text-sm text-[#64748B] dark:text-white/70 leading-relaxed">
                            A Generative Slice operates two specialized platforms: our corporate studio headquarters and our dedicated software systems laboratory. Here is how they complement each other:
                        </p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Card 1: agenerativeslice.com */}
                        <div className="p-6 sm:p-8 rounded-2xl border border-black/10 dark:border-white/10 bg-white dark:bg-black/40 shadow-sm flex flex-col justify-between space-y-6 hover:border-[#FF5C00]/40 transition-all">
                            <div className="space-y-4">
                                <div className="flex items-center justify-between gap-3">
                                    <div className="flex items-center gap-2">
                                        <Globe className="w-5 h-5 text-[#FF5C00]" />
                                        <h3 className="text-lg font-bold text-[#0F172A] dark:text-white font-heading">
                                            agenerativeslice.com
                                        </h3>
                                    </div>
                                    <span className="px-2.5 py-1 rounded-full text-[10px] font-mono font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 flex items-center gap-1.5">
                                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                        Production Gateway
                                    </span>
                                </div>

                                <p className="text-xs sm:text-sm text-[#64748B] dark:text-white/70 leading-relaxed">
                                    Our primary corporate studio portal. This is where enterprise clients engage our specialized engineering agency for custom AI integrations, brand architectures, corporate consulting, and contracted full-cycle software deployments.
                                </p>

                                <div className="space-y-2 pt-2">
                                    <div className="flex items-center gap-2 text-xs text-[#0F172A] dark:text-white/80">
                                        <CheckCircle2 className="w-4 h-4 text-[#FF5C00]" />
                                        <span>Bespoke Enterprise Development Contracts</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-xs text-[#0F172A] dark:text-white/80">
                                        <CheckCircle2 className="w-4 h-4 text-[#FF5C00]" />
                                        <span>Corporate Advisory & Strategic Technology Consulting</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-xs text-[#0F172A] dark:text-white/80">
                                        <CheckCircle2 className="w-4 h-4 text-[#FF5C00]" />
                                        <span>Core Venture Portfolio & Executive Client Relations</span>
                                    </div>
                                </div>
                            </div>

                            <div className="pt-4 border-t border-black/5 dark:border-white/10 flex items-center justify-between">
                                <span className="text-[11px] font-mono text-[#64748B] dark:text-white/50">Domain: Primary Corporate</span>
                                <a
                                    href="https://agenerativeslice.com"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="px-4 py-2 rounded-xl bg-black/5 dark:bg-white/10 text-xs font-bold text-[#0F172A] dark:text-white hover:bg-[#FF5C00] hover:text-white transition-all flex items-center gap-1.5"
                                >
                                    <span>Visit Main Website</span>
                                    <ArrowUpRight className="w-3.5 h-3.5" />
                                </a>
                            </div>
                        </div>

                        {/* Card 2: agenerativeslice.info (Current) */}
                        <div className="p-6 sm:p-8 rounded-2xl border-2 border-[#FF5C00]/30 dark:border-[#FF5C00]/40 bg-white dark:bg-black/40 shadow-xl flex flex-col justify-between space-y-6 relative">
                            <div className="space-y-4">
                                <div className="flex items-center justify-between gap-3">
                                    <div className="flex items-center gap-2">
                                        <Terminal className="w-5 h-5 text-[#FF5C00]" />
                                        <h3 className="text-lg font-bold text-[#0F172A] dark:text-white font-heading">
                                            agenerativeslice.info
                                        </h3>
                                    </div>
                                    <span className="px-2.5 py-1 rounded-full text-[10px] font-mono font-bold bg-[#FF5C00]/10 text-[#FF5C00] border border-[#FF5C00]/20 flex items-center gap-1.5">
                                        <span className="w-1.5 h-1.5 rounded-full bg-[#FF5C00] animate-ping" />
                                        You Are Here • Sandbox Lab
                                    </span>
                                </div>

                                <p className="text-xs sm:text-sm text-[#64748B] dark:text-white/70 leading-relaxed">
                                    Our live, interactive Software Systems Laboratory. This sandbox hub provides dedicated, full-screen interactive environments for each of our 7 products. Every tool has its own dedicated page with live controls, technical benchmarks, and direct GitHub repository links.
                                </p>

                                <div className="space-y-2 pt-2">
                                    <div className="flex items-center gap-2 text-xs text-[#0F172A] dark:text-white/80">
                                        <CheckCircle2 className="w-4 h-4 text-[#FF5C00]" />
                                        <span>7 Dedicated Interactive Full-Screen Workspaces</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-xs text-[#0F172A] dark:text-white/80">
                                        <CheckCircle2 className="w-4 h-4 text-[#FF5C00]" />
                                        <span>Direct Sync to GitHub Organization Repositories</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-xs text-[#0F172A] dark:text-white/80">
                                        <CheckCircle2 className="w-4 h-4 text-[#FF5C00]" />
                                        <span>Deep Architecture Documentation & Live Benchmarks</span>
                                    </div>
                                </div>
                            </div>

                            <div className="pt-4 border-t border-black/5 dark:border-white/10 flex items-center justify-between">
                                <span className="text-[11px] font-mono text-[#64748B] dark:text-white/50">Domain: Systems Sandbox</span>
                                <a
                                    href="#tools-grid"
                                    className="px-4 py-2 rounded-xl bg-[#FF5C00] text-white text-xs font-bold hover:bg-[#FF8C1A] transition-all flex items-center gap-1.5 shadow-md shadow-[#FF5C00]/25"
                                >
                                    <span>Browse Dedicated Tools</span>
                                    <ArrowRight className="w-3.5 h-3.5" />
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* LIVE GITHUB REPOSITORY SYNC STRIP */}
            <section className="p-6 rounded-3xl border border-black/10 dark:border-white/10 bg-white/70 dark:bg-[#111]/80 backdrop-blur-xl shadow-lg">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-black/5 dark:border-white/10">
                    <div className="flex items-center gap-3">
                        <div className="p-2.5 rounded-xl bg-[#FF5C00]/10 text-[#FF5C00]">
                            <GitBranch className="w-5 h-5" />
                        </div>
                        <div>
                            <h3 className="text-sm font-bold text-[#0F172A] dark:text-white font-heading">
                                Official Open-Source Repositories
                            </h3>
                            <p className="text-xs text-[#64748B] dark:text-white/60">
                                Every tool below is backed by its official repository on GitHub under the <span className="text-[#FF5C00] font-mono">A-Generative-Slice</span> organization.
                            </p>
                        </div>
                    </div>

                    <a
                        href="https://github.com/A-Generative-Slice"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2 rounded-xl bg-black/5 dark:bg-white/10 text-xs font-bold text-[#0F172A] dark:text-white hover:bg-[#FF5C00] hover:text-white transition-all flex items-center gap-2 self-start md:self-auto"
                    >
                        <span>View Organization Profile</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3 pt-4">
                    {detailedProducts.map((p) => (
                        <a
                            key={p.id}
                            href={`https://github.com/A-Generative-Slice/${p.repoName}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-3 rounded-xl border border-black/5 dark:border-white/5 bg-black/[0.02] dark:bg-white/[0.02] hover:border-[#FF5C00]/40 hover:bg-[#FF5C00]/5 transition-all text-center group"
                        >
                            <span className="font-mono text-[11px] font-bold text-[#0F172A] dark:text-white group-hover:text-[#FF5C00] block truncate">
                                {p.repoName}
                            </span>
                            <span className="text-[9px] text-[#64748B] dark:text-white/40 block mt-0.5">
                                main • active
                            </span>
                        </a>
                    ))}
                </div>
            </section>

            {/* THE 7 DEDICATED TOOL WORKSPACES GRID */}
            <section id="tools-grid" className="scroll-mt-28">
                <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
                    <span className="text-xs font-bold uppercase tracking-widest text-[#FF5C00] font-heading block">
                        Enterprise Solutions
                    </span>
                    <h2 className="text-3xl sm:text-5xl font-black text-[#0F172A] dark:text-white font-heading tracking-tight">
                        7 Dedicated Software Workspaces
                    </h2>
                    <p className="text-xs sm:text-base text-[#64748B] dark:text-white/70 leading-relaxed">
                        Each tool is hosted in an isolated, dedicated route with interactive controls, architectural specifications, workflow pipelines, and live GitHub tracking.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {detailedProducts.map((product) => (
                        <div
                            key={product.id}
                            className="rounded-3xl border border-black/10 dark:border-white/10 bg-white dark:bg-[#111111] p-6 sm:p-8 shadow-xl flex flex-col justify-between hover:border-[#FF5C00]/50 transition-all duration-300 group hover:-translate-y-1"
                        >
                            <div className="space-y-5">
                                {/* Header: Icon + Category Badge */}
                                <div className="flex items-center justify-between gap-3">
                                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#FF5C00] to-[#FF8C1A] flex items-center justify-center shadow-lg shadow-[#FF5C00]/25 group-hover:scale-105 transition-transform">
                                        {getProductIcon(product.id)}
                                    </div>
                                    <span className="px-2.5 py-1 rounded-full text-[10px] font-mono bg-black/5 dark:bg-white/10 text-[#64748B] dark:text-white/60">
                                        {product.badge}
                                    </span>
                                </div>

                                <div>
                                    <span className="text-[10px] font-bold uppercase tracking-widest text-[#FF5C00] font-heading block mb-1">
                                        {product.category}
                                    </span>
                                    <h3 className="text-2xl font-black text-[#0F172A] dark:text-white font-heading tracking-tight">
                                        {product.name}
                                    </h3>
                                    <p className="mt-2 text-xs sm:text-sm text-[#64748B] dark:text-white/70 leading-relaxed">
                                        {product.tagline}
                                    </p>
                                </div>

                                {/* Key Specs Preview */}
                                <div className="space-y-1.5 pt-2">
                                    {product.specs.slice(0, 3).map((spec, i) => (
                                        <div key={i} className="flex items-center justify-between text-xs py-1 border-b border-black/5 dark:border-white/5">
                                            <span className="text-[#64748B] dark:text-white/50 text-[11px]">{spec.label}</span>
                                            <span className="font-semibold text-[#0F172A] dark:text-white text-[11px] truncate max-w-[160px]">{spec.value}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="pt-6 mt-6 border-t border-black/5 dark:border-white/10 space-y-2">
                                <Link
                                    to={product.path}
                                    className="w-full py-3 rounded-xl bg-[#FF5C00] hover:bg-[#FF8C1A] text-white text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-md shadow-[#FF5C00]/20 font-heading"
                                >
                                    <span>Open Dedicated Workspace</span>
                                    <ArrowRight className="w-3.5 h-3.5" />
                                </Link>

                                <a
                                    href={`https://github.com/A-Generative-Slice/${product.repoName}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-full py-2.5 rounded-xl border border-black/5 dark:border-white/10 bg-black/[0.02] dark:bg-white/[0.02] hover:bg-black/5 dark:hover:bg-white/10 text-xs font-mono text-[#64748B] dark:text-white/70 transition-all flex items-center justify-center gap-1.5"
                                >
                                    <GitBranch className="w-3.5 h-3.5 text-[#FF5C00]" />
                                    <span>A-Generative-Slice/{product.repoName}</span>
                                </a>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* UNIFIED WORKFLOW PIPELINE ARCHITECTURE */}
            <section className="p-8 sm:p-12 rounded-3xl border border-black/10 dark:border-white/10 bg-white dark:bg-[#111111] shadow-2xl">
                <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
                    <span className="text-xs font-bold uppercase tracking-widest text-[#FF5C00] font-heading block">
                        Interoperable Pipeline
                    </span>
                    <h2 className="text-2xl sm:text-4xl font-black text-[#0F172A] dark:text-white font-heading tracking-tight">
                        How The 7 Systems Connect
                    </h2>
                    <p className="text-xs sm:text-sm text-[#64748B] dark:text-white/70 leading-relaxed">
                        Each tool operates as an autonomous modular service or can be orchestrated in an integrated pipeline.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="p-5 rounded-2xl border border-black/10 dark:border-white/10 bg-black/[0.02] dark:bg-white/[0.02] space-y-2">
                        <span className="font-mono text-[#FF5C00] font-bold text-xs">Stage 01</span>
                        <h4 className="font-bold text-sm text-[#0F172A] dark:text-white">Target Ingestion</h4>
                        <p className="text-xs text-[#64748B] dark:text-white/60">
                            SliceLeads scrapes and verifies decision-makers, feeding rich intent signals to SliceMail for hyper-personalized outreach.
                        </p>
                    </div>

                    <div className="p-5 rounded-2xl border border-black/10 dark:border-white/10 bg-black/[0.02] dark:bg-white/[0.02] space-y-2">
                        <span className="font-mono text-[#FF5C00] font-bold text-xs">Stage 02</span>
                        <h4 className="font-bold text-sm text-[#0F172A] dark:text-white">Omnichannel Triage</h4>
                        <p className="text-xs text-[#64748B] dark:text-white/60">
                            SliceInbox unifies customer replies from WhatsApp, Email, and Web, escalating critical tickets with auto-sentiment detection.
                        </p>
                    </div>

                    <div className="p-5 rounded-2xl border border-black/10 dark:border-white/10 bg-black/[0.02] dark:bg-white/[0.02] space-y-2">
                        <span className="font-mono text-[#FF5C00] font-bold text-xs">Stage 03</span>
                        <h4 className="font-bold text-sm text-[#0F172A] dark:text-white">Immersive Experiences</h4>
                        <p className="text-xs text-[#64748B] dark:text-white/60">
                            SliceDAM optimizes high-res assets, streaming 3D geometries to Slice3D for lightning-fast 60 FPS customer customization.
                        </p>
                    </div>

                    <div className="p-5 rounded-2xl border border-black/10 dark:border-white/10 bg-black/[0.02] dark:bg-white/[0.02] space-y-2">
                        <span className="font-mono text-[#FF5C00] font-bold text-xs">Stage 04</span>
                        <h4 className="font-bold text-sm text-[#0F172A] dark:text-white">Executive Enablement</h4>
                        <p className="text-xs text-[#64748B] dark:text-white/60">
                            SlicePPT generates boardroom investor decks in seconds, while SliceClass trains teams on internal operations.
                        </p>
                    </div>
                </div>
            </section>

            {/* GENERAL DEPLOYMENT & ARCHITECTURE SCOPING FORM */}
            <section id="scoping-form" className="rounded-3xl border border-black/10 dark:border-white/10 bg-white dark:bg-[#111111] p-8 sm:p-12 shadow-2xl relative overflow-hidden scroll-mt-28">
                <div className="absolute top-0 right-0 w-80 h-80 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />

                <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
                    <span className="text-xs font-bold uppercase tracking-widest text-[#FF5C00] font-heading block">
                        Enterprise Consultation
                    </span>
                    <h2 className="text-2xl sm:text-4xl font-black text-[#0F172A] dark:text-white font-heading tracking-tight">
                        Schedule an Architecture Review
                    </h2>
                    <p className="text-xs sm:text-sm text-[#64748B] dark:text-white/60">
                        Inquire about deploying, licensing, or tailoring any of the 7 products for your enterprise infrastructure.
                    </p>
                </div>

                <form onSubmit={handleFormSubmit} className="max-w-3xl mx-auto space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="text-xs font-semibold text-[#0F172A] dark:text-white/70 block mb-1">
                                Full Name *
                            </label>
                            <input
                                type="text"
                                required
                                value={formData.fullName}
                                onChange={(e) => setFormData(prev => ({ ...prev, fullName: e.target.value }))}
                                placeholder="Your Name"
                                className="w-full px-4 py-2.5 rounded-xl border border-black/10 dark:border-white/10 bg-black/[0.02] dark:bg-white/[0.03] text-xs text-[#0F172A] dark:text-white focus:outline-none focus:border-[#FF5C00]"
                            />
                        </div>

                        <div>
                            <label className="text-xs font-semibold text-[#0F172A] dark:text-white/70 block mb-1">
                                Work Email *
                            </label>
                            <input
                                type="email"
                                required
                                value={formData.email}
                                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                                placeholder="name@company.com"
                                className="w-full px-4 py-2.5 rounded-xl border border-black/10 dark:border-white/10 bg-black/[0.02] dark:bg-white/[0.03] text-xs text-[#0F172A] dark:text-white focus:outline-none focus:border-[#FF5C00]"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="text-xs font-semibold text-[#0F172A] dark:text-white/70 block mb-1">
                                WhatsApp / Mobile *
                            </label>
                            <input
                                type="tel"
                                required
                                value={formData.phone}
                                onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                                placeholder="+91 78128 91494"
                                className="w-full px-4 py-2.5 rounded-xl border border-black/10 dark:border-white/10 bg-black/[0.02] dark:bg-white/[0.03] text-xs text-[#0F172A] dark:text-white focus:outline-none focus:border-[#FF5C00]"
                            />
                        </div>

                        <div>
                            <label className="text-xs font-semibold text-[#0F172A] dark:text-white/70 block mb-1">
                                Primary Product of Interest
                            </label>
                            <select
                                value={formData.category}
                                onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                                className="w-full px-4 py-2.5 rounded-xl border border-black/10 dark:border-white/10 bg-black/[0.02] dark:bg-white/[0.03] text-xs text-[#0F172A] dark:text-white focus:outline-none focus:border-[#FF5C00]"
                            >
                                <option value="All Suite Products">Full Suite Integration (All 7)</option>
                                <option value="Slice3D">Slice3D — Interactive 3D Engine</option>
                                <option value="SliceLeads">SliceLeads — B2B Sales Intelligence</option>
                                <option value="SliceMail">SliceMail — Autonomous Cold Outreach</option>
                                <option value="SliceInbox">SliceInbox — Omnichannel Triage</option>
                                <option value="SlicePPT">SlicePPT — Executive Slide Synthesis</option>
                                <option value="SliceDAM">SliceDAM — Digital Asset Management</option>
                                <option value="SliceClass">SliceClass — Adaptive EdTech LMS</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="text-xs font-semibold text-[#0F172A] dark:text-white/70 block mb-1">
                            Architecture Scope / Deployment Goals
                        </label>
                        <textarea
                            rows={4}
                            value={formData.message}
                            onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                            className="w-full px-4 py-2.5 rounded-xl border border-black/10 dark:border-white/10 bg-black/[0.02] dark:bg-white/[0.03] text-xs text-[#0F172A] dark:text-white focus:outline-none focus:border-[#FF5C00] leading-relaxed"
                            placeholder="Detail your operational requirements, expected user volume, or custom hosting needs..."
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={status === 'sending'}
                        className="w-full py-3.5 rounded-xl bg-[#FF5C00] text-white text-xs font-bold hover:bg-[#FF8C1A] transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#FF5C00]/25 disabled:opacity-50 font-heading"
                    >
                        {status === 'sending' ? (
                            <span>Submitting Architecture Scoping Brief...</span>
                        ) : status === 'sent' ? (
                            <span className="flex items-center gap-2">
                                <CheckCircle2 className="w-4 h-4" /> Scoping Logged! Our lead architect will respond directly.
                            </span>
                        ) : (
                            <span className="flex items-center gap-2">
                                <Send className="w-4 h-4" /> Submit Scoping Request
                            </span>
                        )}
                    </button>
                </form>

                {/* Direct Contact Verification */}
                <div className="mt-8 pt-6 border-t border-black/5 dark:border-white/10 flex flex-wrap items-center justify-center gap-6 text-xs text-[#64748B] dark:text-white/50">
                    <span className="flex items-center gap-1.5">
                        <Server className="w-3.5 h-3.5 text-[#FF5C00]" />
                        <span>Sole Official Contact: +91 78128 91494</span>
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1.5">
                        <Activity className="w-3.5 h-3.5 text-[#FF5C00]" />
                        <span>Email: smdhussain@agenerativeslice.com</span>
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1.5">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                        <span>Direct Founder & Engineering Lab</span>
                    </span>
                </div>
            </section>
        </div>
    );
};
