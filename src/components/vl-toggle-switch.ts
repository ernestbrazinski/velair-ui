import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';

@customElement('vl-toggle-switch')
export class VlToggleSwitch extends LitElement {
  static styles = css`
    :host {
      display: inline-block;
      --vl-base: var(--base-size, 16px);
      --vl-border: var(--color-border, #d4d4d8);
      --vl-surface: var(--color-surface, #e4e4e7);
      --vl-muted: var(--color-muted, #71717a);
      --vl-accent: var(--color-accent, #2563eb);
      --switch-w: calc(var(--vl-base) * 3.25);
      --switch-h: calc(var(--vl-base) * 1.875);
      --knob: calc(var(--vl-base) * 1.5);
      --pad: calc(var(--vl-base) * 0.1875);
      --travel: calc(var(--switch-w) - var(--knob) - var(--pad) * 2);
      --glass-on: rgba(52, 199, 89, 0.55);
    }
    :host([hidden]) {
      display: none;
    }
    label {
      position: relative;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      vertical-align: middle;
      cursor: pointer;
      -webkit-tap-highlight-color: transparent;
    }
    label.is-disabled {
      opacity: 0.45;
      cursor: not-allowed;
    }
    label:has(input:focus-visible) .track {
      outline: 2px solid var(--vl-accent);
      outline-offset: 3px;
    }
    input {
      position: absolute;
      inset: 0;
      z-index: 2;
      width: 100%;
      height: 100%;
      margin: 0;
      opacity: 0;
      cursor: pointer;
    }
    input:disabled {
      cursor: not-allowed;
    }
    .track {
      position: relative;
      width: var(--switch-w);
      height: var(--switch-h);
      border-radius: 999px;
      background: linear-gradient(
        145deg,
        color-mix(in srgb, var(--vl-surface) 55%, transparent),
        color-mix(in srgb, var(--vl-border) 35%, transparent)
      );
      backdrop-filter: blur(14px) saturate(1.35);
      -webkit-backdrop-filter: blur(14px) saturate(1.35);
      box-shadow:
        inset 0 1px 1px rgba(255, 255, 255, 0.45),
        inset 0 -0.5px 0.5px rgba(0, 0, 0, 0.12),
        0 2px 8px rgba(0, 0, 0, 0.08),
        0 0 0 0.5px color-mix(in srgb, var(--vl-border) 70%, transparent);
      transition:
        background 0.38s cubic-bezier(0.4, 0, 0.2, 1),
        box-shadow 0.38s cubic-bezier(0.4, 0, 0.2, 1);
    }
    label.is-on .track {
      background: linear-gradient(
        145deg,
        color-mix(in srgb, var(--glass-on) 88%, white),
        color-mix(in srgb, var(--vl-accent) 65%, transparent)
      );
      box-shadow:
        inset 0 1px 1px rgba(255, 255, 255, 0.5),
        inset 0 -1px 1px rgba(0, 0, 0, 0.08),
        0 2px 10px color-mix(in srgb, var(--vl-accent) 35%, transparent),
        0 0 0 0.5px color-mix(in srgb, var(--vl-accent) 45%, transparent);
    }
    label.is-disabled .track {
      filter: grayscale(0.15);
    }
    .glow {
      position: absolute;
      inset: 0;
      border-radius: inherit;
      opacity: 0;
      background: radial-gradient(120% 80% at 30% 0%, rgba(255, 255, 255, 0.55), transparent 55%);
      pointer-events: none;
      transition: opacity 0.35s ease;
    }
    label.is-on .glow {
      opacity: 0.85;
    }
    .knob {
      position: absolute;
      top: var(--pad);
      left: var(--pad);
      width: var(--knob);
      height: var(--knob);
      border-radius: 50%;
      background: linear-gradient(
        165deg,
        #ffffff 0%,
        color-mix(in srgb, #ffffff 88%, var(--vl-muted)) 100%
      );
      box-shadow:
        0 1px 2px rgba(0, 0, 0, 0.12),
        0 4px 10px rgba(0, 0, 0, 0.14),
        inset 0 1px 0 rgba(255, 255, 255, 0.95),
        inset 0 -1px 0 rgba(0, 0, 0, 0.06);
      transform: translate3d(0, 0, 0);
      transition:
        transform 0.42s cubic-bezier(0.34, 1.3, 0.64, 1),
        box-shadow 0.35s ease;
    }
    label.is-on .knob {
      transform: translate3d(var(--travel), 0, 0);
      box-shadow:
        0 1px 2px rgba(0, 0, 0, 0.1),
        0 5px 14px rgba(0, 0, 0, 0.16),
        inset 0 1px 0 rgba(255, 255, 255, 1),
        inset 0 -1px 0 rgba(0, 0, 0, 0.05);
    }
    .knob-shine {
      position: absolute;
      inset: 18% 22% auto 22%;
      height: 32%;
      border-radius: 999px;
      background: linear-gradient(180deg, rgba(255, 255, 255, 0.95), rgba(255, 255, 255, 0));
      opacity: 0.9;
      pointer-events: none;
    }
  `;

  @property({ type: Boolean, reflect: true }) checked = false;

  @property({ type: Boolean, reflect: true }) disabled = false;

  protected render() {
    const on = this.checked;
    const cls = `vl-switch${on ? ' is-on' : ''}${this.disabled ? ' is-disabled' : ''}`;
    return html`
      <label class=${cls}>
        <input
          type="checkbox"
          role="switch"
          aria-checked=${on ? 'true' : 'false'}
          .checked=${this.checked}
          ?disabled=${this.disabled}
          @change=${this._onChange}
        />
        <span class="track" aria-hidden="true">
          <span class="glow"></span>
          <span class="knob">
            <span class="knob-shine"></span>
          </span>
        </span>
      </label>
    `;
  }

  private _onChange(e: Event) {
    const t = e.target as HTMLInputElement;
    this.checked = t.checked;
    this.dispatchEvent(
      new CustomEvent('vl-change', { bubbles: true, composed: true, detail: { checked: this.checked } }),
    );
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'vl-toggle-switch': VlToggleSwitch;
  }
}
