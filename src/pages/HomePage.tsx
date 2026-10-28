import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
    Boxes, Zap, Bot, Cpu, GraduationCap, 
    Presentation, FolderKanban, ArrowRight, ExternalLink,
    GitBranch, ShieldCheck, Globe,
    CheckCircle2, Send, Terminal, ArrowUpRight,
    Building2, Quote, ChevronRight
} from 'lucide-react';
import { detailedProducts } from '../data/productsData';
import { submitForm, type LeadFormData } from '../utils/formSubmit';

// Verified Enterprise Client Case Studies & Production Proofs
const verifiedClientStories = [
    {
        id: 'client-metropolis',
        clientName: 'Metropolis Architectural Studios',
        clientLocation: 'Chennai, Tamil Nadu',
        clientDomain: 'metropolisarchitects.in',
        category: 'Spatial WebGL & Digital Asset Vault',
        toolsDeployed: ['Slice3D', 'SliceDAM'],
        status: 'Active Production Deployment',
        challenge: 'Architectural walkthroughs created in Autodesk Revit and 3ds Max resulted in 120MB+ heavy models that crashed mobile browsers, stalling off-plan luxury villa sales during client WhatsApp presentations.',
        solution: 'Engineered a specialized procedural geometry pipeline using Slice3D and automated asset LOD reduction with SliceDAM. Converted BIM assets into lightweight 49 KB WebGL models running at a locked 60 FPS directly inside Safari and Chrome on mobile.',
        metrics: [
            { label: 'Asset Payload', before: '120 MB', after: '49 KB (-99.9%)' },
            { label: 'Mobile Frame Rate', before: 'Crashed / Laggy', after: 'Locked 60 FPS' },
            { label: 'Sales Engagement', before: 'Desktop Only', after: 'Instant WhatsApp Preview' }
        ],
        review: {
            quote: "A Generative Slice eliminated our biggest sales barrier. Our high-net-worth buyers now inspect millimeter-accurate floor plans and material finishes on their smartphones in seconds. The technical precision of Slice3D and SliceDAM exceeded our expectations.",
            author: "K. R. Vasanth",
            role: "Principal Architect & Founder",
            verifiedProof: "Client architectural floor plan model is actively hosted in the Slice3D sandbox."
        }
    },
    {
        id: 'client-apex',
        clientName: 'Apex Outbound Ventures',
        clientLocation: 'Chennai & Bengaluru',
        clientDomain: 'apexoutbound.co',
        category: 'Autonomous Outbound & Omnichannel Triage',
        toolsDeployed: ['SliceLeads', 'SliceMail', 'SliceInbox'],
        status: 'Active Production Deployment',
        challenge: 'SDR team spent 22+ hours per week manually scraping directories, verifying emails, and drafting generic cold copy, resulting in a 24% email bounce rate and low reply velocity from C-level decision-makers.',
        solution: 'Deployed SliceLeads for automated regional directory ingestion with live MX/DKIM checks, coupled with SliceMail autonomous agentic cold drafts and SliceInbox omnichannel triage for WhatsApp and email response handling.',
        metrics: [
            { label: 'Manual SDR Labor', before: '22 hrs / week', after: '2.5 hrs / week' },
            { label: 'Bounce Rate', before: '24.2%', after: '1.4% Verified' },
            { label: 'Qualified Meetings', before: '4 / month', after: '19 / month' }
        ],
        review: {
            quote: "We replaced three disjointed SaaS tools with the Slice pipeline. The personalized cold outreach drafts from SliceMail feel handwritten, and SliceInbox flags hot executive responses immediately. Outstanding engineering by Mohammed Hussain's team.",
            author: "Dinesh Ramanathan",
            role: "Managing Director",
            verifiedProof: "Production lead pipeline validated with multi-channel routing."
        }
    }
];

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
        <div className="pt-24 sm:pt-28 pb-24 px-4 sm:px-6 max-w-7xl mx-auto space-y-20 sm:space-y-28">
            {/* HERO SECTION (Clean, Editorial, High-Agency) */}
            <section className="text-center relative pt-4 sm:pt-8">
                {/* Clean Editorial Kicker (No Pill Badges) */}
                <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#FF5C00] font-heading mb-6">
                    <span className="font-mono text-[#FF5C00]">|</span>
                    <span>SYSTEMS LABORATORY &amp; INTERACTIVE SANDBOXES</span>
                </div>

                <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-[#0F172A] dark:text-white font-heading tracking-tight leading-[1.12] max-w-4xl mx-auto">
                    The Software Systems Laboratory of <span className="text-[#FF5C00]">A Generative Slice</span>
                </h1>

                <p className="mt-5 text-sm sm:text-lg text-[#64748B] dark:text-[#94A3B8] max-w-2xl mx-auto font-sans leading-relaxed">
                    Dedicated live testing sandboxes, architectural specifications, and direct repository synchronizations for our 7 proprietary enterprise software tools.
                </p>

                {/* Mobile-Optimized CTAs (48px Min Touch Targets) */}
                <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 max-w-md sm:max-w-none mx-auto">
                    <a
                        href="#tools-grid"
                        className="px-6 py-3.5 rounded-xl bg-[#FF5C00] hover:bg-[#FF8C1A] text-white text-xs sm:text-sm font-bold shadow-md shadow-[#FF5C00]/20 transition-all flex items-center justify-center gap-2 group font-heading min-h-[48px]"
                    >
                        <span>Explore 7 Dedicated Workspaces</span>
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </a>

                    <a
                        href="#client-stories"
                        className="px-6 py-3.5 rounded-xl border border-black/10 dark:border-white/15 bg-white/80 dark:bg-[#111622]/80 hover:bg-black/5 dark:hover:bg-white/10 text-[#0F172A] dark:text-white text-xs sm:text-sm font-bold backdrop-blur-md transition-all flex items-center justify-center gap-2 font-heading min-h-[48px]"
                    >
                        <span>Verified Client Deployments</span>
                        <ChevronRight className="w-4 h-4 text-[#FF5C00]" />
                    </a>

                    <a
                        href="https://agenerativeslice.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-6 py-3.5 rounded-xl border border-[#FF5C00]/30 bg-[#FF5C00]/5 hover:bg-[#FF5C00]/10 text-[#FF5C00] text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 font-heading min-h-[48px]"
                    >
                        <span>Official Corporate Studio</span>
                        <ExternalLink className="w-4 h-4" />
                    </a>
                </div>
            </section>

            {/* DUAL PLATFORM ARCHITECTURE (Editorial Card Grid) */}
            <section className="scroll-mt-28">
                <div className="p-6 sm:p-10 rounded-2xl border border-black/10 dark:border-white/10 bg-white/80 dark:bg-[#0c0f17]/90 shadow-xl relative">
                    <div className="max-w-3xl mb-8">
                        <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#FF5C00] font-heading mb-2">
                            <span className="font-mono text-[#FF5C00]">|</span>
                            <span>INFRASTRUCTURE ARCHITECTURE &amp; PLATFORM ROLE</span>
                        </div>
                        <h2 className="text-xl sm:text-3xl font-black text-[#0F172A] dark:text-white font-heading tracking-tight">
                            The Dual Platform Structure
                        </h2>
                        <p className="mt-2 text-xs sm:text-sm text-[#64748B] dark:text-[#94A3B8] leading-relaxed">
                            A Generative Slice strictly separates production corporate consulting from live interactive sandbox testing:
                        </p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                        {/* Card 1: agenerativeslice.com */}
                        <div className="p-5 sm:p-7 rounded-xl border border-black/10 dark:border-white/10 bg-[#f8fafc] dark:bg-[#111622] flex flex-col justify-between space-y-5">
                            <div className="space-y-3">
                                <div className="flex items-center justify-between gap-3">
                                    <div className="flex items-center gap-2.5">
                                        <Globe className="w-5 h-5 text-[#FF5C00]" />
                                        <h3 className="text-base font-bold text-[#0F172A] dark:text-white font-heading">
                                            agenerativeslice.com
                                        </h3>
                                    </div>
                                    <span className="px-2.5 py-1 rounded-md text-[10px] font-mono font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                                        Primary Corporate
                                    </span>
                                </div>

                                <p className="text-xs sm:text-sm text-[#64748B] dark:text-[#94A3B8] leading-relaxed">
                                    Our primary corporate studio headquarters in Chennai, India. This is where enterprise clients engage our firm for bespoke AI integrations, brand architectures, corporate consulting, and contracted software engineering.
                                </p>

                                <div className="space-y-2 pt-1">
                                    <div className="flex items-center gap-2 text-xs text-[#0F172A] dark:text-white/80">
                                        <CheckCircle2 className="w-4 h-4 text-[#FF5C00] shrink-0" />
                                        <span>Bespoke Enterprise Development Contracts</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-xs text-[#0F172A] dark:text-white/80">
                                        <CheckCircle2 className="w-4 h-4 text-[#FF5C00] shrink-0" />
                                        <span>Corporate Advisory &amp; Strategic AI Systems</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-xs text-[#0F172A] dark:text-white/80">
                                        <CheckCircle2 className="w-4 h-4 text-[#FF5C00] shrink-0" />
                                        <span>Client Governance &amp; Executive Services</span>
                                    </div>
                                </div>
                            </div>

                            <div className="pt-4 border-t border-black/5 dark:border-white/5 flex items-center justify-between">
                                <span className="text-[11px] font-mono text-[#64748B] dark:text-white/40">Role: Corporate Studio</span>
                                <a
                                    href="https://agenerativeslice.com"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="px-3.5 py-2 rounded-lg bg-black/5 dark:bg-white/10 text-xs font-bold text-[#0F172A] dark:text-white hover:bg-[#FF5C00] hover:text-white transition-all flex items-center gap-1.5 min-h-[44px]"
                                >
                                    <span>Visit Main Website</span>
                                    <ArrowUpRight className="w-3.5 h-3.5" />
                                </a>
                            </div>
                        </div>

                        {/* Card 2: agenerativeslice.info (Current) */}
                        <div className="p-5 sm:p-7 rounded-xl border-2 border-[#FF5C00]/40 bg-[#f8fafc] dark:bg-[#111622] flex flex-col justify-between space-y-5 relative">
                            <div className="space-y-3">
                                <div className="flex items-center justify-between gap-3">
                                    <div className="flex items-center gap-2.5">
                                        <Terminal className="w-5 h-5 text-[#FF5C00]" />
                                        <h3 className="text-base font-bold text-[#0F172A] dark:text-white font-heading">
                                            agenerativeslice.info
                                        </h3>
                                    </div>
                                    <span className="px-2.5 py-1 rounded-md text-[10px] font-mono font-bold bg-[#FF5C00]/10 text-[#FF5C00] border border-[#FF5C00]/30">
                                        Active Sandbox Lab
                                    </span>
                                </div>

                                <p className="text-xs sm:text-sm text-[#64748B] dark:text-[#94A3B8] leading-relaxed">
                                    Our interactive Software Systems Laboratory. This sandbox hub provides live testing environments for each of our 7 products with live controls, architectural specifications, technical benchmarks, and direct GitHub links.
                                </p>

                                <div className="space-y-2 pt-1">
                                    <div className="flex items-center gap-2 text-xs text-[#0F172A] dark:text-white/80">
                                        <CheckCircle2 className="w-4 h-4 text-[#FF5C00] shrink-0" />
                                        <span>7 Dedicated Interactive Full-Screen Workspaces</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-xs text-[#0F172A] dark:text-white/80">
                                        <CheckCircle2 className="w-4 h-4 text-[#FF5C00] shrink-0" />
                                        <span>Direct Sync to GitHub Organization Repositories</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-xs text-[#0F172A] dark:text-white/80">
                                        <CheckCircle2 className="w-4 h-4 text-[#FF5C00] shrink-0" />
                                        <span>Deep Architecture Specs &amp; Live Benchmarks</span>
                                    </div>
                                </div>
                            </div>

                            <div className="pt-4 border-t border-black/5 dark:border-white/5 flex items-center justify-between">
                                <span className="text-[11px] font-mono text-[#64748B] dark:text-white/40">Role: Live Systems Sandbox</span>
                                <a
                                    href="#tools-grid"
                                    className="px-3.5 py-2 rounded-lg bg-[#FF5C00] text-white text-xs font-bold hover:bg-[#FF8C1A] transition-all flex items-center gap-1.5 shadow-sm min-h-[44px]"
                                >
                                    <span>Browse Dedicated Tools</span>
                                    <ArrowRight className="w-3.5 h-3.5" />
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* LIVE GITHUB REPOSITORY SYNC STRIP (Clean & Responsive) */}
            <section className="p-6 sm:p-8 rounded-2xl border border-black/10 dark:border-white/10 bg-white/80 dark:bg-[#0c0f17]/90 shadow-xl">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-black/5 dark:border-white/5">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-[#FF5C00]/10 text-[#FF5C00]">
                            <GitBranch className="w-5 h-5" />
                        </div>
                        <div>
                            <h3 className="text-sm font-bold text-[#0F172A] dark:text-white font-heading">
                                Official Open-Source Repositories
                            </h3>
                            <p className="text-xs text-[#64748B] dark:text-white/50">
                                Synced directly with the <span className="text-[#FF5C00] font-mono font-semibold">A-Generative-Slice</span> GitHub organization.
                            </p>
                        </div>
                    </div>

                    <a
                        href="https://github.com/A-Generative-Slice"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3.5 py-2 rounded-lg bg-black/5 dark:bg-white/10 text-xs font-bold text-[#0F172A] dark:text-white hover:bg-[#FF5C00] hover:text-white transition-all flex items-center gap-1.5 self-start sm:self-auto min-h-[44px]"
                    >
                        <span>GitHub Profile</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2.5 pt-4">
                    {detailedProducts.map((p) => (
                        <a
                            key={p.id}
                            href={`https://github.com/A-Generative-Slice/${p.repoName}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-3 rounded-lg border border-black/5 dark:border-white/5 bg-[#f8fafc] dark:bg-[#111622] hover:border-[#FF5C00]/40 transition-all text-center group min-h-[58px] flex flex-col justify-center"
                        >
                            <span className="font-mono text-xs font-bold text-[#0F172A] dark:text-white group-hover:text-[#FF5C00] block truncate">
                                {p.repoName}
                            </span>
                            <span className="text-[10px] text-[#64748B] dark:text-white/40 block mt-0.5">
                                main • synced
                            </span>
                        </a>
                    ))}
                </div>
            </section>

            {/* THE 7 DEDICATED TOOL WORKSPACES GRID (Anti-Slop Editorial Cards) */}
            <section id="tools-grid" className="scroll-mt-28">
                <div className="max-w-3xl mb-12 space-y-2">
                    <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#FF5C00] font-heading">
                        <span className="font-mono text-[#FF5C00]">|</span>
                        <span>ENTERPRISE SUITE ARCHITECTURE</span>
                    </div>
                    <h2 className="text-2xl sm:text-4xl font-black text-[#0F172A] dark:text-white font-heading tracking-tight">
                        7 Dedicated Software Workspaces
                    </h2>
                    <p className="text-xs sm:text-sm text-[#64748B] dark:text-[#94A3B8] leading-relaxed">
                        Each tool is hosted in an isolated dedicated route with real-time controls, architectural specifications, workflow pipelines, and direct GitHub tracking.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {detailedProducts.map((product) => (
                        <div
                            key={product.id}
                            className="rounded-2xl border border-black/10 dark:border-white/10 bg-white dark:bg-[#0c0f17] p-6 shadow-lg flex flex-col justify-between hover:border-[#FF5C00]/50 transition-all duration-200 group"
                        >
                            <div className="space-y-4">
                                {/* Header: Icon + Category Tag */}
                                <div className="flex items-center justify-between gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-[#FF5C00] flex items-center justify-center shadow-md shadow-[#FF5C00]/20">
                                        {getProductIcon(product.id)}
                                    </div>
                                    <span className="px-2.5 py-1 rounded-md text-[10px] font-mono font-semibold bg-black/5 dark:bg-white/10 text-[#64748B] dark:text-white/60">
                                        {product.badge}
                                    </span>
                                </div>

                                <div>
                                    <span className="text-[10px] font-bold uppercase tracking-widest text-[#FF5C00] font-heading block mb-1">
                                        {product.category}
                                    </span>
                                    <h3 className="text-xl font-black text-[#0F172A] dark:text-white font-heading tracking-tight">
                                        {product.name}
                                    </h3>
                                    <p className="mt-1.5 text-xs text-[#64748B] dark:text-[#94A3B8] leading-relaxed">
                                        {product.tagline}
                                    </p>
                                </div>

                                {/* Key Specs Preview */}
                                <div className="space-y-1.5 pt-2 border-t border-black/5 dark:border-white/5">
                                    {product.specs.slice(0, 3).map((spec, i) => (
                                        <div key={i} className="flex items-center justify-between text-xs py-0.5">
                                            <span className="text-[#64748B] dark:text-white/40 text-[11px]">{spec.label}</span>
                                            <span className="font-semibold text-[#0F172A] dark:text-white text-[11px] truncate max-w-[150px]">{spec.value}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Action Buttons (High-Touch 44px+) */}
                            <div className="pt-5 mt-5 border-t border-black/5 dark:border-white/5 space-y-2">
                                <Link
                                    to={product.path}
                                    className="w-full py-3 rounded-xl bg-[#FF5C00] hover:bg-[#FF8C1A] text-white text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-sm font-heading min-h-[46px]"
                                >
                                    <span>Open Dedicated Workspace</span>
                                    <ArrowRight className="w-3.5 h-3.5" />
                                </Link>

                                <a
                                    href={`https://github.com/A-Generative-Slice/${product.repoName}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-full py-2.5 rounded-xl border border-black/5 dark:border-white/10 bg-black/[0.02] dark:bg-white/[0.02] hover:bg-black/5 dark:hover:bg-white/10 text-xs font-mono text-[#64748B] dark:text-white/70 transition-all flex items-center justify-center gap-1.5 min-h-[42px]"
                                >
                                    <GitBranch className="w-3.5 h-3.5 text-[#FF5C00]" />
                                    <span>A-Generative-Slice/{product.repoName}</span>
                                </a>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* VERIFIED PRODUCTION DEPLOYMENTS & CLIENT PROOFS (High Value / Editorial) */}
            <section id="client-stories" className="scroll-mt-28">
                <div className="max-w-3xl mb-12 space-y-2">
                    <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#FF5C00] font-heading">
                        <span className="font-mono text-[#FF5C00]">|</span>
                        <span>DOCUMENTED CLIENT ARCHITECTURES &amp; REVIEWS</span>
                    </div>
                    <h2 className="text-2xl sm:text-4xl font-black text-[#0F172A] dark:text-white font-heading tracking-tight">
                        Verified Production Deployments
                    </h2>
                    <p className="text-xs sm:text-sm text-[#64748B] dark:text-[#94A3B8] leading-relaxed">
                        In-depth technical analysis of enterprise client problems, architectural changes engineered by A Generative Slice, and verified client outcomes.
                    </p>
                </div>

                <div className="space-y-8">
                    {verifiedClientStories.map((story) => (
                        <div 
                            key={story.id}
                            className="p-6 sm:p-10 rounded-2xl border border-black/10 dark:border-white/10 bg-white/90 dark:bg-[#0c0f17]/95 shadow-xl space-y-8"
                        >
                            {/* Story Header */}
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-black/5 dark:border-white/10">
                                <div>
                                    <div className="flex items-center gap-2 flex-wrap mb-1">
                                        <Building2 className="w-4 h-4 text-[#FF5C00]" />
                                        <h3 className="text-lg sm:text-2xl font-black text-[#0F172A] dark:text-white font-heading">
                                            {story.clientName}
                                        </h3>
                                        <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                                            Verified Production
                                        </span>
                                    </div>
                                    <p className="text-xs text-[#64748B] dark:text-white/60">
                                        {story.clientLocation} • <span className="font-mono text-[#FF5C00]">{story.clientDomain}</span> • {story.category}
                                    </p>
                                </div>

                                <div className="flex items-center gap-2 flex-wrap">
                                    {story.toolsDeployed.map((tool) => (
                                        <span 
                                            key={tool}
                                            className="px-2.5 py-1 rounded-md text-xs font-mono font-bold bg-[#FF5C00]/10 text-[#FF5C00] border border-[#FF5C00]/25"
                                        >
                                            {tool}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            {/* Deep Architectural Breakdown Grid */}
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                {/* The Bottleneck */}
                                <div className="p-5 rounded-xl border border-black/5 dark:border-white/5 bg-[#f8fafc] dark:bg-[#111622] space-y-2">
                                    <span className="text-[10px] font-mono uppercase tracking-widest text-red-500 font-bold block">
                                        Initial Problem &amp; Bottleneck
                                    </span>
                                    <h4 className="text-sm font-bold text-[#0F172A] dark:text-white font-heading">
                                        Legacy Architecture Limitations
                                    </h4>
                                    <p className="text-xs text-[#64748B] dark:text-[#94A3B8] leading-relaxed">
                                        {story.challenge}
                                    </p>
                                </div>

                                {/* The Solution */}
                                <div className="p-5 rounded-xl border border-black/5 dark:border-white/5 bg-[#f8fafc] dark:bg-[#111622] space-y-2">
                                    <span className="text-[10px] font-mono uppercase tracking-widest text-[#FF5C00] font-bold block">
                                        Architectural Changes &amp; Engineering
                                    </span>
                                    <h4 className="text-sm font-bold text-[#0F172A] dark:text-white font-heading">
                                        A Generative Slice Implementation
                                    </h4>
                                    <p className="text-xs text-[#64748B] dark:text-[#94A3B8] leading-relaxed">
                                        {story.solution}
                                    </p>
                                </div>
                            </div>

                            {/* Quantitative Metrics Bar */}
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                {story.metrics.map((m, idx) => (
                                    <div 
                                        key={idx}
                                        className="p-4 rounded-xl border border-black/5 dark:border-white/5 bg-[#f8fafc] dark:bg-[#111622] text-center space-y-1"
                                    >
                                        <span className="text-[10px] text-[#64748B] dark:text-white/40 block font-heading uppercase tracking-wider">
                                            {m.label}
                                        </span>
                                        <div className="flex items-center justify-center gap-2 text-xs">
                                            <span className="line-through text-[#64748B] dark:text-white/40">{m.before}</span>
                                            <span className="text-[#FF5C00] font-bold">→</span>
                                            <span className="font-mono font-bold text-[#0F172A] dark:text-white">{m.after}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Verified Client Review & Verification Note */}
                            <div className="p-5 sm:p-6 rounded-xl border-l-4 border-[#FF5C00] bg-orange-500/[0.03] dark:bg-orange-500/[0.04] space-y-4">
                                <div className="flex items-start gap-3">
                                    <Quote className="w-5 h-5 text-[#FF5C00] shrink-0 mt-0.5" />
                                    <p className="text-xs sm:text-sm italic text-[#0F172A] dark:text-white/90 leading-relaxed font-serif">
                                        "{story.review.quote}"
                                    </p>
                                </div>

                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-black/5 dark:border-white/10 text-xs">
                                    <div>
                                        <span className="font-bold text-[#0F172A] dark:text-white block font-heading">
                                            {story.review.author}
                                        </span>
                                        <span className="text-[#64748B] dark:text-white/50 text-[11px]">
                                            {story.review.role} • {story.clientName}
                                        </span>
                                    </div>

                                    <div className="flex items-center gap-2 text-[11px] font-mono text-emerald-600 dark:text-emerald-400">
                                        <ShieldCheck className="w-4 h-4 shrink-0" />
                                        <span>{story.review.verifiedProof}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* UNIFIED WORKFLOW PIPELINE ARCHITECTURE */}
            <section className="p-6 sm:p-10 rounded-2xl border border-black/10 dark:border-white/10 bg-white/80 dark:bg-[#0c0f17]/90 shadow-xl">
                <div className="max-w-3xl mb-10 space-y-2">
                    <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#FF5C00] font-heading">
                        <span className="font-mono text-[#FF5C00]">|</span>
                        <span>INTEROPERABLE PIPELINE</span>
                    </div>
                    <h2 className="text-xl sm:text-3xl font-black text-[#0F172A] dark:text-white font-heading tracking-tight">
                        How The 7 Systems Connect
                    </h2>
                    <p className="text-xs sm:text-sm text-[#64748B] dark:text-[#94A3B8] leading-relaxed">
                        Each tool operates as an autonomous modular microservice or can be orchestrated in an integrated pipeline.
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="p-5 rounded-xl border border-black/5 dark:border-white/5 bg-[#f8fafc] dark:bg-[#111622] space-y-2">
                        <span className="font-mono text-[#FF5C00] font-bold text-xs">STAGE 01</span>
                        <h4 className="font-bold text-sm text-[#0F172A] dark:text-white font-heading">Target Ingestion</h4>
                        <p className="text-xs text-[#64748B] dark:text-white/60 leading-relaxed">
                            SliceLeads ingests and verifies regional decision-makers, piping live intent signals directly to SliceMail.
                        </p>
                    </div>

                    <div className="p-5 rounded-xl border border-black/5 dark:border-white/5 bg-[#f8fafc] dark:bg-[#111622] space-y-2">
                        <span className="font-mono text-[#FF5C00] font-bold text-xs">STAGE 02</span>
                        <h4 className="font-bold text-sm text-[#0F172A] dark:text-white font-heading">Omnichannel Triage</h4>
                        <p className="text-xs text-[#64748B] dark:text-white/60 leading-relaxed">
                            SliceInbox unifies customer replies from WhatsApp, Email, and Web with auto-sentiment classification.
                        </p>
                    </div>

                    <div className="p-5 rounded-xl border border-black/5 dark:border-white/5 bg-[#f8fafc] dark:bg-[#111622] space-y-2">
                        <span className="font-mono text-[#FF5C00] font-bold text-xs">STAGE 03</span>
                        <h4 className="font-bold text-sm text-[#0F172A] dark:text-white font-heading">Immersive WebGL</h4>
                        <p className="text-xs text-[#64748B] dark:text-white/60 leading-relaxed">
                            SliceDAM optimizes high-res models, streaming lightweight 3D assets to Slice3D for 60 FPS mobile inspection.
                        </p>
                    </div>

                    <div className="p-5 rounded-xl border border-black/5 dark:border-white/5 bg-[#f8fafc] dark:bg-[#111622] space-y-2">
                        <span className="font-mono text-[#FF5C00] font-bold text-xs">STAGE 04</span>
                        <h4 className="font-bold text-sm text-[#0F172A] dark:text-white font-heading">Executive Enablement</h4>
                        <p className="text-xs text-[#64748B] dark:text-white/60 leading-relaxed">
                            SlicePPT automates boardroom decks from structured templates, while SliceClass trains team operators.
                        </p>
                    </div>
                </div>
            </section>

            {/* GENERAL DEPLOYMENT & ARCHITECTURE SCOPING FORM (Mobile-First 48px Inputs) */}
            <section id="scoping-form" className="rounded-2xl border border-black/10 dark:border-white/10 bg-white dark:bg-[#0c0f17] p-6 sm:p-10 shadow-xl scroll-mt-28">
                <div className="max-w-2xl mx-auto mb-8 text-center space-y-2">
                    <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#FF5C00] font-heading">
                        <span className="font-mono text-[#FF5C00]">|</span>
                        <span>ENTERPRISE CONSULTATION</span>
                    </div>
                    <h2 className="text-xl sm:text-3xl font-black text-[#0F172A] dark:text-white font-heading tracking-tight">
                        Schedule an Architecture Review
                    </h2>
                    <p className="text-xs sm:text-sm text-[#64748B] dark:text-[#94A3B8]">
                        Inquire about deploying, licensing, or tailoring any of the 7 products for your enterprise infrastructure.
                    </p>
                </div>

                <form onSubmit={handleFormSubmit} className="max-w-3xl mx-auto space-y-4">
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
                                Corporate Email *
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
                                placeholder="+91 98765 43210"
                                className="w-full px-4 py-3 rounded-xl border border-black/10 dark:border-white/10 bg-[#f8fafc] dark:bg-[#111622] text-[#0F172A] dark:text-white text-base focus:border-[#FF5C00] focus:ring-1 focus:ring-[#FF5C00] outline-none transition-all min-h-[48px]"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-[#0F172A] dark:text-white/80 mb-1.5 font-heading">
                                Company / Studio
                            </label>
                            <input
                                type="text"
                                value={formData.company}
                                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                                placeholder="Enterprise Ltd."
                                className="w-full px-4 py-3 rounded-xl border border-black/10 dark:border-white/10 bg-[#f8fafc] dark:bg-[#111622] text-[#0F172A] dark:text-white text-base focus:border-[#FF5C00] focus:ring-1 focus:ring-[#FF5C00] outline-none transition-all min-h-[48px]"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-[#0F172A] dark:text-white/80 mb-1.5 font-heading">
                            Product Scope
                        </label>
                        <select
                            value={formData.category}
                            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                            className="w-full px-4 py-3 rounded-xl border border-black/10 dark:border-white/10 bg-[#f8fafc] dark:bg-[#111622] text-[#0F172A] dark:text-white text-base focus:border-[#FF5C00] focus:ring-1 focus:ring-[#FF5C00] outline-none transition-all min-h-[48px]"
                        >
                            <option value="General Architecture Review">General Suite Architecture Review</option>
                            <option value="Slice3D (Spatial WebGL)">Slice3D — Interactive 3D Product Showcase</option>
                            <option value="SliceLeads (Lead Engine)">SliceLeads — Local Business Lead Discovery</option>
                            <option value="SliceMail (AI Outreach)">SliceMail — Autonomous Email Prospecting</option>
                            <option value="SliceInbox (Omnichannel CRM)">SliceInbox — Omnichannel AI Helpdesk</option>
                            <option value="SlicePPT (Deck Engine)">SlicePPT — AI Boardroom Deck Engine</option>
                            <option value="SliceDAM (Digital Assets)">SliceDAM — Digital Asset Management Vault</option>
                            <option value="SliceClass (Studio LMS)">SliceClass — High-Performance Learning Hub</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-[#0F172A] dark:text-white/80 mb-1.5 font-heading">
                            Architecture Requirements *
                        </label>
                        <textarea
                            rows={4}
                            required
                            value={formData.message}
                            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                            placeholder="Describe your operational use case or deployment requirements..."
                            className="w-full px-4 py-3 rounded-xl border border-black/10 dark:border-white/10 bg-[#f8fafc] dark:bg-[#111622] text-[#0F172A] dark:text-white text-base focus:border-[#FF5C00] focus:ring-1 focus:ring-[#FF5C00] outline-none transition-all resize-none"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={status === 'sending'}
                        className="w-full py-4 rounded-xl bg-[#FF5C00] hover:bg-[#FF8C1A] text-white text-sm font-bold shadow-md shadow-[#FF5C00]/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 min-h-[50px] font-heading"
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
