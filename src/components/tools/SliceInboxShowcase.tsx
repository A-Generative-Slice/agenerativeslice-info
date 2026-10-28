import { useState } from 'react';
import { 
    Inbox, CheckCircle2, FileText, ExternalLink, Bot
} from 'lucide-react';
import { RepoSyncBar } from '../RepoSyncBar';

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
    aiConfidence: string;
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
        tag: 'High-Value Inbound Lead',
        aiConfidence: '98.7% Triage Match',
        suggestedReply: `Hi Karthik,

Thank you for reaching out! Slice3D is specifically engineered for high-touch real estate launches like your ECR villa enclave, giving prospective buyers smooth 60fps 3D exploration right inside their phone browser.

Thursday afternoon works perfectly for our founding engineering team. I will send across a calendar invite along with a tailored architectural preview.

Looking forward to speaking,
Mohammed Hussain
Director, A Generative Slice`
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
        aiConfidence: '99.2% Triage Match',
        suggestedReply: `Hi Divya,

Certainly. I have regenerated the signed tax invoice with your updated GSTIN via our SliceDAM system. The verified PDF is attached for your accounting audit.

Best regards,
A Generative Slice Accounts`
    },
    {
        id: 'inbox-3',
        sender: 'Global Domains Deals',
        email: 'promo@unsolicitedhostingdeals.biz',
        subject: 'LAST CHANCE: 85% Discount on Off-shore Virtual Dedicated Servers!',
        snippet: 'Do not miss our lowest pricing of the quarter on Linux VPS hosting with unmetered bandwidth...',
        fullMessage: `Dear Webmaster, save 85% on cloud hosting packages! Click here to claim your limited discount coupon code before midnight!`,
        timestamp: '3 hours ago',
        priority: 'filtered',
        tag: 'Automated Noise Suppressed',
        aiConfidence: '99.9% Spam Classification',
        suggestedReply: 'Auto-archived by SliceInbox FastMCP rules engine. Zero staff attention required.'
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
        <div>
            {/* Live GitHub Repository Sync Bar */}
            <RepoSyncBar repoName="SliceInbox" />

            <div className="rounded-3xl border border-black/10 dark:border-white/10 bg-white dark:bg-[#111] overflow-hidden shadow-2xl flex flex-col">
                {/* Header */}
                <div className="px-6 py-4 border-b border-black/5 dark:border-white/10 bg-black/[0.02] dark:bg-white/[0.02] flex items-center justify-between flex-wrap gap-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-[#FF5C00]/10 border border-[#FF5C00]/20 flex items-center justify-center text-[#FF5C00]">
                            <Inbox className="w-5 h-5" />
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <span className="font-bold text-sm text-[#0F172A] dark:text-white font-heading">
                                    SliceInbox FastMCP AI Chief of Staff
                                </span>
                                <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-bold bg-[#FF5C00]/10 text-[#FF5C00] border border-[#FF5C00]/20">
                                    24/7 Zero Noise Engine
                                </span>
                            </div>
                            <p className="text-[11px] text-[#64748B] dark:text-white/50">
                                Autonomous email classifier with human-in-the-loop dispatch review
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-semibold px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                            FastMCP Server Active
                        </span>
                    </div>
                </div>

                {/* Filter Sub-Bar */}
                <div className="px-6 py-3 bg-black/[0.01] dark:bg-white/[0.01] border-b border-black/5 dark:border-white/10 flex items-center justify-between flex-wrap gap-3">
                    <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold text-[#64748B] dark:text-white/40 mr-2 uppercase tracking-widest text-[10px]">
                            Filter Feed:
                        </span>
                        {(['all', 'urgent', 'normal'] as const).map((mode) => (
                            <button
                                key={mode}
                                onClick={() => setFilter(mode)}
                                className={`px-3 py-1 rounded-lg text-xs font-semibold capitalize transition-all ${
                                    filter === mode
                                        ? 'bg-[#FF5C00] text-white shadow-sm'
                                        : 'bg-black/5 dark:bg-white/5 text-[#64748B] dark:text-white/60 hover:text-[#0F172A] dark:hover:text-white'
                                }`}
                            >
                                {mode}
                            </button>
                        ))}
                    </div>

                    <div className="text-xs text-[#64748B] dark:text-white/40 font-mono">
                        Rulebook: <code className="text-[#FF5C00]">agent_instructions.md</code>
                    </div>
                </div>

                {/* Main Split: Inboxes List vs AI Decision Inspector */}
                <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-black/5 dark:divide-white/10">
                    {/* Emails List */}
                    <div className="lg:col-span-5 divide-y divide-black/5 dark:divide-white/5 max-h-[560px] overflow-y-auto">
                        {filteredEmails.map((email) => (
                            <div
                                key={email.id}
                                onClick={() => handleSelectEmail(email)}
                                className={`p-5 cursor-pointer transition-all ${
                                    selectedEmail.id === email.id
                                        ? 'bg-[#FF5C00]/5 border-l-4 border-l-[#FF5C00]'
                                        : 'hover:bg-black/[0.02] dark:hover:bg-white/[0.02]'
                                }`}
                            >
                                <div className="flex items-center justify-between mb-1.5">
                                    <span className="font-bold text-xs text-[#0F172A] dark:text-white">
                                        {email.sender}
                                    </span>
                                    <span className="text-[10px] text-[#64748B] dark:text-white/40 font-mono">
                                        {email.timestamp}
                                    </span>
                                </div>
                                <div className="font-semibold text-xs text-[#0F172A] dark:text-white/90 truncate mb-1">
                                    {email.subject}
                                </div>
                                <p className="text-[11px] text-[#64748B] dark:text-white/50 line-clamp-2 leading-relaxed mb-2.5">
                                    {email.snippet}
                                </p>
                                <div className="flex items-center gap-2">
                                    <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-md ${
                                        email.priority === 'urgent'
                                            ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20'
                                            : email.priority === 'normal'
                                                ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20'
                                                : 'bg-slate-500/10 text-slate-500 border border-slate-500/20'
                                    }`}>
                                        {email.tag}
                                    </span>
                                    <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-mono">
                                        {email.aiConfidence}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Email View & AI Response Studio */}
                    <div className="lg:col-span-7 p-6 space-y-5 bg-black/[0.01] dark:bg-white/[0.01]">
                        {/* Selected Email Card */}
                        <div className="rounded-2xl border border-black/10 dark:border-white/10 bg-white dark:bg-[#161616] p-5 shadow-sm space-y-3">
                            <div className="border-b border-black/5 dark:border-white/10 pb-3 space-y-1 text-xs">
                                <div className="font-bold text-sm text-[#0F172A] dark:text-white">
                                    {selectedEmail.subject}
                                </div>
                                <div className="text-[11px] text-[#64748B] dark:text-white/50 flex items-center justify-between">
                                    <span>From: {selectedEmail.sender} &lt;{selectedEmail.email}&gt;</span>
                                    <span className="font-mono">{selectedEmail.timestamp}</span>
                                </div>
                            </div>
                            <div className="text-xs text-[#0F172A] dark:text-white/80 whitespace-pre-wrap leading-relaxed">
                                {selectedEmail.fullMessage}
                            </div>
                        </div>

                        {/* AI Suggested Reply */}
                        <div className="rounded-2xl border border-orange-500/20 bg-orange-500/5 p-5 space-y-3">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <Bot className="w-4 h-4 text-[#FF5C00]" />
                                    <span className="text-xs font-bold uppercase tracking-wider text-[#FF5C00] font-heading">
                                        FastMCP Suggested Response
                                    </span>
                                </div>
                                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-semibold">
                                    Human-in-the-loop Guardrail
                                </span>
                            </div>

                            <div className="p-3.5 rounded-xl bg-white dark:bg-[#111] border border-black/5 dark:border-white/10 text-xs text-[#0F172A] dark:text-white/90 whitespace-pre-wrap leading-relaxed font-sans">
                                {selectedEmail.suggestedReply}
                            </div>

                            {selectedEmail.priority !== 'filtered' && (
                                <div className="flex items-center gap-3 pt-2">
                                    <button
                                        onClick={() => setIsApproved(true)}
                                        disabled={isApproved}
                                        className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                                            isApproved
                                                ? 'bg-emerald-500 text-white cursor-default'
                                                : 'bg-[#FF5C00] text-white hover:bg-[#FF8C1A] shadow-md shadow-[#FF5C00]/20'
                                        }`}
                                    >
                                        <CheckCircle2 className="w-3.5 h-3.5" />
                                        <span>{isApproved ? 'Approved & Dispatched via FastMCP' : '1-Click Approve & Send'}</span>
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Repo Rules Link */}
                        <div className="flex items-center justify-between text-xs text-[#64748B] dark:text-white/50 pt-2">
                            <span className="font-mono flex items-center gap-1.5">
                                <FileText className="w-3.5 h-3.5 text-[#FF5C00]" />
                                <span>SliceInbox/agent_instructions.md</span>
                            </span>
                            <a
                                href="https://github.com/A-Generative-Slice/SliceInbox/blob/main/agent_instructions.md"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-[#FF5C00] hover:underline flex items-center gap-1 font-semibold"
                            >
                                <span>View Prompt & Rules</span>
                                <ExternalLink className="w-3 h-3" />
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
