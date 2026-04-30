import { LitElement, html, css } from "lit";
import { customElement, property, query } from "lit/decorators.js";

@customElement("vl-modal")
export class VlModal extends LitElement {
  static styles = css`
    :host {
      display: contents;
      outline: none !important;
      --vl-base: var(--base-size, 16px);
      --vl-border: var(--color-border, #d4d4d8);
      --vl-surface: var(--color-surface, #fafafa);
      --vl-text: var(--color-text, #111);
      --vl-muted: var(--color-muted, #71717a);
      --vl-accent: var(--color-accent, #2563eb);
    }
    dialog {
      padding: 0;
      border: none;
      margin: auto;
      max-width: min(
        calc(var(--vl-base) * 56),
        calc(100vw - var(--vl-base) * 2)
      );
      width: 100%;
      background: transparent;
      color: inherit;
    }
    dialog::backdrop {
      background: color-mix(in srgb, var(--vl-text) 35%, transparent);
    }
    dialog:focus,
    dialog:focus-visible {
      outline: none;
    }
    .panel {
      position: relative;
      display: flex;
      flex-direction: column;
      gap: calc(var(--vl-base) * 0.75);
      padding: calc(var(--vl-base) * 1.25);
      border: 1px solid var(--vl-border);
      border-radius: 8px;
      background: var(--vl-surface);
      color: inherit;
      box-shadow:
        0 calc(var(--vl-base) * 0.25) calc(var(--vl-base) * 1.5)
          color-mix(in srgb, var(--vl-text) 12%, transparent),
        0 0 0 0.5px color-mix(in srgb, var(--vl-border) 50%, transparent);
    }
    .close {
      position: absolute;
      top: calc(var(--vl-base) * 0.5);
      right: calc(var(--vl-base) * 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      width: calc(var(--vl-base) * 3);
      height: calc(var(--vl-base) * 3);
      padding: 0;
      border: none;
      border-radius: 4px;
      background: transparent;
      color: var(--vl-color-placeholder);
      font: inherit;
      font-size: calc(var(--vl-base) * 1.75);
      line-height: 1;
      cursor: pointer;
    }
    .close:hover {
      color: inherit;
      background: color-mix(in srgb, var(--vl-border) 40%, transparent);
    }
    .close:focus-visible {
      outline: 2px solid var(--vl-accent);
      outline-offset: 2px;
    }
    .title {
      padding-right: calc(var(--vl-base) * 3.5);
      font-size: calc(var(--vl-base) * 1.25);
      font-weight: 600;
    }
    .body {
      font-size: calc(var(--vl-base) * 0.9375);
      line-height: 1.5;
    }
    .footer {
      display: flex;
      flex-wrap: wrap;
      gap: calc(var(--vl-base) * 0.5);
      justify-content: flex-end;
      padding-top: calc(var(--vl-base) * 0.25);
    }
  `;

  @query("dialog", true) private _dialog!: HTMLDialogElement;

  @property({ type: Boolean, reflect: true }) open = false;

  @property({ type: Boolean }) closeOnBackdrop = true;

  @property({ type: Boolean }) showClose = true;

  firstUpdated() {
    this._syncOpen();
  }

  updated(changed: Map<string, unknown>) {
    if (changed.has("open")) {
      queueMicrotask(() => this._syncOpen());
    }
  }

  /** Programmatically closes the dialog (same as the × control). */
  close(): void {
    this._dialog?.close();
  }

  private _onDialogClose = () => {
    this.open = false;
    this.dispatchEvent(
      new CustomEvent("vl-close", { bubbles: true, composed: true }),
    );
  };

  private _syncOpen() {
    const el = this._dialog;
    if (!el) return;
    if (this.open) {
      if (!el.open) el.showModal();
    } else if (el.open) {
      el.close();
    }
  }

  private _onDialogClick(e: MouseEvent) {
    if (!this.closeOnBackdrop) return;
    if (e.target === this._dialog) this._dialog.close();
  }

  private _onCloseClick() {
    this._dialog.close();
  }

  protected render() {
    return html`
      <dialog @click=${this._onDialogClick} @close=${this._onDialogClose}>
        <div class="panel">
          ${this.showClose
            ? html`
                <button
                  type="button"
                  class="close"
                  aria-label="Close"
                  @click=${this._onCloseClick}
                >
                  ×
                </button>
              `
            : null}
          <div class="title"><slot name="title"></slot></div>
          <div class="body"><slot></slot></div>
          <div class="footer"><slot name="footer"></slot></div>
        </div>
      </dialog>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "vl-modal": VlModal;
  }
}
