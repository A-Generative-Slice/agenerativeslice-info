import React, { useState } from 'react';
import { 
    FileText, Search, ShieldCheck, 
    Download, CheckCircle2, Lock, Printer 
} from 'lucide-react';
import logoImg from '../../assets/logo.jpg';

interface VaultDocument {
    id: string;
    title: string;
    type: 'contract' | 'invoice' | 'nda' | 'asset';
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
        type: 'contract',
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
        type: 'invoice',
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
        type: 'nda',
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
    }
];

export const SliceDAMShowcase: React.FC = () => {
    const [selectedDoc, setSelectedDoc] = useState<VaultDocument>(mockVaultDocs[0]);
    const [searchQuery, setSearchQuery] = useState('');
    const [activeFilter, setActiveFilter] = useState<'all' | 'contract' | 'invoice' | 'nda'>('all');

    const filteredDocs = mockVaultDocs.filter(d => {
        const matchesFilter = activeFilter === 'all' || d.type === activeFilter;
        const matchesSearch = d.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                              d.client.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesFilter && matchesSearch;
    });

    return (
        <div className="w-full rounded-3xl border border-white/10 bg-[#0F172A] overflow-hidden shadow-2xl flex flex-col">
            {/* Header */}
            <div className="px-5 py-4 border-b border-white/10 bg-[#0B0F17]/90 backdrop-blur flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center gap-3">
                    <img src={logoImg} alt="AGS Logo" className="w-8 h-8 rounded-full border border-[#FF5C00]/40 object-cover" />
                    <div>
                        <div className="flex items-center gap-2">
                            <span className="font-bold text-sm text-white font-heading">SliceDAM Document Vault</span>
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#FF5C00]/20 text-[#FF5C00] border border-[#FF5C00]/30">
                                Enterprise DAM
                            </span>
                        </div>
                        <p className="text-[11px] text-white/50">Centralized contracts, GST invoices & tamper-proof company files</p>
                    </div>
                </div>

                <div className="flex items-center gap-2 text-xs font-mono text-white/70">
                    <span className="flex items-center gap-1.5 text-emerald-400">
                        <Lock className="w-3.5 h-3.5" /> SHA-256 Tamper Proof
                    </span>
                    <span className="text-white/20">|</span>
                    <span>MSME Certified</span>
                </div>
            </div>

            {/* Sub-bar: Search & Type Filter */}
            <div className="p-4 bg-[#0B0F17]/40 border-b border-white/10 flex items-center justify-between flex-wrap gap-3">
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setActiveFilter('all')}
                        className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-colors ${
                            activeFilter === 'all' ? 'bg-[#FF5C00] text-white font-bold' : 'bg-white/5 text-white/60 hover:text-white'
                        }`}
                    >
                        All Documents
                    </button>
                    <button
                        onClick={() => setActiveFilter('contract')}
                        className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-colors ${
                            activeFilter === 'contract' ? 'bg-[#FF5C00] text-white font-bold' : 'bg-white/5 text-white/60 hover:text-white'
                        }`}
                    >
                        Contracts
                    </button>
                    <button
                        onClick={() => setActiveFilter('invoice')}
                        className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-colors ${
                            activeFilter === 'invoice' ? 'bg-[#FF5C00] text-white font-bold' : 'bg-white/5 text-white/60 hover:text-white'
                        }`}
                    >
                        Tax Invoices
                    </button>
                    <button
                        onClick={() => setActiveFilter('nda')}
                        className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-colors ${
                            activeFilter === 'nda' ? 'bg-[#FF5C00] text-white font-bold' : 'bg-white/5 text-white/60 hover:text-white'
                        }`}
                    >
                        NDAs
                    </button>
                </div>

                <div className="relative w-full sm:w-64">
                    <Search className="w-3.5 h-3.5 text-white/40 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search contracts or invoices..."
                        className="w-full bg-[#0F172A] border border-white/10 rounded-xl pl-8 pr-3 py-1.5 text-xs text-white placeholder-white/40 focus:outline-none focus:border-[#FF5C00]"
                    />
                </div>
            </div>

            {/* Split Screen Grid: Documents List & Live Preview */}
            <div className="grid grid-cols-1 lg:grid-cols-12 flex-grow min-h-[440px]">
                {/* Document List */}
                <div className="lg:col-span-5 border-b lg:border-b-0 lg:border-r border-white/10 divide-y divide-white/5 bg-[#0B0F17]/20">
                    {filteredDocs.map((doc) => (
                        <div
                            key={doc.id}
                            onClick={() => setSelectedDoc(doc)}
                            className={`p-4 cursor-pointer transition-colors ${
                                selectedDoc.id === doc.id
                                    ? 'bg-white/10 border-l-4 border-l-[#FF5C00]'
                                    : 'hover:bg-white/[0.03]'
                            }`}
                        >
                            <div className="flex items-center justify-between mb-1">
                                <span className="font-bold text-xs text-white line-clamp-1">{doc.title}</span>
                                <span className="text-[10px] text-white/40 font-mono shrink-0">{doc.date}</span>
                            </div>

                            <div className="text-[11px] text-white/60 flex items-center justify-between mt-1">
                                <span>{doc.client}</span>
                                <span className="font-mono text-white/40">{doc.size}</span>
                            </div>

                            <div className="mt-2 flex items-center gap-2">
                                <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                                    {doc.status}
                                </span>
                                <span className="text-[10px] text-white/40 font-mono truncate max-w-[150px]">
                                    hash: {doc.sha256.substring(0, 10)}...
                                </span>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Styled Document Preview */}
                <div className="lg:col-span-7 p-6 flex flex-col justify-between bg-[#0F172A]">
                    <div>
                        {/* Top bar */}
                        <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-4">
                            <div className="flex items-center gap-2 text-xs text-white/80">
                                <FileText className="w-4 h-4 text-[#FF5C00]" />
                                <span className="font-bold font-heading text-white">Verified Document Viewer</span>
                            </div>

                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => window.print()}
                                    className="p-1.5 rounded-lg bg-white/5 text-white/60 hover:text-white border border-white/10"
                                    title="Print Document"
                                >
                                    <Printer className="w-3.5 h-3.5" />
                                </button>
                                <button
                                    onClick={() => alert(`Downloading signed copy: ${selectedDoc.title}.pdf`)}
                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#FF5C00] hover:bg-[#FF8C1A] text-white text-xs font-bold transition-all shadow-md shadow-[#FF5C00]/20"
                                >
                                    <Download className="w-3.5 h-3.5" /> Download PDF
                                </button>
                            </div>
                        </div>

                        {/* Styled Document Sheet */}
                        <div className="rounded-2xl bg-[#0B0F17] border border-white/10 p-6 space-y-4 font-sans text-xs">
                            {/* Document Header with AGS Stamp */}
                            <div className="flex items-start justify-between border-b border-white/10 pb-4">
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2">
                                        <img src={logoImg} alt="AGS Logo" className="w-6 h-6 rounded-full object-cover" />
                                        <span className="font-bold text-white font-heading text-sm">A Generative Slice</span>
                                    </div>
                                    <p className="text-[10px] text-white/50">MSME Reg: UDYAM-TN-02-0471493 • Chennai, Tamil Nadu</p>
                                    <p className="text-[10px] text-white/50">Official Phone: +91 78128 91494 • Email: smdhussain@agenerativeslice.com</p>
                                </div>

                                <div className="text-right">
                                    <span className="px-2 py-1 rounded text-[10px] font-bold bg-[#FF5C00]/20 text-[#FF5C00] border border-[#FF5C00]/30 uppercase font-mono">
                                        {selectedDoc.type}
                                    </span>
                                    <div className="text-[10px] text-white/40 font-mono mt-1">{selectedDoc.date}</div>
                                </div>
                            </div>

                            {/* Title & Parties */}
                            <div className="space-y-1.5">
                                <h4 className="text-sm font-bold text-white font-heading">{selectedDoc.title}</h4>
                                <div className="text-[11px] text-white/70 font-medium">
                                    <span className="text-white/40">Parties:</span> {selectedDoc.content.parties}
                                </div>
                                {selectedDoc.content.amount && (
                                    <div className="text-[11px] text-[#FF5C00] font-bold font-mono">
                                        Amount: {selectedDoc.content.amount}
                                    </div>
                                )}
                            </div>

                            {/* Summary */}
                            <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 text-white/80 leading-relaxed">
                                {selectedDoc.content.summary}
                            </div>

                            {/* Terms */}
                            <div className="space-y-1.5">
                                <div className="text-[10px] font-bold uppercase tracking-wider text-white/50 font-heading">
                                    Key Enacted Terms & Clauses
                                </div>
                                <ul className="space-y-1">
                                    {selectedDoc.content.terms.map((term, i) => (
                                        <li key={i} className="flex items-start gap-2 text-[11px] text-white/70">
                                            <CheckCircle2 className="w-3.5 h-3.5 text-[#FF5C00] shrink-0 mt-0.5" />
                                            <span>{term}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Digital Seal / Cryptographic Signature Stamp */}
                            <div className="pt-3 border-t border-white/10 flex items-center justify-between flex-wrap gap-2 text-[10px] text-white/50 font-mono">
                                <div className="flex items-center gap-1.5 text-emerald-400">
                                    <ShieldCheck className="w-3.5 h-3.5" />
                                    <span>Digitally Sealed by Mohammed Hussain (Founder, AGS)</span>
                                </div>
                                <span className="truncate max-w-[200px]">SHA256: {selectedDoc.sha256}</span>
                            </div>
                        </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-[11px] text-white/50">
                        <span>Self-hosted repository: Zero third-party cloud lock-in</span>
                        <span className="text-[#FF5C00] font-bold">100% Data Sovereignty</span>
                    </div>
                </div>
            </div>
        </div>
    );
};
