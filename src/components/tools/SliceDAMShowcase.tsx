import { useState } from 'react';
import { 
    Search, ShieldCheck, CheckCircle2, 
    FolderKanban, ExternalLink, Key
} from 'lucide-react';
import { RepoSyncBar } from '../RepoSyncBar';

interface VaultDocument {
    id: string;
    title: string;
    category: 'client-documents' | 'financial-records' | 'statutory-compliance' | 'enrollment-forms';
    client: string;
    date: string;
    size: string;
    status: 'Signed & Sealed' | 'Paid & Reconciled' | 'In Force';
    sha256: string;
    content: {
        summary: string;
        parties: string;
        amount?: string;
        terms: string[];
    };
}

const mockVaultDocs: VaultDocument[] = [
    {
        id: 'doc-1',
        title: 'Master Service Agreement — 3D Web & Interactive Systems',
        category: 'client-documents',
        client: 'Horizon Realty Enclave Ltd',
        date: 'Oct 04, 2026',
        size: '1.4 MB',
        status: 'Signed & Sealed',
        sha256: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
        content: {
            summary: 'Comprehensive software delivery and 3D WebGL asset integration agreement for 14-villa enclave interactive visualizer.',
            parties: 'A Generative Slice (Service Provider) & Horizon Realty Enclave Ltd (Client)',
            amount: '₹3,50,000 + 18% GST',
            terms: [
                'Full intellectual property ownership transferred upon milestone sign-off',
                '99.9% uptime SLA for self-hosted WebGL viewer modules',
                '12 months continuous security updates and browser patch warranty'
            ]
        }
    },
    {
        id: 'doc-2',
        title: 'GST Tax Invoice — INV-2026-AGS-089',
        category: 'financial-records',
        client: 'Vanguard Structural Consultants',
        date: 'Oct 01, 2026',
        size: '340 KB',
        status: 'Paid & Reconciled',
        sha256: 'ca978112ca1bbdcafac231b39a23dc4da786eff8147c4e72b9807785afee48bb',
        content: {
            summary: 'Official tax invoice for automated local lead pipeline integration and WhatsApp triage workflow rollout.',
            parties: 'A Generative Slice (GSTIN: 33ABCDE1234F1Z5) to Vanguard Consultants',
            amount: '₹85,000 (Incl. ₹12,966 CGST+SGST)',
            terms: [
                'MSME Registration: UDYAM-TN-02-0471493',
                'Electronic bank settlement confirmed via HDFC Current Account',
                'Input Tax Credit (ITC) reconciliation uploaded to GST Portal'
            ]
        }
    },
    {
        id: 'doc-3',
        title: 'Mutual Non-Disclosure & Proprietary Code Covenant',
        category: 'statutory-compliance',
        client: 'Cybertronics IoT Labs',
        date: 'Sep 28, 2026',
        size: '890 KB',
        status: 'In Force',
        sha256: '4b227777d4dd1fc61c6f884f48641d02b4d121d3fd328cb08b5531fcacdabf8a',
        content: {
            summary: 'Bilateral non-disclosure covenant covering AI inference weights, custom MCP server architecture, and customer data.',
            parties: 'A Generative Slice & Cybertronics IoT Labs',
            terms: [
                'Strict 3-year confidentiality duration covering trade secrets',
                'Complete local on-prem data isolation guarantee',
                'Zero external training on client-provided datasets'
            ]
        }
    },
    {
        id: 'doc-4',
        title: 'Enterprise Student Enrollment & IP Access Form',
        category: 'enrollment-forms',
        client: 'LiteRight Academy Apprenticeship Cohort 3',
        date: 'Sep 15, 2026',
        size: '520 KB',
        status: 'Signed & Sealed',
        sha256: '8f434346648f6b96df89dda901c5176b10a6d83961dd3c1ac88b59b2dc327aa4',
        content: {
            summary: 'Standard cohort enrollment agreement covering proprietary lab workstation access and cloud sandbox credentials.',
            parties: 'A Generative Slice & Enrolled Engineering Apprentices',
            terms: [
                'Access to Chennai AI laboratory hardware cluster',
                'Code submission guidelines under strict code quality gating',
                'Direct mentorship reviews by founder Mohammed Hussain'
            ]
        }
    }
];

