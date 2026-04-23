import { LitElement, html, css, nothing } from "lit";
import { customElement, property, query } from "lit/decorators.js";
import { ifDefined } from "lit/directives/if-defined.js";

@customElement("vl-radio")
export class VlRadio extends LitElement {
  static formAssociated = true;
  private internals = this.attachInternals();

  static styles = css`
    :host {
      display: inline-block;
    }
    :host([hidden]) {
      display: none;
    }
    [part~="root"] {
      display: flex;
      flex-direction: column;
    }
    [part~="field"] {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      cursor: pointer;
      margin: 0;
    }
    :host([disabled]) [part~="field"] {
      cursor: not-allowed;
    }
    [part~="control"] {
      position: relative;
      flex-shrink: 0;
      width: 16px;
      height: 16px;
    }
    [part~="input"] {
      position: absolute;
      inset: 0;
      margin: 0;
      opacity: 0;
      cursor: inherit;
    }
    [part~="box"] {
      box-sizing: border-box;
      position: absolute;
      inset: 0;
      border: 2px solid;
      border-radius: 50%;
      background: Field;
    }
    [part~="input"]:checked + [part~="box"]::after {
      content: "";
      position: absolute;
      inset: 25%;
      border-radius: 50%;
      background: currentColor;
    }
  `;

  @property({ type: String }) name = "";
  @property({ type: String }) value = "";
  @property({ type: String }) error = "";
  @property({ type: Boolean, reflect: true }) checked = false;
  @property({ type: Boolean, reflect: true }) disabled = false;

  @query("input") private inputEl?: HTMLInputElement;

  private onChange = () => {
    if (!this.inputEl) return;
    this.checked = this.inputEl.checked;
    this.syncForm();
    this.dispatchEvent(
      new CustomEvent("vl-change", {
        bubbles: true,
        composed: true,
        detail: { value: this.value, checked: this.checked },
      }),
    );
  };

  private syncForm() {
    this.internals.setFormValue(this.checked ? this.value || "on" : null);
  }

  protected willUpdate() {
    this.toggleAttribute("data-invalid", !!this.error);
  }

  protected updated() {
    if (this.inputEl) this.inputEl.checked = this.checked;
    this.syncForm();
  }

  protected render() {
    return html`
      <div part="root">
        <label part="field">
          <span part="control">
            <input
              part="input"
              type="radio"
              name=${ifDefined(this.name || undefined)}
              value=${this.value}
              .checked=${this.checked}
              ?disabled=${this.disabled}
              aria-invalid=${ifDefined(this.error ? "true" : undefined)}
              @change=${this.onChange}
            />
            <span part="box" aria-hidden="true"></span>
          </span>
          <span part="label"><slot></slot></span>
        </label>
        ${this.error
          ? html`<p part="error" role="alert">${this.error}</p>`
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
