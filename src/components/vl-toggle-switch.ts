import { LitElement, html, css } from "lit";
import { customElement, property } from "lit/decorators.js";

@customElement("vl-toggle-switch")
export class VlToggleSwitch extends LitElement {
  static styles = css`
    :host {
      display: inline-block;
    }
    :host([hidden]) {
      display: none;
    }
    [part~="root"] {
      position: relative;
      display: inline-flex;
      cursor: pointer;
    }
    :host([disabled]) [part~="root"] {
      cursor: not-allowed;
    }
    [part~="input"] {
      position: absolute;
      inset: 0;
      margin: 0;
      opacity: 0;
      cursor: inherit;
    }
    [part~="track"] {
      position: relative;
      width: 40px;
      height: 24px;
      border-radius: 999px;
      background: ButtonFace;
    }
    [part~="knob"] {
      position: absolute;
      top: 2px;
      left: 2px;
      width: 20px;
      height: 20px;
      border-radius: 50%;
      background: Field;
      transition: transform 0.3s ease;
    }
    :host([checked]) [part~="knob"] {
      transform: translateX(16px);
    }
  `;

  @property({ type: Boolean, reflect: true }) checked = false;
  @property({ type: Boolean, reflect: true }) disabled = false;

  private onChange = (e: Event) => {
    this.checked = (e.target as HTMLInputElement).checked;
    this.dispatchEvent(
      new CustomEvent("vl-change", {
        bubbles: true,
        composed: true,
        detail: { checked: this.checked },
      }),
    );
  };

  protected render() {
    return html`
      <label part="root">
        <input
          part="input"
          type="checkbox"
          role="switch"
          aria-checked=${this.checked ? "true" : "false"}
          .checked=${this.checked}
          ?disabled=${this.disabled}
          @change=${this.onChange}
        />
        <span part="track" aria-hidden="true">
          <span part="knob"></span>
        </span>
      </label>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "vl-toggle-switch": VlToggleSwitch;
  }
}
