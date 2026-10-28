import { useState } from 'react';
import { 
    Mail, Send, ShieldCheck, RefreshCw, 
    FileCode, ExternalLink 
} from 'lucide-react';
import { RepoSyncBar } from '../RepoSyncBar';

type OutreachMode = 'pitch' | 'keep-informed';

export const SliceMailShowcase: React.FC = () => {
    const [mode, setMode] = useState<OutreachMode>('pitch');
    const [recipientName, setRecipientName] = useState('Sundar');
    const [recipientCompany, setRecipientCompany] = useState('Horizon Real Estate');
    const [customDetail, setCustomDetail] = useState('new coastal villa development in ECR');
    const [isSendingBatch, setIsSendingBatch] = useState(false);
    const [sentCount, setSentCount] = useState(240);
    const spamScore = 0.2; // out of 10 (lower is better)

    const handleSendTestBatch = () => {
        setIsSendingBatch(true);
        setTimeout(() => {
            setSentCount(prev => Math.min(prev + 40, 400));
            setIsSendingBatch(false);
        }, 800);
    };

    const getEmailSubject = () => {
        if (mode === 'pitch') {
            return `Quick question regarding ${recipientCompany}'s ${customDetail}`;
        }
        return `Weekly Milestone Update: Progress report for ${recipientCompany}`;
    };

    const getEmailBody = () => {
        if (mode === 'pitch') {
            return `Hi ${recipientName},

I came across ${recipientCompany}'s recent work on the ${customDetail}. The architectural lines and attention to natural lighting are remarkable.

We build custom 3D web showcases and automated client portals for leading firms in Chennai. Our interactive models let prospective buyers tour finishes and layouts directly in their phone browser without installing any app.

Would you be open to a 5-minute walkthrough of how we helped similar teams shorten their buyer decision cycle?

Warm regards,
Mohammed Hussain
Director, A Generative Slice — Chennai
smdhussain@agenerativeslice.com | +91 78128 91494`;
        } else {
            return `Hi ${recipientName},

Here is your scheduled milestone update for ${recipientCompany}:

• Milestone: Frontend interactive prototype deployed to staging
• Deliverable: ${customDetail}
• Deliverability / Speed: 99.4% SLA maintained
• Next Step: Final approval before domain go-live on Friday

We keep your team informed at every step so you are never left guessing. Let me know if you need any adjustments before tomorrow's review.

Best regards,
A Generative Slice Engineering Team
Chennai, India`;
        }
    };

    return (
        <div>
            {/* Live GitHub Repository Sync Bar */}
            <RepoSyncBar repoName="SliceMail" />

            <div className="rounded-3xl border border-black/10 dark:border-white/10 bg-white dark:bg-[#111] overflow-hidden shadow-2xl flex flex-col">
                {/* Header */}
                <div className="px-6 py-4 border-b border-black/5 dark:border-white/10 bg-black/[0.02] dark:bg-white/[0.02] flex items-center justify-between flex-wrap gap-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-[#FF5C00]/10 border border-[#FF5C00]/20 flex items-center justify-center text-[#FF5C00]">
                            <Mail className="w-5 h-5" />
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <span className="font-bold text-sm text-[#0F172A] dark:text-white font-heading">
                                    SliceMail Outreach & Notification Engine
                                </span>
                                <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-bold bg-[#FF5C00]/10 text-[#FF5C00] border border-[#FF5C00]/20">
                                    400+ Mails / Day Rate
                                </span>
                            </div>
                            <p className="text-[11px] text-[#64748B] dark:text-white/50">
                                Powered by Google Apps Script (<code className="font-mono text-[#FF5C00]">Code.gs</code>) + Vanilla JavaScript sidebar
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 text-xs font-mono">
                        <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-bold">
                            <ShieldCheck className="w-4 h-4" /> 99.4% Primary Inbox Rate
                        </span>
                        <span className="text-[#64748B] dark:text-white/30">•</span>
                        <span className="text-[#64748B] dark:text-white/60">DKIM / SPF Certified</span>
                    </div>
                </div>

                {/* Mode Selector */}
                <div className="p-6 bg-black/[0.01] dark:bg-white/[0.01] border-b border-black/5 dark:border-white/10 flex items-center justify-between flex-wrap gap-4">
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setMode('pitch')}
                            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                                mode === 'pitch'
                                    ? 'bg-[#FF5C00] text-white shadow-md shadow-[#FF5C00]/20'
                                    : 'bg-black/5 dark:bg-white/5 text-[#64748B] dark:text-white/60 hover:text-[#0F172A] dark:hover:text-white'
                            }`}
                        >
                            Cold Pitch Mode (New Prospects)
                        </button>
                        <button
                            onClick={() => setMode('keep-informed')}
                            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                                mode === 'keep-informed'
                                    ? 'bg-[#FF5C00] text-white shadow-md shadow-[#FF5C00]/20'
                                    : 'bg-black/5 dark:bg-white/5 text-[#64748B] dark:text-white/60 hover:text-[#0F172A] dark:hover:text-white'
                            }`}
                        >
                            Client Update Mode (Keep Informed)
                        </button>
                    </div>

                    {/* Daily Throughput Gauge */}
                    <div className="flex items-center gap-3">
                        <div className="text-right">
                            <span className="text-[10px] text-[#64748B] dark:text-white/40 uppercase tracking-widest block font-bold">
                                Daily Quota Dispatched
                            </span>
                            <span className="text-xs font-mono font-bold text-[#FF5C00]">
                                {sentCount} / 400 Emails
                            </span>
                        </div>
                        <div className="w-28 h-2.5 rounded-full bg-black/10 dark:bg-white/10 overflow-hidden">
                            <div 
                                className="h-full bg-gradient-to-r from-[#FF5C00] to-[#FF8C1A] transition-all duration-500 rounded-full"
                                style={{ width: `${(sentCount / 400) * 100}%` }}
                            />
                        </div>
                    </div>
                </div>

                {/* Main Split: Form Inputs vs Live Rendered Email */}
                <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-black/5 dark:divide-white/10">
                    {/* Inputs */}
                    <div className="lg:col-span-5 p-6 space-y-4">
                        <span className="text-xs font-bold uppercase tracking-wider text-[#FF5C00] block font-heading">
                            Dynamic Merge Variables
                        </span>

                        <div>
                            <label className="text-[11px] font-semibold text-[#64748B] dark:text-white/60 block mb-1">
                                Prospect / Client Name
                            </label>
                            <input
                                type="text"
                                value={recipientName}
                                onChange={(e) => setRecipientName(e.target.value)}
                                className="w-full px-3.5 py-2 rounded-xl border border-black/10 dark:border-white/10 bg-black/[0.02] dark:bg-white/[0.03] text-xs text-[#0F172A] dark:text-white focus:outline-none focus:border-[#FF5C00]"
                            />
                        </div>

                        <div>
                            <label className="text-[11px] font-semibold text-[#64748B] dark:text-white/60 block mb-1">
                                Company / Firm Name
                            </label>
                            <input
                                type="text"
                                value={recipientCompany}
                                onChange={(e) => setRecipientCompany(e.target.value)}
                                className="w-full px-3.5 py-2 rounded-xl border border-black/10 dark:border-white/10 bg-black/[0.02] dark:bg-white/[0.03] text-xs text-[#0F172A] dark:text-white focus:outline-none focus:border-[#FF5C00]"
                            />
                        </div>

                        <div>
                            <label className="text-[11px] font-semibold text-[#64748B] dark:text-white/60 block mb-1">
                                Specific Observation / Milestone Context
                            </label>
                            <textarea
                                value={customDetail}
                                onChange={(e) => setCustomDetail(e.target.value)}
                                rows={3}
                                className="w-full px-3.5 py-2 rounded-xl border border-black/10 dark:border-white/10 bg-black/[0.02] dark:bg-white/[0.03] text-xs text-[#0F172A] dark:text-white focus:outline-none focus:border-[#FF5C00]"
                            />
                        </div>

                        {/* Spam Score Audit */}
                        <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-800 dark:text-emerald-300 space-y-1">
                            <div className="flex items-center justify-between font-bold">
                                <span>Deliverability Audit Score</span>
                                <span className="font-mono text-emerald-600 dark:text-emerald-400">{spamScore} / 10.0 (Flawless)</span>
                            </div>
                            <p className="text-[11px] opacity-80">
                                Zero spam buzzwords detected. Clean domain reputation headers verified.
                            </p>
                        </div>

                        <button
                            onClick={handleSendTestBatch}
                            disabled={isSendingBatch || sentCount >= 400}
                            className="w-full py-3 rounded-xl bg-[#FF5C00] text-white text-xs font-bold hover:bg-[#FF8C1A] transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#FF5C00]/25 disabled:opacity-50"
                        >
                            {isSendingBatch ? (
                                <>
                                    <RefreshCw className="w-4 h-4 animate-spin" />
                                    <span>Dispatching 40 Personalized Emails...</span>
                                </>
                            ) : (
                                <>
                                    <Send className="w-4 h-4" />
                                    <span>Dispatch Next Test Batch (+40)</span>
                                </>
                            )}
                        </button>
                    </div>

                    {/* Live Rendered Email Preview */}
                    <div className="lg:col-span-7 p-6 bg-black/[0.02] dark:bg-white/[0.01]">
                        <span className="text-xs font-bold uppercase tracking-wider text-[#FF5C00] block mb-3 font-heading">
                            Client-Side Preview (Exact Recipient View)
                        </span>

                        <div className="rounded-2xl border border-black/10 dark:border-white/10 bg-white dark:bg-[#161616] p-5 shadow-sm space-y-3">
                            <div className="border-b border-black/5 dark:border-white/10 pb-3 space-y-1.5 text-xs">
                                <div className="flex items-center gap-2">
                                    <span className="text-[#64748B] dark:text-white/40 font-semibold w-16">Subject:</span>
                                    <span className="font-bold text-[#0F172A] dark:text-white">{getEmailSubject()}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-[#64748B] dark:text-white/40 font-semibold w-16">From:</span>
                                    <span className="text-[#0F172A] dark:text-white font-mono">Mohammed Hussain &lt;smdhussain@agenerativeslice.com&gt;</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-[#64748B] dark:text-white/40 font-semibold w-16">To:</span>
                                    <span className="text-[#0F172A] dark:text-white font-mono">{recipientName.toLowerCase()}@{recipientCompany.toLowerCase().replace(/\s+/g, '')}.com</span>
                                </div>
                            </div>

                            <div className="py-2 text-xs text-[#0F172A] dark:text-white/90 whitespace-pre-wrap leading-relaxed font-sans">
                                {getEmailBody()}
                            </div>
                        </div>

                        {/* Code Link */}
                        <div className="mt-4 flex items-center justify-between text-xs text-[#64748B] dark:text-white/50">
                            <span className="font-mono flex items-center gap-1.5">
                                <FileCode className="w-3.5 h-3.5 text-[#FF5C00]" />
                                <span>SliceMail/Code.gs (Apps Script Engine)</span>
                            </span>
                            <a
                                href="https://github.com/A-Generative-Slice/SliceMail/blob/main/Code.gs"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-[#FF5C00] hover:underline flex items-center gap-1 font-semibold"
                            >
                                <span>Inspect Code.gs</span>
                                <ExternalLink className="w-3 h-3" />
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
