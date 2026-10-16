import React, { useState } from 'react';
import { 
    Sparkles, CheckCircle2, Send, User 
} from 'lucide-react';
import logoImg from '../../assets/logo.jpg';

interface TriageEmail {
    id: string;
    sender: string;
    email: string;
    subject: string;
    snippet: string;
    fullMessage: string;
    timestamp: string;
    priority: 'urgent' | 'normal' | 'filtered';
    tag: string;
    suggestedReply: string;
}

const mockInboxFeed: TriageEmail[] = [
    {
        id: 'inbox-1',
        sender: 'Karthik Ramanathan',
        email: 'karthik@ramanathanbuilds.com',
        subject: 'Inquiry for Interactive 3D Villa Visualizer for our ECR Project',
        snippet: 'We are launching a 14-villa gated enclave on ECR next month and want buyers to interact with...',
        fullMessage: `Hello A Generative Slice Team,

We are launching a 14-villa luxury enclave on ECR, Chennai next month. We saw your Slice3D interactive viewer and would like to know if we can embed this directly on our website so prospective buyers can inspect finishes, room layouts, and exterior lighting from their phones.

Could we schedule a brief scoping call this Thursday afternoon?

Regards,
Karthik Ramanathan
Managing Director, Ramanathan Builders`,
        timestamp: '12 mins ago',
        priority: 'urgent',
        tag: 'High-Value Lead',
        suggestedReply: `Hi Karthik,

Thank you for reaching out! Slice3D is specifically engineered for high-touch real estate launches like your ECR villa enclave, giving prospective buyers smooth 60fps 3D exploration right inside their phone browser.

Thursday afternoon works perfectly for our founding engineering team. I will send across a calendar invite along with a tailored architectural preview.

Looking forward to speaking,
Mohammed Hussain
A Generative Slice`
    },
    {
        id: 'inbox-2',
        sender: 'Divya Menachery',
        email: 'divya@lotusfashion.in',
        subject: 'Clarification regarding GST Invoice for August Milestone',
        snippet: 'Could you please re-issue the GST input credit certificate with our updated tax ID...',
        fullMessage: `Hi Hussain,

Hope all is well. Our accounting department is auditing August expenditures. Could you please share the revised GST invoice reflecting our updated GSTIN?

Thanks,
Divya`,
        timestamp: '1 hour ago',
        priority: 'normal',
        tag: 'Billing & Compliance',
        suggestedReply: `Hi Divya,

Certainly. I have regenerated the signed tax invoice with your updated GSTIN via our SliceDAM system. The verified PDF is attached for your accounting audit.

Best regards,
A Generative Slice Accounts`
    },
    {
        id: 'inbox-3',
        sender: 'Global Domains Special Deals',
        email: 'promo@unsolicitedhostingdeals.biz',
        subject: 'LAST CHANCE: 85% Discount on Off-shore Virtual Dedicated Servers!',
        snippet: 'Do not miss our lowest pricing of the quarter on Linux VPS hosting with unmetered bandwidth...',
        fullMessage: `Dear Webmaster, save 85% on cloud hosting packages! Click here to claim your limited discount coupon code before midnight!`,
        timestamp: '3 hours ago',
        priority: 'filtered',
        tag: 'Automated Noise Filtered',
        suggestedReply: 'Auto-archived by SliceInbox AI rules engine. Zero staff attention required.'
    }
];

