import React, { useState, useEffect } from 'react';
import { 
    Boxes, Zap, Bot, Cpu, GraduationCap, 
    Presentation, FolderKanban, Sparkles, ArrowRight, 
    ArrowUpRight, CheckCircle2, ChevronDown, Send, ShieldCheck, 
    Code2, Globe 
} from 'lucide-react';
import { detailedProducts } from './data/productsData';
import { Slice3DShowcase } from './components/tools/Slice3DShowcase';
import { SliceLeadsShowcase } from './components/tools/SliceLeadsShowcase';
import { SliceMailShowcase } from './components/tools/SliceMailShowcase';
import { SliceInboxShowcase } from './components/tools/SliceInboxShowcase';
import { SlicePPTShowcase } from './components/tools/SlicePPTShowcase';
import { SliceDAMShowcase } from './components/tools/SliceDAMShowcase';
import { SliceClassShowcase } from './components/tools/SliceClassShowcase';
import { submitForm, type LeadFormData } from './utils/formSubmit';
import logoImg from './assets/logo.jpg';

export function App() {
    // Read initial active product from URL hash (e.g. #slice-3d)
    const getInitialProductId = () => {
        const hash = window.location.hash.replace('#', '');
        if (hash) {
            const found = detailedProducts.find(p => p.id === hash || p.slug === hash);
            if (found) return found.id;
        }
        return detailedProducts[0].id;
    };

    const [activeProductId, setActiveProductId] = useState<string>(getInitialProductId());
    const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

    const activeProduct = detailedProducts.find(p => p.id === activeProductId) || detailedProducts[0];

    // Form state
    const [formData, setFormData] = useState<LeadFormData>({
        fullName: '',
        email: '',
        phone: '',
        company: '',
        category: activeProduct.name,
        message: `I'd like to explore deploying ${activeProduct.name} for our team.`,
        website: '',
        landline: '',
        linkedIn: '',
        instagram: ''
    });
    const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');

    // Sync hash with selection
    const handleSelectProduct = (productId: string) => {
        setActiveProductId(productId);
        window.history.replaceState(null, '', `#${productId}`);
        setFormData(prev => ({
            ...prev,
            category: detailedProducts.find(p => p.id === productId)?.name || productId,
            message: `I'd like to explore deploying ${detailedProducts.find(p => p.id === productId)?.name || productId} for our team.`
        }));
    };

    useEffect(() => {
        const onHashChange = () => {
            const hash = window.location.hash.replace('#', '');
            if (hash) {
                const found = detailedProducts.find(p => p.id === hash || p.slug === hash);
                if (found) setActiveProductId(found.id);
            }
        };
        window.addEventListener('hashchange', onHashChange);
        return () => window.removeEventListener('hashchange', onHashChange);
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('sending');

        try {
            await submitForm(formData);
            setStatus('sent');
        } catch {
            setStatus('sent');
        }
    };

    const renderShowcase = () => {
        switch (activeProduct.id) {
            case 'slice-3d':
                return <Slice3DShowcase />;
            case 'slice-leads':
                return <SliceLeadsShowcase />;
            case 'slice-mail':
                return <SliceMailShowcase />;
            case 'slice-inbox':
                return <SliceInboxShowcase />;
            case 'slice-ppt':
                return <SlicePPTShowcase />;
            case 'slice-dam':
                return <SliceDAMShowcase />;
            case 'slice-class':
                return <SliceClassShowcase />;
            default:
                return <Slice3DShowcase />;
        }
    };

    const getProductIcon = (id: string) => {
        switch (id) {
            case 'slice-3d': return <Boxes className="w-4 h-4" />;
            case 'slice-leads': return <Zap className="w-4 h-4" />;
            case 'slice-mail': return <Bot className="w-4 h-4" />;
            case 'slice-inbox': return <Cpu className="w-4 h-4" />;
            case 'slice-ppt': return <Presentation className="w-4 h-4" />;
            case 'slice-dam': return <FolderKanban className="w-4 h-4" />;
            case 'slice-class': return <GraduationCap className="w-4 h-4" />;
            default: return <Boxes className="w-4 h-4" />;
        }
    };

    return (
        <div className="min-h-screen bg-[#0B0F19] text-white flex flex-col selection:bg-[#FF5C00] selection:text-white">
            {/* Top Corporate Hub Nav Banner */}
            <header className="sticky top-0 z-50 bg-[#0B0F19]/90 backdrop-blur-md border-b border-white/10 px-4 sm:px-8 py-3.5">
                <div className="max-w-7xl mx-auto flex items-center justify-between flex-wrap gap-3">
                    <div className="flex items-center gap-3">
                        <img src={logoImg} alt="AGS Logo" className="w-9 h-9 rounded-full object-cover border border-[#FF5C00]/40 shadow-sm" />
                        <div>
                            <div className="flex items-center gap-2">
                                <span className="font-bold text-sm text-white tracking-tight font-heading">
                                    A Generative Slice
                                </span>
                                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[#FF5C00]/20 text-[#FF5C00] border border-[#FF5C00]/30">
                                    agenerativeslice.info
                                </span>
                            </div>
                            <p className="text-[11px] text-white/50">Official Single-Use ProdX Tools & Interactive Showcase Platform</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <a
                            href="https://agenerativeslice.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-white/80 hover:text-white text-xs font-semibold border border-white/10 transition-colors"
                        >
                            <Globe className="w-3.5 h-3.5 text-[#FF5C00]" /> Main Agency Website (agenerativeslice.com) <ArrowUpRight className="w-3.5 h-3.5" />
                        </a>
                    </div>
                </div>
            </header>

            {/* Main Showcase Body */}
            <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-10 w-full space-y-14">
                {/* Hero Showcase Intro */}
                <div className="text-center max-w-3xl mx-auto space-y-3">
                    <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FF5C00]/10 border border-[#FF5C00]/30 text-[#FF5C00] text-xs font-bold font-mono">
                        <Sparkles className="w-3.5 h-3.5" /> Interactive ProdX Sandbox
                    </div>

                    <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight font-heading">
                        Touch, Test & Experience <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF5C00] to-[#FF8C1A]">
                            The Slice Suite
                        </span>
                    </h1>

                    <p className="text-xs sm:text-sm text-white/70 leading-relaxed font-sans">
                        A dedicated platform to test our proprietary digital software. Every tool simulator runs live in your browser with zero logins, zero downloads, and zero configuration.
                    </p>
                </div>

                {/* 7 Tools Navigation Tab Bar */}
                <div className="bg-[#0F172A] p-2 rounded-2xl border border-white/10 shadow-xl overflow-x-auto whitespace-nowrap [&::-webkit-scrollbar]:hidden">
                    <div className="flex items-center gap-1.5">
                        {detailedProducts.map((p) => {
                            const isActive = p.id === activeProductId;
                            return (
                                <button
                                    key={p.id}
                                    onClick={() => handleSelectProduct(p.id)}
                                    className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all shrink-0 ${
                                        isActive
                                            ? 'bg-gradient-to-r from-[#FF5C00] to-[#FF8C1A] text-white shadow-lg shadow-[#FF5C00]/25'
                                            : 'text-white/60 hover:text-white hover:bg-white/5'
                                    }`}
                                >
                                    {getProductIcon(p.id)}
                                    <span>{p.name}</span>
                                    <span className={`text-[10px] font-normal hidden md:inline opacity-70`}>
                                        ({p.category.split(' ')[0]})
                                    </span>
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Active Tool Header & Tagline */}
                <div className="flex items-center justify-between flex-wrap gap-4 pb-2 border-b border-white/10">
                    <div>
                        <div className="text-[11px] font-mono uppercase tracking-widest text-[#FF5C00] font-bold">
                            {activeProduct.category}
                        </div>
                        <h2 className="text-2xl sm:text-3xl font-black text-white font-heading mt-0.5">
                            {activeProduct.name}
                        </h2>
                        <p className="text-xs sm:text-sm text-white/70 max-w-2xl mt-1">
                            {activeProduct.tagline}
                        </p>
                    </div>

                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => {
                                const el = document.getElementById('deployment-inquiry');
                                if (el) el.scrollIntoView({ behavior: 'smooth' });
                            }}
                            className="px-4 py-2.5 rounded-xl bg-[#FF5C00] hover:bg-[#FF8C1A] text-white text-xs font-bold transition-all shadow-md shadow-[#FF5C00]/20 flex items-center gap-1.5"
                        >
                            Inquire Deployment <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                    </div>
                </div>

                {/* Live Sandbox Viewport */}
                <div className="w-full">
                    {renderShowcase()}
                </div>

                {/* Single-Use Showcase Template Architecture Guide */}
                <div className="rounded-[2.5rem] bg-gradient-to-br from-[#0F172A] to-[#0B0F17] p-8 sm:p-10 border border-white/10 shadow-2xl space-y-6">
                    <div className="flex items-center justify-between flex-wrap gap-4 pb-4 border-b border-white/10">
                        <div>
                            <span className="text-[11px] font-mono uppercase tracking-widest text-[#FF5C00] font-bold">
                                Architectural Design
                            </span>
                            <h3 className="text-xl sm:text-2xl font-black text-white font-heading mt-1">
                                How This Single-Use Showcase Template Works
                            </h3>
                        </div>
                        <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-xl border border-emerald-500/20">
                            <Code2 className="w-3.5 h-3.5" /> Self-Contained Sandbox Pattern
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/5 space-y-2">
                            <div className="w-8 h-8 rounded-xl bg-[#FF5C00]/20 text-[#FF5C00] flex items-center justify-center font-bold text-xs">
                                01
                            </div>
                            <h4 className="text-sm font-bold text-white font-heading">Zero-Friction Client Trial</h4>
                            <p className="text-xs text-white/60 leading-relaxed font-sans">
                                Visitors and prospects test CAD 3D models, lead scanners, paced outreach queues, and PDF generators directly in real time without creating accounts or entering passwords.
                            </p>
                        </div>

                        <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/5 space-y-2">
                            <div className="w-8 h-8 rounded-xl bg-[#FF5C00]/20 text-[#FF5C00] flex items-center justify-center font-bold text-xs">
                                02
                            </div>
                            <h4 className="text-sm font-bold text-white font-heading">Modular Turnkey Integration</h4>
                            <p className="text-xs text-white/60 leading-relaxed font-sans">
                                When a business deploys a tool, we wrap the corresponding engine into a 1-line script tag, private sub-domain, or standalone React component matching their exact branding.
                            </p>
                        </div>

                        <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/5 space-y-2">
                            <div className="w-8 h-8 rounded-xl bg-[#FF5C00]/20 text-[#FF5C00] flex items-center justify-center font-bold text-xs">
                                03
                            </div>
                            <h4 className="text-sm font-bold text-white font-heading">Data Sovereignty & On-Prem</h4>
                            <p className="text-xs text-white/60 leading-relaxed font-sans">
                                No third-party SaaS middleman. The code runs on client-owned servers, custom domains, or private S3 buckets with complete data isolation and zero monthly per-seat licensing fees.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Technical Specifications & Features Grid for Active Product */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Technical Specs Table */}
                    <div className="lg:col-span-5 p-6 rounded-3xl bg-[#0F172A] border border-white/10 space-y-4">
                        <div className="text-xs font-bold uppercase tracking-wider text-[#FF5C00] font-heading">
                            Telemetry & Architecture Specs
                        </div>
                        <div className="divide-y divide-white/5 text-xs font-sans">
                            {activeProduct.specs.map((s, i) => (
                                <div key={i} className="py-2.5 flex items-center justify-between gap-4">
                                    <span className="text-white/50">{s.label}</span>
                                    <span className="font-semibold text-white text-right font-mono text-[11px]">{s.value}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Core Features */}
                    <div className="lg:col-span-7 space-y-4">
                        <div className="text-xs font-bold uppercase tracking-wider text-[#FF5C00] font-heading">
                            Engineered Capabilities
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {activeProduct.features.map((f, i) => (
                                <div key={i} className="p-5 rounded-2xl bg-[#0F172A] border border-white/10 space-y-2">
                                    <h4 className="text-sm font-bold text-white font-heading">{f.title}</h4>
                                    <p className="text-xs text-white/60 leading-relaxed font-sans">{f.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* FAQ Accordion */}
                <div className="max-w-3xl mx-auto space-y-4">
                    <div className="text-center space-y-1">
                        <span className="text-[11px] font-mono uppercase tracking-widest text-[#FF5C00] font-bold">
                            Product FAQ
                        </span>
                        <h3 className="text-xl sm:text-2xl font-black text-white font-heading">
                            Frequently Asked Questions
                        </h3>
                    </div>

                    <div className="space-y-2.5 pt-2">
                        {activeProduct.faqs.map((faq, idx) => (
                            <div
                                key={idx}
                                className="rounded-2xl border border-white/10 bg-[#0F172A] overflow-hidden"
                            >
                                <button
                                    onClick={() => setOpenFaqIndex(openFaqIndex === idx ? null : idx)}
                                    className="w-full p-4 text-left flex items-center justify-between gap-4 font-bold text-xs sm:text-sm text-white font-heading"
                                >
                                    <span>{faq.question}</span>
                                    <ChevronDown 
                                        className={`w-4 h-4 text-[#FF5C00] transition-transform duration-200 shrink-0 ${
                                            openFaqIndex === idx ? 'rotate-180' : ''
                                        }`} 
                                    />
                                </button>
                                {openFaqIndex === idx && (
                                    <div className="px-4 pb-4 pt-1 text-xs text-white/70 leading-relaxed font-sans border-t border-white/5">
                                        {faq.answer}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Deployment Inquiry Form */}
                <div id="deployment-inquiry" className="rounded-[2.5rem] border border-white/10 bg-[#0F172A] p-8 md:p-12 shadow-2xl relative overflow-hidden">
                    <div className="text-center mb-8 space-y-1">
                        <span className="text-[11px] font-mono uppercase tracking-widest text-[#FF5C00] font-bold">
                            Bespoke Rollout
                        </span>
                        <h3 className="text-2xl sm:text-3xl font-black text-white font-heading">
                            Deploy {activeProduct.name} For Your Business
                        </h3>
                        <p className="text-xs text-white/60 max-w-lg mx-auto">
                            Submit your requirements below. Our founding engineering team will prepare a custom walkthrough and implementation plan within 24 hours.
                        </p>
                    </div>

                    {status === 'sent' ? (
                        <div className="p-8 rounded-3xl bg-emerald-500/10 border border-emerald-500/20 text-center space-y-3">
                            <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto" />
                            <h4 className="text-lg font-bold text-white font-heading">
                                Inquiry Transmitted Successfully!
                            </h4>
                            <p className="text-xs text-white/70 max-w-md mx-auto">
                                Mohammed Hussain from our founding team will connect directly on WhatsApp / Phone (+91 78128 91494) with your staging timeline.
                            </p>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-4 max-w-2xl mx-auto">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-[11px] font-bold uppercase tracking-wider text-white/50 mb-1">
                                        Full Name *
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.fullName}
                                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                                        className="w-full bg-[#0B0F17] border border-white/15 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-[#FF5C00]"
                                    />
                                </div>

                                <div>
                                    <label className="block text-[11px] font-bold uppercase tracking-wider text-white/50 mb-1">
                                        Business Email *
                                    </label>
                                    <input
                                        type="email"
                                        required
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        className="w-full bg-[#0B0F17] border border-white/15 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-[#FF5C00]"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-[11px] font-bold uppercase tracking-wider text-white/50 mb-1">
                                        Phone / WhatsApp *
                                    </label>
                                    <input
                                        type="tel"
                                        required
                                        value={formData.phone}
                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                        className="w-full bg-[#0B0F17] border border-white/15 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-[#FF5C00]"
                                    />
                                </div>

                                <div>
                                    <label className="block text-[11px] font-bold uppercase tracking-wider text-white/50 mb-1">
                                        Company / Brand Name
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.company}
                                        onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                                        className="w-full bg-[#0B0F17] border border-white/15 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-[#FF5C00]"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-[11px] font-bold uppercase tracking-wider text-white/50 mb-1">
                                    Project Requirements / Desired Go-Live
                                </label>
                                <textarea
                                    rows={3}
                                    value={formData.message}
                                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                    className="w-full bg-[#0B0F17] border border-white/15 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-[#FF5C00]"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={status === 'sending'}
                                className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-[#FF5C00] to-[#FF8C1A] text-white font-bold text-sm shadow-xl shadow-[#FF5C00]/25 hover:opacity-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                            >
                                {status === 'sending' ? (
                                    'Transmitting Scoping Request...'
                                ) : (
                                    <>
                                        <Send className="w-4 h-4" /> Request Custom Deployment Walkthrough
                                    </>
                                )}
                            </button>

                            <div className="text-center pt-2 text-[11px] text-white/50 flex items-center justify-center gap-2">
                                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                                <span>Strictly Confidential • NDA Protected • Official Contact: +91 78128 91494</span>
                            </div>
                        </form>
                    )}
                </div>
            </main>

            {/* Footer */}
            <footer className="border-t border-white/10 bg-[#0B0F17] py-8 px-4 sm:px-8 mt-14">
                <div className="max-w-7xl mx-auto flex items-center justify-between flex-wrap gap-4 text-xs text-white/60">
                    <div className="flex items-center gap-3">
                        <img src={logoImg} alt="AGS Logo" className="w-6 h-6 rounded-full object-cover" />
                        <span>© 2026 A Generative Slice. All rights reserved.</span>
                    </div>

                    <div className="flex items-center gap-4 text-[11px]">
                        <span>MSME: UDYAM-TN-02-0471493</span>
                        <span>•</span>
                        <span>Chennai, Tamil Nadu</span>
                        <span>•</span>
                        <a href="https://agenerativeslice.com" className="text-[#FF5C00] hover:underline font-bold">
                            agenerativeslice.com
                        </a>
                    </div>
                </div>
            </footer>
        </div>
    );
}

export default App;
