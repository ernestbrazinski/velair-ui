import type { Preview } from "@storybook/web-components-vite";
import customElements from "../custom-elements.json";

import defaultTheme from "../themes/default.css?inline";
import glassTheme from "../themes/glass.css?inline";

import "../src/index.ts";
import "./preview.css";

declare global {
  interface Window {
    __STORYBOOK_CUSTOM_ELEMENTS_MANIFEST__: unknown;
  }
}
window.__STORYBOOK_CUSTOM_ELEMENTS_MANIFEST__ = customElements;

const THEMES: Record<string, string> = {
  default: defaultTheme,
  glass: glassTheme,
};

let themeStyleEl: HTMLStyleElement | null = null;
function applyTheme(name: string) {
  if (!themeStyleEl) {
    themeStyleEl = document.createElement("style");
    themeStyleEl.id = "vl-theme";
    document.head.appendChild(themeStyleEl);
  }
  themeStyleEl.textContent = THEMES[name] ?? THEMES.default;
}

function applyScheme(name: string) {
  document.documentElement.setAttribute("data-scheme", name);
}

const preview: Preview = {
  globalTypes: {
    theme: {
      description: "UI theme",
      defaultValue: "default",
      toolbar: {
        title: "Theme",
        icon: "paintbrush",
        items: [
          { value: "default", title: "Default" },
          { value: "glass", title: "Glass" },
        ],
        dynamicTitle: true,
      },
    },
    scheme: {
      description: "Color scheme",
      defaultValue: "light",
      toolbar: {
        title: "Scheme",
        icon: "circlehollow",
        items: [
          { value: "light", title: "Light", icon: "sun" },
          { value: "dark", title: "Dark", icon: "moon" },
        ],
        dynamicTitle: true,
      },
    },
  },
  decorators: [
    (story, context) => {
      applyTheme(context.globals.theme);
      applyScheme(context.globals.scheme);
      return story();
    },
  ],
  parameters: {
    backgrounds: { disable: true },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    docs: { toc: true },
    options: {
      storySort: { order: ["Intro", "Components"] },
    },
  },
};

export default preview;
