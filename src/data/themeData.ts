import { type ThemePalette, type NavItem } from './types';

// All color values are CSS variables — theme switches automatically when
// <html class="dark"> is toggled. Brand red stays the same in both themes.
export const themeData: ThemePalette = {
  colors: {
    // 🔴 Brand (same in both themes)
    brand: "#E94057",
    brandHover: "#d6364d",
    brandDeep: "#b91c1c",

    // 🎨 Backgrounds — all via CSS vars
    pageBackground: "var(--color-page-bg)",
    bgSoft: "var(--color-bg-soft)",
    bgAccent: "var(--color-bg-accent)",
    bgFooter: "var(--color-bg-footer)",
    cardBg: "var(--color-card-bg)",

    // 📝 Text
    textHeading: "var(--color-text-heading)",
    textBody: "var(--color-text-body)",
    textMuted: "var(--color-text-muted)",

    // 🧱 Borders
    border: "var(--color-border)",
    borderSoft: "var(--color-border-soft)",

    // 🔲 Inputs
    inputBg: "var(--color-input-bg)",
    inputSolid: "var(--color-input-solid)",

    // White
    white: "#FFFFFF",

    // Legacy dark-mode keys kept for backward compat
    bgSoftDark: "#121212",
    cardDark: "#1E1E1E",
    textHeadingDark: "#FFFFFF",
    textBodyDark: "#A0A0A0",
    borderDark: "#2A2A2A",
  }
};

export const navigationData: NavItem[] = [
  { label: "Advisors", path: "/#advisors" },
  { label: "How It Works", path: "/#how-it-works" },
  { label: "Pricing", path: "/#pricing" },
  { label: "FAQ", path: "/#faq" }
];

export const footerLinks = {
  company: [
    { label: "About Us", path: "/about" },
    { label: "Careers", path: "/careers" },
    { label: "Success Stories", path: "/success-stories" },
    { label: "Contact Us", path: "/contact" },
  ],
  resources: [
    { label: "Blogs", path: "/blogs" },
    { label: "Privacy Policy", path: "/privacy" },
    { label: "Terms of Use", path: "/terms" },
    { label: "Cookies Policy", path: "/cookies" },
  ]
};

export const socialLinksData = [
  { id: 1, label: "Twitter", url: "https://twitter.com/datingadvice", icon: "𝕏" },
  { id: 2, label: "Instagram", url: "https://instagram.com/datingadvice", icon: "IG" },
  { id: 3, label: "Facebook", url: "https://facebook.com/datingadvice", icon: "FB" }
];
