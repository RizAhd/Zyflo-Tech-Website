/* ==========================================================================
   Zyflo Tech: site content and configuration
   ONE file. Everything a human might want to change lives here.

   WARNING: ITEMS MARKED `TODO_` ARE PLACEHOLDERS AND MUST BE FILLED IN
       BEFORE LAUNCH. Search this file for "TODO_" to find them all.
       Anything still set to a TODO_ value is automatically hidden from the
       rendered site (see `isTodo()` below) so nothing fake can ever ship.
   ========================================================================== */

/** True when a config value is still an unfilled placeholder. */
export const isTodo = (v: string | undefined | null): boolean =>
  !v || v.startsWith('TODO_')

// ---------------------------------------------------------------------------
// Business identity
// ---------------------------------------------------------------------------
export const business = {
  name: 'Zyflo Tech',
  tagline: 'Digital tech solutions',
  /** Used in the footer copyright and JSON-LD. */
  legalName: 'Zyflo Tech',
  owner: 'Hysham',
  location: 'Sri Lanka',
  /** Public site URL. Set this once you pick a domain. */
  url: 'TODO_SITE_URL', // e.g. https://zyflotech.com
  foundedYear: 2018,
} as const

/** Clients with shipped work. Only add a name here once the project is live. */
export const clients = [
  { name: 'SJD POS', kind: 'POS system', href: undefined },
  { name: 'mrvadventure.lk', kind: 'Website', href: 'https://mrvadventure.lk' },
] as const

// ---------------------------------------------------------------------------
// Contact: fill these in and the site wires itself up
// ---------------------------------------------------------------------------
export const contact = {
  /** International format, digits only, no + or spaces. e.g. 94771234567 */
  whatsapp: 'TODO_WHATSAPP_NUMBER',
  /** Pre-filled first message when someone taps WhatsApp. */
  whatsappMessage: "Hi Zyflo Tech, I'd like to talk about a project.",

  email: 'TODO_EMAIL',
  /** Human-readable phone, e.g. +94 77 123 4567 */
  phone: 'TODO_PHONE',

  /**
   * Free access key from https://web3forms.com, which makes the contact form
   * email you directly. Without it the form falls back to WhatsApp and email
   * links.
   */
  web3formsKey: 'TODO_WEB3FORMS_ACCESS_KEY',
} as const

export const socials = [
  { label: 'Facebook',  url: 'TODO_FACEBOOK_URL' },
  { label: 'Instagram', url: 'TODO_INSTAGRAM_URL' },
  { label: 'LinkedIn',  url: 'TODO_LINKEDIN_URL' },
  { label: 'GitHub',    url: 'TODO_GITHUB_URL' },
] as const

// ---------------------------------------------------------------------------
// Navigation: the single source of truth for section order and labels.
// Order here drives the nav, the scroll-spy and the tunnel stations, so every
// `id` must match the id of a section actually rendered on the page.
// ---------------------------------------------------------------------------
export const navLinks = [
  { id: 'services', label: 'Services' },
  { id: 'process',  label: 'Process' },
  { id: 'work',     label: 'Work' },
  { id: 'about',    label: 'Studio' },
  { id: 'faq',      label: 'FAQ' },
  { id: 'contact',  label: 'Contact' },
] as const

// ---------------------------------------------------------------------------
// Hero
// ---------------------------------------------------------------------------
export const hero = {
  eyebrow: 'Zyflo Tech, Sri Lanka',
  /** Split on `|` for the line-by-line reveal. */
  headline: 'Digital work that|pulls its weight.',
  lead:
    'Websites, apps and automations built for real businesses: designed with care, ' +
    'shipped on time, and handed over so you own every line of it.',
  primaryCta: { label: "Start a project", href: '#contact' },
  secondaryCta: { label: 'See what I do', href: '#services' },
} as const

