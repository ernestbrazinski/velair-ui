import type { Meta, StoryObj } from "@storybook/web-components-vite";
import { html } from "lit";
import "../components/vl-input.js";

const meta: Meta = {
  title: "Components/vl-input",
  component: "vl-input",
  tags: ["autodocs"],
  argTypes: {
    type: {
      control: "select",
      options: ["text", "password", "email", "search", "tel", "url", "number"],
    },
    value: { control: "text" },
    placeholder: { control: "text" },
    label: { control: "text" },
    error: { control: "text" },
    autocomplete: { control: "text" },
    name: { control: "text" },
    maxlength: { control: "number" },
    minlength: { control: "number" },
    disabled: { control: "boolean" },
    readonly: { control: "boolean" },
    wide: { control: "boolean" },
    float: { control: "boolean" },
  },
  args: {
    type: "text",
    value: "",
    placeholder: "Type something",
    label: "",
    error: "",
    disabled: false,
    readonly: false,
    wide: false,
    float: false,
  },
};

export default meta;
type Story = StoryObj;

const render = (args: Record<string, unknown>) => html`
  <vl-input
    type=${args.type as string}
    .value=${args.value as string}
    placeholder=${args.placeholder as string}
    label=${args.label as string}
    error=${args.error as string}
    name=${(args.name as string) ?? ""}
    autocomplete=${(args.autocomplete as string) ?? ""}
    ?disabled=${args.disabled as boolean}
    ?readonly=${args.readonly as boolean}
    ?wide=${args.wide as boolean}
    ?float=${args.float as boolean}
  ></vl-input>
`;

export const Default: Story = { render };

export const Floating: Story = {
  render,
  args: { float: true, label: "Email", placeholder: "you@example.com" },
};

export const WithError: Story = {
  render,
  args: { value: "abc", error: "Must be at least 5 characters" },
};

export const Disabled: Story = {
  render,
  args: { value: "Read-only value", disabled: true },
};

export const Wide: Story = {
  render,
  args: { wide: true, placeholder: "Full width" },
};
