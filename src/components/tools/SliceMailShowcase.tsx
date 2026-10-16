import React, { useState } from 'react';
import { 
    Mail, Send, CheckCircle2, ShieldCheck, RefreshCw 
} from 'lucide-react';
import logoImg from '../../assets/logo.jpg';

type OutreachMode = 'pitch' | 'keep-informed';

export const SliceMailShowcase: React.FC = () => {
    const [mode, setMode] = useState<OutreachMode>('pitch');
    const [recipientName, setRecipientName] = useState('Sundar');
    const [recipientCompany, setRecipientCompany] = useState('Horizon Real Estate');
    const [customDetail, setCustomDetail] = useState('new coastal villa development in ECR');
    const [isSendingBatch, setIsSendingBatch] = useState(false);
    const [sentCount, setSentCount] = useState(240);

    const handleSendTestBatch = () => {
        setIsSendingBatch(true);
        setTimeout(() => {
            setSentCount(prev => Math.min(prev + 40, 400));
            setIsSendingBatch(false);
        }, 1000);
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
A Generative Slice — Chennai`;
        } else {
            return `Hi ${recipientName},

Here is your scheduled milestone update for ${recipientCompany}:

• Milestone: Frontend interactive prototype deployed to staging
• Deliverable: ${customDetail}
• Deliverability / Speed: 99.4% SLA maintained
• Next Step: Final approval before domain go-live on Friday

We keep your team informed at every step so you are never left guessing. Let me know if you need any adjustments before tomorrow's review.

Best regards,
A Generative Slice Engineering Team`;
        }
    };

    return (
        <div className="w-full rounded-3xl border border-white/10 bg-[#0F172A] overflow-hidden shadow-2xl flex flex-col">
            {/* Header */}
            <div className="px-5 py-4 border-b border-white/10 bg-[#0B0F17]/90 backdrop-blur flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center gap-3">
                    <img src={logoImg} alt="AGS Logo" className="w-8 h-8 rounded-full border border-[#FF5C00]/40 object-cover" />
                    <div>
                        <div className="flex items-center gap-2">
                            <span className="font-bold text-sm text-white font-heading">SliceMail Smart Dispatcher</span>
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#FF5C00]/20 text-[#FF5C00] border border-[#FF5C00]/30">
                                400+ Mails / Day Engine
                            </span>
                        </div>
                        <p className="text-[11px] text-white/50">Custom automated pitches & client-update outreach</p>
                    </div>
                </div>

                <div className="flex items-center gap-2 text-xs font-mono text-white/70">
                    <span className="flex items-center gap-1.5 text-emerald-400">
                        <ShieldCheck className="w-3.5 h-3.5" /> 99.4% Inbox Rate
                    </span>
                    <span className="text-white/20">|</span>
                    <span>DKIM/SPF Certified</span>
                </div>
            </div>

            {/* Mode Switcher */}
            <div className="p-5 bg-[#0B0F17]/40 border-b border-white/10 flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setMode('pitch')}
                        className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                            mode === 'pitch'
                                ? 'bg-[#FF5C00] text-white shadow-lg shadow-[#FF5C00]/20'
                                : 'bg-white/5 text-white/60 hover:text-white hover:bg-white/10'
                        }`}
                    >
                        Cold Pitch Mode (New Prospects)
                    </button>
                    <button
                        onClick={() => setMode('keep-informed')}
                        className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                            mode === 'keep-informed'
                                ? 'bg-[#FF5C00] text-white shadow-lg shadow-[#FF5C00]/20'
                                : 'bg-white/5 text-white/60 hover:text-white hover:bg-white/10'
                        }`}
                    >
                        Client Update Mode (Keep Informed)
                    </button>
                </div>

                {/* 400 Mails Daily Quota Tracker */}
                <div className="flex items-center gap-3">
                    <div className="text-right">
                        <div className="text-[10px] font-mono text-white/50 uppercase">Daily Outgoing Pacing</div>
                        <div className="text-xs font-bold text-white font-mono">
                            <span className="text-[#FF5C00]">{sentCount}</span> / 400 Mails Sent Today
                        </div>
                    </div>
                    <div className="w-24 bg-white/10 h-2 rounded-full overflow-hidden">
                        <div 
                            className="bg-gradient-to-r from-[#FF5C00] to-[#FF8C1A] h-full rounded-full transition-all duration-500"
                            style={{ width: `${(sentCount / 400) * 100}%` }}
                        />
                    </div>
                </div>
            </div>

            {/* Split Screen: Dynamic Input Fields vs Live Rendered Email */}
            <div className="grid grid-cols-1 lg:grid-cols-12 flex-grow">
                {/* Inputs Column */}
                <div className="lg:col-span-5 p-6 border-b lg:border-b-0 lg:border-r border-white/10 space-y-4 bg-[#0B0F17]/30">
                    <div className="text-xs font-bold uppercase tracking-wider text-white/60 font-heading mb-1">
                        Personalization Variables
                    </div>

                    <div>
                        <label className="block text-[11px] text-white/50 mb-1">Recipient Name</label>
                        <input
                            type="text"
                            value={recipientName}
                            onChange={(e) => setRecipientName(e.target.value)}
                            className="w-full bg-[#0F172A] border border-white/15 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-[#FF5C00]"
                        />
                    </div>

                    <div>
                        <label className="block text-[11px] text-white/50 mb-1">Company / Brand Name</label>
                        <input
                            type="text"
                            value={recipientCompany}
                            onChange={(e) => setRecipientCompany(e.target.value)}
                            className="w-full bg-[#0F172A] border border-white/15 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-[#FF5C00]"
                        />
                    </div>

                    <div>
                        <label className="block text-[11px] text-white/50 mb-1">
                            {mode === 'pitch' ? 'Relevant Project / Focus' : 'Current Project Milestone'}
                        </label>
                        <input
                            type="text"
                            value={customDetail}
                            onChange={(e) => setCustomDetail(e.target.value)}
                            className="w-full bg-[#0F172A] border border-white/15 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-[#FF5C00]"
                        />
                    </div>

                    {/* Deliverability Health Card */}
                    <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 space-y-2 mt-4">
                        <div className="flex items-center justify-between text-xs">
                            <span className="text-white/60">Spam Check Score:</span>
                            <span className="font-bold text-emerald-400 font-mono">0.02 / 10.0 (Perfect)</span>
                        </div>
                        <div className="flex items-center justify-between text-xs">
                            <span className="text-white/60">Dispatch Interval:</span>
                            <span className="font-mono text-white/80">90s Human Cadence</span>
                        </div>
                        <div className="flex items-center justify-between text-xs">
                            <span className="text-white/60">Mailbox Provider:</span>
                            <span className="font-mono text-white/80">Zoho / GSuite Direct</span>
                        </div>
                    </div>

                    <button
                        onClick={handleSendTestBatch}
                        disabled={isSendingBatch}
                        className="w-full py-2.5 px-4 rounded-xl bg-[#FF5C00] hover:bg-[#FF8C1A] text-white font-bold text-xs flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                    >
                        {isSendingBatch ? (
                            <>
                                <RefreshCw className="w-4 h-4 animate-spin" /> Dispatching Paced Batch...
                            </>
                        ) : (
                            <>
                                <Send className="w-4 h-4" /> Simulate Sending Next 40 Mails
                            </>
                        )}
                    </button>
                </div>

                {/* Live Email Preview Column */}
                <div className="lg:col-span-7 p-6 flex flex-col justify-between bg-[#0F172A]">
                    <div>
                        <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-4">
                            <div className="flex items-center gap-2 text-xs text-white/70">
                                <Mail className="w-4 h-4 text-[#FF5C00]" />
                                <span className="font-semibold text-white">Live Outgoing Message Preview</span>
                            </div>
                            <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                                Ready for Inbox
                            </span>
                        </div>

                        {/* Email Client UI Mockup */}
                        <div className="rounded-2xl bg-[#0B0F17] border border-white/10 p-5 space-y-3 font-sans">
                            <div className="text-xs text-white/60 flex items-center gap-2 pb-2 border-b border-white/5">
                                <span className="w-16 font-mono text-white/40">Subject:</span>
                                <span className="text-white font-medium">{getEmailSubject()}</span>
                            </div>
                            <div className="text-xs text-white/60 flex items-center gap-2 pb-2 border-b border-white/5">
                                <span className="w-16 font-mono text-white/40">From:</span>
                                <span className="text-white font-mono">Mohammed Hussain &lt;smdhussain@agenerativeslice.com&gt;</span>
                            </div>
                            <div className="text-xs text-white/60 flex items-center gap-2 pb-2 border-b border-white/5">
                                <span className="w-16 font-mono text-white/40">To:</span>
                                <span className="text-white font-mono">{recipientName.toLowerCase()}@{recipientCompany.toLowerCase().replace(/\s+/g, '')}.com</span>
                            </div>

                            {/* Body */}
                            <div className="pt-2 text-xs text-white/90 whitespace-pre-line leading-relaxed font-sans">
                                {getEmailBody()}
                            </div>
                        </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-[11px] text-white/50">
                        <span>Pacing: 400 individualized messages per 24 hours</span>
                        <span className="text-emerald-400 flex items-center gap-1 font-mono">
                            <CheckCircle2 className="w-3 h-3" /> Zero bounce recorded
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};
