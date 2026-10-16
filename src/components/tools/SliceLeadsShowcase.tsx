import React, { useState } from 'react';
import { 
    Search, MapPin, CheckCircle2, Download, 
    Sparkles, RefreshCw, Phone, ExternalLink 
} from 'lucide-react';
import logoImg from '../../assets/logo.jpg';

interface ScannedLead {
    id: string;
    name: string;
    niche: string;
    area: string;
    phone: string;
    whatsappVerified: boolean;
    rating: string;
    icebreaker: string;
}

const mockLeadsDatabase: Record<string, ScannedLead[]> = {
    'Architects': [
        {
            id: 'lead-1',
            name: 'Studio Form & Space Architecture',
            niche: 'Sustainable Residential Architecture',
            area: 'Anna Nagar West, Chennai',
            phone: '+91 98402 11842',
            whatsappVerified: true,
            rating: '4.9 (42 reviews)',
            icebreaker: 'Hi Ar. Rajesh, loved your recent courtyard villa in ECR. We noticed you showcase 2D floor plans on your site — would a 3D interactive model where clients walk through finishes right on their phone be worth exploring?'
        },
        {
            id: 'lead-2',
            name: 'Vanguard Structural Consultants',
            niche: 'Commercial & High-Rise Structures',
            area: 'T. Nagar, Chennai',
            phone: '+91 94441 87290',
            whatsappVerified: true,
            rating: '4.8 (29 reviews)',
            icebreaker: 'Hello Vanguard Team, saw your industrial warehouse structural design. We build automated proposal and client agreement vaults for Chennai design firms to eliminate contract paperwork turnaround.'
        },
        {
            id: 'lead-3',
            name: 'Kalaivaani Interior Spaces',
            niche: 'Luxury Penthouse Interiors',
            area: 'Alwarpet, Chennai',
            phone: '+91 98840 54119',
            whatsappVerified: true,
            rating: '5.0 (61 reviews)',
            icebreaker: 'Hi Kalaivaani Studio, your bespoke teak cabinetry work in Poes Garden is phenomenal. We assist luxury interior designers in automating their customer discovery and pitch presentations with 1-click 16:9 PDF decks.'
        }
    ],
    'Restaurants': [
        {
            id: 'lead-4',
            name: 'The French Brioche Café',
            niche: 'Artisanal Bakery & Bistro',
            area: 'Nungambakkam, Chennai',
            phone: '+91 98410 73220',
            whatsappVerified: true,
            rating: '4.7 (184 reviews)',
            icebreaker: 'Hello Brioche Team, your sourdough croissants are a weekend staple! Quick question: are you taking corporate catering bookings via WhatsApp? We build 1-click WhatsApp order flows for boutique bakeries.'
        },
        {
            id: 'lead-5',
            name: 'Spice & Heritage Coastal Kitchen',
            niche: 'Traditional Seafood & Coastal Cuisine',
            area: 'Besant Nagar Beach, Chennai',
            phone: '+91 99620 44109',
            whatsappVerified: true,
            rating: '4.9 (310 reviews)',
            icebreaker: 'Hi Spice & Heritage, love your seafood platters. We help coastal fine-dining spots in Chennai keep high-spending weekend diners updated with tailored weekly specials without ending in spam.'
        }
    ],
    'Clinics': [
        {
            id: 'lead-6',
            name: 'Aura Aesthetics & Dermatology',
            niche: 'Cosmetic Skin & Laser Surgery',
            area: 'Kilpauk, Chennai',
            phone: '+91 98409 63518',
            whatsappVerified: true,
            rating: '4.9 (95 reviews)',
            icebreaker: 'Hi Dr. Shalini, congratulations on Aura\'s new branch! We help boutique aesthetic clinics automate patient inquiries and send customized pre-procedure guidance seamlessly via WhatsApp.'
        }
    ]
};

