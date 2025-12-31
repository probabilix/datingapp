// src/data/types.ts
export interface ThemePalette {
  colors: {
    brand: string;
    brandHover: string;
    bgSoft: string;
    bgSoftDark: string;      // Fix: Add this to clear the red line
    bgAccent: string;
    textHeading: string;
    brandDeep: string;
    pageBackground: string;
    textHeadingDark: string;  // Fix: Add this to clear the red line
    textBody: string;
    textBodyDark: string;     // Fix: Add this to clear the red line
    border: string;
    borderDark: string;       // Fix: Add this to clear the red line
    white: string;
    cardDark: string;         // Fix: Add this to clear the red line
    bgFooter: string;
  };
}

export interface NavItem {
  label: string;
  path: string;
}