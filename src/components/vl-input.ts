import { LitElement, html, css, nothing } from 'lit';
import { customElement, property } from 'lit/decorators.js';

@customElement('vl-input')
export class VlInput extends LitElement {
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
    input {
      box-sizing: border-box;
      max-width: 100%;
      width: var(--vl-input-width, auto);
      min-width: calc(var(--vl-base) * 12);
      padding: calc(var(--vl-base) * 0.5) calc(var(--vl-base) * 0.65);
      border: 1px solid var(--vl-border);
      border-radius: 4px;
      background: var(--vl-bg);
      color: var(--vl-text);
      font: inherit;
    }
    :host([wide]) input {
      width: 100%;
      min-width: 0;
    }
    input::placeholder {
      color: var(--vl-muted);
      opacity: 1;
    }
    input:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
    input:read-only:not(:disabled) {
      cursor: default;
    }
    input:focus-visible {
      outline: 2px solid var(--vl-accent);
      outline-offset: 2px;
    }
  `;

  @property({ type: String }) value = '';

  @property({ type: String }) type:
    | 'text'
    | 'password'
    | 'email'
    | 'search'
    | 'tel'
    | 'url'
    | 'number' = 'text';

  @property({ type: Boolean, reflect: true }) disabled = false;

  @property({ type: Boolean, reflect: true }) readonly = false;

  @property({ type: String }) inputId = '';

  @property({ type: String }) name = '';

  @property({ type: String }) placeholder = '';

  @property({ type: String }) autocomplete = '';

  @property({ type: Number }) maxlength: number | undefined;

  @property({ type: Number }) minlength: number | undefined;

  @property({ type: Boolean, reflect: true }) wide = false;

  protected render() {
    return html`
      <input
        id=${this.inputId || nothing}
        name=${this.name || nothing}
        type=${this.type}
        .value=${this.value}
        ?disabled=${this.disabled}
        ?readonly=${this.readonly}
        placeholder=${this.placeholder || nothing}
        autocomplete=${this.autocomplete || nothing}
        maxlength=${this.maxlength ?? nothing}
        minlength=${this.minlength ?? nothing}
        @input=${this._onInput}
        @change=${this._onChange}
      />
    `;
  }

  private _onInput(e: Event) {
    const t = e.target as HTMLInputElement;
    this.value = t.value;
    this.dispatchEvent(
      new CustomEvent('vl-input', { bubbles: true, composed: true, detail: { value: this.value } }),
    );
  }

  private _onChange(e: Event) {
    const t = e.target as HTMLInputElement;
    this.value = t.value;
    this.dispatchEvent(
      new CustomEvent('vl-change', { bubbles: true, composed: true, detail: { value: this.value } }),
    );
  }

  updated(changed: Map<PropertyKey, unknown>) {
    if (changed.has('value')) {
      const input = this.renderRoot.querySelector('input');
      if (input && input.value !== this.value) input.value = this.value;
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'vl-input': VlInput;
  }
}
