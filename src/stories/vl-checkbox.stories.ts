import type { Meta, StoryObj } from "@storybook/web-components-vite";
import { html } from "lit";
import "../components/vl-checkbox.js";

const meta: Meta = {
  title: "Components/vl-checkbox",
  component: "vl-checkbox",
  tags: ["autodocs"],
  argTypes: {
    name: { control: "text" },
    value: { control: "text" },
    error: { control: "text" },
    label: { control: "text" },
    checked: { control: "boolean" },
    disabled: { control: "boolean" },
    indeterminate: { control: "boolean" },
  },
  args: {
    label: "Accept terms",
    checked: false,
    disabled: false,
    indeterminate: false,
    error: "",
    value: "on",
  },
};

export default meta;
type Story = StoryObj;

const render = (args: Record<string, unknown>) => html`
  <vl-checkbox
    name=${(args.name as string) ?? ""}
    value=${args.value as string}
    error=${args.error as string}
    ?checked=${args.checked as boolean}
    ?disabled=${args.disabled as boolean}
    ?indeterminate=${args.indeterminate as boolean}
  >${args.label as string}</vl-checkbox>
`;

export const Default: Story = { render };

export const Checked: Story = { render, args: { checked: true } };

export const Indeterminate: Story = { render, args: { indeterminate: true } };

export const WithError: Story = {
  render,
  args: { error: "You must accept the terms" },
};

export const Disabled: Story = { render, args: { disabled: true, checked: true } };
