import { DEFAULT_MARQUEE } from "./defaults";
import { COMPANIES } from "./companies";
import type { CompanyId, MarqueeSettings } from "./types";
import "./marquee.css";

function formatSpeed(duration: number) {
  if (duration <= 10) return "Very fast";
  if (duration <= 25) return "Fast";
  if (duration <= 42) return "Balanced";
  if (duration <= 54) return "Slow";
  return "Very slow";
}

export function MarqueeControls({
  settings,
  disabled = false,
  onChange,
  onReset,
  speedInputId = 'mq-speed',
  sizeInputId = 'mq-size',
}: {
  settings: MarqueeSettings;
  disabled?: boolean;
  onChange: (settings: MarqueeSettings) => void;
  onReset?: () => void;
  speedInputId?: string;
  sizeInputId?: string;
}) {
  const selectedCount = settings.includedCompanies.length;

  function patch(partial: Partial<MarqueeSettings>) {
    onChange({ ...settings, ...partial });
  }

  function toggleCompany(id: CompanyId) {
    const included = settings.includedCompanies.includes(id)
      ? settings.includedCompanies.filter((companyId) => companyId !== id)
      : [...settings.includedCompanies, id];
    patch({ includedCompanies: included });
  }

  return (
    <aside aria-label="Marquee controls" className="mq-panel">
      <div className="mq-panel-head">
        <div>
          <p className="mq-eyebrow">Live controls</p>
          <p className="mq-panel-title">Marquee studio</p>
        </div>
        {onReset ? (
          <button
            aria-label="Reset marquee controls"
            className="mq-icon-btn"
            disabled={disabled}
            onClick={onReset}
            title="Reset controls"
            type="button"
          >
            Reset
          </button>
        ) : null}
      </div>

      <div className="mq-panel-body">
        <div className="mq-section">
          <div className="mq-label-row">
            <label htmlFor={speedInputId}>Speed</label>
            <span>
              {formatSpeed(settings.duration)} <strong>{settings.duration}s</strong>
            </span>
          </div>
          <input
            aria-label="Marquee speed duration"
            disabled={disabled}
            id={speedInputId}
            max={60}
            min={5}
            onChange={(event) => patch({ duration: Number(event.target.value) })}
            type="range"
            value={settings.duration}
          />
          <div className="mq-range-ends" aria-hidden="true">
            <span>Very fast</span>
            <span>Very slow</span>
          </div>
        </div>

        <div className="mq-section">
          <div className="mq-label-row">
            <label htmlFor={sizeInputId}>Logo size</label>
            <span>
              <strong>{settings.logoSize}px</strong>
            </span>
          </div>
          <input
            aria-label="Logo size"
            disabled={disabled}
            id={sizeInputId}
            max={64}
            min={16}
            onChange={(event) => patch({ logoSize: Number(event.target.value) })}
            step={2}
            type="range"
            value={settings.logoSize}
          />
          <div className="mq-range-ends" aria-hidden="true">
            <span>Small</span>
            <span>Extra large</span>
          </div>
        </div>

        <div className="mq-section mq-split">
          <div>
            <p className="mq-label">Direction</p>
            <span className="mq-value">
              {settings.direction === "rtl" ? "Right to left" : "Left to right"}
            </span>
          </div>
          <button
            aria-label={`Change direction to ${
              settings.direction === "rtl" ? "left to right" : "right to left"
            }`}
            aria-pressed={settings.direction === "ltr"}
            className="mq-action"
            disabled={disabled}
            onClick={() => patch({ direction: settings.direction === "rtl" ? "ltr" : "rtl" })}
            type="button"
          >
            Flip direction
          </button>
        </div>

        <div className="mq-section mq-split">
          <div>
            <p className="mq-label">Playback</p>
            <span className="mq-value">{settings.isPlaying ? "Playing" : "Paused"}</span>
          </div>
          <button
            aria-label={settings.isPlaying ? "Pause marquee" : "Play marquee"}
            aria-pressed={!settings.isPlaying}
            className={`mq-action${settings.isPlaying ? "" : " is-paused"}`}
            disabled={disabled}
            onClick={() => patch({ isPlaying: !settings.isPlaying })}
            type="button"
          >
            {settings.isPlaying ? "Pause" : "Play"}
          </button>
        </div>

        <div className="mq-section">
          <div className="mq-label-row">
            <p className="mq-label">Companies included</p>
            <span>
              {selectedCount} of {COMPANIES.length}
            </span>
          </div>
          <div className="mq-chips" role="group" aria-label="Companies included in marquee">
            {COMPANIES.map(({ id, name }) => {
              const selected = settings.includedCompanies.includes(id);
              return (
                <button
                  aria-pressed={selected}
                  className={`mq-chip${selected ? " is-on" : ""}`}
                  disabled={disabled}
                  key={id}
                  onClick={() => toggleCompany(id)}
                  type="button"
                >
                  <span className="mq-chip-mark">{selected ? "✓" : ""}</span>
                  <span>{name}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </aside>
  );
}

export function resetMarqueeSettings() {
  return { ...DEFAULT_MARQUEE, includedCompanies: [...DEFAULT_MARQUEE.includedCompanies] };
}
