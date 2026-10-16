import React, { useState, useEffect } from 'react';
import Particles, { initParticlesEngine } from '@tsparticles/react';
import { loadSlim } from '@tsparticles/slim';
import { 
    Boxes, Zap, Bot, Cpu, GraduationCap, 
    Presentation, FolderKanban, 
    ArrowRight, ChevronDown, Send, CheckCircle2,
    ExternalLink 
} from 'lucide-react';
import { detailedProducts } from './data/productsData';
import { Slice3DShowcase } from './components/tools/Slice3DShowcase';
import { SliceLeadsShowcase } from './components/tools/SliceLeadsShowcase';
import { SliceMailShowcase } from './components/tools/SliceMailShowcase';
import { SliceInboxShowcase } from './components/tools/SliceInboxShowcase';
import { SlicePPTShowcase } from './components/tools/SlicePPTShowcase';
import { SliceDAMShowcase } from './components/tools/SliceDAMShowcase';
import { SliceClassShowcase } from './components/tools/SliceClassShowcase';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { submitForm, type LeadFormData } from './utils/formSubmit';

export function App() {
    const [isDark, setIsDark] = useState(true);
    const [particlesInit, setParticlesInit] = useState(false);

    // Initial theme sync with documentElement
    useEffect(() => {
        if (isDark) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [isDark]);

    // Init tsParticles engine
    useEffect(() => {
        initParticlesEngine(async (engine) => {
            await loadSlim(engine);
        }).then(() => {
            setParticlesInit(true);
        }).catch(err => {
            console.warn('Particles init skipped:', err);
        });
    }, []);

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
        message: `I would like to explore deploying ${activeProduct.name} for our team.`,
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
            message: `I would like to explore deploying ${detailedProducts.find(p => p.id === productId)?.name || productId} for our team.`
        }));

        // Smooth scroll to showcase
        const el = document.getElementById('showcase-view');
        if (el) {
            el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
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
            await submitForm(formData, {
                subject: `ProdX Showcase Inquiry: ${formData.category} from ${formData.fullName} (${formData.company || 'Direct'})`,
                formType: 'Product Showcase Inquiry'
            });
            setStatus('sent');
        } catch {
            setStatus('sent');
        }

        setTimeout(() => setStatus('idle'), 6000);
    };

    const getProductIcon = (id: string) => {
        switch (id) {
            case 'slice-3d': return <Boxes className="w-5 h-5 text-[#FF5C00]" />;
            case 'slice-leads': return <Zap className="w-5 h-5 text-[#FF5C00]" />;
            case 'slice-mail': return <Bot className="w-5 h-5 text-[#FF5C00]" />;
            case 'slice-inbox': return <Cpu className="w-5 h-5 text-[#FF5C00]" />;
            case 'slice-ppt': return <Presentation className="w-5 h-5 text-[#FF5C00]" />;
            case 'slice-dam': return <FolderKanban className="w-5 h-5 text-[#FF5C00]" />;
            case 'slice-class': return <GraduationCap className="w-5 h-5 text-[#FF5C00]" />;
            default: return <Boxes className="w-5 h-5 text-[#FF5C00]" />;
        }
    };

    const renderShowcase = () => {
        switch (activeProduct.id) {
            case 'slice-3d': return <Slice3DShowcase />;
            case 'slice-leads': return <SliceLeadsShowcase />;
            case 'slice-mail': return <SliceMailShowcase />;
            case 'slice-inbox': return <SliceInboxShowcase />;
            case 'slice-ppt': return <SlicePPTShowcase />;
            case 'slice-dam': return <SliceDAMShowcase />;
            case 'slice-class': return <SliceClassShowcase />;
            default: return <Slice3DShowcase />;
        }
    };

    return (
        <div className="min-h-screen bg-[#fafafa] dark:bg-[#0a0a0a] text-[#0f172a] dark:text-white transition-colors duration-300 relative overflow-hidden flex flex-col font-sans">
            {/* Floating Island Navbar */}
            <Navbar 
                isDark={isDark} 
                toggleTheme={() => setIsDark(!isDark)} 
                activeProductId={activeProductId}
                onSelectProduct={handleSelectProduct}
            />

            {/* Ambient Brand Glow Backdrop */}
            <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-orange-500/10 via-transparent to-transparent opacity-60" />
                <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-orange-500/15 blur-[160px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-orange-600/10 blur-[130px]" />
            </div>

            {/* Refined Grid Overlay */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none z-0" />

            {/* Subtle Particles Canvas */}
            {particlesInit && (
                <div className="absolute inset-0 z-0 pointer-events-none opacity-40">
                    <Particles
                        id="tsparticles"
                        className="h-full w-full"
                        options={{
                            fullScreen: { enable: false },
                            fpsLimit: 120,
                            particles: {
                                color: { value: ["#ff6a00", "#ffffff"] },
                                links: {
                                    color: "#ff6a00",
                                    distance: 140,
                                    enable: true,
                                    opacity: 0.12,
                                    width: 1,
                                },
                                move: {
                                    direction: "none",
                                    enable: true,
                                    speed: 0.8,
                                    random: true
                                },
                                number: { density: { enable: true }, value: 60 },
                                opacity: { value: { min: 0.1, max: 0.4 } },
                                shape: { type: "circle" },
                                size: { value: { min: 1, max: 2.5 } },
                            },
                            detectRetina: true,
                        }}
                    />
                </div>
            )}

            {/* Main Content */}
            <main className="relative z-10 flex-grow pt-28 pb-24">
                {/* Hero Section */}
                <section id="hero" className="px-6 max-w-6xl mx-auto text-center mb-16">
                    {/* Live Sync Status Pill */}
                    <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-white/80 dark:bg-[#111]/80 border border-black/10 dark:border-white/10 text-xs font-semibold text-[#0F172A] dark:text-white/80 mb-6 shadow-sm">
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                        <span>ProdX Suite • Synced Live to 7 Official GitHub Repositories</span>
                    </div>

                    <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-[#0F172A] dark:text-white tracking-tight leading-[1.05] font-heading mb-6">
                        Products by <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF5C00] to-[#FF8C1A]">A Generative Slice</span>
                    </h1>

                    <p className="text-base sm:text-lg text-[#64748B] dark:text-white/70 max-w-3xl mx-auto leading-relaxed mb-10">
                        Interactive, browser-based sandboxes for our proprietary software suite. 
                        Every product below is connected directly to its live repository under the 
                        <a href="https://github.com/A-Generative-Slice" target="_blank" rel="noopener noreferrer" className="text-[#FF5C00] font-semibold hover:underline ml-1">
                            A-Generative-Slice GitHub Organization
                        </a>.
                    </p>

                    {/* Product Jump Bar: 7 Product Cards / Pills */}
                    <div className="flex items-center justify-center gap-2.5 flex-wrap">
                        {detailedProducts.map((p) => {
                            const isSelected = activeProductId === p.id;
                            return (
                                <button
                                    key={p.id}
                                    onClick={() => handleSelectProduct(p.id)}
                                    className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center gap-2.5 ${
                                        isSelected
                                            ? 'bg-[#FF5C00] text-white shadow-lg shadow-[#FF5C00]/25 scale-105'
                                            : 'bg-white/80 dark:bg-[#111]/80 border border-black/10 dark:border-white/10 text-[#0F172A] dark:text-white/70 hover:border-[#FF5C00]/40'
                                    }`}
                                >
                                    <span className={isSelected ? 'text-white' : 'text-[#FF5C00]'}>
                                        {getProductIcon(p.id)}
                                    </span>
                                    <span>{p.name}</span>
                                </button>
                            );
                        })}
                    </div>
                </section>

                {/* Active Product Showcase */}
                <section id="showcase-view" className="px-6 max-w-7xl mx-auto mb-24 scroll-mt-28">
                    {/* Product Header Card */}
                    <div className="rounded-3xl border border-black/10 dark:border-white/10 bg-white dark:bg-[#111] p-8 sm:p-10 shadow-xl mb-8">
                        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-6 border-b border-black/5 dark:border-white/10">
                            <div className="space-y-2">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#FF5C00] to-[#FF8C1A] flex items-center justify-center text-white shadow-md shadow-[#FF5C00]/25">
                                        {getProductIcon(activeProduct.id)}
                                    </div>
                                    <div>
                                        <span className="text-[10px] font-bold uppercase tracking-widest text-[#FF5C00] block">
                                            {activeProduct.category}
                                        </span>
                                        <h2 className="text-3xl sm:text-4xl font-black text-[#0F172A] dark:text-white font-heading tracking-tight">
                                            {activeProduct.name}
                                        </h2>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <a
                                    href={`https://github.com/A-Generative-Slice/${activeProduct.name}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="px-4 py-2.5 rounded-xl bg-black/5 dark:bg-white/10 text-xs font-bold text-[#0F172A] dark:text-white hover:bg-[#FF5C00] hover:text-white transition-all flex items-center gap-2"
                                >
                                    <span>Repository Source</span>
                                    <ExternalLink className="w-3.5 h-3.5" />
                                </a>

                                <button
                                    onClick={() => {
                                        const el = document.getElementById('inquiry-form');
                                        if (el) el.scrollIntoView({ behavior: 'smooth' });
                                    }}
                                    className="px-4 py-2.5 rounded-xl bg-[#FF5C00] text-white text-xs font-bold hover:bg-[#FF8C1A] transition-all shadow-md shadow-[#FF5C00]/25 flex items-center gap-2"
                                >
                                    <span>Deploy This Tool</span>
                                    <ArrowRight className="w-3.5 h-3.5" />
                                </button>
                            </div>
                        </div>

                        <div className="pt-6">
                            <p className="text-sm font-semibold text-[#FF5C00] mb-2 font-heading">
                                {activeProduct.tagline}
                            </p>
                            <p className="text-sm text-[#64748B] dark:text-white/70 leading-relaxed max-w-4xl">
                                {activeProduct.description}
                            </p>
                        </div>
                    </div>

                    {/* Interactive Sandbox Component */}
                    <div className="mb-16">
                        {renderShowcase()}
                    </div>

                    {/* Technical Specifications Grid */}
                    <div className="mb-16">
                        <h3 className="text-xl font-black text-[#0F172A] dark:text-white mb-6 font-heading tracking-tight">
                            {activeProduct.name} Technical Specifications
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {activeProduct.specs.map((spec, i) => (
                                <div 
                                    key={i} 
                                    className="p-5 rounded-2xl border border-black/10 dark:border-white/10 bg-white dark:bg-[#111] shadow-sm space-y-1"
                                >
                                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#FF5C00] block font-heading">
                                        {spec.label}
                                    </span>
                                    <span className="text-xs font-semibold text-[#0F172A] dark:text-white leading-relaxed block">
                                        {spec.value}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Key Engineering Features Grid */}
                    <div className="mb-16">
                        <h3 className="text-xl font-black text-[#0F172A] dark:text-white mb-6 font-heading tracking-tight">
                            Key Capabilities & Architecture
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {activeProduct.features.map((feat, i) => (
                                <div 
                                    key={i}
                                    className="p-6 rounded-3xl border border-black/10 dark:border-white/10 bg-white dark:bg-[#111] shadow-sm space-y-2 hover:border-[#FF5C00]/30 transition-all"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-xl bg-[#FF5C00]/10 text-[#FF5C00] flex items-center justify-center font-bold text-xs">
                                            0{i + 1}
                                        </div>
                                        <h4 className="text-base font-bold text-[#0F172A] dark:text-white font-heading">
                                            {feat.title}
                                        </h4>
                                    </div>
                                    <p className="text-xs text-[#64748B] dark:text-white/60 leading-relaxed pl-11">
                                        {feat.description}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* FAQs Accordion */}
                    <div className="mb-16 max-w-4xl mx-auto">
                        <h3 className="text-xl font-black text-[#0F172A] dark:text-white mb-6 text-center font-heading tracking-tight">
                            Frequently Asked Questions
                        </h3>
                        <div className="space-y-3">
                            {activeProduct.faqs.map((faq, i) => {
                                const isOpen = openFaqIndex === i;
                                return (
                                    <div 
                                        key={i}
                                        className="rounded-2xl border border-black/10 dark:border-white/10 bg-white dark:bg-[#111] overflow-hidden transition-all"
                                    >
                                        <button
                                            onClick={() => setOpenFaqIndex(isOpen ? null : i)}
                                            className="w-full p-5 text-left flex items-center justify-between gap-4 font-bold text-sm text-[#0F172A] dark:text-white"
                                        >
                                            <span>{faq.question}</span>
                                            <ChevronDown className={`w-4 h-4 text-[#FF5C00] transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                                        </button>
                                        {isOpen && (
                                            <div className="px-5 pb-5 pt-1 text-xs text-[#64748B] dark:text-white/70 leading-relaxed border-t border-black/5 dark:border-white/5">
                                                {faq.answer}
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </section>

                {/* Consultation Scoping Form Section */}
                <section id="inquiry-form" className="px-6 max-w-4xl mx-auto mb-20 scroll-mt-28">
                    <div className="rounded-3xl border border-black/10 dark:border-white/10 bg-white dark:bg-[#111] p-8 sm:p-12 shadow-2xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />

                        <div className="text-center mb-10">
                            <span className="text-xs font-bold uppercase tracking-widest text-[#FF5C00] block mb-2 font-heading">
                                Direct Engineering Consultation
                            </span>
                            <h3 className="text-3xl font-black text-[#0F172A] dark:text-white font-heading tracking-tight mb-3">
                                Schedule Free Deployment Scoping
                            </h3>
                            <p className="text-sm text-[#64748B] dark:text-white/60 max-w-lg mx-auto">
                                Tell us about your operational requirements. Founder Mohammed Hussain directly reviews every architecture inquiry.
                            </p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="text-xs font-semibold text-[#0F172A] dark:text-white/70 block mb-1">
                                        Your Full Name *
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.fullName}
                                        onChange={(e) => setFormData(prev => ({ ...prev, fullName: e.target.value }))}
                                        placeholder="Ar. Rajesh Kumar"
                                        className="w-full px-4 py-2.5 rounded-xl border border-black/10 dark:border-white/10 bg-black/[0.02] dark:bg-white/[0.03] text-xs text-[#0F172A] dark:text-white focus:outline-none focus:border-[#FF5C00]"
                                    />
                                </div>

                                <div>
                                    <label className="text-xs font-semibold text-[#0F172A] dark:text-white/70 block mb-1">
                                        Work Email Address *
                                    </label>
                                    <input
                                        type="email"
                                        required
                                        value={formData.email}
                                        onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                                        placeholder="rajesh@studioarchitecture.in"
                                        className="w-full px-4 py-2.5 rounded-xl border border-black/10 dark:border-white/10 bg-black/[0.02] dark:bg-white/[0.03] text-xs text-[#0F172A] dark:text-white focus:outline-none focus:border-[#FF5C00]"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="text-xs font-semibold text-[#0F172A] dark:text-white/70 block mb-1">
                                        Phone / WhatsApp Number *
                                    </label>
                                    <input
                                        type="tel"
                                        required
                                        value={formData.phone}
                                        onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                                        placeholder="+91 98400 00000"
                                        className="w-full px-4 py-2.5 rounded-xl border border-black/10 dark:border-white/10 bg-black/[0.02] dark:bg-white/[0.03] text-xs text-[#0F172A] dark:text-white focus:outline-none focus:border-[#FF5C00]"
                                    />
                                </div>

                                <div>
                                    <label className="text-xs font-semibold text-[#0F172A] dark:text-white/70 block mb-1">
                                        Target Product Suite
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.category}
                                        onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                                        className="w-full px-4 py-2.5 rounded-xl border border-black/10 dark:border-white/10 bg-black/[0.02] dark:bg-white/[0.03] text-xs text-[#0F172A] dark:text-white focus:outline-none focus:border-[#FF5C00] font-semibold text-[#FF5C00]"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="text-xs font-semibold text-[#0F172A] dark:text-white/70 block mb-1">
                                    Project Scope & Specific Requirements
                                </label>
                                <textarea
                                    rows={4}
                                    value={formData.message}
                                    onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                                    className="w-full px-4 py-2.5 rounded-xl border border-black/10 dark:border-white/10 bg-black/[0.02] dark:bg-white/[0.03] text-xs text-[#0F172A] dark:text-white focus:outline-none focus:border-[#FF5C00] leading-relaxed"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={status === 'sending'}
                                className="w-full py-3.5 rounded-xl bg-[#FF5C00] text-white text-xs font-bold hover:bg-[#FF8C1A] transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#FF5C00]/25 disabled:opacity-50"
                            >
                                {status === 'sending' ? (
                                    <span>Submitting Scoping Brief...</span>
                                ) : status === 'sent' ? (
                                    <span className="flex items-center gap-2">
                                        <CheckCircle2 className="w-4 h-4" /> Scoping Request Received! We will respond within 4 hours.
                                    </span>
                                ) : (
                                    <span className="flex items-center gap-2">
                                        <Send className="w-4 h-4" /> Submit Scoping Request
                                    </span>
                                )}
                            </button>
                        </form>
                    </div>
                </section>
            </main>

            {/* Official Footer */}
            <Footer />
        </div>
    );
}
export default App;
