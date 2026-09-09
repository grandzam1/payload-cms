import type { CSSProperties } from "react";
import { COMPANIES, type Company } from "./companies";
import type { MarqueeSettings } from "./types";
import "./marquee.css";

function fillLogos(logos: Company[], minCount = 8) {
  if (!logos.length) return [];
  const filled: Company[] = [];
  while (filled.length < minCount) filled.push(...logos);
  return filled;
}

function LogoRow({ logos, duplicate = false }: { logos: Company[]; duplicate?: boolean }) {
  return (
    <div aria-hidden={duplicate} className="mq-group">
      {logos.map((company, index) => (
        <span className="mq-logo" key={`${company.id}-${duplicate ? "b" : "a"}-${index}`}>
          <img alt={duplicate ? "" : company.name} className="mq-logo-mark" src={company.src} />
        </span>
      ))}
    </div>
  );
}

export function Marquee({
  settings,
  className = "",
}: {
  settings: MarqueeSettings;
  className?: string;
}) {
  const logos = COMPANIES.filter((company) => settings.includedCompanies.includes(company.id));
  const filled = fillLogos(logos);
  const style = {
    "--mq-logo-size": `${settings.logoSize}px`,
    "--mq-duration": `${settings.duration}s`,
  } as CSSProperties;

  return (
    <div
      aria-label="Selected companies"
      className={`mq-strip${className ? ` ${className}` : ""}`}
      role="group"
      style={style}
    >
      {filled.length ? (
        <div
          className={`mq-track${settings.direction === "ltr" ? " is-ltr" : ""}${
            settings.isPlaying ? "" : " is-paused"
          }`}
        >
          <LogoRow logos={filled} />
          <LogoRow duplicate logos={filled} />
        </div>
      ) : (
        <p className="mq-empty">No companies selected</p>
      )}
    </div>
  );
}
