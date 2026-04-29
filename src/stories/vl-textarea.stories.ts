import type { Meta, StoryObj } from "@storybook/web-components-vite";
import { html } from "lit";
import "../components/vl-textarea.js";

const meta: Meta = {
  title: "Components/vl-textarea",
  component: "vl-textarea",
  tags: ["autodocs"],
  argTypes: {
    value: { control: "text" },
    placeholder: { control: "text" },
    label: { control: "text" },
    error: { control: "text" },
    rows: { control: "number" },
    maxlength: { control: "number" },
    minlength: { control: "number" },
    disabled: { control: "boolean" },
    readonly: { control: "boolean" },
    wide: { control: "boolean" },
    float: { control: "boolean" },
  },
  args: {
    value: "",
    placeholder: "Write your message",
    label: "",
    error: "",
    rows: 4,
    disabled: false,
    readonly: false,
    wide: false,
    float: false,
  },
};

export default meta;
type Story = StoryObj;

const render = (args: Record<string, unknown>) => html`
  <vl-textarea
    .value=${args.value as string}
    placeholder=${args.placeholder as string}
    label=${args.label as string}
    error=${args.error as string}
    rows=${args.rows as number}
    ?disabled=${args.disabled as boolean}
    ?readonly=${args.readonly as boolean}
    ?wide=${args.wide as boolean}
    ?float=${args.float as boolean}
  ></vl-textarea>
`;

export const Default: Story = { render };

export const Floating: Story = {
  render,
  args: { float: true, label: "Notes", placeholder: "Anything you want to add" },
};

export const WithError: Story = {
  render,
  args: { value: "Too short.", error: "At least 20 characters required" },
};

export const Wide: Story = {
  render,
  args: { wide: true, placeholder: "Full width", rows: 6 },
};
