import { LitElement, html, css, nothing } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { ifDefined } from "lit/directives/if-defined.js";
import { live } from "lit/directives/live.js";

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
    if (value === "false" || value === "true") {
      return value;
    }
    return value;
  },
};

let _id = 0;
function _nextId() {
  return `vl-ta-${++_id}`;
}

@customElement("vl-textarea")
export class VlTextarea extends LitElement {
  static styles = css`
    :host {
      display: inline-block;
      --vl-base: var(--base-size, 16px);
      --vl-border: var(--color-border, #d4d4d8);
      --vl-bg: var(--color-bg, #fff);
      --vl-text: var(--color-text, #111);
      --vl-muted: var(--color-muted, #71717a);
      --vl-accent: var(--color-accent, #2563eb);
    }
    :host([hidden]) {
      display: none;
    }
    :host([wide]) {
      display: block;
      width: 100%;
    }
    :host .wrap {
      display: flex;
      flex-direction: column;
      width: 100%;
    }
    :host .field {
      position: relative;
      display: block;
    }
    :host :not([float]) .field {
      width: 100%;
    }
    :host .field--bordered {
      border: 1px solid var(--vl-border);
      border-radius: 4px;
    }
    :host .field--float {
      border: none;
      border-bottom: 1px solid var(--vl-border);
      border-radius: 0;
    }
    :host .field.field--float[data-invalid] {
      border-bottom-color: var(--vl-error, #dc2626) !important;
    }
    :host .field.field--bordered[data-invalid] {
      border-color: var(--vl-error, #dc2626) !important;
    }
    :host .field--float:focus-within:not([data-invalid]) {
      border-bottom-color: var(--vl-accent);
    }
    :host :not([float]) textarea:focus-visible {
      outline: 2px solid var(--vl-accent);
      outline-offset: 2px;
    }
    :host .field--float textarea:focus-visible {
      outline: none;
    }
    :host
      :not([float])
      .field--bordered:has(:focus-visible):not([data-invalid]) {
      box-shadow: 0 0 0 2px var(--vl-accent);
    }
    textarea {
      box-sizing: border-box;
      max-width: 100%;
      width: var(--vl-textarea-width, auto);
      min-width: calc(var(--vl-base) * 12);
      min-height: calc(var(--vl-base) * 6);
      padding: calc(var(--vl-base) * 0.5) calc(var(--vl-base) * 0.65);
      border: 1px solid var(--vl-border);
      border-radius: 4px;
      background: var(--vl-bg);
      color: var(--vl-text);
      font: inherit;
      line-height: 1.4;
      resize: var(--vl-textarea-resize, vertical);
    }
    :host .field--float textarea {
      border: none;
      width: 100%;
      min-width: 0;
      margin: 0;
      display: block;
      padding: calc(var(--vl-base) * 0.4) 0
        calc(var(--vl-base) * 0.3) 0;
      min-height: calc(var(--vl-base) * 6);
    }
    :host .field--float {
      min-width: 0;
    }
    :host :not([float]) .field--bordered textarea {
      border: none;
    }
    :host .field--bordered textarea {
      width: 100%;
      min-width: 0;
    }
    :host .field--float .float-label {
      position: absolute;
      left: 0;
      top: calc(var(--vl-base) * 0.55);
      right: 0.5rem;
      pointer-events: none;
      color: var(--vl-muted);
      font-size: calc(var(--vl-base) * 1.05);
      line-height: 1.3;
      transform-origin: left top;
      transition:
        transform 0.2s ease,
        top 0.2s ease,
        font-size 0.2s ease;
    }
    :host
      .field--float:has(:focus-within)
      .float-label,
    :host .field--float[data-filled] .float-label {
      top: 0;
      font-size: calc(var(--vl-base) * 0.8);
      font-weight: 500;
      transform: scale(0.9);
    }
    :host([wide]) :not([float]) textarea {
      width: 100%;
    }
    textarea::placeholder {
      color: var(--vl-muted);
      opacity: 1;
    }
    :host([float]) textarea::placeholder {
      color: transparent;
    }
    textarea:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
    textarea:read-only:not(:disabled) {
      cursor: default;
    }
    .err {
      margin: calc(var(--vl-base) * 0.35) 0 0;
      font-size: calc(var(--vl-base) * 0.75);
      line-height: 1.25;
      color: var(--vl-error, #dc2626);
    }
  `;