// ---------------------------------------------------------------------------
// Capabilities: the 21 things built most often, three for every service.
//
// These used to be image tiles in /public/showcase. They are now rendered as
// animated type instead: invented mockups made the page look like a stock
// template, and there are no client screenshots to use. `service` links
// each capability back to the service that owns it, so every id below has to
// exist in `services`.
// ---------------------------------------------------------------------------
export interface Capability {
  title: string
  service: string
}

export const capabilities: Capability[] = [
  { title: 'Business Websites',     service: 'web' },
  { title: 'E-commerce Stores',     service: 'web' },
  { title: 'Landing Pages',         service: 'web' },
  { title: 'Invoicing & POS',       service: 'software' },
  { title: 'Admin Dashboards',      service: 'software' },
  { title: 'Workflow Automation',   service: 'software' },
  { title: 'Android & iOS Apps',    service: 'mobile' },
  { title: 'Offline-first Apps',    service: 'mobile' },
  { title: 'Store Submissions',     service: 'mobile' },
  { title: 'Support Assistants',    service: 'ai' },
  { title: 'Document Extraction',   service: 'ai' },
  { title: 'Content Pipelines',     service: 'ai' },
  { title: 'Social Ad Videos',      service: 'video' },
  { title: 'Product Explainers',    service: 'video' },
  { title: 'Voiceover & Subtitles', service: 'video' },
  { title: 'Search Optimisation',   service: 'marketing' },
  { title: 'Ad Campaigns',          service: 'marketing' },
  { title: 'Conversion Tracking',   service: 'marketing' },
  { title: 'Content Calendars',     service: 'social' },
  { title: 'Page Management',       service: 'social' },
  { title: 'Performance Reports',   service: 'social' },
]

// ---------------------------------------------------------------------------
// Services: exactly 7. Order = conversion order = tunnel station order.
// Every service carries exactly four deliverables.
// ---------------------------------------------------------------------------
export interface Service {
  id: string
  index: string
  title: string
  promise: string
  deliverables: string[]
}

export const services: Service[] = [
  {
    id: 'web',
    index: '01',
    title: 'Website Building',
    promise:
      'A fast, findable website that turns visitors into enquiries, not a brochure nobody reads.',
    deliverables: [
      'Business sites and landing pages',
      'E-commerce and online ordering',
      'Built for speed on mobile data',
      'Search-ready structure and metadata',
    ],
  },
  {
    id: 'software',
    index: '02',
    title: 'Software Application Development',
    promise:
      'The repetitive part of your day, handled by software, so your team stops retyping things.',
    deliverables: [
      'Invoicing, POS and inventory tools',
      'Internal dashboards and admin panels',
      'Spreadsheet and workflow automation',
      'System integrations that talk to each other',
    ],
  },
  {
    id: 'mobile',
    index: '03',
    title: 'Mobile Application Development',
    promise:
      'An app your customers keep on the first screen, on both Android and iOS from one codebase.',
    deliverables: [
      'Cross-platform Android and iOS apps',
      'Offline-capable, low-data by design',
      'Play Store and App Store submission',
      'Push notifications and analytics',
    ],
  },
  {
    id: 'ai',
    index: '04',
    title: 'AI Automation',
    promise:
      'Practical AI wired into your actual workflow, measured on hours saved, not novelty.',
    deliverables: [
      'Customer support and enquiry bots',
      'Document and invoice data extraction',
      'Content and reporting pipelines',
      'AI features inside your existing tools',
    ],
  },
  {
    id: 'video',
    index: '05',
    title: 'AI Video Generation',
    promise:
      'Short video for ads, social and explainers, produced with AI tools instead of a film crew.',
    deliverables: [
      'Promo and ad videos for social',
      'Product and service explainers',
      'Voiceover, subtitles and captions',
      'Vertical cuts sized for each platform',
    ],
  },
  {
    id: 'marketing',
    index: '06',
    title: 'Digital Marketing',
    promise:
      'Getting the right people to the thing you just built, and knowing which effort actually paid.',
    deliverables: [
      'Search optimisation (SEO)',
      'Google and Meta ad campaigns',
      'Email and WhatsApp campaigns',
      'Analytics and conversion tracking',
    ],
  },
  {
    id: 'social',
    index: '07',
    title: 'Social Media Management',
    promise:
      'Your pages posted to, replied to and reported on every month, without you having to remember.',
    deliverables: [
      'A content calendar agreed upfront',
      'Posts, reels and stories',
      'Comment and message replies',
      'Monthly reporting on what worked',
    ],
  },
]

