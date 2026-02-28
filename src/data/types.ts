// src/data/types.ts
export interface ThemePalette {
  colors: {
    brand: string;
    brandHover: string;
    brandDeep: string;
    pageBackground: string;
    bgSoft: string;
    bgAccent: string;
    bgFooter: string;
    cardBg: string;
    textHeading: string;
    textBody: string;
    textMuted: string;
    border: string;
    borderSoft: string;
    white: string;
    inputBg: string;
    inputSolid: string;
    // Keep old dark keys for backward compat
    bgSoftDark: string;
    cardDark: string;
    textHeadingDark: string;
    textBodyDark: string;
    borderDark: string;
  };
}

export interface NavItem {
  label: string;
  path: string;
}