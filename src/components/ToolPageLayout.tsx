import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
    ArrowLeft, ExternalLink, ChevronDown, Send, CheckCircle2,
    Boxes, Zap, Bot, Cpu, Presentation, FolderKanban, GraduationCap, GitBranch
} from 'lucide-react';
import { detailedProducts } from '../data/productsData';
import { submitForm, type LeadFormData } from '../utils/formSubmit';

interface ToolPageLayoutProps {
    productId: string;
    children: React.ReactNode;
}

const getProductIcon = (id: string, className = 'w-6 h-6') => {
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

export const ToolPageLayout: React.FC<ToolPageLayoutProps> = ({ productId, children }) => {
    const product = detailedProducts.find((p) => p.id === productId) || detailedProducts[0];
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

    const scrollToForm = () => {
        document.getElementById('tool-inquiry-form')?.scrollIntoView({ behavior: 'smooth' });
    };

    const inputClass =
        'w-full rounded-xl border border-black/[0.08] bg-[#F8FAFC] px-4 py-3 text-[13px] text-[#0F172A] placeholder:text-[#94A3B8] focus:outline-none focus:border-[#FF5C00] focus:ring-4 focus:ring-[#FF5C00]/10 transition-all min-h-[46px]';
    const labelClass =
        'block mb-1.5 font-heading text-[9px] font-bold uppercase tracking-[0.18em] text-[#64748B]';

    return (
        <div className="relative pt-28 sm:pt-32 pb-20 px-4 sm:px-6">
            <div className="mx-auto max-w-6xl space-y-14 sm:space-y-16">
                {/* Breadcrumbs */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <Link
                        to="/"
                        className="inline-flex items-center gap-2 text-[10px] font-heading font-bold uppercase tracking-[0.16em] text-[#64748B] hover:text-[#FF5C00] transition-colors min-h-[36px]"
                    >
                        <ArrowLeft className="w-3.5 h-3.5" />
                        Back to hub
                    </Link>
                    <a
                        href={`https://github.com/A-Generative-Slice/${product.repoName}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 font-mono text-[10px] text-[#64748B] hover:text-[#FF5C00] transition-colors"
                    >
                        <GitBranch className="w-3 h-3 text-[#FF8C1A]" />
                        A-Generative-Slice/{product.repoName}
                        <ExternalLink className="w-3 h-3" />
                    </a>
                </div>

                {/* Hero */}
                <div className="relative overflow-hidden rounded-[28px] border border-black/[0.07] bg-white/75 backdrop-blur-xl p-6 sm:p-9 shadow-[0_30px_80px_-40px_rgba(15,23,42,0.35)]">
                    <div className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-[#FF5C00]/10 blur-3xl" aria-hidden="true" />
                    <div className="relative space-y-6">
                        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
                            <div className="flex items-start gap-4 min-w-0">
                                <span className="grid place-items-center w-14 h-14 rounded-2xl bg-gradient-to-br from-[#FF5C00] to-[#FF8C1A] text-white shadow-[0_16px_32px_-14px_rgba(255,92,0,0.7)] shrink-0">
                                    {getProductIcon(product.id)}
                                </span>
                                <div className="min-w-0">
                                    <div className="flex flex-wrap items-center gap-2 mb-1.5">
                                        <span className="font-mono text-[9px] uppercase tracking-[0.18em] text-[#FF5C00] font-semibold">
                                            {product.category}
                                        </span>
                                        <span className="rounded-md border border-black/[0.06] bg-black/[0.03] px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-[0.1em] text-[#64748B]">
                                            {product.badge}
                                        </span>
                                    </div>
                                    <h1 className="headline text-[clamp(2rem,5vw,3.3rem)] text-[#0F172A]">
                                        {product.name}
                                    </h1>
                                </div>
                            </div>

                            <div className="flex items-center gap-2 shrink-0">
                                <a
                                    href={`https://github.com/A-Generative-Slice/${product.repoName}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="btn-secondary"
                                >
                                    <GitBranch className="w-3.5 h-3.5" />
                                    Source
                                </a>
                                <button onClick={scrollToForm} className="btn-primary">
                                    Deploy workspace
                                </button>
                            </div>
                        </div>

                        <p className="font-heading text-[13px] sm:text-[15px] font-bold text-[#FF5C00] max-w-3xl">
                            {product.tagline}
                        </p>
                        <p className="max-w-3xl text-[12px] sm:text-[13px] leading-relaxed text-[#64748B]">
                            {product.description}
                        </p>

                        <div className="flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-black/[0.06] pt-4 font-mono text-[9px] uppercase tracking-[0.14em] text-[#94A3B8]">
                            <span className="inline-flex items-center gap-1.5 text-[#0F172A]">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                Live sandbox
                            </span>
                            <span>{product.specs[0]?.label}</span>
                            <span className="hidden sm:inline">·</span>
                            <span className="truncate max-w-[260px]">{product.specs[0]?.value}</span>
                        </div>
                    </div>
                </div>

                {/* Interactive sandbox */}
                <section className="space-y-4">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                        <p className="kicker">Live sandbox</p>
                        <p className="font-mono text-[9px] uppercase tracking-[0.14em] text-[#94A3B8]">
                            Runs entirely in your browser · {product.name}
                        </p>
                    </div>
                    <hr className="hairline" />
                    <div>{children}</div>
                </section>

                {/* Specs */}
                <section className="space-y-5">
                    <div>
                        <p className="kicker">System specifications</p>
                        <h2 className="section-title mt-2.5 text-[#0F172A]">Engineering benchmarks</h2>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                        {product.specs.map((spec, i) => (
                            <div key={i} className="surface-card p-4 sm:p-5">
                                <span className="block font-mono text-[9px] uppercase tracking-[0.16em] text-[#FF5C00]">
                                    {spec.label}
                                </span>
                                <span className="mt-1.5 block text-[12px] font-semibold text-[#0F172A] leading-relaxed">
                                    {spec.value}
                                </span>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Features */}
                <section className="space-y-5">
                    <div>
                        <p className="kicker">Functional architecture</p>
                        <h2 className="section-title mt-2.5 text-[#0F172A]">Core capabilities</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {product.features.map((feat, i) => (
                            <div key={i} className="surface-card p-5 sm:p-6">
                                <div className="flex items-center gap-3">
                                    <span className="grid place-items-center w-8 h-8 rounded-lg bg-[#FF5C00]/[0.08] font-mono text-[10px] font-bold text-[#FF5C00]">
                                        {String(i + 1).padStart(2, '0')}
                                    </span>
                                    <h3 className="font-heading text-[13px] sm:text-sm font-bold text-[#0F172A]">
                                        {feat.title}
                                    </h3>
                                </div>
                                <p className="mt-2.5 pl-11 text-[12px] leading-relaxed text-[#64748B]">
                                    {feat.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Workflow */}
                <section className="space-y-5">
                    <div>
                        <p className="kicker">Integration stages</p>
                        <h2 className="section-title mt-2.5 text-[#0F172A]">Deployment pipeline</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {product.workflow.map((step, i) => (
                            <div key={i} className="relative surface-card p-5 sm:p-6">
                                <span className="font-mono text-[22px] font-bold text-[#FF5C00]/25 leading-none">
                                    {step.step}
                                </span>
                                <h3 className="mt-3 font-heading text-[13px] font-bold text-[#0F172A]">{step.title}</h3>
                                <p className="mt-2 text-[12px] leading-relaxed text-[#64748B]">{step.description}</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* FAQs */}
                <section className="space-y-5">
                    <div>
                        <p className="kicker">FAQs &amp; architecture</p>
                        <h2 className="section-title mt-2.5 text-[#0F172A]">Frequently asked questions</h2>
                    </div>
                    <div className="space-y-2.5">
                        {product.faqs.map((faq, i) => {
                            const isOpen = openFaqIndex === i;
                            return (
                                <div
                                    key={i}
                                    className={`overflow-hidden rounded-2xl border transition-colors ${
                                        isOpen ? 'border-[#FF5C00]/30 bg-white' : 'border-black/[0.07] bg-white/70'
                                    }`}
                                >
                                    <button
                                        onClick={() => setOpenFaqIndex(isOpen ? null : i)}
                                        className="flex w-full items-center justify-between gap-4 px-4 py-4 sm:px-5 text-left font-heading text-[12px] sm:text-[13px] font-bold text-[#0F172A] min-h-[48px]"
                                        aria-expanded={isOpen}
                                    >
                                        <span>{faq.question}</span>
                                        <ChevronDown
                                            className={`w-4 h-4 shrink-0 text-[#FF5C00] transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
                                        />
                                    </button>
                                    {isOpen && (
                                        <div className="border-t border-black/[0.05] px-4 py-4 sm:px-5 text-[12px] leading-relaxed text-[#64748B]">
                                            {faq.answer}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </section>

                {/* Scoping form */}
                <section
                    id="tool-inquiry-form"
                    className="scroll-mt-28 overflow-hidden rounded-[28px] border border-black/[0.07] bg-white/80 backdrop-blur-xl shadow-[0_30px_80px_-40px_rgba(15,23,42,0.35)]"
                >
                    <div className="grid lg:grid-cols-5">
                        <div className="lg:col-span-2 p-6 sm:p-8 border-b lg:border-b-0 lg:border-r border-black/[0.06] bg-gradient-to-br from-[#FFF7F2] to-white">
                            <p className="kicker">Enterprise configuration</p>
                            <h2 className="mt-3 font-heading text-xl sm:text-2xl font-black tracking-tight text-[#0F172A]">
                                Deploy {product.name}
                            </h2>
                            <p className="mt-3 text-[12px] leading-relaxed text-[#64748B]">
                                Configure, self-host or license {product.name} for your organisation. Share the brief and
                                a solution architect will reply within one business day.
                            </p>
                            <ul className="mt-6 space-y-3 text-[11px] text-[#64748B]">
                                {['Scoping call within 24 hours', 'Sandbox walkthrough with your data', 'Written deployment & pricing plan'].map((item) => (
                                    <li key={item} className="flex items-start gap-2">
                                        <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-500" />
                                        <span>{item}</span>
                                    </li>
                                ))}
                            </ul>
                            <div className="mt-7 space-y-2 border-t border-black/[0.06] pt-5 font-mono text-[10px] text-[#94A3B8]">
                                <p className="uppercase tracking-[0.14em]">Direct line</p>
                                <a href="https://wa.me/917812891494" className="block text-[#0F172A] hover:text-[#FF5C00] transition-colors">
                                    WhatsApp · +91 78128 91494
                                </a>
                                <a href="mailto:smdhussain@agenerativeslice.com" className="block text-[#0F172A] hover:text-[#FF5C00] transition-colors break-all">
                                    smdhussain@agenerativeslice.com
                                </a>
                            </div>
                        </div>

                        <div className="lg:col-span-3 p-6 sm:p-8">
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className={labelClass}>Full name *</label>
                                        <input
                                            type="text"
                                            required
                                            value={formData.fullName}
                                            onChange={(e) => setFormData((prev) => ({ ...prev, fullName: e.target.value }))}
                                            placeholder="Your name"
                                            className={inputClass}
                                        />
                                    </div>
                                    <div>
                                        <label className={labelClass}>Work email *</label>
                                        <input
                                            type="email"
                                            required
                                            value={formData.email}
                                            onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                                            placeholder="name@company.com"
                                            className={inputClass}
                                        />
                                    </div>
                                    <div>
                                        <label className={labelClass}>WhatsApp / phone *</label>
                                        <input
                                            type="tel"
                                            required
                                            value={formData.phone}
                                            onChange={(e) => setFormData((prev) => ({ ...prev, phone: e.target.value }))}
                                            placeholder="+91 98400 00000"
                                            className={inputClass}
                                        />
                                    </div>
                                    <div>
                                        <label className={labelClass}>Company / studio</label>
                                        <input
                                            type="text"
                                            value={formData.company}
                                            onChange={(e) => setFormData((prev) => ({ ...prev, company: e.target.value }))}
                                            placeholder="Studio name"
                                            className={inputClass}
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className={labelClass}>Integration requirements</label>
                                    <textarea
                                        rows={4}
                                        value={formData.message}
                                        onChange={(e) => setFormData((prev) => ({ ...prev, message: e.target.value }))}
                                        className={`${inputClass} resize-none leading-relaxed`}
                                    />
                                </div>
                                <button
                                    type="submit"
                                    disabled={status === 'sending'}
                                    className="btn-primary w-full py-4 text-[13px] disabled:opacity-60"
                                >
                                    {status === 'sending' ? (
                                        'Submitting deployment brief…'
                                    ) : status === 'sent' ? (
                                        <span className="inline-flex items-center gap-2">
                                            <CheckCircle2 className="w-4 h-4" /> Brief logged — we’ll connect within 24h
                                        </span>
                                    ) : (
                                        <span className="inline-flex items-center gap-2">
                                            <Send className="w-4 h-4" /> Submit scoping request
                                        </span>
                                    )}
                                </button>
                                <p className="text-center font-mono text-[9px] uppercase tracking-[0.12em] text-[#94A3B8]">
                                    No spam · your brief stays with the AGS team
                                </p>
                            </form>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
};