export const SliceInboxShowcase: React.FC = () => {
    const [selectedEmail, setSelectedEmail] = useState<TriageEmail>(mockInboxFeed[0]);
    const [filter, setFilter] = useState<'all' | 'urgent' | 'normal'>('all');
    const [isApproved, setIsApproved] = useState(false);

    const filteredEmails = filter === 'all' 
        ? mockInboxFeed 
        : mockInboxFeed.filter(m => m.priority === filter);

    const handleSelectEmail = (email: TriageEmail) => {
        setSelectedEmail(email);
        setIsApproved(false);
    };

    return (
        <div className="w-full rounded-3xl border border-white/10 bg-[#0F172A] overflow-hidden shadow-2xl flex flex-col">
            {/* Header */}
            <div className="px-5 py-4 border-b border-white/10 bg-[#0B0F17]/90 backdrop-blur flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center gap-3">
                    <img src={logoImg} alt="AGS Logo" className="w-8 h-8 rounded-full border border-[#FF5C00]/40 object-cover" />
                    <div>
                        <div className="flex items-center gap-2">
                            <span className="font-bold text-sm text-white font-heading">SliceInbox Chief of Staff</span>
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#FF5C00]/20 text-[#FF5C00] border border-[#FF5C00]/30">
                                24/7 Triage Engine
                            </span>
                        </div>
                        <p className="text-[11px] text-white/50">Auto-sorts noise, prioritizes high-value inquiries & drafts responses</p>
                    </div>
                </div>

                <div className="flex items-center gap-2 text-xs font-mono text-white/70">
                    <span className="flex items-center gap-1.5 text-emerald-400">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Self-Hosted Privacy
                    </span>
                    <span className="text-white/20">|</span>
                    <span>Zero Data Leakage</span>
                </div>
            </div>

            {/* Sub-header Filter Tabs */}
            <div className="px-6 py-3 bg-[#0B0F17]/50 border-b border-white/10 flex items-center gap-2 text-xs">
                <button
                    onClick={() => setFilter('all')}
                    className={`px-3 py-1.5 rounded-xl font-medium transition-colors ${
                        filter === 'all' ? 'bg-[#FF5C00] text-white' : 'bg-white/5 text-white/60 hover:text-white'
                    }`}
                >
                    All Messages ({mockInboxFeed.length})
                </button>
                <button
                    onClick={() => setFilter('urgent')}
                    className={`px-3 py-1.5 rounded-xl font-medium transition-colors ${
                        filter === 'urgent' ? 'bg-[#FF5C00] text-white' : 'bg-white/5 text-white/60 hover:text-white'
                    }`}
                >
                    Urgent Leads (1)
                </button>
                <button
                    onClick={() => setFilter('normal')}
                    className={`px-3 py-1.5 rounded-xl font-medium transition-colors ${
                        filter === 'normal' ? 'bg-[#FF5C00] text-white' : 'bg-white/5 text-white/60 hover:text-white'
                    }`}
                >
                    Operations (1)
                </button>
            </div>

            {/* Split Screen Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-12 flex-grow min-h-[440px]">
                {/* Inbox List Column */}
                <div className="lg:col-span-5 border-b lg:border-b-0 lg:border-r border-white/10 divide-y divide-white/5 bg-[#0B0F17]/20">
                    {filteredEmails.map((email) => (
                        <div
                            key={email.id}
                            onClick={() => handleSelectEmail(email)}
                            className={`p-4 cursor-pointer transition-colors ${
                                selectedEmail.id === email.id
                                    ? 'bg-white/10 border-l-4 border-l-[#FF5C00]'
                                    : 'hover:bg-white/[0.03]'
                            }`}
                        >
                            <div className="flex items-center justify-between mb-1">
                                <span className="font-bold text-xs text-white">{email.sender}</span>
                                <span className="text-[10px] text-white/40 font-mono">{email.timestamp}</span>
                            </div>

                            <div className="text-xs font-semibold text-white/90 truncate mb-1">
                                {email.subject}
                            </div>

                            <p className="text-[11px] text-white/50 line-clamp-1 mb-2">
                                {email.snippet}
                            </p>

                            <div className="flex items-center gap-2">
                                <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                                    email.priority === 'urgent'
                                        ? 'bg-[#FF5C00]/20 text-[#FF5C00] border border-[#FF5C00]/30'
                                        : email.priority === 'normal'
                                            ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                                            : 'bg-white/10 text-white/40'
                                }`}>
                                    {email.tag}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Email & AI Draft Review Column */}
                <div className="lg:col-span-7 p-6 flex flex-col justify-between bg-[#0F172A]">
                    <div>
                        {/* Header details */}
                        <div className="pb-4 border-b border-white/10 mb-4">
                            <div className="flex items-center justify-between gap-2 mb-2">
                                <h4 className="text-sm font-bold text-white font-heading">{selectedEmail.subject}</h4>
                                <span className="text-[10px] font-mono text-white/40">{selectedEmail.timestamp}</span>
                            </div>
                            <div className="text-xs text-white/60 flex items-center gap-2">
                                <User className="w-3.5 h-3.5 text-[#FF5C00]" />
                                <span>{selectedEmail.sender}</span>
                                <span className="text-white/30">&lt;{selectedEmail.email}&gt;</span>
                            </div>
                        </div>

                        {/* Customer Email Body */}
                        <div className="text-xs text-white/80 bg-[#0B0F17] p-4 rounded-2xl border border-white/5 leading-relaxed whitespace-pre-line mb-4 font-sans">
                            {selectedEmail.fullMessage}
                        </div>

                        {/* AI Suggested Response Box */}
                        <div className="rounded-2xl border border-[#FF5C00]/30 bg-gradient-to-b from-[#FF5C00]/10 to-transparent p-4">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-xs font-bold text-[#FF5C00] flex items-center gap-1.5 font-heading">
                                    <Sparkles className="w-3.5 h-3.5" /> AI Chief of Staff Drafted Reply
                                </span>
                                <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
                                    Confidence: 99%
                                </span>
                            </div>

                            <p className="text-xs text-white/90 whitespace-pre-line leading-relaxed font-sans bg-black/40 p-3 rounded-xl border border-white/5">
                                {selectedEmail.suggestedReply}
                            </p>
                        </div>
                    </div>

                    {/* Bottom Action Footer */}
                    <div className="mt-5 pt-4 border-t border-white/10 flex items-center justify-between flex-wrap gap-4">
                        <span className="text-[11px] text-white/50">
                            Human review guarantee: Nothing sends until your team clicks approve.
                        </span>

                        <button
                            onClick={() => setIsApproved(true)}
                            disabled={isApproved || selectedEmail.priority === 'filtered'}
                            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                                isApproved
                                    ? 'bg-emerald-500 text-white'
                                    : 'bg-[#FF5C00] hover:bg-[#FF8C1A] text-white shadow-lg shadow-[#FF5C00]/20 disabled:opacity-40'
                            }`}
                        >
                            {isApproved ? (
                                <>
                                    <CheckCircle2 className="w-3.5 h-3.5" /> Approved & Dispatched
                                </>
                            ) : (
                                <>
                                    <Send className="w-3.5 h-3.5" /> Approve & Send Draft
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