  @property({ type: String }) value = "";
  @property({ type: Number }) rows = 4;
  @property({ type: String }) name = "";
  @property({ type: String }) placeholder = "";
  @property({ type: String, attribute: "label-float" }) labelFloat = "";
  @property({ type: Number }) maxlength: number | undefined;
  @property({ type: Number }) minlength: number | undefined;
  @property({ type: String }) autocomplete = "";
  @property({ type: Boolean, attribute: "spellcheck" })
  spellCheck?: boolean;
  @property({ type: Boolean, reflect: true }) disabled = false;
  @property({ type: Boolean, reflect: true }) readonly = false;
  @property({ type: Boolean, reflect: true }) wide = false;
  @property({ type: Boolean, reflect: true }) float = false;
  @property({ type: String, attribute: "input-id" }) inputId = "";
  @property({ converter: errorAttrConverter, reflect: true, attribute: "error" })
  error: string | boolean = false;

  @state() private _autoId = _nextId();
  @state() private _focused = false;

  private get _eid() {
    return (this.inputId && this.inputId.trim()) || this._autoId;
  }

  private get _isError() {
    return this.error === true
      || (typeof this.error === "string" && this.error.length > 0);
  }

  private get _errorText() {
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

  private get _messageId() {
    return this._errorText ? `${this._eid}-err` : undefined;
  }

  private get _floatTextRest() {
    return this.placeholder || " ";
  }

  private get _floatTextUp() {
    return this.labelFloat || this.placeholder || " ";
  }

  private get _hasValue() {
    return this.value != null && String(this.value) !== "";
  }

  private get _floatLabelContent() {
    if (this._focused || this._hasValue) {
      return this._floatTextUp;
    }
    return this._floatTextRest;
  }

  protected render() {
    const id = this._eid;
    const showFloat = this.float;
    const msgId = this._messageId;
    return html`
      <div part="root" class="wrap">
        <div
          part="field"
          class="field ${showFloat ? "field--float" : "field--bordered"}"
          ?data-filled=${this._hasValue}
          ?data-invalid=${this._isError}
        >
          <textarea
            part="textarea"
            id=${id}
            name=${ifDefined(this.name || undefined)}
            rows=${this.rows}
            .value=${live(this.value)}
            ?disabled=${this.disabled}
            ?readonly=${this.readonly}
            placeholder=${ifDefined(
              showFloat
                ? " "
                : (this.placeholder
                  ? this.placeholder
                  : undefined),
            )}
            maxlength=${ifDefined(
              this.maxlength as number | null | undefined,
            )}
            minlength=${ifDefined(
              this.minlength as number | null | undefined,
            )}
            .spellCheck=${ifDefined(
              this.spellCheck,
            )}
            aria-invalid=${ifDefined(
              this._isError
                ? ("true" as const)
                : undefined,
            )}
            aria-errormessage=${ifDefined(
              this._errorText && msgId
                ? msgId
                : undefined,
            )}
            aria-describedby=${ifDefined(
              this._messageId
                ? this._messageId
                : undefined,
            )}
            @input=${this._onInput}
            @change=${this._onChange}
            @focus=${() => { this._focused = true; }}
            @blur=${() => { this._focused = false; }}
          ></textarea>
          ${showFloat
            ? html`
                <label
                  part="label"
                  class="float-label"
                  for=${id}
                >${this._floatLabelContent}</label>
              `
            : nothing}
        </div>
        ${this._errorText
          ? html`
              <p
                part="error"
                class="err"
                id=${ifDefined(msgId ?? undefined)}
                role="alert"
              >${this._errorText}</p>
            `
          : nothing}
      </div>
    `;
  }

  private _onInput(e: Event) {
    const t = e.target as HTMLTextAreaElement;
    this.value = t.value;
    this.dispatchEvent(
      new CustomEvent("vl-input", {
        bubbles: true,
        composed: true,
        detail: { value: this.value },
      }),
    );
  }

  private _onChange(e: Event) {
    const t = e.target as HTMLTextAreaElement;
    this.value = t.value;
    this.dispatchEvent(
      new CustomEvent("vl-change", {
        bubbles: true,
        composed: true,
        detail: { value: this.value },
      }),
    );
  }

  protected updated(changed: Map<PropertyKey, unknown>) {
    if (changed.has("value")) {
      const t = this.renderRoot?.querySelector("textarea");
      if (t && t.value !== this.value) t.value = this.value;
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "vl-textarea": VlTextarea;
  }
}
