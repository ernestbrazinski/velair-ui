import { LitElement, html, css, nothing } from 'lit';
import { customElement, property } from 'lit/decorators.js';

export type VlButtonVariant = 'primary' | 'secondary';

@customElement('vl-button')
export class VlButton extends LitElement {
  static styles = css`
    :host {
      display: inline-block;
      --vl-base: var(--base-size, 16px);
      --vl-border: var(--color-border, #d4d4d8);
      --vl-surface: var(--color-surface, #fafafa);
      --vl-text: var(--color-text, #111);
      --vl-accent: var(--color-accent, #2563eb);
      --vl-accent-text: var(--color-accent-text, #fff);
    }
    :host([hidden]) {
      display: none;
    }
    .root {
      box-sizing: border-box;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      padding: calc(var(--vl-base) * 0.5) calc(var(--vl-base) * 1);
      border-radius: 4px;
      border: 1px solid var(--vl-border);
      background: var(--vl-surface);
      color: var(--vl-text);
      font: inherit;
      line-height: 1.2;
      text-decoration: none;
      cursor: pointer;
      transition:
        background 0.12s ease,
        color 0.12s ease,
        border-color 0.12s ease;
    }
    .root:focus-visible {
      outline: 2px solid var(--color-accent, #2563eb);
      outline-offset: 2px;
    }
    .root:disabled,
    .root[aria-disabled='true'] {
      opacity: 0.5;
      cursor: not-allowed;
    }
    .root--primary {
      background: var(--vl-accent);
      border-color: var(--vl-accent);
      color: var(--vl-accent-text);
    }
    .root--secondary {
      background: var(--vl-surface);
      border-color: var(--vl-border);
      color: var(--vl-text);
    }
  `;

  @property({ type: String }) variant: VlButtonVariant = 'primary';

  @property({ type: Boolean, reflect: true }) disabled = false;

  @property({ type: String }) type: 'button' | 'submit' | 'reset' = 'button';

  /** When set, renders a link instead of a button (use instead of NuxtLink `to`). */
  @property({ type: String }) href = '';

  protected render() {
    const isLink = Boolean(this.href);
    const mod = this.variant === 'secondary' ? 'secondary' : 'primary';
    const cls = `root root--${mod}`;

    if (isLink) {
      return html`
        <a
          class=${cls}
          href=${this.href}
          aria-disabled=${this.disabled ? 'true' : nothing}
          tabindex=${this.disabled ? -1 : nothing}
          @click=${this._onLinkClick}
        >
          <slot></slot>
        </a>
      `;
    }

    return html`
      <button class=${cls} type=${this.type} ?disabled=${this.disabled}>
        <slot></slot>
      </button>
    `;
  }

  private _onLinkClick(e: MouseEvent) {
    if (this.disabled) e.preventDefault();
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'vl-button': VlButton;
  }
}
