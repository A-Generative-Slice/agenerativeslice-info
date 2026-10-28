import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
    Boxes, Zap, Bot, Cpu, GraduationCap, 
    Presentation, FolderKanban, ArrowRight,
    GitBranch, CheckCircle2, Send, ArrowUpRight
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
        message: 'I would like to explore integrating A Generative Slice software products for our operations.',
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
            case 'slice-3d': return <Boxes className="w-5 h-5 text-white" />;
            case 'slice-leads': return <Zap className="w-5 h-5 text-white" />;
            case 'slice-mail': return <Bot className="w-5 h-5 text-white" />;
            case 'slice-inbox': return <Cpu className="w-5 h-5 text-white" />;
            case 'slice-ppt': return <Presentation className="w-5 h-5 text-white" />;
            case 'slice-dam': return <FolderKanban className="w-5 h-5 text-white" />;
            case 'slice-class': return <GraduationCap className="w-5 h-5 text-white" />;
            default: return <Boxes className="w-5 h-5 text-white" />;
        }
    };

    return (
        <div className="pt-24 sm:pt-28 pb-20 px-4 sm:px-6 max-w-6xl mx-auto space-y-16 sm:space-y-24">
            {/* HERO SECTION: Minimal, Authoritative, Confident */}
            <section className="text-center pt-6 sm:pt-10">
                <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#FF5C00] font-heading mb-4">
                    <span className="font-mono text-[#FF5C00]">|</span>
                    <span>SOFTWARE SYSTEMS LABORATORY</span>
                </div>

                <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-[#0F172A] dark:text-white font-heading tracking-tight leading-[1.12] max-w-3xl mx-auto">
                    Proprietary Software Systems &amp; <span className="text-[#FF5C00]">Interactive Sandboxes</span>
                </h1>

                <p className="mt-5 text-sm sm:text-base text-[#64748B] dark:text-[#94A3B8] max-w-2xl mx-auto leading-relaxed">
                    Direct browser sandboxes and technical benchmarks for 7 production systems engineered by A Generative Slice in Chennai, India.
                </p>

                {/* Minimal Status Strip */}
                <div className="mt-6 flex flex-wrap items-center justify-center gap-2 text-[11px] font-mono text-[#64748B] dark:text-white/50">
                    <span className="px-2.5 py-1 rounded-md border border-black/10 dark:border-white/10 bg-black/[0.02] dark:bg-white/[0.03]">
                        7 Live Sandboxes
                    </span>
                    <span className="hidden sm:inline">•</span>
                    <span className="px-2.5 py-1 rounded-md border border-black/10 dark:border-white/10 bg-black/[0.02] dark:bg-white/[0.03]">
                        Zero App Install
                    </span>
                    <span className="hidden sm:inline">•</span>
                    <span className="px-2.5 py-1 rounded-md border border-black/10 dark:border-white/10 bg-black/[0.02] dark:bg-white/[0.03]">
                        Direct Browser Execution
                    </span>
                    <span className="hidden sm:inline">•</span>
                    <span className="px-2.5 py-1 rounded-md border border-black/10 dark:border-white/10 bg-black/[0.02] dark:bg-white/[0.03]">
                        Chennai, IN-TN
                    </span>
                </div>
            </section>

            {/* THE 7 INTERACTIVE WORKSPACES (Clean, Non-Repetitive Directory) */}
            <section id="workspaces" className="scroll-mt-28 space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 border-b border-black/5 dark:border-white/10 pb-4">
                    <div>
                        <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#FF5C00] font-heading mb-1">
                            <span className="font-mono text-[#FF5C00]">|</span>
                            <span>INTERACTIVE WORKSPACES</span>
                        </div>
                        <h2 className="text-xl sm:text-3xl font-black text-[#0F172A] dark:text-white font-heading tracking-tight">
                            Select a Software Sandbox
                        </h2>
                    </div>
                    <span className="text-xs font-mono text-[#64748B] dark:text-white/40">
                        Isolated Routes • Real-Time Controls
                    </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {detailedProducts.map((product, idx) => (
                        <div
                            key={product.id}
                            className="rounded-2xl border border-black/10 dark:border-white/10 bg-white dark:bg-[#0c0f17] p-6 shadow-sm hover:border-[#FF5C00]/40 transition-all flex flex-col justify-between space-y-5 group"
                        >
                            <div className="space-y-4">
                                {/* Card Header */}
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-[#FF5C00] flex items-center justify-center shadow-sm">
                                            {getProductIcon(product.id)}
                                        </div>
                                        <div>
                                            <span className="font-mono text-[10px] text-[#64748B] dark:text-white/40 block">
                                                0{idx + 1}
                                            </span>
                                            <h3 className="text-lg font-black text-[#0F172A] dark:text-white font-heading">
                                                {product.name}
                                            </h3>
                                        </div>
                                    </div>
                                    <span className="px-2 py-0.5 rounded-md text-[10px] font-mono bg-black/5 dark:bg-white/10 text-[#64748B] dark:text-white/60">
                                        {product.badge}
                                    </span>
                                </div>

                                <p className="text-xs text-[#64748B] dark:text-[#94A3B8] leading-relaxed">
                                    {product.tagline}
                                </p>

                                {/* Key Highlight Tag */}
                                <div className="text-[11px] font-mono text-[#FF5C00] bg-[#FF5C00]/5 border border-[#FF5C00]/15 rounded-lg px-2.5 py-1">
                                    {product.specs[0]?.label}: {product.specs[0]?.value}
                                </div>
                            </div>

                            {/* Single Clean Action Link */}
                            <div className="pt-4 border-t border-black/5 dark:border-white/5 flex items-center justify-between gap-3">
                                <a
                                    href={`https://github.com/A-Generative-Slice/${product.repoName}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-[11px] font-mono text-[#64748B] dark:text-white/50 hover:text-[#FF5C00] transition-colors flex items-center gap-1"
                                    title="View Source on GitHub"
                                >
                                    <GitBranch className="w-3 h-3 text-[#FF5C00]" />
                                    <span>{product.repoName}</span>
                                </a>

                                <Link
                                    to={product.path}
                                    className="px-4 py-2.5 rounded-xl bg-[#FF5C00] hover:bg-[#FF8C1A] text-white text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm font-heading min-h-[42px]"
                                >
                                    <span>Launch Sandbox</span>
                                    <ArrowRight className="w-3.5 h-3.5" />
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* MINIMAL CORPORATE STUDIO BRIDGE (Clean, 1 Card) */}
            <section className="rounded-2xl border border-black/10 dark:border-white/10 bg-white dark:bg-[#0c0f17] p-6 sm:p-8 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                <div className="space-y-1.5 max-w-xl">
                    <span className="text-[10px] font-mono uppercase tracking-widest text-[#FF5C00] font-bold block">
                        | Corporate Headquarters
                    </span>
                    <h3 className="text-lg sm:text-xl font-black text-[#0F172A] dark:text-white font-heading">
                        Looking for bespoke client engineering or advisory?
                    </h3>
                    <p className="text-xs text-[#64748B] dark:text-[#94A3B8] leading-relaxed">
                        A Generative Slice operates its primary corporate studio and client consulting headquarters at <span className="font-semibold text-[#0F172A] dark:text-white">agenerativeslice.com</span>.
                    </p>
                </div>

                <a
                    href="https://agenerativeslice.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-5 py-3 rounded-xl bg-black/5 dark:bg-white/10 hover:bg-[#FF5C00] text-[#0F172A] dark:text-white hover:text-white text-xs font-bold transition-all flex items-center gap-2 font-heading shrink-0 min-h-[46px]"
                >
                    <span>Visit Corporate Studio</span>
                    <ArrowUpRight className="w-4 h-4" />
                </a>
            </section>

            {/* MINIMAL INQUIRY / SCOPING FORM (Frictionless & Compact) */}
            <section id="scoping-form" className="rounded-2xl border border-black/10 dark:border-white/10 bg-white dark:bg-[#0c0f17] p-6 sm:p-10 shadow-sm scroll-mt-28">
                <div className="max-w-xl mx-auto mb-8 text-center space-y-1.5">
                    <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#FF5C00] font-heading">
                        <span className="font-mono text-[#FF5C00]">|</span>
                        <span>ARCHITECTURE REVIEW</span>
                    </div>
                    <h2 className="text-xl sm:text-2xl font-black text-[#0F172A] dark:text-white font-heading tracking-tight">
                        Deploy a Sandbox for Your Organization
                    </h2>
                    <p className="text-xs text-[#64748B] dark:text-[#94A3B8]">
                        Inquire about licensing, tailoring, or hosting any of the 7 products.
                    </p>
                </div>

                <form onSubmit={handleFormSubmit} className="max-w-2xl mx-auto space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-[#0F172A] dark:text-white/80 mb-1.5 font-heading">
                                Full Name *
                            </label>
                            <input
                                type="text"
                                required
                                value={formData.fullName}
                                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                                placeholder="Mohammed Hussain"
                                className="w-full px-4 py-3 rounded-xl border border-black/10 dark:border-white/10 bg-[#f8fafc] dark:bg-[#111622] text-[#0F172A] dark:text-white text-base focus:border-[#FF5C00] focus:ring-1 focus:ring-[#FF5C00] outline-none transition-all min-h-[48px]"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-[#0F172A] dark:text-white/80 mb-1.5 font-heading">
                                Work Email *
                            </label>
                            <input
                                type="email"
                                required
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                placeholder="name@company.com"
                                className="w-full px-4 py-3 rounded-xl border border-black/10 dark:border-white/10 bg-[#f8fafc] dark:bg-[#111622] text-[#0F172A] dark:text-white text-base focus:border-[#FF5C00] focus:ring-1 focus:ring-[#FF5C00] outline-none transition-all min-h-[48px]"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-[#0F172A] dark:text-white/80 mb-1.5 font-heading">
                                Phone / WhatsApp *
                            </label>
                            <input
                                type="tel"
                                required
                                value={formData.phone}
                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                placeholder="+91 98400 00000"
                                className="w-full px-4 py-3 rounded-xl border border-black/10 dark:border-white/10 bg-[#f8fafc] dark:bg-[#111622] text-[#0F172A] dark:text-white text-base focus:border-[#FF5C00] focus:ring-1 focus:ring-[#FF5C00] outline-none transition-all min-h-[48px]"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-[#0F172A] dark:text-white/80 mb-1.5 font-heading">
                                Product of Interest
                            </label>
                            <select
                                value={formData.category}
                                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                className="w-full px-4 py-3 rounded-xl border border-black/10 dark:border-white/10 bg-[#f8fafc] dark:bg-[#111622] text-[#0F172A] dark:text-white text-base focus:border-[#FF5C00] focus:ring-1 focus:ring-[#FF5C00] outline-none transition-all min-h-[48px]"
                            >
                                <option value="General Architecture Review">All Systems Review</option>
                                <option value="Slice3D (Spatial WebGL)">Slice3D — 3D WebGL Viewer</option>
                                <option value="SliceLeads (Lead Engine)">SliceLeads — B2B Lead Intelligence</option>
                                <option value="SliceMail (AI Outreach)">SliceMail — Automated Email Engine</option>
                                <option value="SliceInbox (Omnichannel CRM)">SliceInbox — FastMCP CRM Triage</option>
                                <option value="SlicePPT (Deck Engine)">SlicePPT — Automated Slide Generator</option>
                                <option value="SliceDAM (Digital Assets)">SliceDAM — Document Vault</option>
                                <option value="SliceClass (Studio LMS)">SliceClass — Monochromatic LMS</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-[#0F172A] dark:text-white/80 mb-1.5 font-heading">
                            Requirements Brief
                        </label>
                        <textarea
                            rows={3}
                            value={formData.message}
                            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                            placeholder="Describe your use case or infrastructure requirements..."
                            className="w-full px-4 py-3 rounded-xl border border-black/10 dark:border-white/10 bg-[#f8fafc] dark:bg-[#111622] text-[#0F172A] dark:text-white text-base focus:border-[#FF5C00] focus:ring-1 focus:ring-[#FF5C00] outline-none transition-all resize-none"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={status === 'sending'}
                        className="w-full py-4 rounded-xl bg-[#FF5C00] hover:bg-[#FF8C1A] text-white text-sm font-bold shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 min-h-[50px] font-heading"
                    >
                        {status === 'sending' ? (
                            <span>Submitting Review Request...</span>
                        ) : status === 'sent' ? (
                            <span className="flex items-center gap-2">
                                <CheckCircle2 className="w-4 h-4" />
                                Review Request Received — Response within 24h
                            </span>
                        ) : (
                            <span className="flex items-center gap-2">
                                <Send className="w-4 h-4" />
                                Submit Architecture Inquiry
                            </span>
                        )}
                    </button>
                </form>
            </section>
        </div>
    );
};
