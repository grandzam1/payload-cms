export const COMPANY_IDS = [
  "neuralink",
  "grok",
  "spacex",
  "tesla",
  "boring",
  "x",
] as const;

export type CompanyId = (typeof COMPANY_IDS)[number];

export type MarqueeSettings = {
  duration: number;
  logoSize: number;
  direction: "rtl" | "ltr";
  isPlaying: boolean;
  includedCompanies: CompanyId[];
};
