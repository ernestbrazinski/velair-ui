import { LitElement, html, css, nothing } from "lit";
import { customElement, property, state } from "lit/decorators.js";

export type VlSelectOption = {
  value: string;
  label: string;
  disabled?: boolean;
  iconUrl?: string;
};

const parseOptions = (value: string | null): VlSelectOption[] => {
  if (!value?.trim()) return [];
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

@customElement("vl-select")
export class VlSelect extends LitElement {
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
      position: relative;
    }
    [part~="trigger"] {
      display: flex;
      align-items: center;
      gap: 8px;
      width: 100%;
      padding: 6px 10px;
      border: 1px solid;
      background: Field;
      color: inherit;
      font: inherit;
      text-align: left;
      cursor: pointer;
    }
    [part~="trigger"]:disabled {
      cursor: not-allowed;
    }
    [part~="label"] {
      flex: 1;
      min-width: 0;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    [part~="arrow"] {
      width: 12px;
      height: 12px;
      flex-shrink: 0;
    }
    [part~="panel"] {
      position: absolute;
      top: 100%;
      left: 0;
      right: 0;
      margin: 0;
      padding: 0;
      list-style: none;
      border: 1px solid;
      background: Field;
      max-height: 240px;
      overflow: auto;
    }
    [part~="panel"][hidden] {
      display: none;
    }
    [part~="option"] {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 6px 10px;
      cursor: pointer;
    }
    [part~="option"][aria-disabled="true"] {
      cursor: not-allowed;
    }
    [part~="icon"] {
      width: 16px;
      height: 16px;
      flex-shrink: 0;
    }
  `;

  @property({ converter: { fromAttribute: parseOptions } })
  options: VlSelectOption[] = [];

  @property({ type: String }) value = "";
  @property({ type: String }) name = "";
  @property({ type: Boolean, reflect: true }) disabled = false;
  @property({ type: Boolean, reflect: true }) wide = false;

  @state() private open = false;
  @state() private activeIndex = 0;

  private outsideController?: AbortController;

  disconnectedCallback(): void {
    super.disconnectedCallback();
    this.outsideController?.abort();
  }

  protected firstUpdated(): void {
    if (this.options.length && this.value === "") {
      this.value = this.options[0]!.value;
    }
  }

  private get current(): VlSelectOption | undefined {
    return this.options.find((o) => o.value === this.value) ?? this.options[0];
  }

  private setOpen(open: boolean): void {
    this.open = open;
    this.outsideController?.abort();
    if (!open) return;

    const selected = this.options.findIndex((o) => o.value === this.value);
    this.activeIndex = selected < 0 ? 0 : selected;

    this.outsideController = new AbortController();
    document.addEventListener("pointerdown", this.onOutsidePointer, {
      capture: true,
      signal: this.outsideController.signal,
    });
  }

  private onOutsidePointer = (e: PointerEvent): void => {
    if (!e.composedPath().includes(this)) this.setOpen(false);
  };

  private toggle = (): void => {
    if (!this.disabled) this.setOpen(!this.open);
  };

  private select(option: VlSelectOption): void {
    if (option.disabled) return;
    this.value = option.value;
    this.setOpen(false);
    this.dispatchEvent(
      new CustomEvent("vl-change", {
        bubbles: true,
        composed: true,
        detail: { value: this.value },
      }),
    );
  }

  private moveActive(step: number): void {
    const count = this.options.length;
    let next = this.activeIndex;
    for (let i = 0; i < count; i++) {
      next = (next + step + count) % count;
      if (!this.options[next]?.disabled) {
        this.activeIndex = next;
        return;
      }
    }
  }

  private onKeydown = (e: KeyboardEvent): void => {
    if (this.disabled) return;

    if (!this.open) {
      if (e.key === "ArrowDown" || e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        this.setOpen(true);
      }
      return;
    }

    switch (e.key) {
      case "Escape":
        e.preventDefault();
        this.setOpen(false);
        return;
      case "ArrowDown":
        e.preventDefault();
        this.moveActive(1);
        return;
      case "ArrowUp":
        e.preventDefault();
        this.moveActive(-1);
        return;
      case "Enter":
      case " ": {
        e.preventDefault();
        const option = this.options[this.activeIndex];
        if (option) this.select(option);
        return;
      }
    }
  };

  private renderOption(option: VlSelectOption, index: number) {
    const parts = ["option"];
    if (option.value === this.value) parts.push("option--selected");
    if (this.open && index === this.activeIndex) parts.push("option--active");

    return html`
      <li
        part=${parts.join(" ")}
        role="option"
        aria-selected=${option.value === this.value ? "true" : "false"}
        aria-disabled=${option.disabled ? "true" : "false"}
        @click=${() => this.select(option)}
      >
        ${option.iconUrl
          ? html`<img part="icon" src=${option.iconUrl} alt="" />`
          : nothing}
        <span part="label">${option.label}</span>
      </li>
    `;
  }

  protected render() {
    const current = this.current;
    const triggerParts = this.open ? "trigger trigger--open" : "trigger";
    const arrowParts = this.open ? "arrow arrow--open" : "arrow";

    return html`
      <div part="root" @keydown=${this.onKeydown}>
        ${this.name
          ? html`<input
              type="hidden"
              name=${this.name}
              .value=${this.value}
              ?disabled=${this.disabled}
            />`
          : nothing}
        <button
          part=${triggerParts}
          type="button"
          ?disabled=${this.disabled}
          aria-haspopup="listbox"
          aria-expanded=${this.open ? "true" : "false"}
          @click=${this.toggle}
        >
          ${current?.iconUrl
            ? html`<img part="icon" src=${current.iconUrl} alt="" />`
            : nothing}
          <span part="label">${current?.label ?? ""}</span>
          <svg part=${arrowParts} viewBox="0 0 12 12" aria-hidden="true">
            <path
              fill="none"
              stroke="currentColor"
              stroke-width="1.5"
              stroke-linecap="round"
              d="M2.5 4.25L6 7.75l3.5-3.5"
            />
          </svg>
        </button>
        <ul part="panel" role="listbox" ?hidden=${!this.open}>
          ${this.options.map((option, i) => this.renderOption(option, i))}
        </ul>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "vl-select": VlSelect;
  }
}