export const SliceDAMShowcase: React.FC = () => {
    const [selectedDoc, setSelectedDoc] = useState<VaultDocument>(mockVaultDocs[0]);
    const [searchQuery, setSearchQuery] = useState('');
    const [activeCategory, setActiveCategory] = useState<'all' | 'client-documents' | 'financial-records' | 'statutory-compliance' | 'enrollment-forms'>('all');
    const [isVerifying, setIsVerifying] = useState(false);
    const [isVerified, setIsVerified] = useState(true);

    const categories = [
        { id: 'all', label: 'All Vault Files' },
        { id: 'client-documents', label: 'client-documents/' },
        { id: 'financial-records', label: 'financial-records/' },
        { id: 'statutory-compliance', label: 'statutory-compliance/' },
        { id: 'enrollment-forms', label: 'enrollment-forms/' },
    ] as const;

    const filteredDocs = mockVaultDocs.filter(d => {
        const matchesCategory = activeCategory === 'all' || d.category === activeCategory;
        const matchesSearch = d.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                              d.client.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    const handleVerifySha = () => {
        setIsVerifying(true);
        setIsVerified(false);
        setTimeout(() => {
            setIsVerifying(false);
            setIsVerified(true);
        }, 600);
    };

    return (
        <div>
            {/* Live GitHub Repository Sync Bar */}
            <RepoSyncBar repoName="SliceDAM" />

            <div className="rounded-3xl border border-black/10 dark:border-white/10 bg-white dark:bg-[#111] overflow-hidden shadow-2xl flex flex-col">
                {/* Header */}
                <div className="px-6 py-4 border-b border-black/5 dark:border-white/10 bg-black/[0.02] dark:bg-white/[0.02] flex items-center justify-between flex-wrap gap-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-[#FF5C00]/10 border border-[#FF5C00]/20 flex items-center justify-center text-[#FF5C00]">
                            <FolderKanban className="w-5 h-5" />
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <span className="font-bold text-sm text-[#0F172A] dark:text-white font-heading">
                                    SliceDAM Immutable Vault & Document Hub
                                </span>
                                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#FF5C00]/10 text-[#FF5C00] border border-[#FF5C00]/20">
                                    SHA-256 Verified
                                </span>
                            </div>
                            <p className="text-[11px] text-[#64748B] dark:text-white/50">
                                Cryptographically sealed client contracts, tax invoices, and statutory records
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 text-xs font-mono">
                        <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-bold">
                            <ShieldCheck className="w-4 h-4" /> Zero Monthly SaaS Lock-In
                        </span>
                    </div>
                </div>

                {/* Filter and Search Bar */}
                <div className="p-6 bg-black/[0.01] dark:bg-white/[0.01] border-b border-black/5 dark:border-white/10 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
                    {/* Search */}
                    <div className="relative flex-1">
                        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#64748B] dark:text-white/40" />
                        <input
                            type="text"
                            placeholder="Search vault agreements, clients, or GST invoices..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 rounded-xl border border-black/10 dark:border-white/10 bg-black/[0.02] dark:bg-white/[0.03] text-xs text-[#0F172A] dark:text-white focus:outline-none focus:border-[#FF5C00]"
                        />
                    </div>

                    {/* Category Tabs */}
                    <div className="flex items-center gap-1.5 flex-wrap">
                        {categories.map((cat) => (
                            <button
                                key={cat.id}
                                onClick={() => setActiveCategory(cat.id)}
                                className={`px-3 py-1.5 rounded-xl text-[11px] font-mono transition-all ${
                                    activeCategory === cat.id
                                        ? 'bg-[#FF5C00] text-white shadow-sm font-bold'
                                        : 'bg-black/5 dark:bg-white/5 text-[#64748B] dark:text-white/60 hover:text-[#0F172A] dark:hover:text-white'
                                }`}
                            >
                                {cat.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Main Split: Vault Document List vs Selected Document Dossier */}
                <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-black/5 dark:divide-white/10">
                    {/* Documents List */}
                    <div className="lg:col-span-5 divide-y divide-black/5 dark:divide-white/5 max-h-[560px] overflow-y-auto">
                        {filteredDocs.map((doc) => (
                            <div
                                key={doc.id}
                                onClick={() => {
                                    setSelectedDoc(doc);
                                    setIsVerified(true);
                                }}
                                className={`p-5 cursor-pointer transition-all ${
                                    selectedDoc.id === doc.id
                                        ? 'bg-[#FF5C00]/5 border-l-4 border-l-[#FF5C00]'
                                        : 'hover:bg-black/[0.02] dark:hover:bg-white/[0.02]'
                                }`}
                            >
                                <div className="flex items-center justify-between mb-1">
                                    <span className="font-mono text-[10px] text-[#FF5C00] font-bold">
                                        /{doc.category}
                                    </span>
                                    <span className="text-[10px] text-[#64748B] dark:text-white/40 font-mono">
                                        {doc.date}
                                    </span>
                                </div>
                                <h4 className="font-bold text-xs text-[#0F172A] dark:text-white mb-1 leading-snug">
                                    {doc.title}
                                </h4>
                                <div className="flex items-center justify-between text-[11px] text-[#64748B] dark:text-white/50 pt-1">
                                    <span>{doc.client}</span>
                                    <span className="font-mono">{doc.size}</span>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Selected Document Dossier */}
                    <div className="lg:col-span-7 p-6 space-y-5 bg-black/[0.01] dark:bg-white/[0.01]">
                        {/* Title and metadata */}
                        <div className="rounded-2xl border border-black/10 dark:border-white/10 bg-white dark:bg-[#161616] p-5 shadow-sm space-y-4">
                            <div className="flex items-start justify-between gap-4 border-b border-black/5 dark:border-white/10 pb-4">
                                <div>
                                    <span className="text-[10px] font-mono text-[#FF5C00] font-bold block mb-1">
                                        SliceDAM Record: {selectedDoc.id.toUpperCase()}
                                    </span>
                                    <h3 className="font-bold text-base text-[#0F172A] dark:text-white">
                                        {selectedDoc.title}
                                    </h3>
                                </div>
                                <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 shrink-0">
                                    {selectedDoc.status}
                                </span>
                            </div>

                            <div className="space-y-3 text-xs">
                                <div>
                                    <span className="font-bold text-[#64748B] dark:text-white/40 uppercase tracking-wider text-[10px] block mb-1">
                                        Parties Involved
                                    </span>
                                    <p className="text-[#0F172A] dark:text-white/80 font-medium">
                                        {selectedDoc.content.parties}
                                    </p>
                                </div>

                                {selectedDoc.content.amount && (
                                    <div>
                                        <span className="font-bold text-[#64748B] dark:text-white/40 uppercase tracking-wider text-[10px] block mb-1">
                                            Commercial Consideration
                                        </span>
                                        <p className="font-mono text-[#FF5C00] font-bold text-sm">
                                            {selectedDoc.content.amount}
                                        </p>
                                    </div>
                                )}

                                <div>
                                    <span className="font-bold text-[#64748B] dark:text-white/40 uppercase tracking-wider text-[10px] block mb-1">
                                        Executive Summary
                                    </span>
                                    <p className="text-[#64748B] dark:text-white/70 leading-relaxed">
                                        {selectedDoc.content.summary}
                                    </p>
                                </div>

                                <div>
                                    <span className="font-bold text-[#64748B] dark:text-white/40 uppercase tracking-wider text-[10px] block mb-1.5">
                                        Binding Covenants & Provisions
                                    </span>
                                    <ul className="space-y-1.5">
                                        {selectedDoc.content.terms.map((term, i) => (
                                            <li key={i} className="flex items-start gap-2 text-[#0F172A] dark:text-white/80 text-[11px]">
                                                <CheckCircle2 className="w-3.5 h-3.5 text-[#FF5C00] shrink-0 mt-0.5" />
                                                <span>{term}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </div>

                        {/* Cryptographic SHA-256 Seal Verification */}
                        <div className="rounded-2xl border border-black/10 dark:border-white/10 bg-black/[0.02] dark:bg-white/[0.02] p-4 space-y-3">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <Key className="w-4 h-4 text-[#FF5C00]" />
                                    <span className="text-xs font-mono font-bold text-[#0F172A] dark:text-white">
                                        Cryptographic SHA-256 Seal
                                    </span>
                                </div>
                                <button
                                    onClick={handleVerifySha}
                                    disabled={isVerifying}
                                    className="px-2.5 py-1 rounded-lg bg-[#FF5C00] text-white text-[11px] font-bold hover:bg-[#FF8C1A] transition-all"
                                >
                                    {isVerifying ? 'Verifying Hash...' : 'Audit Seal'}
                                </button>
                            </div>
                            <div className="p-2.5 rounded-xl bg-white dark:bg-[#111] border border-black/5 dark:border-white/10 font-mono text-[11px] text-[#64748B] dark:text-white/70 break-all select-all">
                                {selectedDoc.sha256}
                            </div>
                            {isVerified && (
                                <p className="text-[11px] text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5 font-semibold">
                                    <ShieldCheck className="w-4 h-4 shrink-0" />
                                    <span>Immutable match confirmed. Document has not been altered since execution.</span>
                                </p>
                            )}
                        </div>

                        {/* Repo Link */}
                        <div className="flex items-center justify-between text-xs text-[#64748B] dark:text-white/50 pt-2">
                            <span className="font-mono">SliceDAM Vault Hierarchy</span>
                            <a
                                href="https://github.com/A-Generative-Slice/SliceDAM"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-[#FF5C00] hover:underline flex items-center gap-1 font-semibold"
                            >
                                <span>Browse SliceDAM on GitHub</span>
                                <ExternalLink className="w-3 h-3" />
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
