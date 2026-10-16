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
        <div className="pt-24 pb-24 px-6 max-w-7xl mx-auto">
            {/* Top Navigation & Breadcrumbs */}
            <div className="flex items-center justify-between gap-4 mb-8">
                <Link
                    to="/"
                    className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#64748B] dark:text-white/60 hover:text-[#FF5C00] transition-colors font-heading"
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
                        className="text-[#FF5C00] hover:underline flex items-center gap-1 font-semibold"
                    >
                        <span>A-Generative-Slice/{product.repoName}</span>
                        <ExternalLink className="w-3 h-3" />
                    </a>
                </div>
            </div>

            {/* Product Hero Header */}
            <div className="rounded-3xl border border-black/10 dark:border-white/10 bg-white dark:bg-[#111] p-8 sm:p-10 shadow-xl mb-8">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-6 border-b border-black/5 dark:border-white/10">
                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#FF5C00] to-[#FF8C1A] flex items-center justify-center shadow-lg shadow-[#FF5C00]/25 shrink-0">
                            {getProductIcon(product.id)}
                        </div>
                        <div>
                            <div className="flex items-center gap-2 flex-wrap mb-1">
                                <span className="text-[10px] font-bold uppercase tracking-widest text-[#FF5C00] font-heading">
                                    {product.category}
                                </span>
                                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-black/5 dark:bg-white/10 text-[#64748B] dark:text-white/60">
                                    {product.badge}
                                </span>
                            </div>
                            <h1 className="text-3xl sm:text-5xl font-black text-[#0F172A] dark:text-white font-heading tracking-tight">
                                {product.name}
                            </h1>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <a
                            href={`https://github.com/A-Generative-Slice/${product.repoName}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-4 py-2.5 rounded-xl bg-black/5 dark:bg-white/10 text-xs font-bold text-[#0F172A] dark:text-white hover:bg-[#FF5C00] hover:text-white transition-all flex items-center gap-2 shadow-sm"
                        >
                            <GitBranch className="w-3.5 h-3.5" />
                            <span>GitHub Source</span>
                        </a>

                        <button
                            onClick={() => {
                                const el = document.getElementById('tool-inquiry-form');
                                if (el) el.scrollIntoView({ behavior: 'smooth' });
                            }}
                            className="px-4 py-2.5 rounded-xl bg-[#FF5C00] text-white text-xs font-bold hover:bg-[#FF8C1A] transition-all shadow-md shadow-[#FF5C00]/25"
                        >
                            Request Deployment
                        </button>
                    </div>
                </div>

                <div className="pt-6 space-y-2">
                    <p className="text-sm sm:text-base font-bold text-[#FF5C00] font-heading">
                        {product.tagline}
                    </p>
                    <p className="text-xs sm:text-sm text-[#64748B] dark:text-white/70 leading-relaxed max-w-4xl">
                        {product.description}
                    </p>
                </div>
            </div>

            {/* Dedicated Interactive Sandbox Container */}
            <div className="mb-16">
                {children}
            </div>

            {/* Technical Specifications */}
            <div className="mb-16">
                <h3 className="text-xl font-black text-[#0F172A] dark:text-white mb-6 font-heading tracking-tight">
                    {product.name} Engineering Specifications
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {product.specs.map((spec, i) => (
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

            {/* Key Capabilities */}
            <div className="mb-16">
                <h3 className="text-xl font-black text-[#0F172A] dark:text-white mb-6 font-heading tracking-tight">
                    Key Features & Functional Architecture
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {product.features.map((feat, i) => (
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

            {/* Workflow Pipeline */}
            <div className="mb-16">
                <h3 className="text-xl font-black text-[#0F172A] dark:text-white mb-6 font-heading tracking-tight">
                    Integration & Deployment Workflow
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {product.workflow.map((w, i) => (
                        <div key={i} className="p-6 rounded-3xl border border-black/10 dark:border-white/10 bg-white dark:bg-[#111] shadow-sm space-y-2">
                            <span className="font-mono text-[#FF5C00] font-bold text-xs">{w.step}</span>
                            <h4 className="font-bold text-sm text-[#0F172A] dark:text-white">{w.title}</h4>
                            <p className="text-xs text-[#64748B] dark:text-white/60 leading-relaxed">{w.description}</p>
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
                    {product.faqs.map((faq, i) => {
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

            {/* In-Page Scoping Form */}
            <div id="tool-inquiry-form" className="rounded-3xl border border-black/10 dark:border-white/10 bg-white dark:bg-[#111] p-8 sm:p-12 shadow-2xl relative overflow-hidden max-w-4xl mx-auto scroll-mt-28">
                <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />

                <div className="text-center mb-10">
                    <span className="text-xs font-bold uppercase tracking-widest text-[#FF5C00] block mb-2 font-heading">
                        Bespoke {product.name} Deployment
                    </span>
                    <h3 className="text-2xl sm:text-3xl font-black text-[#0F172A] dark:text-white font-heading tracking-tight mb-2">
                        Schedule Architecture Review
                    </h3>
                    <p className="text-xs sm:text-sm text-[#64748B] dark:text-white/60 max-w-md mx-auto">
                        Inquire about configuring and hosting {product.name} for your organization.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
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
                                placeholder="+91 98400 00000"
                                className="w-full px-4 py-2.5 rounded-xl border border-black/10 dark:border-white/10 bg-black/[0.02] dark:bg-white/[0.03] text-xs text-[#0F172A] dark:text-white focus:outline-none focus:border-[#FF5C00]"
                            />
                        </div>

                        <div>
                            <label className="text-xs font-semibold text-[#0F172A] dark:text-white/70 block mb-1">
                                Company / Studio
                            </label>
                            <input
                                type="text"
                                value={formData.company}
                                onChange={(e) => setFormData(prev => ({ ...prev, company: e.target.value }))}
                                placeholder="Company Name"
                                className="w-full px-4 py-2.5 rounded-xl border border-black/10 dark:border-white/10 bg-black/[0.02] dark:bg-white/[0.03] text-xs text-[#0F172A] dark:text-white focus:outline-none focus:border-[#FF5C00]"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="text-xs font-semibold text-[#0F172A] dark:text-white/70 block mb-1">
                            Specific Integration Requirements
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
                            <span>Submitting Deployment Brief...</span>
                        ) : status === 'sent' ? (
                            <span className="flex items-center gap-2">
                                <CheckCircle2 className="w-4 h-4" /> Request Logged! Hussain will reach out directly.
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
