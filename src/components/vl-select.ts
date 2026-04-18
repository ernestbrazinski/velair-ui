import { LitElement, html, css, nothing } from "lit";
import { customElement, property } from "lit/decorators.js";

export type VlSelectOption = {
  value: string;
  label: string;
  disabled?: boolean;
};

function optionsFromAttr(value: string | null): VlSelectOption[] {
  if (!value?.trim()) return [];
  try {
    const parsed = JSON.parse(value) as unknown;
    return Array.isArray(parsed) ? (parsed as VlSelectOption[]) : [];
  } catch {
    return [];
  }
}

@customElement("vl-select")
export class VlSelect extends LitElement {
  static styles = css`
    :host {
      display: inline-block;
      --vl-base: var(--base-size, 16px);
      --vl-border: var(--color-border, #d4d4d8);
      --vl-bg: var(--color-bg, #fff);
      --vl-text: var(--color-text, #111);
      --vl-accent: var(--color-accent, #2563eb);
    }
    :host([hidden]) {
      display: none;
    }
    :host([wide]) {
      display: block;
      width: 100%;
    }
    select {
      box-sizing: border-box;
      padding: calc(var(--vl-base) * 0.35) calc(var(--vl-base) * 0.5);
      border: 1px solid var(--vl-border);
      // border-radius: 4px;
      // background: var(--vl-bg);
      background: transparent;
      border: none;
      color: var(--vl-text);
      font: inherit;
      // min-width: calc(var(--vl-base) * 10);
      cursor: pointer;
    }
    :host([wide]) select {
      width: 100%;
      min-width: 0;
    }
    select:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
    select:focus-visible {
      outline: 2px solid var(--vl-accent);
      outline-offset: 2px;
    }
  `;

  @property({
    converter: { fromAttribute: optionsFromAttr },
    attribute: "options",
  })
  options: VlSelectOption[] = [];

  @property({ type: String }) value = "";

  @property({ type: Boolean, reflect: true }) disabled = false;

  @property({ type: String }) selectId = "";

  @property({ type: String }) name = "";

  @property({ type: Boolean, reflect: true }) wide = false;

  protected render() {
    return html`
      <select
        id=${this.selectId || nothing}
        name=${this.name || nothing}
        .value=${this.value}
        ?disabled=${this.disabled}
        @change=${this._onChange}
      >
        ${this.options.map(
          (opt) => html`
            <option value=${opt.value} ?disabled=${opt.disabled ?? false}>
              ${opt.label}
            </option>
          `,
        )}
      </select>
    `;
  }

  private _onChange(e: Event) {
    const t = e.target as HTMLSelectElement;
    this.value = t.value;
    this.dispatchEvent(
      new CustomEvent("vl-change", {
        bubbles: true,
        composed: true,
        detail: { value: this.value },
      }),
    );
  }

  updated(changed: Map<PropertyKey, unknown>) {
    if (changed.has("value")) {
      const sel = this.renderRoot.querySelector("select");
      if (sel && sel.value !== this.value) sel.value = this.value;
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "vl-select": VlSelect;
  }
}