// ---------------------------------------------------------------------------
// Work: shipped projects only. Add a new entry when a project goes live.
// ---------------------------------------------------------------------------
export interface Project {
  id: string
  title: string
  category: string
  summary: string
  tags: string[]
  href?: string
}

export const projects: Project[] = [
  {
    id: 'invoice-suite',
    title: 'Zyflo Invoice & Receipt Suite',
    category: 'Custom Software',
    summary:
      'An offline-first invoicing tool that generates invoices and receipts, adapts the document ' +
      'to payment status, and exports clean single-page PDFs. Built and used in-house.',
    tags: ['Offline-first', 'PDF export', 'Local storage'],
  },
  {
    id: 'sjd-pos',
    title: 'SJD POS',
    category: 'Software Application Development',
    summary:
      'A point of sale system built and shipped for SJD, a client of the studio. ' +
      'Designed around the way the shop actually sells.',
    tags: ['POS', 'Custom software', 'Shipped'],
  },
  {
    id: 'mrvadventure',
    title: 'mrvadventure.lk',
    category: 'Website Building',
    summary:
      'The website for mrvadventure.lk, designed, built and launched by Zyflo Tech. ' +
      'Live on the web today.',
    tags: ['Website', 'Live', 'Sri Lanka'],
    href: 'https://mrvadventure.lk',
  },
]

// ---------------------------------------------------------------------------
// Process
// ---------------------------------------------------------------------------
export const process = [
  {
    step: '01',
    title: 'Understand',
    body: 'A proper conversation about what the business actually needs, before a single mockup. You get a written scope and a fixed quote in LKR.',
  },
  {
    step: '02',
    title: 'Design',
    body: 'You see the real thing laid out and agree on it before code starts, so there are no surprises at the end.',
  },
  {
    step: '03',
    title: 'Build',
    body: 'Built in visible stages with a link you can open any time. You watch it come together instead of waiting in the dark.',
  },
  {
    step: '04',
    title: 'Hand over',
    body: 'Launched, documented, and yours: accounts, code and all. Plus support after launch, not a disappearing act.',
  },
] as const

// ---------------------------------------------------------------------------
// About: honest solo-operator positioning. No invented headcount or awards.
// ---------------------------------------------------------------------------
export const about = {
  heading: 'One person. Fully accountable.',
  body: [
    'Zyflo Tech is a one-person studio, and that is the point. You talk to the person who ' +
      'writes the code. Nothing gets lost between a salesperson, a project manager and a ' +
      'developer who never heard what you asked for.',
    'That means honest scoping, direct answers, and work handed over properly. The accounts, ' +
      'the code and the documentation are yours at the end. No lock-in, no hostage situation.',
  ],
  /** Honest capability claims, deliberately not fabricated statistics. */
  points: [
    { label: 'Direct contact', value: 'You talk to the builder' },
    { label: 'Fixed quotes', value: 'Priced in LKR, agreed upfront' },
    { label: 'Full handover', value: 'You own the code & accounts' },
    { label: 'After launch', value: 'Support that continues' },
  ],
} as const

// ---------------------------------------------------------------------------
// Contact section + form
// ---------------------------------------------------------------------------
export const contactSection = {
  heading: "Let's talk about what you need.",
  lead:
    'Tell me what you are trying to build and I will tell you honestly whether I am the right ' +
    'person for it, roughly what it costs, and how long it takes.',
  budgetOptions: [
    'Not sure yet',
    'Under Rs 50,000',
    'Rs 50,000 to 150,000',
    'Rs 150,000 to 400,000',
    'Rs 400,000 to 1,000,000',
    'Over Rs 1,000,000',
  ],
} as const

