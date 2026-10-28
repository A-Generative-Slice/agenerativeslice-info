import React, { useState, useEffect } from 'react';
import { GitBranch, GitCommit, ExternalLink, Copy, Check, RefreshCw } from 'lucide-react';
import { fetchLiveRepoStatus, type RepoSyncStatus, FALLBACK_REPO_DATA } from '../services/repoSyncService';

interface RepoSyncBarProps {
    repoName: string;
    onSyncComplete?: (status: RepoSyncStatus) => void;
}

export const RepoSyncBar: React.FC<RepoSyncBarProps> = ({ repoName, onSyncComplete }) => {
    const [status, setStatus] = useState<RepoSyncStatus>(FALLBACK_REPO_DATA[repoName] || {
        repoName,
        orgName: 'A-Generative-Slice',
        sha: 'main',
        fullSha: 'main',
        message: 'Tracking repository main branch',
        author: 'A-Generative-Slice',
        date: 'Connecting...',
        rawDate: '',
        htmlUrl: `https://github.com/A-Generative-Slice/${repoName}`,
        commitUrl: `https://github.com/A-Generative-Slice/${repoName}/commits/main`,
        cloneUrl: `https://github.com/A-Generative-Slice/${repoName}.git`,
        rawBaseUrl: `https://raw.githubusercontent.com/A-Generative-Slice/${repoName}/main`,
        isLive: true,
        lastSyncedAt: new Date().toLocaleTimeString()
    });
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [copied, setCopied] = useState(false);

    const loadStatus = async () => {
        setIsRefreshing(true);
        try {
            const data = await fetchLiveRepoStatus(repoName);
            setStatus(data);
            if (onSyncComplete) onSyncComplete(data);
        } finally {
            setTimeout(() => setIsRefreshing(false), 400);
        }
    };

    useEffect(() => {
        loadStatus();
    }, [repoName]);

    const handleCopyClone = () => {
        navigator.clipboard.writeText(status.cloneUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="mb-6 p-4 rounded-2xl border border-black/10 dark:border-white/10 bg-white/70 dark:bg-[#111111]/80 backdrop-blur-xl shadow-lg transition-all">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
                {/* Left: Live status & commit info */}
                <div className="flex items-start sm:items-center gap-3">
                    <div className="flex items-center gap-2 shrink-0 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-semibold">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        <span>Live Synced</span>
                    </div>

                    <div className="flex items-center gap-2 flex-wrap text-xs text-[#0F172A] dark:text-white/80">
                        <span className="font-mono px-2 py-0.5 rounded bg-black/5 dark:bg-white/10 text-[#FF5C00] font-bold">
                            {status.repoName}
                        </span>
                        <span className="text-[#64748B] dark:text-white/40 flex items-center gap-1 font-mono">
                            <GitBranch className="w-3.5 h-3.5" /> main
                        </span>
                        <a 
                            href={status.commitUrl} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="font-mono text-xs text-orange-500 hover:underline flex items-center gap-1 font-semibold"
                            title={`Commit: ${status.fullSha}`}
                        >
                            <GitCommit className="w-3.5 h-3.5" /> {status.sha}
                        </a>
                        <span className="hidden sm:inline text-[#64748B] dark:text-white/30">•</span>
                        <span className="truncate max-w-[280px] sm:max-w-[360px] text-[#64748B] dark:text-white/60 italic" title={status.message}>
                            "{status.message}"
                        </span>
                        <span className="text-[11px] text-[#64748B] dark:text-white/40">
                            ({status.date})
                        </span>
                    </div>
                </div>

                {/* Right: Actions */}
                <div className="flex items-center gap-2 self-end lg:self-auto shrink-0">
                    <button
                        onClick={loadStatus}
                        disabled={isRefreshing}
                        className="px-2.5 py-1.5 rounded-lg border border-black/5 dark:border-white/10 text-[11px] font-semibold text-[#0F172A] dark:text-white/70 hover:text-[#FF5C00] hover:border-[#FF5C00]/30 transition-all flex items-center gap-1.5"
                        title="Re-query live GitHub status"
                    >
                        <RefreshCw className={`w-3 h-3 ${isRefreshing ? 'animate-spin text-[#FF5C00]' : ''}`} />
                        <span>Sync</span>
                    </button>

                    <button
                        onClick={handleCopyClone}
                        className="px-2.5 py-1.5 rounded-lg border border-black/5 dark:border-white/10 text-[11px] font-semibold text-[#0F172A] dark:text-white/70 hover:text-[#FF5C00] hover:border-[#FF5C00]/30 transition-all flex items-center gap-1.5"
                        title={`Copy: ${status.cloneUrl}`}
                    >
                        {copied ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                        <span>{copied ? 'Copied' : 'Clone'}</span>
                    </button>

                    <a
                        href="https://agenerativeslice.com/products"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1.5 rounded-lg bg-[#FF5C00] text-white text-[11px] font-bold hover:bg-[#FF8C1A] transition-all flex items-center gap-1 shadow-sm font-heading"
                    >
                        <span>Official Studio Hub</span>
                        <ExternalLink className="w-3 h-3" />
                    </a>
                </div>
            </div>
        </div>
    );
};
