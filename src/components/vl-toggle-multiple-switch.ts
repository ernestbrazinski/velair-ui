import { LitElement, html, css } from "lit";
import { customElement, property, state } from "lit/decorators.js";

@customElement("vl-toggle-multiple-switch")
export class VlToggleMultipleSwitch extends LitElement {
  static styles = css`
    :host {
      display: inline-block;
      outline: none !important;
    }
    :host([hidden]) {
      display: none;
    }
    :host([disabled]) {
      pointer-events: none;
      opacity: 0.5;
    }
    [part~="root"] {
      position: relative;
      display: flex;
      gap: var(--vl-tms-gap, 8px);
      padding: var(--vl-tms-pad, 4px);
      border-radius: 999px;
      background: ButtonFace;
    }
    [part~="thumb"] {
      position: absolute;
      top: var(--vl-tms-pad, 4px);
      height: calc(100% - 2 * var(--vl-tms-pad, 4px));
      border-radius: 999px;
      background: Field;
      transition: left 0.3s ease, width 0.3s ease;
      pointer-events: none;
    }
    [part~="options"] {
      position: relative;
      display: flex;
      flex: 1;
      gap: var(--vl-tms-gap, 8px);
      min-width: 0;
    }
    ::slotted(*) {
      flex: 1;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      padding: 6px 16px;
      border: none;
      border-radius: 999px;
      background: transparent;
      font: inherit;
      color: inherit;
      cursor: pointer;
    }
    ::slotted([aria-checked="true"]) {
      cursor: default;
    }
  `;

  @property({ type: String, reflect: true }) value = "";
  @property({ type: Boolean, reflect: true }) disabled = false;

  @state() private count = 0;
  @state() private activeIndex = 0;

  private optionsController?: AbortController;

  connectedCallback(): void {
    super.connectedCallback();
    this.addEventListener("keydown", this.onKeydown);
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    this.removeEventListener("keydown", this.onKeydown);
    this.optionsController?.abort();
  }

  protected firstUpdated(): void {
    this.syncOptions();
  }

  protected updated(changed: Map<string, unknown>): void {
    if (changed.has("value")) this.applyValue();
  }

  private optionValue(el: HTMLElement, index: number): string {
    return el.getAttribute("value") ?? el.dataset.value ?? String(index);
  }

  private readOptions(): HTMLElement[] {
    const slot = this.renderRoot.querySelector("slot");
    if (!slot) return [];
    return slot
      .assignedElements({ flatten: true })
      .filter((n): n is HTMLElement => n instanceof HTMLElement);
  }

  private indexOfValue(opts: HTMLElement[]): number {
    if (!opts.length) return 0;
    const i = opts.findIndex(
      (el, idx) => this.optionValue(el, idx) === this.value,
    );
    return i < 0 ? 0 : i;
  }

  private syncOptions = (): void => {
    this.optionsController?.abort();
    this.optionsController = new AbortController();
    const { signal } = this.optionsController;

    const opts = this.readOptions();
    this.count = opts.length;

    opts.forEach((el, idx) => {
      el.setAttribute("role", "radio");
      el.tabIndex = -1;
      el.addEventListener(
        "click",
        () => !this.disabled && this.select(idx),
        { signal },
      );
    });

    if (opts.length && this.value === "") {
      this.value = this.optionValue(opts[0]!, 0);
    }
    this.applyValue();
  };

  private applyValue(): void {
    const opts = this.readOptions();
    const i = this.indexOfValue(opts);
    this.activeIndex = i;

    opts.forEach((el, idx) => {
      el.setAttribute("aria-checked", idx === i ? "true" : "false");
      el.tabIndex = idx === i ? 0 : -1;
    });

    const next = opts[i] ? this.optionValue(opts[i]!, i) : "";
    if (this.value !== next) this.value = next;
  }

  private select(idx: number): void {
    const opts = this.readOptions();
    if (!opts[idx]) return;
    const next = this.optionValue(opts[idx]!, idx);
    if (next === this.value) return;
    this.value = next;
    this.dispatchEvent(
      new CustomEvent("vl-change", {
        bubbles: true,
        composed: true,
        detail: { value: this.value, index: idx },
      }),
    );
  }

  private onKeydown = (e: KeyboardEvent): void => {
    if (this.disabled || this.count < 2) return;
    const step =
      e.key === "ArrowRight" || e.key === "ArrowDown"
        ? 1
        : e.key === "ArrowLeft" || e.key === "ArrowUp"
          ? -1
          : 0;
    if (!step) return;
    e.preventDefault();
    const next = (this.activeIndex + step + this.count) % this.count;
    this.select(next);
    this.readOptions()[next]?.focus();
  };

  private thumbStyle() {
    if (!this.count) return { left: "0", width: "0", opacity: "0" };
    const n = this.count;
    const seg = `calc((100% - 2 * var(--vl-tms-pad, 4px) - ${n - 1} * var(--vl-tms-gap, 8px)) / ${n})`;
    const left = `calc(var(--vl-tms-pad, 4px) + ${this.activeIndex} * (${seg} + var(--vl-tms-gap, 8px)))`;
    return { left, width: seg, opacity: "1" };
  }

  protected render() {
    const { left, width, opacity } = this.thumbStyle();
    return html`
      <div part="root" role="radiogroup">
        <div
          part="thumb"
          style="left:${left};width:${width};opacity:${opacity}"
        ></div>
        <div part="options">
          <slot @slotchange=${this.syncOptions}></slot>
        </div>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "vl-toggle-multiple-switch": VlToggleMultipleSwitch;
  }
}
