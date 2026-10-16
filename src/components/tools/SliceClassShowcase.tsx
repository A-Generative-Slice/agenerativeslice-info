import React, { useState } from 'react';
import { 
    Play, Pause, CheckCircle2, 
    Smartphone, Volume2, Maximize, FileText 
} from 'lucide-react';
import logoImg from '../../assets/logo.jpg';

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
];

export const SliceClassShowcase: React.FC = () => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [lessons, setLessons] = useState<Lesson[]>(mockLessons);
    const [currentTime, setCurrentTime] = useState(252); // seconds (04:12)
    const [showOtpModal, setShowOtpModal] = useState(false);
    const [phoneNumber, setPhoneNumber] = useState('+91 98402 11842');
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
        <div className="w-full rounded-3xl border border-white/10 bg-[#0F172A] overflow-hidden shadow-2xl flex flex-col">
            {/* Header */}
            <div className="px-5 py-4 border-b border-white/10 bg-[#0B0F17]/90 backdrop-blur flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center gap-3">
                    <img src={logoImg} alt="AGS Logo" className="w-8 h-8 rounded-full border border-[#FF5C00]/40 object-cover" />
                    <div>
                        <div className="flex items-center gap-2">
                            <span className="font-bold text-sm text-white font-heading">SliceClass Studio LMS</span>
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#FF5C00]/20 text-[#FF5C00] border border-[#FF5C00]/30">
                                Monochromatic Player
                            </span>
                        </div>
                        <p className="text-[11px] text-white/50">Distraction-free learning portal with instant phone OTP login</p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <div className="hidden sm:flex items-center gap-2 text-xs font-mono text-white/70">
                        <span className="flex items-center gap-1.5 text-emerald-400">
                            <Smartphone className="w-3.5 h-3.5" /> Password-Free OTP
                        </span>
                        <span className="text-white/20">|</span>
                        <span>Adaptive Bitrate 1080p</span>
                    </div>

                    <button
                        onClick={() => setShowOtpModal(!showOtpModal)}
                        className="px-3 py-1.5 rounded-xl bg-white/5 text-white/80 hover:text-white border border-white/10 text-xs font-medium"
                    >
                        {isLoggedIn ? 'Student: Hussain' : 'Log In via OTP'}
                    </button>
                </div>
            </div>

            {/* OTP Simulator Drawer if open */}
            {showOtpModal && (
                <div className="p-4 bg-[#0B0F17] border-b border-[#FF5C00]/30 animate-fadeIn flex items-center justify-between flex-wrap gap-4">
                    <div className="flex items-center gap-3">
                        <Smartphone className="w-5 h-5 text-[#FF5C00]" />
                        <div>
                            <div className="text-xs font-bold text-white">One-Tap Phone Authentication</div>
                            <div className="text-[11px] text-white/50">Zero forgotten passwords for students or clients</div>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <input
                            type="text"
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                            className="bg-[#0F172A] border border-white/15 rounded-xl px-3 py-1.5 text-xs text-white font-mono"
                        />
                        <input
                            type="text"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                            placeholder="OTP"
                            className="w-16 bg-[#0F172A] border border-white/15 rounded-xl px-2 py-1.5 text-xs text-white text-center font-mono"
                        />
                        <button
                            onClick={() => {
                                setIsLoggedIn(true);
                                setShowOtpModal(false);
                            }}
                            className="px-3 py-1.5 rounded-xl bg-[#FF5C00] text-white text-xs font-bold"
                        >
                            Verify & Enter
                        </button>
                    </div>
                </div>
            )}

            {/* Split Screen: Video Player & Course Curriculum */}
            <div className="grid grid-cols-1 lg:grid-cols-12 flex-grow min-h-[420px]">
                {/* Video Player Column */}
                <div className="lg:col-span-8 p-6 flex flex-col justify-between bg-black/60">
                    {/* Screen Viewport */}
                    <div className="relative aspect-video w-full rounded-2xl bg-gradient-to-tr from-[#0F172A] to-[#1E293B] border border-white/10 overflow-hidden shadow-2xl flex flex-col justify-between p-6">
                        {/* Overlay Top Bar */}
                        <div className="flex items-center justify-between text-xs text-white/80 z-10">
                            <span className="font-heading font-bold text-white">{activeLesson.title}</span>
                            <span className="px-2 py-0.5 rounded bg-black/60 font-mono text-[10px] text-emerald-400 border border-white/10">
                                1080p 60fps HD
                            </span>
                        </div>

                        {/* Center Play Button */}
                        <div className="flex items-center justify-center z-10">
                            <button
                                onClick={togglePlay}
                                className="w-16 h-16 rounded-full bg-[#FF5C00] hover:bg-[#FF8C1A] text-white flex items-center justify-center shadow-2xl shadow-[#FF5C00]/40 transition-transform hover:scale-105 active:scale-95"
                            >
                                {isPlaying ? <Pause className="w-7 h-7" /> : <Play className="w-7 h-7 ml-1" />}
                            </button>
                        </div>

                        {/* Player Controls Bar */}
                        <div className="space-y-2 z-10 bg-black/70 backdrop-blur-md p-3 rounded-xl border border-white/10">
                            {/* Scrubber */}
                            <div className="w-full bg-white/20 h-1 rounded-full cursor-pointer overflow-hidden">
                                <div className="bg-[#FF5C00] h-full w-[35%] rounded-full" />
                            </div>

                            <div className="flex items-center justify-between text-xs text-white/70 font-mono">
                                <div className="flex items-center gap-3">
                                    <button onClick={togglePlay} className="text-white hover:text-[#FF5C00]">
                                        {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                                    </button>
                                    <span className="text-[11px]">{formatSeconds(currentTime)} / {activeLesson.duration}</span>
                                </div>

                                <div className="flex items-center gap-3 text-[11px]">
                                    <span className="text-[#FF5C00] font-bold">1.25x</span>
                                    <Volume2 className="w-3.5 h-3.5 hover:text-white cursor-pointer" />
                                    <Maximize className="w-3.5 h-3.5 hover:text-white cursor-pointer" />
                                </div>
                            </div>
                        </div>

                        {/* Subtle background studio grid */}
                        <div className="absolute inset-0 opacity-15 pointer-events-none bg-[radial-gradient(#FF5C00_1px,transparent_1px)] [background-size:24px_24px]" />
                    </div>

                    {/* Lesson Notes & Downloadable Resource */}
                    <div className="mt-4 flex items-center justify-between text-xs text-white/60">
                        <span className="flex items-center gap-1.5">
                            <FileText className="w-3.5 h-3.5 text-[#FF5C00]" /> Accompanying Code Repo & Cheatsheet available
                        </span>
                        <button 
                            onClick={() => alert('Download: slice_class_cheatsheet.pdf')}
                            className="text-[#FF5C00] font-bold hover:underline"
                        >
                            Download Lesson PDF
                        </button>
                    </div>
                </div>

                {/* Course Curriculum Column */}
                <div className="lg:col-span-4 p-5 border-t lg:border-t-0 lg:border-l border-white/10 bg-[#0B0F17]/40 flex flex-col justify-between">
                    <div>
                        <div className="text-xs font-bold uppercase tracking-wider text-white/60 font-heading mb-2">
                            Course Curriculum
                        </div>

                        {/* Completion Bar */}
                        <div className="mb-4 p-3 rounded-xl bg-white/[0.03] border border-white/5 space-y-1.5">
                            <div className="flex items-center justify-between text-xs">
                                <span className="text-white/70">Overall Completion</span>
                                <span className="font-mono font-bold text-[#FF5C00]">25%</span>
                            </div>
                            <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                                <div className="bg-[#FF5C00] h-full w-1/4 rounded-full" />
                            </div>
                        </div>

                        {/* Lesson List */}
                        <div className="space-y-2">
                            {lessons.map((lesson) => (
                                <div
                                    key={lesson.id}
                                    onClick={() => selectLesson(lesson.id)}
                                    className={`p-3 rounded-xl border cursor-pointer transition-all ${
                                        lesson.active
                                            ? 'bg-[#FF5C00]/15 border-[#FF5C00] text-white shadow-lg'
                                            : 'bg-white/[0.02] border-white/5 text-white/60 hover:text-white hover:bg-white/5'
                                    }`}
                                >
                                    <div className="flex items-center justify-between gap-2">
                                        <div className="flex items-center gap-2">
                                            {lesson.completed ? (
                                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                                            ) : (
                                                <div className="w-3.5 h-3.5 rounded-full border border-white/30 shrink-0" />
                                            )}
                                            <span className="text-xs font-medium line-clamp-1">{lesson.title}</span>
                                        </div>
                                        <span className="text-[10px] font-mono text-white/40 shrink-0">{lesson.duration}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-white/10 text-[11px] text-white/40 font-mono text-center">
                        SliceClass Studio Engine • AGS
                    </div>
                </div>
            </div>
        </div>
    );
};
