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
    useEffect(() => {
        document.documentElement.classList.remove('dark');
    }, []);

    return (
        <BrowserRouter>
            <ScrollToTop />
            <div className="min-h-screen bg-[#fafafa] text-[#0f172a] relative overflow-x-hidden flex flex-col font-sans">
                {/* Atmosphere: aurora glows, precision grid, film grain */}
                <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
                    <div
                        className="aurora-blob bg-[#FF5C00] w-[38vw] h-[38vw] max-w-[520px] max-h-[520px] -top-[16vw] -left-[12vw] opacity-[0.11]"
                        style={{ animationDelay: '-4s' }}
                    />
                    <div className="aurora-blob bg-[#FFB066] w-[30vw] h-[30vw] max-w-[440px] max-h-[440px] top-[6vh] right-[-14vw] opacity-[0.1]" />
                    <div className="aurora-blob bg-[#FFD9B8] w-[26vw] h-[26vw] max-w-[360px] max-h-[360px] bottom-[-12vh] left-[28vw] opacity-[0.12]" />
                    <div className="absolute inset-0 atmosphere-grid" />
                    <div className="absolute inset-0 noise-overlay" />
                </div>

                <Navbar />

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

                <Footer />
            </div>
        </BrowserRouter>
    );
}

export default App;
