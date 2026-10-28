import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
    ArrowLeft, ExternalLink, ChevronDown, 
    Send, CheckCircle2, Boxes, Zap, Bot, Cpu, 
    Presentation, FolderKanban, GraduationCap, GitBranch
} from 'lucide-react';
import { detailedProducts } from '../data/productsData';
import { submitForm, type LeadFormData } from '../utils/formSubmit';

interface ToolPageLayoutProps {
    productId: string;
    children: React.ReactNode;
}

export const ToolPageLayout: React.FC<ToolPageLayoutProps> = ({ productId, children }) => {
    const product = detailedProducts.find(p => p.id === productId) || detailedProducts[0];
    const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

    const [formData, setFormData] = useState<LeadFormData>({
        fullName: '',
        email: '',
        phone: '',
        company: '',
        category: product.name,
        message: `I would like to explore deploying ${product.name} for our team operations.`,
        website: '',
        landline: '',
        linkedIn: '',
        instagram: ''
    });
    const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('sending');

        try {
            await submitForm(formData, {
                subject: `Dedicated Tool Inquiry: ${formData.category} from ${formData.fullName} (${formData.company || 'Direct'})`,
                formType: `${product.name} Dedicated Scoping`
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
        <div className="pt-24 sm:pt-28 pb-24 px-4 sm:px-6 max-w-7xl mx-auto space-y-12 sm:space-y-16">
            {/* Top Navigation & Breadcrumbs */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2">
                <Link
                    to="/"
                    className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#64748B] dark:text-[#94A3B8] hover:text-[#FF5C00] transition-colors font-heading min-h-[44px]"
                >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Back to Platform Hub</span>
                </Link>

                <div className="flex items-center gap-2 text-xs font-mono text-[#64748B] dark:text-white/40">
                    <span className="hidden sm:inline">Suite Repository:</span>
                    <a
                        href={`https://github.com/A-Generative-Slice/${product.repoName}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#FF5C00] hover:underline flex items-center gap-1 font-semibold min-h-[44px]"
                    >
                        <span>A-Generative-Slice/{product.repoName}</span>
                        <ExternalLink className="w-3 h-3" />
                    </a>
                </div>
            </div>

            {/* Product Hero Header */}
            <div className="rounded-2xl border border-black/10 dark:border-white/10 bg-white/90 dark:bg-[#0c0f17] p-6 sm:p-10 shadow-xl space-y-6">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-6 border-b border-black/5 dark:border-white/10">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-[#FF5C00] flex items-center justify-center shadow-md shadow-[#FF5C00]/25 shrink-0">
                            {getProductIcon(product.id)}
                        </div>
                        <div>
                            <div className="flex items-center gap-2 flex-wrap mb-1">
                                <span className="text-[10px] font-mono uppercase tracking-widest text-[#FF5C00] font-bold">
                                    | {product.category}
                                </span>
                                <span className="px-2 py-0.5 rounded-md text-[10px] font-mono bg-black/5 dark:bg-white/10 text-[#64748B] dark:text-white/60">
                                    {product.badge}
                                </span>
                            </div>
                            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black text-[#0F172A] dark:text-white font-heading tracking-tight">
                                {product.name}
                            </h1>
                        </div>
                    </div>

                    <div className="flex items-center gap-2.5 w-full sm:w-auto">
                        <a
                            href={`https://github.com/A-Generative-Slice/${product.repoName}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-1 sm:flex-none px-4 py-3 rounded-xl bg-black/5 dark:bg-white/10 text-xs font-bold text-[#0F172A] dark:text-white hover:bg-[#FF5C00] hover:text-white transition-all flex items-center justify-center gap-2 min-h-[46px]"
                        >
                            <GitBranch className="w-3.5 h-3.5" />
                            <span>GitHub Source</span>
                        </a>

                        <button
                            onClick={() => {
                                const el = document.getElementById('tool-inquiry-form');
                                if (el) el.scrollIntoView({ behavior: 'smooth' });
                            }}
                            className="flex-1 sm:flex-none px-4 py-3 rounded-xl bg-[#FF5C00] text-white text-xs font-bold hover:bg-[#FF8C1A] transition-all shadow-sm font-heading min-h-[46px] cursor-pointer"
                        >
                            Deploy Workspace
                        </button>
                    </div>
                </div>

                <div className="space-y-2">
                    <p className="text-sm sm:text-base font-bold text-[#FF5C00] font-heading">
                        {product.tagline}
                    </p>
                    <p className="text-xs sm:text-sm text-[#64748B] dark:text-[#94A3B8] leading-relaxed max-w-4xl">
                        {product.description}
                    </p>
                </div>
            </div>

            {/* Dedicated Interactive Sandbox Container */}
            <div>
                {children}
            </div>

            {/* Technical Specifications */}
            <div className="space-y-4">
                <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#FF5C00] font-heading">
                    <span className="font-mono text-[#FF5C00]">|</span>
                    <span>SYSTEM SPECIFICATIONS</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-[#0F172A] dark:text-white font-heading tracking-tight">
                    {product.name} Engineering Benchmarks
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {product.specs.map((spec, i) => (
                        <div 
                            key={i} 
                            className="p-4 rounded-xl border border-black/10 dark:border-white/10 bg-white dark:bg-[#0c0f17] shadow-sm space-y-1"
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

            {/* Key Capabilities */}
            <div className="space-y-4">
                <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#FF5C00] font-heading">
                    <span className="font-mono text-[#FF5C00]">|</span>
                    <span>FUNCTIONAL ARCHITECTURE</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-[#0F172A] dark:text-white font-heading tracking-tight">
                    Core Capabilities &amp; Design
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {product.features.map((feat, i) => (
                        <div 
                            key={i}
                            className="p-5 sm:p-6 rounded-2xl border border-black/10 dark:border-white/10 bg-white dark:bg-[#0c0f17] shadow-sm space-y-2 hover:border-[#FF5C00]/30 transition-all"
                        >
                            <div className="flex items-center gap-3">
                                <div className="w-7 h-7 rounded-lg bg-[#FF5C00]/10 text-[#FF5C00] flex items-center justify-center font-bold text-xs font-mono">
                                    0{i + 1}
                                </div>
                                <h4 className="text-sm sm:text-base font-bold text-[#0F172A] dark:text-white font-heading">
                                    {feat.title}
                                </h4>
                            </div>
                            <p className="text-xs text-[#64748B] dark:text-[#94A3B8] leading-relaxed pl-10">
                                {feat.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Workflow Pipeline */}
            <div className="space-y-4">
                <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#FF5C00] font-heading">
                    <span className="font-mono text-[#FF5C00]">|</span>
                    <span>INTEGRATION STAGES</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-[#0F172A] dark:text-white font-heading tracking-tight">
                    Deployment Pipeline
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {product.workflow.map((w, i) => (
                        <div key={i} className="p-5 sm:p-6 rounded-xl border border-black/10 dark:border-white/10 bg-white dark:bg-[#0c0f17] shadow-sm space-y-2">
                            <span className="font-mono text-[#FF5C00] font-bold text-xs">{w.step}</span>
                            <h4 className="font-bold text-sm text-[#0F172A] dark:text-white font-heading">{w.title}</h4>
                            <p className="text-xs text-[#64748B] dark:text-[#94A3B8] leading-relaxed">{w.description}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* FAQs Accordion */}
            <div className="max-w-4xl mx-auto space-y-4">
                <div className="text-center">
                    <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#FF5C00] font-heading mb-1">
                        <span className="font-mono text-[#FF5C00]">|</span>
                        <span>FAQS &amp; ARCHITECTURE</span>
                    </div>
                    <h3 className="text-xl sm:text-2xl font-black text-[#0F172A] dark:text-white font-heading tracking-tight">
                        Frequently Asked Questions
                    </h3>
                </div>
                <div className="space-y-2.5">
                    {product.faqs.map((faq, i) => {
                        const isOpen = openFaqIndex === i;
                        return (
                            <div 
                                key={i}
                                className="rounded-xl border border-black/10 dark:border-white/10 bg-white dark:bg-[#0c0f17] overflow-hidden transition-all"
                            >
                                <button
                                    onClick={() => setOpenFaqIndex(isOpen ? null : i)}
                                    className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 font-bold text-xs sm:text-sm text-[#0F172A] dark:text-white cursor-pointer min-h-[48px]"
                                >
                                    <span>{faq.question}</span>
                                    <ChevronDown className={`w-4 h-4 text-[#FF5C00] shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                                </button>
                                {isOpen && (
                                    <div className="px-4 sm:px-5 pb-5 pt-1 text-xs text-[#64748B] dark:text-[#94A3B8] leading-relaxed border-t border-black/5 dark:border-white/5">
                                        {faq.answer}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* In-Page Scoping Form (Mobile-Optimized) */}
            <div id="tool-inquiry-form" className="rounded-2xl border border-black/10 dark:border-white/10 bg-white dark:bg-[#0c0f17] p-6 sm:p-10 shadow-xl max-w-4xl mx-auto scroll-mt-28">
                <div className="text-center mb-8 space-y-1.5">
                    <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#FF5C00] font-heading">
                        <span className="font-mono text-[#FF5C00]">|</span>
                        <span>ENTERPRISE CONFIGURATION</span>
                    </div>
                    <h3 className="text-xl sm:text-3xl font-black text-[#0F172A] dark:text-white font-heading tracking-tight">
                        Deploy {product.name}
                    </h3>
                    <p className="text-xs sm:text-sm text-[#64748B] dark:text-[#94A3B8] max-w-md mx-auto">
                        Inquire about configuring, self-hosting, or licensing {product.name} for your organization.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="text-xs font-bold uppercase tracking-wider text-[#0F172A] dark:text-white/80 block mb-1.5 font-heading">
                                Full Name *
                            </label>
                            <input
                                type="text"
                                required
                                value={formData.fullName}
                                onChange={(e) => setFormData(prev => ({ ...prev, fullName: e.target.value }))}
                                placeholder="Mohammed Hussain"
                                className="w-full px-4 py-3 rounded-xl border border-black/10 dark:border-white/10 bg-[#f8fafc] dark:bg-[#111622] text-[#0F172A] dark:text-white text-base focus:outline-none focus:border-[#FF5C00] focus:ring-1 focus:ring-[#FF5C00] min-h-[48px]"
                            />
                        </div>

                        <div>
                            <label className="text-xs font-bold uppercase tracking-wider text-[#0F172A] dark:text-white/80 block mb-1.5 font-heading">
                                Work Email *
                            </label>
                            <input
                                type="email"
                                required
                                value={formData.email}
                                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                                placeholder="name@company.com"
                                className="w-full px-4 py-3 rounded-xl border border-black/10 dark:border-white/10 bg-[#f8fafc] dark:bg-[#111622] text-[#0F172A] dark:text-white text-base focus:outline-none focus:border-[#FF5C00] focus:ring-1 focus:ring-[#FF5C00] min-h-[48px]"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="text-xs font-bold uppercase tracking-wider text-[#0F172A] dark:text-white/80 block mb-1.5 font-heading">
                                WhatsApp / Phone *
                            </label>
                            <input
                                type="tel"
                                required
                                value={formData.phone}
                                onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                                placeholder="+91 98400 00000"
                                className="w-full px-4 py-3 rounded-xl border border-black/10 dark:border-white/10 bg-[#f8fafc] dark:bg-[#111622] text-[#0F172A] dark:text-white text-base focus:outline-none focus:border-[#FF5C00] focus:ring-1 focus:ring-[#FF5C00] min-h-[48px]"
                            />
                        </div>

                        <div>
                            <label className="text-xs font-bold uppercase tracking-wider text-[#0F172A] dark:text-white/80 block mb-1.5 font-heading">
                                Company / Studio
                            </label>
                            <input
                                type="text"
                                value={formData.company}
                                onChange={(e) => setFormData(prev => ({ ...prev, company: e.target.value }))}
                                placeholder="Studio Name"
                                className="w-full px-4 py-3 rounded-xl border border-black/10 dark:border-white/10 bg-[#f8fafc] dark:bg-[#111622] text-[#0F172A] dark:text-white text-base focus:outline-none focus:border-[#FF5C00] focus:ring-1 focus:ring-[#FF5C00] min-h-[48px]"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="text-xs font-bold uppercase tracking-wider text-[#0F172A] dark:text-white/80 block mb-1.5 font-heading">
                            Integration Requirements
                        </label>
                        <textarea
                            rows={4}
                            value={formData.message}
                            onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                            className="w-full px-4 py-3 rounded-xl border border-black/10 dark:border-white/10 bg-[#f8fafc] dark:bg-[#111622] text-[#0F172A] dark:text-white text-base focus:outline-none focus:border-[#FF5C00] focus:ring-1 focus:ring-[#FF5C00] leading-relaxed resize-none"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={status === 'sending'}
                        className="w-full py-4 rounded-xl bg-[#FF5C00] text-white text-sm font-bold hover:bg-[#FF8C1A] transition-all flex items-center justify-center gap-2 shadow-sm font-heading cursor-pointer disabled:opacity-50 min-h-[50px]"
                    >
                        {status === 'sending' ? (
                            <span>Submitting Deployment Brief...</span>
                        ) : status === 'sent' ? (
                            <span className="flex items-center gap-2">
                                <CheckCircle2 className="w-4 h-4" /> Brief Logged — Mohammed Hussain will connect within 24h
                            </span>
                        ) : (
                            <span className="flex items-center gap-2">
                                <Send className="w-4 h-4" /> Submit Scoping Request
                            </span>
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
};
