import { FaInstagram, FaLinkedin, FaGithub, FaWhatsapp } from 'react-icons/fa';
import { Mail, Phone, MapPin, ExternalLink } from 'lucide-react';
import logoImg from '../assets/logo.jpg';

export const Footer = () => {
    return (
        <footer className="py-16 px-6 border-t border-black/10 dark:border-white/10 bg-[#f8fafc] dark:bg-[#050505] transition-colors">
            <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
                    {/* Brand Col */}
                    <div className="md:col-span-2">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-9 h-9 rounded-xl overflow-hidden shadow-md">
                                <img src={logoImg} alt="A Generative Slice" className="w-full h-full object-cover" />
                            </div>
                            <div>
                                <span className="text-[#0F172A] dark:text-white font-black text-sm uppercase tracking-widest block font-heading">
                                    A GENERATIVE SLICE
                                </span>
                                <span className="text-[#FF5C00] text-xs font-semibold">
                                    ProdX & Slice Suite Engineering Hub
                                </span>
                            </div>
                        </div>
                        <p className="text-sm text-[#64748B] dark:text-white/60 max-w-md leading-relaxed mb-6">
                            Independent AI laboratory and bespoke web systems studio in Chennai, India. 
                            We engineer agentic AI, enterprise ERPs, 3D web applications, and automated sales engines.
                        </p>
                        <div className="flex items-center gap-4">
                            <a href="https://www.instagram.com/a_generative_slice/" target="_blank" rel="noopener noreferrer"
                                className="w-9 h-9 rounded-lg bg-black/5 dark:bg-white/5 flex items-center justify-center text-black/60 dark:text-white/60 hover:text-pink-500 hover:bg-pink-500/10 transition-all" title="Instagram">
                                <FaInstagram className="w-4 h-4" />
                            </a>
                            <a href="https://www.linkedin.com/company/107795425" target="_blank" rel="noopener noreferrer"
                                className="w-9 h-9 rounded-lg bg-black/5 dark:bg-white/5 flex items-center justify-center text-black/60 dark:text-white/60 hover:text-blue-500 hover:bg-blue-500/10 transition-all" title="LinkedIn">
                                <FaLinkedin className="w-4 h-4" />
                            </a>
                            <a href="https://github.com/A-Generative-Slice" target="_blank" rel="noopener noreferrer"
                                className="w-9 h-9 rounded-lg bg-black/5 dark:bg-white/5 flex items-center justify-center text-black/60 dark:text-white/60 hover:text-black dark:hover:text-white hover:bg-black/10 transition-all" title="GitHub Org">
                                <FaGithub className="w-4 h-4" />
                            </a>
                            <a href="https://wa.me/917812891494" target="_blank" rel="noopener noreferrer"
                                className="w-9 h-9 rounded-lg bg-black/5 dark:bg-white/5 flex items-center justify-center text-black/60 dark:text-white/60 hover:text-green-500 hover:bg-green-500/10 transition-all" title="WhatsApp Business">
                                <FaWhatsapp className="w-4 h-4" />
                            </a>
                        </div>
                    </div>

                    {/* Slice Suite Repos */}
                    <div>
                        <h4 className="text-xs font-bold uppercase tracking-widest text-[#0F172A] dark:text-white/90 mb-4 font-heading">
                            GitHub Repositories
                        </h4>
                        <ul className="space-y-2 text-xs">
                            {[
                                { name: 'Slice3D', url: 'https://github.com/A-Generative-Slice/Slice3D' },
                                { name: 'SliceLeads', url: 'https://github.com/A-Generative-Slice/SliceLeads' },
                                { name: 'SliceMail', url: 'https://github.com/A-Generative-Slice/SliceMail' },
                                { name: 'SliceInbox', url: 'https://github.com/A-Generative-Slice/SliceInbox' },
                                { name: 'SlicePPT', url: 'https://github.com/A-Generative-Slice/SlicePPT' },
                                { name: 'SliceDAM', url: 'https://github.com/A-Generative-Slice/SliceDAM' },
                                { name: 'SliceClass', url: 'https://github.com/A-Generative-Slice/SliceClass' }
                            ].map((repo) => (
                                <li key={repo.name}>
                                    <a
                                        href={repo.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-[#64748B] dark:text-white/60 hover:text-[#FF5C00] transition-colors flex items-center gap-1.5"
                                    >
                                        <span>{repo.name}</span>
                                        <ExternalLink className="w-2.5 h-2.5 opacity-60" />
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Official Studio Contact */}
                    <div>
                        <h4 className="text-xs font-bold uppercase tracking-widest text-[#0F172A] dark:text-white/90 mb-4 font-heading">
                            Official Headquarters
                        </h4>
                        <ul className="space-y-2.5 text-xs text-[#64748B] dark:text-white/60">
                            <li className="flex items-center gap-2">
                                <MapPin className="w-4 h-4 text-[#FF5C00] shrink-0" />
                                <span>Chennai, Tamil Nadu, India</span>
                            </li>
                            <li className="flex items-center gap-2">
                                <Phone className="w-4 h-4 text-[#FF5C00] shrink-0" />
                                <a href="tel:+917812891494" className="hover:text-[#FF5C00] transition-colors font-medium">
                                    +91 78128 91494
                                </a>
                            </li>
                            <li className="flex items-center gap-2">
                                <Mail className="w-4 h-4 text-[#FF5C00] shrink-0" />
                                <a href="mailto:smdhussain@agenerativeslice.com" className="hover:text-[#FF5C00] transition-colors font-medium">
                                    smdhussain@agenerativeslice.com
                                </a>
                            </li>
                            <li className="pt-2">
                                <a
                                    href="https://agenerativeslice.com"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#FF5C00]/10 border border-[#FF5C00]/20 text-[#FF5C00] font-bold text-[11px] hover:bg-[#FF5C00]/20 transition-all"
                                >
                                    <span>Visit Main Website: agenerativeslice.com</span>
                                    <ExternalLink className="w-3 h-3" />
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="pt-8 border-t border-black/5 dark:border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#64748B] dark:text-white/40">
                    <p>© {new Date().getFullYear()} A Generative Slice. Mohammed Hussain. All rights reserved.</p>
                    <p className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        <span>All 7 Slice Suite Repositories Synced Live</span>
                    </p>
                </div>
            </div>
        </footer>
    );
};
