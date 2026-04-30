import { LitElement, html, css, nothing } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { ifDefined } from "lit/directives/if-defined.js";
import { live } from "lit/directives/live.js";

@customElement("vl-textarea")
export class VlTextarea extends LitElement {
  static styles = css`
    :host {
      display: inline-block;
      outline: none !important;
    }
    :host([hidden]) {
      display: none;
    }
    :host([wide]) {
      display: block;
      width: 100%;
    }
    [part~="root"] {
      display: flex;
      flex-direction: column;
    }
    [part~="field"] {
      position: relative;
    }
    [part~="textarea"] {
      box-sizing: border-box;
      display: block;
      width: 100%;
      padding: 6px 10px;
      border: 1px solid;
      background: Field;
      color: inherit;
      font: inherit;
      resize: vertical;
    }
    [part~="textarea"]:disabled {
      cursor: not-allowed;
    }
    [part~="label"] {
      position: absolute;
      left: 10px;
      top: 10px;
      pointer-events: none;
      transition: 0.15s ease;
    }
    [part~="label--floating"] {
      top: 0;
      transform: translateY(-50%) scale(0.85);
      transform-origin: left center;
    }
  `;

  @property({ type: String }) value = "";
  @property({ type: Number }) rows = 4;
  @property({ type: String }) name = "";
  @property({ type: String }) label = "";
  @property({ type: String }) placeholder = "";
  @property({ type: String }) autocomplete = "";
  @property({ type: String }) error = "";
  @property({ type: Number }) maxlength?: number;
  @property({ type: Number }) minlength?: number;
  @property({ type: Boolean, reflect: true }) disabled = false;
  @property({ type: Boolean, reflect: true }) readonly = false;
  @property({ type: Boolean, reflect: true }) wide = false;
  @property({ type: Boolean, reflect: true }) float = false;

  @state() private focused = false;

  private get hasValue() {
    return this.value !== "";
  }

  private get floating() {
    return this.float && (this.focused || this.hasValue);
  }

  protected willUpdate() {
    this.toggleAttribute("data-invalid", !!this.error);
  }

  private onInput = (e: Event) => {
    this.value = (e.target as HTMLTextAreaElement).value;
    this.dispatchEvent(
      new CustomEvent("vl-input", {
        bubbles: true,
        composed: true,
        detail: { value: this.value },
      }),
    );
  };

  private onChange = (e: Event) => {
    this.value = (e.target as HTMLTextAreaElement).value;
    this.dispatchEvent(
      new CustomEvent("vl-change", {
        bubbles: true,
        composed: true,
        detail: { value: this.value },
      }),
    );
  };

  protected render() {
    const labelPart = this.floating ? "label label--floating" : "label";
    const showLabel = this.float && this.label;
    const placeholder =
      this.float && !this.floating ? undefined : this.placeholder || undefined;

    return html`
      <div part="root">
        <div part="field">
          <textarea
            part="textarea"
            name=${ifDefined(this.name || undefined)}
            rows=${this.rows}
            .value=${live(this.value)}
            placeholder=${ifDefined(placeholder)}
            autocomplete=${ifDefined(this.autocomplete || undefined)}
            maxlength=${ifDefined(this.maxlength)}
            minlength=${ifDefined(this.minlength)}
            ?disabled=${this.disabled}
            ?readonly=${this.readonly}
            aria-invalid=${ifDefined(this.error ? "true" : undefined)}
            @input=${this.onInput}
            @change=${this.onChange}
            @focus=${() => (this.focused = true)}
            @blur=${() => (this.focused = false)}
          ></textarea>
          ${showLabel
            ? html`<label part=${labelPart}>${this.label}</label>`
            : nothing}
        </div>
        ${this.error
          ? html`<p part="error" role="alert">${this.error}</p>`
          : nothing}
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "vl-textarea": VlTextarea;
  }
}
