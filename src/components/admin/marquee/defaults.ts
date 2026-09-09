import { COMPANY_IDS, type CompanyId, type MarqueeSettings } from "./types";

export const DEFAULT_MARQUEE: MarqueeSettings = {
  duration: 40,
  logoSize: 48,
  direction: "rtl",
  isPlaying: true,
  includedCompanies: [...COMPANY_IDS],
};

const LEGACY_DEFAULT = ["tesla", "spacex", "x", "neuralink", "xai", "boring"];

function isCompanyId(value: unknown): value is CompanyId {
  return typeof value === "string" && (COMPANY_IDS as readonly string[]).includes(value);
}

function isLegacyDefault(value: unknown) {
  if (!Array.isArray(value) || value.length !== LEGACY_DEFAULT.length) return false;
  return LEGACY_DEFAULT.every((id, index) => value[index] === id);
}

export function marqueeNeedsMigrate(value: unknown) {
  if (!value || typeof value !== "object") return true;
  const included = (value as { includedCompanies?: unknown }).includedCompanies;
  if (!Array.isArray(included)) return true;
  if (isLegacyDefault(included)) return true;
  return included.some((id) => id === "xai" || id === "starlink");
}

export function resolveMarquee(value: unknown): MarqueeSettings {
  if (!value || typeof value !== "object") return DEFAULT_MARQUEE;
  const raw = value as Partial<MarqueeSettings> & { includedCompanies?: unknown };
  const duration = clamp(Number(raw.duration), 5, 60, DEFAULT_MARQUEE.duration);
  const logoSize = clamp(Number(raw.logoSize), 16, 64, DEFAULT_MARQUEE.logoSize);
  const direction = raw.direction === "ltr" ? "ltr" : "rtl";
  const isPlaying = raw.isPlaying !== false;
  const included = isLegacyDefault(raw.includedCompanies)
    ? DEFAULT_MARQUEE.includedCompanies
    : Array.isArray(raw.includedCompanies)
      ? raw.includedCompanies.filter(isCompanyId)
      : DEFAULT_MARQUEE.includedCompanies;
  return {
    duration,
    logoSize,
    direction,
    isPlaying,
    includedCompanies: included.length ? included : DEFAULT_MARQUEE.includedCompanies,
  };
}

function clamp(value: number, min: number, max: number, fallback: number) {
  if (!Number.isFinite(value)) return fallback;
  return Math.min(max, Math.max(min, value));
}
