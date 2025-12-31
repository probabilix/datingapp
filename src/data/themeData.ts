import { type ThemePalette, type NavItem } from './types';

export const themeData: ThemePalette = {
  colors: {
    // 🔴 Brand
    brand: "#E94057",
    brandHover: "#d6364d",
    brandDeep: "#b91c1c",

    // 🟤 GLOBAL BACKGROUNDS (IMPORTANT)
    pageBackground: "#F7F3EE", // 👈 SINGLE SOURCE OF TRUTH
    bgSoft: "#F7F3EE",
    bgAccent: "#FFE4E6",
    bgFooter: "#F2EDE4",

    // 🌙 Dark mode
    bgSoftDark: "#121212",
    cardDark: "#1E1E1E",

    // 📝 Text
    textHeading: "#12172D",
    textHeadingDark: "#FFFFFF",
    textBody: "#5A5E73",
    textBodyDark: "#A0A0A0",

    // 🧱 Borders
    border: "#E8E2D9",
    borderDark: "#2A2A2A",

    white: "#FFFFFF",
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
