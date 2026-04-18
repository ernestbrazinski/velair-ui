import { LitElement, html, css, nothing } from "lit";
import { customElement, property, query } from "lit/decorators.js";
import { ifDefined } from "lit/directives/if-defined.js";

const errorAttrConverter = {
  fromAttribute(value: string | null): string | boolean | undefined {
    if (value == null) return false;
    if (value === "" || value === "true") return true;
    if (value === "false") return false;
    return value;
  },
  toAttribute(value: string | boolean | undefined | null) {
    if (value == null || value === false) return null;
    if (value === true) return "";
    return value;
  },
};

let _eid = 0;
function _nextErrId() {
  return `vl-rb-err-${++_eid}`;
}

@customElement("vl-radio")
export class VlRadio extends LitElement {
  static formAssociated = true;
  private _internals!: ElementInternals;
  private _errId = _nextErrId();

  static styles = css`
    :host {
      display: inline-block;
      --vl-base: var(--base-size, 16px);
      --vl-border: var(--color-border, #d4d4d8);
      --vl-bg: var(--color-bg, #fff);
      --vl-accent: var(--color-accent, #2563eb);
      --vl-text: var(--color-text, #111);
    }
    :host([hidden]) {
      display: none;
    }
    :host([data-invalid]) .ring {
      border-color: var(--vl-error, #dc2626) !important;
    }
    :host label.root {
      display: inline-flex;
      align-items: flex-start;
      gap: calc(var(--vl-base) * 0.4);
      cursor: pointer;
      -webkit-tap-highlight-color: transparent;
      color: var(--vl-text);
      font: inherit;
      margin: 0;
    }
    :host .control-wrap {
      position: relative;
      width: calc(var(--vl-base) * 1.2);
      height: calc(var(--vl-base) * 1.2);
      margin-top: 0.1em;
      flex-shrink: 0;
    }
    :host .native {
      position: absolute;
      margin: 0;
      width: 100%;
      height: 100%;
      opacity: 0.01;
      z-index: 1;
      cursor: pointer;
    }
    :host([disabled]) label {
      cursor: not-allowed;
    }
    :host .ring {
      box-sizing: border-box;
      position: absolute;
      inset: 0;
      border: 2px solid var(--vl-border);
      border-radius: 50%;
      background: var(--vl-bg);
      transition: border-color 0.12s, background 0.12s;
    }
    :host label.root:focus-within .ring {
      box-shadow: 0 0 0 2px
        color-mix(in srgb, var(--vl-accent) 35%, transparent);
    }
    :host
      :checked
      + .ring::after {
      content: "";
      position: absolute;
      left: 50%;
      top: 50%;
      width: 50%;
      height: 50%;
      border-radius: 50%;
      background: var(--vl-accent);
      transform: translate(-50%, -50%);
    }
    :host
      :checked
      + .ring {
      border-color: var(--vl-accent);
    }
    :host .text {
      font: inherit;
      line-height: 1.4;
    }
    :host p.err {
      margin: calc(var(--vl-base) * 0.25) 0 0;
      font-size: calc(var(--vl-base) * 0.75);
      color: var(--vl-error, #dc2626);
    }
  `;

  @property({ type: String }) name = "";
  @property({ type: String }) value = "";
  @property({ type: Boolean, reflect: true }) checked = false;
  @property({ type: Boolean, reflect: true }) disabled = false;
  @property({ converter: errorAttrConverter, reflect: true, attribute: "error" })
  error: string | boolean = false;

  @query("input", true) private _input?: HTMLInputElement;

  constructor() {
    super();
    this._internals = this.attachInternals();
  }

  private get _isError() {
    return this.error === true
      || (typeof this.error === "string" && this.error.length > 0);
  }

  private get _errText() {
    if (this.error === true) return "";
    if (
      typeof this.error === "string"
      && this.error
      && this.error !== "true"
    ) {
      return this.error;
    }
    return "";
  }

  private _onChange() {
    if (this._input) {
      this.checked = this._input.checked;
    }
    this._syncValue();
    this.dispatchEvent(
      new CustomEvent("vl-change", {
        bubbles: true,
        composed: true,
        detail: { value: this.value, checked: this.checked },
      }),
    );
  }

  private _syncValue() {
    this._internals.setFormValue(
      this.checked
        ? (this.value || "on")
        : null,
    );
  }

  protected willUpdate() {
    this.toggleAttribute("data-invalid", this._isError);
  }

  protected updated() {
    if (this._input) {
      this._input.checked = this.checked;
    }
    this._syncValue();
  }

  protected render() {
    const et = this._errText;
    const eid = this._errId;
    return html`
      <div part="field">
        <label part="root" class="root">
          <span class="control-wrap">
            <input
              part="input"
              class="native"
              type="radio"
              name=${ifDefined(this.name || undefined)}
              value=${this.value}
              .checked=${this.checked}
              ?disabled=${this.disabled}
              aria-errormessage=${ifDefined(et ? eid : undefined)}
              aria-describedby=${ifDefined(et ? eid : undefined)}
              aria-invalid=${ifDefined(
                this._isError
                  ? ("true" as const)
                  : undefined,
              )}
              @change=${() => { this._onChange(); }}
            />
            <span part="ring" class="ring" aria-hidden="true"></span>
          </span>
          <span part="label" class="text"><slot></slot></span>
        </label>
        ${et
        ? html`
            <p part="error" class="err" id=${eid} role="alert">
              ${et}
            </p>
          `
        : nothing}
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "vl-radio": VlRadio;
  }
}
