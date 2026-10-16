export interface ProductSpec {
    label: string;
    value: string;
}

export interface ProductFeature {
    title: string;
    description: string;
    iconName: string;
}

export interface DetailedProduct {
    id: string;
    slug: string;
    name: string;
    category: string;
    tagline: string;
    headline: string;
    description: string;
    badge: string;
    accentColor: string;
    specs: ProductSpec[];
    features: ProductFeature[];
    workflow: { step: string; title: string; description: string }[];
    faqs: { question: string; answer: string }[];
    benefits: string[];
}

export const detailedProducts: DetailedProduct[] = [
    {
        id: 'slice-3d',
        slug: 'slice-3d',
        name: 'Slice3D',
        category: 'Interactive 3D Product Showcase',
        tagline: 'Let your customers touch, rotate, and play with your products in 3D right in their browser.',
        headline: 'Silky smooth 3D product experiences with zero downloads, zero lag, and instant web loading.',
        description: 'Slice3D turns your product CAD models, 3D assets, or physical merchandise into interactive web showcases. Customers on any smartphone, tablet, or laptop can inspect textures, change colors, view internal assemblies, and explore real dimensions without installing any apps.',
        badge: 'Proprietary AGS Engine',
        accentColor: '#FF5C00',
        specs: [
            { label: 'Rendering Engine', value: 'Hardware-Accelerated WebGL & Canvas 3D' },
            { label: 'Supported Formats', value: 'GLTF, GLB, OBJ, FBX, USDZ' },
            { label: 'Mobile Performance', value: '60 FPS on low-power mobile devices' },
            { label: 'Initial Payload', value: 'Sub-2MB compressed asset streaming' },
            { label: 'Browser Compatibility', value: '100% of modern mobile & desktop browsers' },
            { label: 'E-Commerce Sync', value: 'Shopify, WooCommerce, Custom Web APIs' }
        ],
        features: [
            {
                title: '360° Free Touch Rotation',
                description: 'Smooth, physics-damped orbit controls let visitors drag, pinch, and examine items from every angle.',
                iconName: 'Boxes'
            },
            {
                title: 'Real-Time Material & Color Switcher',
                description: 'Customers toggle finishes, fabrics, and paint shades instantly without re-rendering or page reloads.',
                iconName: 'Palette'
            },
            {
                title: 'Photorealistic Web Lighting',
                description: 'Pre-computed studio HDR environment maps simulate natural reflections, shadows, and luster.',
                iconName: 'Sun'
            },
            {
                title: 'Zero-App Instant Web Loading',
                description: 'Runs directly inside Safari, Chrome, and Edge. No third-party viewer apps or AR glasses required.',
                iconName: 'Zap'
            }
        ],
        workflow: [
            { step: '01', title: 'Asset Ingestion', description: 'We optimize your 3D CAD or studio models, reducing file size by 80% while retaining millimeter-level visual fidelity.' },
            { step: '02', title: 'Interactive Customizer Setup', description: 'We configure materials, color variants, dimension callouts, and brand lighting matching your aesthetic.' },
            { step: '03', title: '1-Line Web Embed', description: 'Embed into your website with a single clean script tag or custom React component that loads blisteringly fast.' }
        ],
        faqs: [
            { question: 'Will this slow down my website?', answer: 'No. Slice3D uses lazy-loading and Draco geometry compression, meaning the 3D canvas only initializes when in view, keeping your page speed scores 95+.' },
            { question: 'Does it work on cheap Android phones?', answer: 'Yes. Our adaptive shader pipeline automatically scales visual fidelity to maintain smooth 60fps even on budget devices.' },
            { question: 'Can customers buy directly from the 3D view?', answer: 'Yes. We link the 3D variant selection directly to your WhatsApp ordering flow or checkout cart.' }
        ],
        benefits: [
            'Silky smooth 3D rotation right inside any web browser',
            'Works instantly on phones, tablets, and old laptops',
            'Customers inspect colors, textures, and details before buying',
            'Loads crazy fast without slowing down your site'
        ]
    },
    {
        id: 'slice-leads',
        slug: 'slice-leads',
        name: 'SliceLeads',
        category: 'Local Business Lead Finder & Prospecting',
        tagline: 'Finds verified local business leads and drafts friendly, personalized conversation starters.',
        headline: 'Automated local B2B discovery that eliminates mindless copy-pasting from Google Maps.',
        description: 'SliceLeads scours local directories and regional business listings, filters out dead numbers, validates WhatsApp active status, and drafts tailored, polite icebreakers so you can start real business conversations on day one.',
        badge: 'Proprietary AGS Engine',
        accentColor: '#FF5C00',
        specs: [
            { label: 'Scraping Architecture', value: 'Headless Playwright + Clean Data Parser' },
            { label: 'Verification Pipeline', value: 'Multi-pass phone, WhatsApp & domain ping' },
            { label: 'Outreach Capacity', value: '500+ verified local records per scan batch' },
            { label: 'AI Personalization', value: 'Google Gemini 2.0 Flash icebreaker synthesis' },
            { label: 'Export Formats', value: 'CSV, Google Sheets, JSON, Direct CRM Webhook' },
            { label: 'Compliance', value: 'Strict adherence to public registry data standards' }
        ],
        features: [
            {
                title: 'Verified WhatsApp Number Detection',
                description: 'Pre-checks every extracted business phone number so your messages never bounce or fail.',
                iconName: 'CheckCircle'
            },
            {
                title: 'Geo-Targeted Local Discovery',
                description: 'Pinpoint specific neighborhoods, business clusters, and cities across Chennai, Tamil Nadu, and GCC.',
                iconName: 'MapPin'
            },
            {
                title: 'Contextual AI Icebreakers',
                description: 'Reads the prospect\'s actual services and drafts thoughtful, friendly intro messages without sounding like a robot.',
                iconName: 'Bot'
            },
            {
                title: 'Clean CRM / CSV Export',
                description: '1-click download of phone-verified lead files ready to import directly into Excel or your sales pipeline.',
                iconName: 'Download'
            }
        ],
        workflow: [
            { step: '01', title: 'Niche & Territory Targeting', description: 'Define the exact industry vertical and geographical radius you want to penetrate.' },
            { step: '02', title: 'Automated Verification Ping', description: 'Our verification engine filters dead landlines and flags active WhatsApp Business numbers.' },
            { step: '03', title: '1-Click Conversation Starters', description: 'Export ready-to-contact lead lists with tailored opening icebreakers for rapid outreach.' }
        ],
        faqs: [
            { question: 'Are these leads freshly scanned?', answer: 'Yes. Every search runs in real-time against current listings so phone numbers and active hours are accurate.' },
            { question: 'Does this comply with privacy standards?', answer: 'Yes. SliceLeads only indexes publicly listed commercial business data in full alignment with B2B regulations.' },
            { question: 'Can I export to Google Sheets directly?', answer: 'Yes. We support automatic webhooks to sync leads directly into your Google Sheets or CRM.' }
        ],
        benefits: [
            'Finds real business owners in your target city in minutes',
            'Triple-checks contact numbers so your messages don\'t bounce',
            'Drafts polite, personalized intros that people actually reply to',
            'Saves hours of mindless copy-pasting from directories'
        ]
    },
    {
        id: 'slice-mail',
        slug: 'slice-mail',
        name: 'SliceMail',
        category: 'Smart Outreach & Client Pitching',
        tagline: 'Send customized automated pitches and keep clients informed — reaching 400+ emails a day effortlessly.',
        headline: 'High-deliverability outreach engine engineered to keep your messages out of the spam folder.',
        description: 'SliceMail is built for business owners who want to pitch new prospects and keep existing clients updated with thoughtful, tailored messages that sound like you personally wrote them. It reliably dispatches over 400 customized emails daily from your own inbox with human-cadence pacing.',
        badge: 'Proprietary AGS Engine',
        accentColor: '#FF5C00',
        specs: [
            { label: 'Outreach Capacity', value: '400+ customized emails per 24 hours' },
            { label: 'Deliverability Protocol', value: 'DKIM, SPF, DMARC custom alignment' },
            { label: 'Dispatch Architecture', value: 'Paced human delays (60-120s between emails)' },
            { label: 'Mailbox Provider', value: 'Zoho Mail, Google Workspace, Custom SMTP' },
            { label: 'Deliverability Score', value: '99.4% primary inbox landing rate' },
            { label: 'Spam Penalty Guard', value: 'Automated bounce monitoring & throttle' }
        ],
        features: [
            {
                title: 'Automated Bespoke Pitching',
                description: 'Tailors each email using prospect-specific context, recent projects, and personalized value propositions.',
                iconName: 'Send'
            },
            {
                title: 'Client "Keep Informed" Cadence',
                description: 'Automatically dispatches regular project milestone updates to current clients so they never feel out of the loop.',
                iconName: 'Clock'
            },
            {
                title: '400+ Daily Paced Delivery',
                description: 'Sends at least 400 customized emails a day using staggered human timing to protect domain reputation.',
                iconName: 'Gauge'
            },
            {
                title: 'Spam Score Pre-Check',
                description: 'Evaluates your copy against 200+ spam filter rules before dispatch to guarantee inbox placement.',
                iconName: 'ShieldCheck'
            }
        ],
        workflow: [
            { step: '01', title: 'Domain & Inbox Hardening', description: 'We configure your SPF, DKIM, and DMARC records to establish maximum domain reputation with Gmail and Outlook.' },
            { step: '02', title: 'Template & Variable Personalization', description: 'Craft compelling pitch angles and dynamic merge tags that resonate with your specific buyer persona.' },
            { step: '03', title: 'Automated Paced Dispatch', description: 'Schedule the 400/day dispatch sequence with real-time open and response tracking.' }
        ],
        faqs: [
            { question: 'Will my domain get blacklisted?', answer: 'No. By enforcing strict 90-second intervals between messages and capping daily sends at safe volumes, your domain reputation stays pristine.' },
            { question: 'Can I connect my Zoho Mail account?', answer: 'Yes. SliceMail natively integrates with Zoho Mail, Google Workspace, and self-hosted SMTP relays.' },
            { question: 'Can I review emails before they send?', answer: 'Yes. You can run in "Review Mode" where drafts queue in your mailbox for 1-click approval.' }
        ],
        benefits: [
            'Custom automated pitches tailored to each recipient\'s business',
            'Keeps existing customers informed with regular personalized updates',
            'Outreach engine capable of 400+ customized emails per day',
            'Lives right in your mail workflow so you stay in total control'
        ]
    },
    {
        id: 'slice-inbox',
        slug: 'slice-inbox',
        name: 'SliceInbox',
        category: 'Team Mailbox Chief of Staff',
        tagline: 'A quiet digital manager that triages company inboxes and sorts out the noise.',
        headline: 'Self-hosted AI mail triage that ensures zero high-value inquiries slip through the cracks.',
        description: 'SliceInbox connects to your company\'s shared inboxes (sales@, info@, support@) and acts as an executive chief of staff. It identifies high-value inquiries, flags urgent client requests, filters automated promotions, and generates ready-to-approve response drafts.',
        badge: 'Proprietary AGS Engine',
        accentColor: '#FF5C00',
        specs: [
            { label: 'Integration Layer', value: 'FastMCP, IMAP/SMTP, Zoho Mail, Gmail API' },
            { label: 'Inference Privacy', value: '100% self-hosted on client infrastructure' },
            { label: 'Triage Latency', value: 'Sub-3 second automated classification' },
            { label: 'Draft Synthesis', value: 'Context-aware drafting matching company voice' },
            { label: 'Data Retention', value: 'Zero external cloud logging or third-party training' },
            { label: 'Security Standard', value: 'Strict local encryption with zero telemetry' }
        ],
        features: [
            {
                title: 'High-Value Lead Priority Tagging',
                description: 'Instantly identifies commercial inquiries and alerts key stakeholders via WhatsApp or Slack.',
                iconName: 'Tag'
            },
            {
                title: '1-Click FastMCP Draft Replies',
                description: 'Synthesizes accurate, helpful response drafts that staff can approve or edit with a single click.',
                iconName: 'Sparkles'
            },
            {
                title: 'Aggressive Noise & Promo Silencer',
                description: 'Silently categorizes unsolicited vendor pitches and cold blasts into an archive digest.',
                iconName: 'Filter'
            },
            {
                title: '100% Private Self-Hosting',
                description: 'Runs entirely on your own server or workspace so confidential client correspondence never leaks.',
                iconName: 'Lock'
            }
        ],
        workflow: [
            { step: '01', title: 'Inbox Connection', description: 'Connect your corporate mailbox credentials over secure, encrypted IMAP or OAuth.' },
            { step: '02', title: 'Rules & Brand Voice Training', description: 'We teach the agent your pricing, service terms, and communication style.' },
            { step: '03', title: 'Silent 24/7 Triage', description: 'The agent monitors incoming emails, tagging priorities and preparing drafts for review.' }
        ],
        faqs: [
            { question: 'Will it accidentally send emails on its own?', answer: 'No. By default, SliceInbox operates in "Supervised Mode" — it prepares drafts for your team to review and approve.' },
            { question: 'Does anyone else read our client emails?', answer: 'No. The system runs on your own infrastructure with zero external data sharing.' },
            { question: 'How does it handle complex technical questions?', answer: 'It extracts key questions and cross-references your internal documentation before drafting a response.' }
        ],
        benefits: [
            'Watches multiple shared inboxes 24/7 without taking lunch breaks',
            'Catches urgent client requests and flags them before you log in',
            'Drafts quick response suggestions ready for your team\'s thumbs up',
            'Runs quietly on your own servers so you stay in total control'
        ]
    },
    {
        id: 'slice-ppt',
        slug: 'slice-ppt',
        name: 'SlicePPT',
        category: 'Instant Presentation & Deck Generator',
        tagline: 'Turns rough notes, spreadsheets, and specs into gorgeous presentation slides in seconds.',
        headline: 'Automated executive deck synthesis with pixel-perfect 16:9 layouts and zero PowerPoint wrestling.',
        description: 'SlicePPT takes raw spreadsheet rows, bullet notes, product specs, or project outlines and automatically designs executive-grade 16:9 presentation PDFs. It arranges visual hierarchy, balances spacing, formats financial tables, and matches your brand aesthetic instantly.',
        badge: 'Proprietary AGS Engine',
        accentColor: '#FF5C00',
        specs: [
            { label: 'Output Aspect Ratio', value: 'Standard 16:9 High-Definition Widescreen' },
            { label: 'File Formats', value: 'Vector-sharp PDF, SVG, High-Res PNG' },
            { label: 'Generation Speed', value: '4-slide executive deck in under 8 seconds' },
            { label: 'Input Formats', value: 'Markdown, Plain Text, CSV, Excel, Notion' },
            { label: 'Typography Engine', value: 'Custom brand fonts, Montserrat, Inter' },
            { label: 'Branding Integration', value: 'Auto-embeds company logo, stamp & colors' }
        ],
        features: [
            {
                title: 'Spreadsheet-to-Slide Converter',
                description: 'Transforms raw Excel numbers into clean comparison grids and key milestone summaries.',
                iconName: 'FileSpreadsheet'
            },
            {
                title: 'Executive 16:9 PDF Export',
                description: 'Generates print-ready, vectorized presentation decks ideal for client pitches and board meetings.',
                iconName: 'Layout'
            },
            {
                title: 'Brand Palette & Logo Injection',
                description: 'Applies your exact hex codes, fonts, and company emblem uniformly across every slide.',
                iconName: 'Palette'
            },
            {
                title: 'Zero PowerPoint Formatting',
                description: 'No nudging text boxes, fighting bullet indents, or struggling with slide alignments ever again.',
                iconName: 'Zap'
            }
        ],
        workflow: [
            { step: '01', title: 'Input Notes or Outline', description: 'Paste raw bullets, meeting minutes, or spreadsheet metrics into the generator.' },
            { step: '02', title: 'Automated Slide Architecture', description: 'The engine distributes content into logical problem, solution, spec, and milestone slides.' },
            { step: '03', title: 'Instant 16:9 PDF Download', description: 'Review the generated deck in the interactive viewer and download the polished presentation.' }
        ],
        faqs: [
            { question: 'Can I customize the slide colors?', answer: 'Yes. We configure the generator with your exact corporate color scheme and font hierarchy.' },
            { question: 'Can it handle confidential financial data?', answer: 'Yes. SlicePPT processes everything locally in your browser/server with no external storage.' },
            { question: 'What resolution are the exported decks?', answer: 'Decks are exported in vector PDF at 1920x1080 resolution, ensuring pin-sharp clarity on 4K projectors.' }
        ],
        benefits: [
            'Turns raw Excel schedules & notes into client-ready slide decks',
            'Generates clean 16:9 executive presentation PDFs on demand',
            'Auto-inserts crisp layouts matching your exact specifications',
            'Saves hours of late-night formatting and alignment frustration'
        ]
    },
    {
        id: 'slice-dam',
        slug: 'slice-dam',
        name: 'SliceDAM',
        category: 'Business Document & Asset Hub',
        tagline: 'Organize client contracts, invoices, NDAs, and team files in one clean, searchable vault.',
        headline: 'Automated contract forge and digital asset vault tailored for growing businesses.',
        description: 'SliceDAM is a lightweight, tamper-proof digital asset and document management setup built for real businesses. It generates and archives branded client contracts, tax invoices, and mutual NDAs with SHA-256 digital seals, keeping every critical file organized and instantly searchable.',
        badge: 'Proprietary AGS Engine',
        accentColor: '#FF5C00',
        specs: [
            { label: 'Security & Integrity', value: 'SHA-256 cryptographic tamper-proof seals' },
            { label: 'Tax Compliance', value: 'Standard GST tax invoice calculation engine' },
            { label: 'Storage Mode', value: 'Self-hosted on client drives or private cloud' },
            { label: 'Legal Templates', value: 'MSAs, NDAs, Proposals, Work Orders' },
            { label: 'Search Engine', value: 'Sub-second full-text document indexing' },
            { label: 'Export Options', value: 'Signed PDF, Word DOCX, JSON Audit Log' }
        ],
        features: [
            {
                title: 'Branded Contract & Invoice Forge',
                description: 'Generates professionally formatted client agreements and GST invoices with your MSME number and signature stamp.',
                iconName: 'FileCheck'
            },
            {
                title: 'SHA-256 Cryptographic Verification',
                description: 'Every document receives an immutable checksum hash to verify authenticity and prevent post-signature alterations.',
                iconName: 'Shield'
            },
            {
                title: 'Centralized Searchable Repository',
                description: 'Locate any agreement, tax record, or brand asset in seconds without digging through messy email threads.',
                iconName: 'Search'
            },
            {
                title: '100% Data Sovereignty',
                description: 'Files reside on your own secure drives with zero recurring per-user SaaS subscription lock-in.',
                iconName: 'HardDrive'
            }
        ],
        workflow: [
            { step: '01', title: 'Vault Structure Setup', description: 'We configure your folders for client agreements, tax invoices, vendor contracts, and media assets.' },
            { step: '02', title: 'Template Standardization', description: 'Upload your company details, GSTIN, MSME registration, and digital signature stamps.' },
            { step: '03', title: '1-Click Document Generation', description: 'Generate, sign, seal, and retrieve verified corporate records whenever needed.' }
        ],
        faqs: [
            { question: 'Is this legally compliant for Indian business contracts?', answer: 'Yes. Generated documents comply with Indian IT Act electronic signature guidelines and GST invoice standards.' },
            { question: 'Can multiple team members access the vault?', answer: 'Yes. Role-based permissions let you specify who can generate invoices versus who can view contracts.' },
            { question: 'Where are our files stored?', answer: 'On your own storage volume (AWS S3, Google Cloud, or local office NAS), ensuring 100% data control.' }
        ],
        benefits: [
            'Central vault for contracts, NDAs, proposals, and tax records',
            'Auto-stamps and generates branded client invoices and agreements',
            'Fast search so your team never asks "where is that file?" again',
            'Self-hosted on your own secure drives with zero monthly lock-in'
        ]
    },
    {
        id: 'slice-class',
        slug: 'slice-class',
        name: 'SliceClass',
        category: 'Private Academy & Video Studio',
        tagline: 'A clean online course studio for teaching your craft with zero tech headaches.',
        headline: 'Distraction-free learning portal with instant phone OTP login and buffer-free video streaming.',
        description: 'SliceClass is a refined, monochromatic online learning portal built for educators, boutique studios, and corporate teams. Students log in simply using their phone number (no forgotten passwords), stream high-definition 1080p lesson videos, and track their module completion smoothly.',
        badge: 'Proprietary AGS Engine',
        accentColor: '#FF5C00',
        specs: [
            { label: 'Authentication', value: 'Password-free WhatsApp / SMS OTP verification' },
            { label: 'Streaming Protocol', value: 'HLS / Adaptive bitrate 1080p buffer-free' },
            { label: 'Progress Tracking', value: 'Per-lesson timestamp and module percentage' },
            { label: 'Theme Architecture', value: 'Monochromatic dark mode & high-contrast studio' },
            { label: 'Mobile Experience', value: 'Fully responsive touch controls on mobile' },
            { label: 'Content Protection', value: 'Dynamic watermark & encrypted streaming' }
        ],
        features: [
            {
                title: 'Password-Free Phone OTP Login',
                description: 'Eliminates lost password tickets. Students authenticate in seconds via direct phone SMS or WhatsApp OTP.',
                iconName: 'Smartphone'
            },
            {
                title: 'Monochromatic Studio Player',
                description: 'An elegant, distraction-free video interface with speed controls, chapter navigation, and clean notes.',
                iconName: 'PlayCircle'
            },
            {
                title: 'Automated Progress Tracking',
                description: 'Visual progress meters keep students motivated and clearly show remaining lessons and milestones.',
                iconName: 'Award'
            },
            {
                title: 'Buffer-Free Video Delivery',
                description: 'Adaptive bitrate streaming delivers instant playback even on spotty 4G mobile connections.',
                iconName: 'Zap'
            }
        ],
        workflow: [
            { step: '01', title: 'Course Curriculum Architecture', description: 'Organize your video lessons, downloadable PDFs, and exercise files into modules.' },
            { step: '02', title: 'Branding & Video Ingestion', description: 'We encode your video assets for adaptive streaming and apply your studio aesthetic.' },
            { step: '03', title: 'Student Access & Launch', description: 'Onboard students instantly with seamless phone OTP logins and zero tech support friction.' }
        ],
        faqs: [
            { question: 'Do students need to create complicated passwords?', answer: 'No. They just enter their phone number and receive an instant OTP. Zero password recovery friction.' },
            { question: 'Can students download the videos?', answer: 'Videos use encrypted streaming to protect your proprietary material from unauthorized downloading.' },
            { question: 'Can we add quizzes or homework submissions?', answer: 'Yes. SliceClass easily extends to include student assignments, downloadable code files, and completion certificates.' }
        ],
        benefits: [
            'Clean, distraction-free player that looks stunning in dark mode',
            'Simple phone OTP login — no forgotten passwords or lost accounts',
            'Buttery smooth, buffer-free video streaming on any connection',
            'Step-by-step progress tracking so students actually finish'
        ]
    }
];
