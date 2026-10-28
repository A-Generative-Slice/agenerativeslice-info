import { FaInstagram, FaLinkedin, FaGithub, FaWhatsapp } from 'react-icons/fa';
import { Mail, Phone, MapPin, ExternalLink } from 'lucide-react';
import logoImg from '../assets/logo.jpg';

export const Footer = () => {
    return (
        <footer className="py-16 px-4 sm:px-6 border-t border-black/10 dark:border-white/10 bg-[#f8fafc] dark:bg-[#07090e] transition-colors">
            <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
                    {/* Brand Col */}
                    <div className="md:col-span-2 space-y-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl overflow-hidden border border-black/10 dark:border-white/10 shadow-sm shrink-0">
                                <img src={logoImg} alt="A Generative Slice" className="w-full h-full object-cover" />
                            </div>
                            <div>
                                <span className="text-[#0F172A] dark:text-white font-black text-sm uppercase tracking-widest block font-heading">
                                    A GENERATIVE SLICE
                                </span>
                                <span className="text-[#FF5C00] text-xs font-semibold">
                                    Software Systems Laboratory &amp; Sandboxes
                                </span>
                            </div>
                        </div>
                        <p className="text-xs sm:text-sm text-[#64748B] dark:text-[#94A3B8] max-w-md leading-relaxed">
                            Independent AI engineering laboratory and bespoke systems studio in Chennai, Tamil Nadu, India. 
                            We engineer agentic AI, enterprise ERPs, 3D WebGL applications, and automated sales engines.
                        </p>
                        {/* Social Links (44x44px Min Touch Targets) */}
                        <div className="flex items-center gap-3 pt-2">
                            <a 
                                href="https://wa.me/917812891494" 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="w-11 h-11 rounded-xl bg-black/5 dark:bg-white/5 flex items-center justify-center text-black/70 dark:text-white/70 hover:text-emerald-500 hover:bg-emerald-500/10 transition-all border border-black/5 dark:border-white/5" 
                                title="WhatsApp Business (+91 78128 91494)"
                                aria-label="Chat on WhatsApp"
                            >
                                <FaWhatsapp className="w-4 h-4" />
                            </a>
                            <a 
                                href="https://github.com/A-Generative-Slice" 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="w-11 h-11 rounded-xl bg-black/5 dark:bg-white/5 flex items-center justify-center text-black/70 dark:text-white/70 hover:text-[#FF5C00] hover:bg-[#FF5C00]/10 transition-all border border-black/5 dark:border-white/5" 
                                title="GitHub Organization Profile"
                                aria-label="Visit GitHub Profile"
                            >
                                <FaGithub className="w-4 h-4" />
                            </a>
                            <a 
                                href="https://www.linkedin.com/company/107795425" 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="w-11 h-11 rounded-xl bg-black/5 dark:bg-white/5 flex items-center justify-center text-black/70 dark:text-white/70 hover:text-blue-500 hover:bg-blue-500/10 transition-all border border-black/5 dark:border-white/5" 
                                title="LinkedIn Company Page"
                                aria-label="Visit LinkedIn Profile"
                            >
                                <FaLinkedin className="w-4 h-4" />
                            </a>
                            <a 
                                href="https://www.instagram.com/a_generative_slice/" 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="w-11 h-11 rounded-xl bg-black/5 dark:bg-white/5 flex items-center justify-center text-black/70 dark:text-white/70 hover:text-pink-500 hover:bg-pink-500/10 transition-all border border-black/5 dark:border-white/5" 
                                title="Instagram Profile"
                                aria-label="Visit Instagram"
                            >
                                <FaInstagram className="w-4 h-4" />
                            </a>
                        </div>
                    </div>

                    {/* Slice Suite Workspaces */}
                    <div className="space-y-3">
                        <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-[#FF5C00] font-heading">
                            <span className="font-mono text-[#FF5C00]">|</span>
                            <span>INTERACTIVE WORKSPACES</span>
                        </div>
                        <ul className="space-y-1.5 text-xs">
                            {[
                                { name: 'Slice3D (Spatial WebGL)', path: '/slice-3d' },
                                { name: 'SliceLeads (Lead Engine)', path: '/slice-leads' },
                                { name: 'SliceMail (Smart Outreach)', path: '/slice-mail' },
                                { name: 'SliceInbox (Omnichannel Triage)', path: '/slice-inbox' },
                                { name: 'SlicePPT (Deck Generator)', path: '/slice-ppt' },
                                { name: 'SliceDAM (Document Vault)', path: '/slice-dam' },
                                { name: 'SliceClass (Studio LMS)', path: '/slice-class' }
                            ].map((item) => (
                                <li key={item.name}>
                                    <a
                                        href={item.path}
                                        className="py-1 text-[#64748B] dark:text-[#94A3B8] hover:text-[#FF5C00] transition-colors flex items-center gap-1.5 min-h-[32px]"
                                    >
                                        <span>{item.name}</span>
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Official Studio Contact */}
                    <div className="space-y-3">
                        <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-[#FF5C00] font-heading">
                            <span className="font-mono text-[#FF5C00]">|</span>
                            <span>OFFICIAL HEADQUARTERS</span>
                        </div>
                        <ul className="space-y-3 text-xs text-[#64748B] dark:text-[#94A3B8]">
                            <li className="flex items-start gap-2.5">
                                <MapPin className="w-4 h-4 text-[#FF5C00] shrink-0 mt-0.5" />
                                <span>Chennai, Tamil Nadu, 600034, India</span>
                            </li>
                            <li className="flex items-center gap-2.5">
                                <Phone className="w-4 h-4 text-[#FF5C00] shrink-0" />
                                <a href="tel:+917812891494" className="hover:text-[#FF5C00] transition-colors font-medium min-h-[32px] flex items-center">
                                    +91 78128 91494
                                </a>
                            </li>
                            <li className="flex items-center gap-2.5">
                                <Mail className="w-4 h-4 text-[#FF5C00] shrink-0" />
                                <a href="mailto:smdhussain@agenerativeslice.com" className="hover:text-[#FF5C00] transition-colors font-medium min-h-[32px] flex items-center">
                                    smdhussain@agenerativeslice.com
                                </a>
                            </li>
                            <li className="pt-2">
                                <a
                                    href="https://agenerativeslice.com"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#FF5C00]/10 border border-[#FF5C00]/25 text-[#FF5C00] font-bold text-xs hover:bg-[#FF5C00]/20 transition-all min-h-[44px]"
                                >
                                    <span>Corporate: agenerativeslice.com</span>
                                    <ExternalLink className="w-3.5 h-3.5" />
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="pt-8 border-t border-black/5 dark:border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#64748B] dark:text-white/40">
                    <p>© {new Date().getFullYear()} A Generative Slice. Mohammed Hussain. All rights reserved.</p>
                    <p className="flex items-center gap-2 font-mono">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        <span>7 Proprietary Slice Suite Repositories Synced Live</span>
                    </p>
                </div>
            </div>
        </footer>
    );
};
