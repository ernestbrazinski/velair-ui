import { LitElement, html, css, nothing } from "lit";
import { customElement, property } from "lit/decorators.js";

export type VlNotificationVariant = "success" | "warning" | "error" | "default";

@customElement("vl-notification")
export class VlNotification extends LitElement {
  static styles = css`
    :host {
      display: none;
    }
    :host([open]) {
      display: block;
      position: fixed;
      top: 10px;
      right: 10px;
      z-index: var(--vl-notification-z, 10050);
      box-sizing: border-box;
      animation: vl-notif-in 0.22s ease-out;
    }
    @keyframes vl-notif-in {
      from {
        opacity: 0;
        transform: translateY(6px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
    :host([hidden]) {
      display: none !important;
    }
    .panel {
      position: relative;
      display: flex;
      align-items: flex-start;
      padding: 16px 32px;
      font-size: 14px;
      line-height: 1.45;
      border: 1px solid;
      border-radius: 12px;
    }
    :host([variant="default"]) .panel {
      background: var(--vl-color-notification-default-background);
      border-color: var(--vl-color-notification-default-border);
      color: var(--vl-color-notification-default-color);
    }
    :host([variant="success"]) .panel {
      background: var(--vl-color-notification-success-background);
      border-color: var(--vl-color-notification-success-border);
      color: var(--vl-color-notification-success-color);
    }
    :host([variant="warning"]) .panel {
      background: var(--vl-color-notification-warning-background);
      border-color: var(--vl-color-notification-warning-border);
      color: var(--vl-color-notification-warning-color);
    }
    :host([variant="error"]) .panel {
      background: var(--vl-color-notification-error-background);
      border-color: var(--vl-color-notification-error-border);
      color: var(--vl-color-notification-error-color);
    }
    .body {
      flex: 1;
      min-width: 0;
    }
    .close {
      position: absolute;
      top: 2px;
      right: 2px;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 14px;
      height: 14px;
      padding: 0;
      border: none;
      background: transparent;
      color: inherit;
      font: inherit;
      font-size: 14px;
      line-height: 1;
      cursor: pointer;
      opacity: 0.75;
    }
    .close:hover {
      opacity: 1;
      background: color-mix(in srgb, currentColor 10%, transparent);
    }
    .close:focus-visible {
      outline: 2px solid currentColor;
      outline-offset: 2px;
    }
  `;

  @property({ type: Boolean, reflect: true }) open = false;
  @property({ type: String, reflect: true }) variant: VlNotificationVariant =
    "success";
  @property({ type: Number }) delay = 3000;

  private _timer: ReturnType<typeof setTimeout> | undefined;

  disconnectedCallback(): void {
    super.disconnectedCallback();
    this._clearTimer();
  }

  protected updated(changed: Map<PropertyKey, unknown>) {
    if (changed.has("open")) {
      if (this.open) {
        this._armAutoClose();
      } else {
        this._clearTimer();
      }
    }
    if (changed.has("delay") && this.open) {
      this._armAutoClose();
    }
  }

  private _clearTimer() {
    if (this._timer != null) {
      clearTimeout(this._timer);
      this._timer = undefined;
    }
  }

  private _armAutoClose() {
    this._clearTimer();
    const ms = Number(this.delay);
    if (!this.open || !Number.isFinite(ms) || ms <= 0) return;
    this._timer = setTimeout(() => this._dismiss(), ms);
  }

  private _dismiss() {
    this._clearTimer();
    if (!this.open) return;
    this.open = false;
    this.dispatchEvent(
      new CustomEvent("vl-close", {
        bubbles: true,
        composed: true,
        detail: { reason: "timeout" as const },
      }),
    );
  }

  private _onCloseClick() {
    this._clearTimer();
    this.open = false;
    this.dispatchEvent(
      new CustomEvent("vl-close", {
        bubbles: true,
        composed: true,
        detail: { reason: "close" as const },
      }),
    );
  }

  protected render() {
    if (!this.open) return nothing;
    return html`
      <div
        class="panel"
        part="panel"
        role=${this.variant === "error" ? "alert" : "status"}
        aria-live=${this.variant === "error" ? "assertive" : "polite"}
      >
        <div part="body" class="body"><slot></slot></div>
        <button
          part="close"
          type="button"
          class="close"
          aria-label="close"
          @click=${this._onCloseClick}
        >
          ×
        </button>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "vl-notification": VlNotification;
  }
}
