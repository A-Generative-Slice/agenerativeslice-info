import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
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
    // Lock default to crisp, modern white/light theme (no dark mode, no theme toggle)
    useEffect(() => {
        document.documentElement.classList.remove('dark');
    }, []);

    return (
        <BrowserRouter>
            <ScrollToTop />
            <div className="min-h-screen bg-[#fafafa] text-[#0f172a] relative overflow-x-hidden flex flex-col font-sans selection:bg-[#FF5C00]/20 selection:text-[#FF5C00]">
                {/* Precision Studio Engineering Grid Backdrop */}
                <div 
                    className="fixed inset-0 pointer-events-none z-0 opacity-40"
                    style={{
                        backgroundImage: `linear-gradient(to right, rgba(120, 130, 150, 0.12) 1px, transparent 1px), linear-gradient(to bottom, rgba(120, 130, 150, 0.12) 1px, transparent 1px)`,
                        backgroundSize: '36px 36px'
                    }}
                />

                {/* Subtle Brand Accent Ambient Gradient */}
                <div className="fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-48 bg-gradient-to-b from-[#FF5C00]/[0.05] to-transparent pointer-events-none z-0" />

                {/* Clean Modern Navbar (No Theme Toggle) */}
                <Navbar />

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
