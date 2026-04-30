import { LitElement, html, css, nothing } from "lit";
import { customElement, property, query } from "lit/decorators.js";
import { ifDefined } from "lit/directives/if-defined.js";

@customElement("vl-checkbox")
export class VlCheckbox extends LitElement {
  static formAssociated = true;
  private internals = this.attachInternals();

  static styles = css`
    :host {
      display: inline-block;
      outline: none !important;
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
      background: Field;
    }
    [part~="input"]:checked + [part~="box"]::after {
      content: "";
      position: absolute;
      left: 50%;
      top: 45%;
      width: 40%;
      height: 20%;
      border: 2px solid;
      border-top: none;
      border-right: none;
      transform: translate(-50%, -50%) rotate(-45deg);
    }
    [part~="input"]:indeterminate + [part~="box"]::after {
      content: "";
      position: absolute;
      left: 50%;
      top: 50%;
      width: 55%;
      height: 2px;
      background: currentColor;
      transform: translate(-50%, -50%);
    }
  `;

  @property({ type: String }) name = "";
  @property({ type: String }) value = "on";
  @property({ type: String }) error = "";
  @property({ type: Boolean, reflect: true }) checked = false;
  @property({ type: Boolean, reflect: true }) disabled = false;
  @property({ type: Boolean, reflect: true }) indeterminate = false;

  @query("input") private inputEl?: HTMLInputElement;

  private onChange = () => {
    if (!this.inputEl) return;
    this.checked = this.inputEl.checked;
    this.indeterminate = this.inputEl.indeterminate;
    this.syncForm();
    this.dispatchEvent(
      new CustomEvent("vl-change", {
        bubbles: true,
        composed: true,
        detail: { checked: this.checked, indeterminate: this.indeterminate },
      }),
    );
  };

  private syncForm() {
    this.internals.setFormValue(
      !this.indeterminate && this.checked ? this.value || "on" : null,
    );
  }

  protected willUpdate() {
    this.toggleAttribute("data-invalid", !!this.error);
  }

  protected updated() {
    if (this.inputEl) {
      this.inputEl.indeterminate = this.indeterminate;
      this.inputEl.checked = this.checked;
    }
    this.syncForm();
  }

  protected render() {
    return html`
      <div part="root">
        <label part="field">
          <span part="control">
            <input
              part="input"
              type="checkbox"
              name=${ifDefined(this.name || undefined)}
              value=${this.value}
              .checked=${this.checked}
              .indeterminate=${this.indeterminate}
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
    "vl-checkbox": VlCheckbox;
  }
}
