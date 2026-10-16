import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import Particles, { initParticlesEngine } from '@tsparticles/react';
import { loadSlim } from '@tsparticles/slim';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { HomePage } from './pages/HomePage';
import { Slice3DPage } from './pages/Slice3DPage';
import { SliceLeadsPage } from './pages/SliceLeadsPage';
import { SliceMailPage } from './pages/SliceMailPage';
import { SliceInboxPage } from './pages/SliceInboxPage';
import { SlicePPTPage } from './pages/SlicePPTPage';
import { SliceDAMPage } from './pages/SliceDAMPage';
import { SliceClassPage } from './pages/SliceClassPage';

// Scroll to top helper on route transitions
function ScrollToTop() {
    const { pathname } = useLocation();

    useEffect(() => {
        window.scrollTo({
            top: 0,
            left: 0,
            behavior: 'instant' as ScrollBehavior
        });
    }, [pathname]);

    return null;
}

export function App() {
    const [isDark, setIsDark] = useState(true);
    const [particlesInit, setParticlesInit] = useState(false);

    // Initial theme sync with documentElement
    useEffect(() => {
        if (isDark) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [isDark]);

    // Init tsParticles engine
    useEffect(() => {
        initParticlesEngine(async (engine) => {
            await loadSlim(engine);
        }).then(() => {
            setParticlesInit(true);
        }).catch(err => {
            console.warn('Particles init skipped:', err);
        });
    }, []);

    return (
        <BrowserRouter>
            <ScrollToTop />
            <div className="min-h-screen bg-[#fafafa] dark:bg-[#0a0a0a] text-[#0f172a] dark:text-white transition-colors duration-300 relative overflow-hidden flex flex-col font-sans">
                {/* Floating Island Navbar */}
                <Navbar 
                    isDark={isDark} 
                    toggleTheme={() => setIsDark(!isDark)} 
                />

                {/* Ambient Brand Glow Backdrop */}
                <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-orange-500/10 via-transparent to-transparent opacity-60" />
                    <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-orange-500/15 blur-[160px]" />
                    <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-orange-600/10 blur-[130px]" />
                </div>

                {/* Refined Grid Overlay */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none z-0" />

                {/* Subtle Particles Canvas */}
                {particlesInit && (
                    <div className="absolute inset-0 z-0 pointer-events-none opacity-40">
                        <Particles
                            id="tsparticles"
                            className="h-full w-full"
                            options={{
                                fullScreen: { enable: false },
                                fpsLimit: 120,
                                particles: {
                                    color: { value: ["#ff6a00", "#ffffff"] },
                                    links: {
                                        color: "#ff6a00",
                                        distance: 140,
                                        enable: true,
                                        opacity: 0.12,
                                        width: 1,
                                    },
                                    move: {
                                        direction: "none",
                                        enable: true,
                                        speed: 0.8,
                                        random: true
                                    },
                                    number: { density: { enable: true }, value: 60 },
                                    opacity: { value: { min: 0.1, max: 0.4 } },
                                    shape: { type: "circle" },
                                    size: { value: { min: 1, max: 2.5 } },
                                },
                                detectRetina: true,
                            }}
                        />
                    </div>
                )}

                {/* Routed Content */}
                <main className="relative z-10 flex-grow">
                    <Routes>
                        <Route path="/" element={<HomePage />} />
                        <Route path="/slice-3d" element={<Slice3DPage />} />
                        <Route path="/slice-leads" element={<SliceLeadsPage />} />
                        <Route path="/slice-mail" element={<SliceMailPage />} />
                        <Route path="/slice-inbox" element={<SliceInboxPage />} />
                        <Route path="/slice-ppt" element={<SlicePPTPage />} />
                        <Route path="/slice-dam" element={<SliceDAMPage />} />
                        <Route path="/slice-class" element={<SliceClassPage />} />
                        <Route path="*" element={<HomePage />} />
                    </Routes>
                </main>

                {/* Official Footer */}
                <Footer />
            </div>
        </BrowserRouter>
    );
}

export default App;