export const SliceLeadsShowcase: React.FC = () => {
    const [niche, setNiche] = useState('Architects');
    const [selectedLocation, setSelectedLocation] = useState('Chennai, Tamil Nadu');
    const [isScanning, setIsScanning] = useState(false);
    const [scanProgress, setScanProgress] = useState(100);
    const [leads, setLeads] = useState<ScannedLead[]>(mockLeadsDatabase['Architects']);
    const [activeIcebreaker, setActiveIcebreaker] = useState<ScannedLead | null>(null);

    const handleStartScan = () => {
        setIsScanning(true);
        setScanProgress(15);
        setActiveIcebreaker(null);

        setTimeout(() => setScanProgress(45), 400);
        setTimeout(() => setScanProgress(78), 800);
        setTimeout(() => {
            setScanProgress(100);
            setIsScanning(false);
            const pool = mockLeadsDatabase[niche] || mockLeadsDatabase['Architects'];
            setLeads(pool);
        }, 1200);
    };

    return (
        <div className="w-full rounded-3xl border border-white/10 bg-[#0F172A] overflow-hidden shadow-2xl flex flex-col">
            {/* Header */}
            <div className="px-5 py-4 border-b border-white/10 bg-[#0B0F17]/90 backdrop-blur flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center gap-3">
                    <img src={logoImg} alt="AGS Logo" className="w-8 h-8 rounded-full border border-[#FF5C00]/40 object-cover" />
                    <div>
                        <div className="flex items-center gap-2">
                            <span className="font-bold text-sm text-white font-heading">SliceLeads Prospector</span>
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#FF5C00]/20 text-[#FF5C00] border border-[#FF5C00]/30">
                                Active Simulator
                            </span>
                        </div>
                        <p className="text-[11px] text-white/50">Verified local business scanner with zero bounce rate</p>
                    </div>
                </div>

                <div className="flex items-center gap-2 text-xs text-white/70 font-mono">
                    <span className="flex items-center gap-1.5 text-emerald-400">
                        <CheckCircle2 className="w-3.5 h-3.5" /> 100% Phone Ping Verified
                    </span>
                    <span className="text-white/20">|</span>
                    <span>Gemini 2.0 Synthesis</span>
                </div>
            </div>

            {/* Scan Control Panel */}
            <div className="p-6 bg-[#0B0F17]/50 border-b border-white/10">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {/* Niche selector */}
                    <div>
                        <label className="block text-[11px] font-bold uppercase tracking-wider text-white/50 mb-1.5">
                            Target Niche / Industry
                        </label>
                        <select
                            value={niche}
                            onChange={(e) => setNiche(e.target.value)}
                            className="w-full bg-[#0F172A] border border-white/15 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#FF5C00]"
                        >
                            <option value="Architects">Architects & Interior Designers</option>
                            <option value="Restaurants">Fine Dining & Artisanal Cafés</option>
                            <option value="Clinics">Cosmetic Clinics & Specialists</option>
                        </select>
                    </div>

                    {/* Location selector */}
                    <div>
                        <label className="block text-[11px] font-bold uppercase tracking-wider text-white/50 mb-1.5">
                            Target Location
                        </label>
                        <div className="relative">
                            <MapPin className="w-4 h-4 text-white/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
                            <select
                                value={selectedLocation}
                                onChange={(e) => setSelectedLocation(e.target.value)}
                                className="w-full bg-[#0F172A] border border-white/15 rounded-xl pl-9 pr-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#FF5C00]"
                            >
                                <option value="Chennai, Tamil Nadu">Chennai, Tamil Nadu (All Hubs)</option>
                                <option value="Anna Nagar / Kilpauk">Chennai — Anna Nagar & Kilpauk</option>
                                <option value="Alwarpet / Poes Garden">Chennai — Alwarpet & Poes Garden</option>
                                <option value="OMR / ECR Coastal Belt">Chennai — OMR & ECR Belt</option>
                                <option value="Bengaluru, Karnataka">Bengaluru — Indiranagar & Koramangala</option>
                            </select>
                        </div>
                    </div>

                    {/* Action button */}
                    <div className="flex items-end">
                        <button
                            onClick={handleStartScan}
                            disabled={isScanning}
                            className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-[#FF5C00] to-[#FF8C1A] text-white font-bold text-xs flex items-center justify-center gap-2 hover:opacity-95 transition-all shadow-lg shadow-[#FF5C00]/20 disabled:opacity-50"
                        >
                            {isScanning ? (
                                <>
                                    <RefreshCw className="w-4 h-4 animate-spin" /> Scanning Registry ({scanProgress}%)...
                                </>
                            ) : (
                                <>
                                    <Search className="w-4 h-4" /> Scan Verified Local Leads
                                </>
                            )}
                        </button>
                    </div>
                </div>

                {/* Scan Progress Bar */}
                {isScanning && (
                    <div className="mt-4">
                        <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
                            <div 
                                className="bg-[#FF5C00] h-full transition-all duration-300 rounded-full"
                                style={{ width: `${scanProgress}%` }}
                            />
                        </div>
                        <p className="text-[11px] text-white/40 mt-1 font-mono">
                            Checking telephone switchboards & WhatsApp Business accounts...
                        </p>
                    </div>
                )}
            </div>

            {/* Results Table */}
            <div className="p-6 flex-grow flex flex-col justify-between">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                        <thead>
                            <tr className="border-b border-white/10 text-white/40 font-mono text-[10px] uppercase tracking-wider">
                                <th className="pb-3 font-semibold">Business & Locality</th>
                                <th className="pb-3 font-semibold">Direct Phone</th>
                                <th className="pb-3 font-semibold">WhatsApp Status</th>
                                <th className="pb-3 font-semibold text-right">AI Icebreaker</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {leads.map((lead) => (
                                <tr key={lead.id} className="hover:bg-white/[0.02] transition-colors">
                                    <td className="py-3.5 pr-4">
                                        <div className="font-bold text-white text-sm font-heading">{lead.name}</div>
                                        <div className="text-[11px] text-white/50 flex items-center gap-1 mt-0.5">
                                            <span>{lead.niche}</span>
                                            <span>•</span>
                                            <span className="text-[#FF5C00]">{lead.area}</span>
                                        </div>
                                    </td>

                                    <td className="py-3.5 pr-4 font-mono text-white/80">
                                        <div className="flex items-center gap-1.5">
                                            <Phone className="w-3.5 h-3.5 text-[#FF5C00]" />
                                            <span>{lead.phone}</span>
                                        </div>
                                    </td>

                                    <td className="py-3.5 pr-4">
                                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                                            <CheckCircle2 className="w-3 h-3" /> WhatsApp Active
                                        </span>
                                    </td>

                                    <td className="py-3.5 text-right">
                                        <button
                                            onClick={() => setActiveIcebreaker(lead)}
                                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-[#FF5C00] text-white text-xs font-semibold border border-white/10 hover:border-[#FF5C00] transition-all"
                                        >
                                            <Sparkles className="w-3 h-3" /> View Icebreaker
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Icebreaker Drawer / Modal preview */}
                {activeIcebreaker && (
                    <div className="mt-6 p-4 rounded-2xl bg-[#0B0F17] border border-[#FF5C00]/30 animate-fadeIn">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-xs font-bold text-[#FF5C00] flex items-center gap-1.5 font-heading">
                                <Sparkles className="w-3.5 h-3.5" /> Tailored WhatsApp Pitch for {activeIcebreaker.name}
                            </span>
                            <button 
                                onClick={() => setActiveIcebreaker(null)}
                                className="text-white/40 hover:text-white text-xs"
                            >
                                Close
                            </button>
                        </div>
                        <p className="text-xs text-white/80 bg-white/5 p-3 rounded-xl border border-white/5 leading-relaxed font-sans">
                            "{activeIcebreaker.icebreaker}"
                        </p>
                        <div className="mt-3 flex items-center justify-between text-[11px] text-white/50">
                            <span>Character count: {activeIcebreaker.icebreaker.length} (optimal reading length)</span>
                            <a
                                href={`https://wa.me/?text=${encodeURIComponent(activeIcebreaker.icebreaker)}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-[#FF5C00] font-bold hover:underline flex items-center gap-1"
                            >
                                Test on WhatsApp <ExternalLink className="w-3 h-3" />
                            </a>
                        </div>
                    </div>
                )}

                {/* Bottom Footer Action */}
                <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between flex-wrap gap-4 text-xs text-white/60">
                    <span className="font-mono">Ready to export {leads.length} verified records</span>
                    <button 
                        onClick={() => alert('Demo export downloaded: ags_verified_leads.csv')}
                        className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-white font-medium border border-white/10 transition-colors"
                    >
                        <Download className="w-3.5 h-3.5 text-[#FF5C00]" /> Export Clean CSV
                    </button>
                </div>
            </div>
        </div>
    );
};
