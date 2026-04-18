import { LitElement, html, css, nothing } from "lit";
import { customElement, property } from "lit/decorators.js";

@customElement("vl-button")
export class VlButton extends LitElement {
  static styles = css`
    :host {
    }
    :host([hidden]) {
      display: none;
    }
    button,
    a {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: auto;
      font: inherit;
      font-size: var(--vl-button-font-size, 14px);
      line-height: var(--vl-button-line-height, 1);
      color: var(--vl-button-color, inherit);
      border-style: solid;
      border-width: 1px;
      border-color: var(--vl-border-color);
      border-radius: 0;
      background-color: var(--vl-background-color);
      padding: var(--vl-button-padding, 8px 16px);
      cursor: pointer;
      appearance: none;
      text-decoration: none;
      text-align: center;
      outline: none;
      transition:
        var(--vl-transition-time, 0.3s) background-color,
        var(--vl-transition-time, 0.3s) color,
        var(--vl-transition-time, 0.3s) border-color;
    }

    button:hover,
    a:hover {
      background-color: var(--vl-primary-color-hover);
    }
    button:active,
    a:active {
      background-color: var(--vl-primary-color-active);
    }
  `;

  @property({ type: Boolean, reflect: true }) disabled = false;
  @property({ type: String }) type: "button" | "submit" | "reset" = "button";
  @property({ type: String }) href: string = "";

  protected render() {
    const isLink = Boolean(this.href);

    if (isLink) {
      return html`
        <a
          part="link"
          href=${this.href}
          aria-disabled=${this.disabled ? "true" : nothing}
          tabindex=${this.disabled ? -1 : nothing}
          @click=${this._onClick}
        >
          <slot></slot>
        </a>
      `;
    }

    const innerType =
      this.type === "submit" || this.type === "reset" ? "button" : this.type;
    return html`
      <button
        part="button"
        type=${innerType}
        ?disabled=${this.disabled}
        @click=${this._onClick}
      >
        <slot></slot>
      </button>
    `;
  }

  /** Shadow inner button is not a form light-DOM descendant; handle submit/reset on the host. */
  private _onClick(e: MouseEvent) {
    if (this.disabled) {
      e.preventDefault();
      return;
    }
    if (this.href) {
      if (this.disabled) e.preventDefault();
      return;
    }
    const form = this.closest("form");
    if (this.type === "reset" && form) {
      e.preventDefault();
      form.reset();
      return;
    }
    if (this.type === "submit" && form) {
      e.preventDefault();
      form.requestSubmit();
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "vl-button": VlButton;
  }
}
