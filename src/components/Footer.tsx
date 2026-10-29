import { FaInstagram, FaLinkedin, FaGithub, FaWhatsapp } from 'react-icons/fa';
import { Mail, Phone, MapPin, ExternalLink } from 'lucide-react';
import logoImg from '../assets/logo.jpg';

const WORKSPACES = [
    { name: 'Slice3D', hint: 'Spatial WebGL', path: '/slice-3d' },
    { name: 'SliceLeads', hint: 'Lead engine', path: '/slice-leads' },
    { name: 'SliceMail', hint: 'Smart outreach', path: '/slice-mail' },
    { name: 'SliceInbox', hint: 'Mailbox triage', path: '/slice-inbox' },
    { name: 'SlicePPT', hint: 'Deck generator', path: '/slice-ppt' },
    { name: 'SliceDAM', hint: 'Document vault', path: '/slice-dam' },
    { name: 'SliceClass', hint: 'Studio LMS', path: '/slice-class' }
];

export const Footer = () => {
    return (
        <footer className="relative z-10 border-t border-black/[0.06] bg-white/55 backdrop-blur-xl">
            <div className="mx-auto max-w-6xl px-4 sm:px-6 py-14 sm:py-16">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-8">
                    {/* Brand */}
                    <div className="md:col-span-5 space-y-5">
                        <div className="flex items-center gap-3">
                            <span className="grid place-items-center w-10 h-10 rounded-xl overflow-hidden border border-black/[0.08] bg-white shadow-sm shrink-0">
                                <img src={logoImg} alt="A Generative Slice" className="w-full h-full object-cover" />
                            </span>
                            <span>
                                <span className="block font-heading font-extrabold text-[11px] tracking-[0.18em] text-[#0F172A]">
                                    A GENERATIVE SLICE
                                </span>
                                <span className="block mt-0.5 font-mono text-[9px] uppercase tracking-[0.18em] text-[#FF5C00]">
                                    Systems laboratory · agenerativeslice.info
                                </span>
                            </span>
                        </div>

                        <p className="max-w-sm text-[12px] leading-relaxed text-[#64748B]">
                            Independent AI engineering lab and bespoke systems studio in Chennai, India.
                            We build agentic AI, enterprise tooling, 3D WebGL applications and automated sales engines.
                        </p>

                        <div className="flex items-center gap-2 pt-1">
                            {[
                                { href: 'https://wa.me/917812891494', label: 'WhatsApp', icon: <FaWhatsapp className="w-4 h-4" />, hover: 'hover:text-emerald-600 hover:bg-emerald-50 hover:border-emerald-200' },
                                { href: 'https://github.com/A-Generative-Slice', label: 'GitHub', icon: <FaGithub className="w-4 h-4" />, hover: 'hover:text-[#FF5C00] hover:bg-[#FF5C00]/[0.06] hover:border-[#FF5C00]/30' },
                                { href: 'https://www.linkedin.com/company/107795425', label: 'LinkedIn', icon: <FaLinkedin className="w-4 h-4" />, hover: 'hover:text-blue-600 hover:bg-blue-50 hover:border-blue-200' },
                                { href: 'https://www.instagram.com/a_generative_slice/', label: 'Instagram', icon: <FaInstagram className="w-4 h-4" />, hover: 'hover:text-pink-600 hover:bg-pink-50 hover:border-pink-200' }
                            ].map((social) => (
                                <a
                                    key={social.label}
                                    href={social.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label={social.label}
                                    title={social.label}
                                    className={`grid place-items-center w-10 h-10 rounded-xl border border-black/[0.07] bg-white/70 text-[#64748B] transition-colors ${social.hover}`}
                                >
                                    {social.icon}
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Workspaces */}
                    <div className="md:col-span-3">
                        <p className="kicker">Workspaces</p>
                        <ul className="mt-4 space-y-0.5">
                            {WORKSPACES.map((item) => (
                                <li key={item.name}>
                                    <a
                                        href={item.path}
                                        className="group flex items-baseline justify-between gap-3 rounded-lg px-2 py-2 -mx-2 text-[12px] text-[#64748B] hover:text-[#FF5C00] hover:bg-[#FF5C00]/[0.04] transition-colors"
                                    >
                                        <span className="font-medium">{item.name}</span>
                                        <span className="font-mono text-[9px] uppercase tracking-[0.12em] text-[#CBD5E1] group-hover:text-[#FFB066]">
                                            {item.hint}
                                        </span>
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact */}
                    <div className="md:col-span-4">
                        <p className="kicker">Headquarters</p>
                        <ul className="mt-4 space-y-3.5 text-[12px] text-[#64748B]">
                            <li className="flex items-start gap-2.5">
                                <MapPin className="w-3.5 h-3.5 text-[#FF5C00] shrink-0 mt-0.5" />
                                <span>No: 144, Valluvar Kottam High Rd,<br />Nungambakkam, Chennai 600034</span>
                            </li>
                            <li className="flex items-center gap-2.5">
                                <Phone className="w-3.5 h-3.5 text-[#FF5C00] shrink-0" />
                                <a href="tel:+917812891494" className="hover:text-[#FF5C00] transition-colors">+91 78128 91494</a>
                            </li>
                            <li className="flex items-center gap-2.5">
                                <Mail className="w-3.5 h-3.5 text-[#FF5C00] shrink-0" />
                                <a href="mailto:smdhussain@agenerativeslice.com" className="hover:text-[#FF5C00] transition-colors break-all">
                                    smdhussain@agenerativeslice.com
                                </a>
                            </li>
                            <li className="pt-1">
                                <a
                                    href="https://agenerativeslice.com"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2 rounded-xl border border-[#FF5C00]/25 bg-[#FF5C00]/[0.05] px-3.5 py-2 font-heading text-[10px] font-bold uppercase tracking-[0.08em] text-[#FF5C00] hover:bg-[#FF5C00] hover:text-white transition-all"
                                >
                                    Corporate site
                                    <ExternalLink className="w-3 h-3" />
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="mt-12 pt-6 border-t border-black/[0.06] flex flex-col sm:flex-row items-center justify-between gap-3">
                    <p className="text-[11px] text-[#94A3B8]">
                        © {new Date().getFullYear()} A Generative Slice · Mohammed Hussain. All rights reserved.
                    </p>
                    <p className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.12em] text-[#94A3B8]">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        7 repositories synced live
                    </p>
                </div>
            </div>
        </footer>
    );
};
