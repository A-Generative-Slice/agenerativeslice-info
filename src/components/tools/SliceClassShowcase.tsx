import { useState } from 'react';
import { 
    Play, Pause, CheckCircle2, 
    Smartphone, Volume2, Maximize, ExternalLink, GraduationCap, Award
} from 'lucide-react';
import { RepoSyncBar } from '../RepoSyncBar';

interface Lesson {
    id: string;
    title: string;
    duration: string;
    completed: boolean;
    active: boolean;
}

const mockLessons: Lesson[] = [
    { id: 'l-1', title: '01. Foundational Architecture & Core Philosophy', duration: '12:40', completed: true, active: false },
    { id: 'l-2', title: '02. 3D WebGL Pipeline & Draco Geometry Compression', duration: '18:15', completed: false, active: true },
    { id: 'l-3', title: '03. Local Business Discovery & Phone Verification', duration: '15:20', completed: false, active: false },
    { id: 'l-4', title: '04. Client Dispatch Engine & Paced 400 Mails/Day', duration: '21:05', completed: false, active: false },
    { id: 'l-5', title: '05. FastMCP Mailbox Triage Server & Autonomous Guardrails', duration: '16:30', completed: false, active: false }
];

export const SliceClassShowcase: React.FC = () => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [lessons, setLessons] = useState<Lesson[]>(mockLessons);
    const [currentTime, setCurrentTime] = useState(252); // seconds (04:12)
    const [showOtpModal, setShowOtpModal] = useState(false);
    const [phoneNumber, setPhoneNumber] = useState('+91 78128 91494');
    const [otp, setOtp] = useState('8492');
    const [isLoggedIn, setIsLoggedIn] = useState(true);

    const activeLesson = lessons.find(l => l.active) || lessons[1];

    const togglePlay = () => {
        setIsPlaying(!isPlaying);
    };

    const selectLesson = (id: string) => {
        setLessons(prev => prev.map(l => ({
            ...l,
            active: l.id === id
        })));
        setCurrentTime(0);
        setIsPlaying(true);
    };

    const formatSeconds = (sec: number) => {
        const m = Math.floor(sec / 60);
        const s = sec % 60;
        return `${m < 10 ? '0' : ''}${m}:${s < 10 ? '0' : ''}${s}`;
    };

    return (
        <div>
            {/* Live GitHub Repository Sync Bar */}
            <RepoSyncBar repoName="SliceClass" />

            <div className="rounded-3xl border border-black/10 dark:border-white/10 bg-white dark:bg-[#111] overflow-hidden shadow-2xl flex flex-col">
                {/* Header */}
                <div className="px-6 py-4 border-b border-black/5 dark:border-white/10 bg-black/[0.02] dark:bg-white/[0.02] flex items-center justify-between flex-wrap gap-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-[#FF5C00]/10 border border-[#FF5C00]/20 flex items-center justify-center text-[#FF5C00]">
                            <GraduationCap className="w-5 h-5" />
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <span className="font-bold text-sm text-[#0F172A] dark:text-white font-heading">
                                    SliceClass Monochromatic Academy & Video LMS
                                </span>
                                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#FF5C00]/10 text-[#FF5C00] border border-[#FF5C00]/20">
                                    Phone OTP Login
                                </span>
                            </div>
                            <p className="text-[11px] text-[#64748B] dark:text-white/50">
                                Distraction-free video streaming with zero buffer delays
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="hidden sm:flex items-center gap-2 text-xs font-mono text-[#64748B] dark:text-white/60">
                            <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-bold">
                                <Smartphone className="w-3.5 h-3.5" /> Password-Free OTP
                            </span>
                            <span>•</span>
                            <span>1080p 60FPS</span>
                        </div>

                        <button
                            onClick={() => setShowOtpModal(!showOtpModal)}
                            className="px-3 py-1.5 rounded-xl bg-black/5 dark:bg-white/10 text-xs font-semibold text-[#0F172A] dark:text-white hover:bg-[#FF5C00] hover:text-white transition-all"
                        >
                            {isLoggedIn ? 'Student: Hussain' : 'Log In via OTP'}
                        </button>
                    </div>
                </div>

                {/* OTP Drawer */}
                {showOtpModal && (
                    <div className="p-4 bg-orange-500/5 border-b border-orange-500/20 flex items-center justify-between flex-wrap gap-4 text-xs">
                        <div className="flex items-center gap-3">
                            <Smartphone className="w-5 h-5 text-[#FF5C00]" />
                            <div>
                                <span className="font-bold text-[#0F172A] dark:text-white">One-Tap Phone OTP Authentication</span>
                                <p className="text-[11px] text-[#64748B] dark:text-white/50">Zero forgotten passwords for students or apprentices</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            <input
                                type="text"
                                value={phoneNumber}
                                onChange={(e) => setPhoneNumber(e.target.value)}
                                className="px-3 py-1.5 rounded-lg border border-black/10 dark:border-white/10 bg-white dark:bg-[#111] text-xs font-mono"
                            />
                            <input
                                type="text"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                                className="w-20 px-3 py-1.5 rounded-lg border border-black/10 dark:border-white/10 bg-white dark:bg-[#111] text-xs font-mono text-center tracking-widest text-[#FF5C00] font-bold"
                            />
                            <button
                                onClick={() => {
                                    setIsLoggedIn(true);
                                    setShowOtpModal(false);
                                }}
                                className="px-3 py-1.5 rounded-lg bg-[#FF5C00] text-white text-xs font-bold hover:bg-[#FF8C1A]"
                            >
                                Verify OTP
                            </button>
                        </div>
                    </div>
                )}

                {/* Main Split: Video Player vs Curriculum Syllabus */}
                <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-black/5 dark:divide-white/10">
                    {/* Video Player */}
                    <div className="lg:col-span-8 p-6 flex flex-col justify-between space-y-4">
                        {/* Video Canvas Container */}
                        <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-slate-900 border border-black/10 dark:border-white/10 shadow-2xl flex items-center justify-center group">
                            {/* Ambient Glow */}
                            <div className="absolute inset-0 bg-gradient-to-tr from-[#FF5C00]/10 via-transparent to-blue-500/10 pointer-events-none" />

                            {/* Simulated Video Scene */}
                            <div className="text-center space-y-3 z-10 px-6">
                                <div className="w-14 h-14 rounded-full bg-[#FF5C00] text-white flex items-center justify-center mx-auto shadow-xl shadow-[#FF5C00]/30 cursor-pointer transform group-hover:scale-110 transition-transform" onClick={togglePlay}>
                                    {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 ml-1" />}
                                </div>
                                <h4 className="text-white font-bold text-base font-heading">
                                    {activeLesson.title}
                                </h4>
                                <p className="text-xs text-white/60 font-mono">
                                    Time: {formatSeconds(currentTime)} / {activeLesson.duration}
                                </p>
                            </div>

                            {/* Bottom Video Controls Overlay */}
                            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/90 to-transparent flex items-center justify-between text-white text-xs">
                                <div className="flex items-center gap-3">
                                    <button onClick={togglePlay} className="hover:text-[#FF5C00] transition-colors">
                                        {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                                    </button>
                                    <span className="font-mono text-[11px]">{formatSeconds(currentTime)}</span>
                                </div>

                                {/* Scrubber Bar */}
                                <div className="flex-1 mx-4 h-1 bg-white/20 rounded-full overflow-hidden cursor-pointer">
                                    <div className="h-full bg-[#FF5C00] w-1/4" />
                                </div>

                                <div className="flex items-center gap-3 text-white/70">
                                    <Volume2 className="w-4 h-4" />
                                    <Maximize className="w-4 h-4" />
                                </div>
                            </div>
                        </div>

                        {/* Video Lesson Description */}
                        <div className="p-4 rounded-2xl bg-black/[0.02] dark:bg-white/[0.02] border border-black/5 dark:border-white/10 flex items-center justify-between text-xs text-[#64748B] dark:text-white/60">
                            <div>
                                <span className="font-bold text-[#0F172A] dark:text-white block">Curriculum Blueprint: course_outline.md</span>
                                <span>Module 2: 3D WebGL Pipeline & Draco Geometry Compression</span>
                            </div>
                            <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold font-mono">
                                40% Completed
                            </span>
                        </div>
                    </div>

                    {/* Syllabus Modules */}
                    <div className="lg:col-span-4 p-6 space-y-4">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-bold uppercase tracking-wider text-[#FF5C00] font-heading">
                                Course Outline & Syllabus
                            </span>
                            <span className="text-xs text-[#64748B] dark:text-white/40 font-mono">
                                5 Lessons
                            </span>
                        </div>

                        <div className="space-y-2">
                            {lessons.map((lesson) => (
                                <button
                                    key={lesson.id}
                                    onClick={() => selectLesson(lesson.id)}
                                    className={`w-full text-left p-3.5 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
                                        lesson.active
                                            ? 'border-[#FF5C00] bg-[#FF5C00]/10 text-[#0F172A] dark:text-white shadow-sm'
                                            : 'border-black/5 dark:border-white/10 hover:border-black/20 text-[#64748B] dark:text-white/70'
                                    }`}
                                >
                                    <div className="space-y-0.5">
                                        <div className="font-bold text-xs">{lesson.title}</div>
                                        <div className="text-[11px] opacity-60 font-mono">{lesson.duration}</div>
                                    </div>

                                    {lesson.completed ? (
                                        <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                                    ) : lesson.active ? (
                                        <span className="w-2 h-2 rounded-full bg-[#FF5C00] animate-pulse shrink-0" />
                                    ) : (
                                        <span className="w-2 h-2 rounded-full bg-black/20 dark:bg-white/20 shrink-0" />
                                    )}
                                </button>
                            ))}
                        </div>

                        {/* Completion Award Badge */}
                        <div className="p-4 rounded-2xl bg-gradient-to-br from-amber-500/10 to-orange-500/10 border border-amber-500/20 text-xs space-y-1">
                            <div className="flex items-center gap-2 font-bold text-amber-700 dark:text-amber-300">
                                <Award className="w-4 h-4 text-[#FF5C00]" />
                                <span>Apprenticeship Certification</span>
                            </div>
                            <p className="text-[11px] text-[#64748B] dark:text-white/60 leading-relaxed">
                                Completing all modules awards a cryptographically verifiable AGS Apprentice Certificate.
                            </p>
                        </div>

                        {/* Repo Link */}
                        <div className="pt-2 flex items-center justify-between text-xs text-[#64748B] dark:text-white/50">
                            <span className="font-mono">SliceClass Repo</span>
                            <a
                                href="https://github.com/A-Generative-Slice/SliceClass"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-[#FF5C00] hover:underline flex items-center gap-1 font-semibold"
                            >
                                <span>Browse on GitHub</span>
                                <ExternalLink className="w-3 h-3" />
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
