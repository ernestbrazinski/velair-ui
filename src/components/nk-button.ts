import { LitElement, html, css, nothing } from 'lit';
import { customElement, property } from 'lit/decorators.js';

export type NkButtonVariant = 'primary' | 'secondary' | 'ghost';

@customElement('nk-button')
export class NkButton extends LitElement {
  static styles = css`
    :host {
      display: inline-block;
    }
    :host([hidden]) {
      display: none;
    }
    button {
      box-sizing: border-box;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 0.35em;
      min-height: 2.25rem;
      padding: 0 0.9rem;
      font: inherit;
      line-height: 1.2;
      border-radius: 0.375rem;
      border: 1px solid transparent;
      cursor: pointer;
      transition:
        background 0.12s ease,
        color 0.12s ease,
        border-color 0.12s ease,
        box-shadow 0.12s ease;
    }
    button:focus-visible {
      outline: 2px solid currentColor;
      outline-offset: 2px;
    }
    button:disabled {
      opacity: 0.45;
      cursor: not-allowed;
    }
    .primary {
      color: #fff;
      background: #111;
      border-color: #111;
    }
    .primary:hover:not(:disabled) {
      background: #333;
      border-color: #333;
    }
    .secondary {
      color: #111;
      background: #f4f4f5;
      border-color: #d4d4d8;
    }
    .secondary:hover:not(:disabled) {
      background: #e4e4e7;
      border-color: #a1a1aa;
    }
    .ghost {
      color: #111;
      background: transparent;
      border-color: transparent;
    }
    .ghost:hover:not(:disabled) {
      background: #f4f4f5;
    }
  `;

  @property({ type: String }) variant: NkButtonVariant = 'primary';

  @property({ type: Boolean, reflect: true }) disabled = false;

  @property({ type: String }) type: 'button' | 'submit' | 'reset' = 'button';

  @property({ type: String }) label = '';

  protected render() {
    const variantClass =
      this.variant === 'secondary' || this.variant === 'ghost' ? this.variant : 'primary';

    return html`
      <button
        type=${this.type}
        class=${variantClass}
        ?disabled=${this.disabled}
        aria-disabled=${this.disabled ? 'true' : nothing}
      >
        ${this.label ? html`<span>${this.label}</span>` : html`<slot></slot>`}
      </button>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'nk-button': NkButton;
  }
}