// ---------------------------------------------------------------------------
// FAQ: drives the on-page FAQ section and the FAQPage structured data.
//
// Rules for editing, because this block is read both by search engines and by
// AI assistants answering questions about the studio:
//   1. Answer in the FIRST sentence, then add at most two more.
//   2. Keep every answer to roughly 40 to 70 words.
//   3. State no price and no delivery time in days. Cost is
//      quoted per project in LKR after a scoping conversation, and the budget
//      bands in `contactSection.budgetOptions` are the only figures to point at.
//   4. Say nothing that is not already true elsewhere on this page.
// ---------------------------------------------------------------------------
export interface Faq {
  q: string
  a: string
}

export const faqs: Faq[] = [
  {
    q: 'How much does a website or app cost?',
    a:
      'Every project is quoted individually in Lankan rupees, as a fixed price agreed before ' +
      'any work starts. The cost depends on how many pages or screens you need and how much ' +
      'of the work is custom. The enquiry form has budget bands starting under Rs 50,000, so ' +
      'pick the one that fits and the scope is built around it.',
  },
  {
    q: 'Who actually does the work?',
    a:
      'I do, and I am the only person in the studio. Zyflo Tech is a one person ' +
      'operation based in Sri Lanka, so the person you brief is the person who writes the ' +
      'code and hands it over. There is no sales layer and no project manager repeating your ' +
      'words back to you.',
  },
  {
    q: 'Do I own the code and the accounts at the end?',
    a:
      'Yes, all of it is handed over to you: the code, the hosting and domain accounts, and ' +
      'the documentation. There is no lock-in, no rented platform you cannot leave, and no ' +
      'situation where you have to come back just to make a change. If you later move to ' +
      'another developer, they get a clean handover.',
  },
  {
    q: 'How long does a project take?',
    a:
      'It depends on the scope, and you get a timeline in writing alongside your fixed quote ' +
      'before work begins. A small marketing site moves faster than custom software or a ' +
      'mobile app, so the honest answer comes after a short scoping conversation. The build ' +
      'then runs in visible stages with a link you can open any time.',
  },
  {
    q: 'What happens after the site or app goes live?',
    a:
      'Support continues after launch, it is not a disappearing act. You can come back with ' +
      'fixes, changes and questions, and because you already own the code and the accounts ' +
      'you are never stuck waiting on anyone. Further work is quoted the same way as the ' +
      'build, as a fixed price agreed before it starts.',
  },
  {
    q: 'Can you work with me if I am not in Colombo?',
    a:
      'Yes, the studio works remotely with clients anywhere. Zyflo Tech is based in Sri Lanka ' +
      'and projects run over calls, messages and shared links, so your location does not ' +
      'change how the work is scoped, built or handed over. Enquiries usually get a reply ' +
      'within a day or two.',
  },
  {
    q: 'Who have you built for?',
    a:
      'Zyflo Tech has been running since 2018. Shipped work includes a point of sale system ' +
      'for SJD and the website for mrvadventure.lk, alongside the studio\'s own invoice and ' +
      'receipt tool. Each was built and handed over by the same person, so you can ask me ' +
      'about any of them directly.',
  },
  {
    q: 'What services do you offer?',
    a:
      'Seven: website building, software application development, mobile application ' +
      'development, AI automation, AI video generation, digital marketing and social media ' +
      'management. They are meant to fit together, so one person can build the site, wire up ' +
      'the automation behind it and then run the pages that feed it.',
  },
]

// ---------------------------------------------------------------------------
// SEO
// ---------------------------------------------------------------------------
export const seo = {
  title: 'Zyflo Tech: Web, Apps, AI and Marketing in Sri Lanka',
  description:
    'Zyflo Tech builds websites, apps, software, AI automation, AI video, marketing and ' +
    'social media for businesses in Sri Lanka. Fixed quotes in LKR, full handover.',
  keywords:
    'web development Sri Lanka, software development Sri Lanka, mobile app development, ' +
    'AI automation, AI video generation, digital marketing Sri Lanka, social media management',
  ogImage: '/brand/og-image.png',
} as const
