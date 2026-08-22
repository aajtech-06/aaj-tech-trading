import { HeroSlide, Category, Product, Industry, Counter, NavItem } from '../types';

export const navItems: NavItem[] = [
  { title: 'Home', href: '/' },
  {
    title: 'Connectors',
    href: '/products',
    items: [
      { title: 'D-Sub Connectors', href: '/products?category=dsub' },
      { title: 'Circular Connectors', href: '/products?category=circular' },
      { title: 'Rectangular Connectors', href: '/products?category=rectangular' },
    ],
  },
  {
    title: 'Wire Harness',
    href: '/about-wire-harness',
    items: [
      { title: 'About Wire Harness', href: '/about-wire-harness' },
      { title: 'Products', href: '/wire-harness-products' },
    ],
  },
  {
    title: 'EV Solution',
    href: '/about-ev',
    items: [
      { title: 'About EV', href: '/about-ev' },
      { title: 'Product', href: '/ev-products' },
      { title: 'Catalog', href: '/ev-catalog' },
    ],
  },
  {
    title: 'About Us',
    href: '/about',
    items: [
      { title: 'About Us', href: '/about' },
      { title: 'Catalog', href: '/catalog' },
      { title: 'Career', href: '/career' },
    ],
  },
  {
    title: 'Blog',
    href: '/blog',
    items: [
      { title: 'All Blogs', href: '/blog' },
      { title: 'Technical', href: '/blog?category=Technical' },
      { title: 'Industry', href: '/blog?category=Industry' },
      { title: 'Company & Culture', href: '/blog?category=Company %26 Culture' },
    ],
  },
  { title: 'Contact Us', href: '/contact' },
];

export const heroSlides: HeroSlide[] = [
  {
    id: 1,
    title: 'Industrial Connectors',
    subtitle: '',
    image: '/banner1.png',
    ctaText: '',
    ctaHref: '',
    isFullImage: true,
    backgroundColor: 'white'
  },
  {
    id: 2,
    title: 'Battery Connectors',
    subtitle: '',
    image: '/banner2.png',
    ctaText: '',
    ctaHref: '',
    isFullImage: true,
    backgroundColor: 'white'
  },
  {
    id: 3,
    title: 'New Energy Storage Connectors',
    subtitle: '',
    image: '/New-Energy-Storage-Desktop-Banner.png',
    ctaText: '',
    ctaHref: '',
    isFullImage: true,
    backgroundColor: 'white'
  },
  {
    id: 4,
    title: 'Delivering Trusted Connections',
    subtitle: 'Built for stability, safety, and performance. Certified industrial connectivity solutions.',
    image: '/connector_collage_v2.png',
    ctaText: 'Know More',
    ctaHref: '/products',
    backgroundColor: '#ED1C24',
    isFullImage: false,
  },
  {
    id: 5,
    title: 'Precision Wire Harnesses',
    subtitle: 'Custom engineered solutions for complex industrial applications and machinery.',
    image: '/wire_harness_collage_v2.png',
    ctaText: 'Know More',
    ctaHref: '/wire-harness-products',
    backgroundColor: '#ED1C24',
    isFullImage: false,
  },
];

export const categories: Category[] = [
  {
    id: 'connectors',
    title: 'Industrial Connectors',
    description: 'High-quality connectors for all your industrial needs.',
    image: 'https://images.unsplash.com/photo-1558467523-46113f1fef72?q=80&w=2070&auto=format&fit=crop',
    icon: 'Settings',
  },
  {
    id: 'harness',
    title: 'Wire Harnesses',
    description: 'Custom wire harness assemblies for precision equipment.',
    image: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?q=80&w=2070&auto=format&fit=crop',
    icon: 'Zap',
  },
  {
    id: 'components',
    title: 'Electronic Components',
    description: 'A wide range of electronic parts for industrial automation.',
    image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=2070&auto=format&fit=crop',
    icon: 'Cpu',
  },
];

export const products: Product[] = [
  {
    id: 'dsub-connector-9p',
    name: '9-Pin D-Sub Connector',
    categoryId: 'connectors',
    description: 'Standard 9-pin male connector for serial communication.',
    image: 'https://images.unsplash.com/photo-1555664424-778a1e5e1b48?q=80&w=2070&auto=format&fit=crop',
    features: ['Gold plated pins', 'Durable shell', 'Standard mounting'],
    specifications: {
      Pins: '9',
      Gender: 'Male',
      Material: 'Steel/Brass',
      Current: '5A',
    },
  },
];

export const industries: Industry[] = [
  {
    id: 'industrial-automation',
    title: 'Industrial Automation',
    description: 'Reliable connectors, terminals and cable solutions for automated machinery and industrial control systems.',
    image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=2070&auto=format&fit=crop',
  },
  {
    id: 'solar-renewable-energy',
    title: 'Solar & Renewable Energy',
    description: 'Solar connectors and electrical connectivity solutions for renewable energy and solar applications.',
    image: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?q=80&w=2070&auto=format&fit=crop',
  },
  {
    id: 'battery-energy-storage',
    title: 'Battery & Energy Storage',
    description: 'High-current connectors and power connectivity solutions for batteries and energy storage systems.',
    image: 'https://images.unsplash.com/photo-1620714223084-8fcacc6dfd8d?q=80&w=2071&auto=format&fit=crop',
  },
  {
    id: 'electrical-power-systems',
    title: 'Electrical & Power Systems',
    description: 'Reliable electrical connectivity solutions for power distribution, electrical equipment and industrial applications.',
    image: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?q=80&w=2069&auto=format&fit=crop',
  },
  {
    id: 'wire-harness-cable-assemblies',
    title: 'Wire Harness & Cable Assemblies',
    description: 'Custom wire harnesses and cable assembly solutions for OEM and industrial applications.',
    image: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?q=80&w=2070&auto=format&fit=crop',
  },
  {
    id: 'ev-automotive',
    title: 'EV & Automotive',
    description: 'High-performance connectivity solutions for electric vehicles, batteries and automotive systems.',
    image: 'https://images.unsplash.com/photo-1593941707882-a5bba14938c7?q=80&w=2070&auto=format&fit=crop',
  },
];


export const counters: Counter[] = [
  { id: 1, label: 'Quality Certs', value: 8, suffix: '+' },
  { id: 2, label: 'Products In Stock', value: 25, suffix: 'k+' },
  { id: 3, label: 'Global Partners', value: 50, suffix: '+' },
  { id: 4, label: 'Years of Service', value: 20, suffix: '+' },
];
