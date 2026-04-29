import type { Meta, StoryObj } from "@storybook/web-components-vite";
import { html } from "lit";
import "../components/vl-toggle-switch.js";

const meta: Meta = {
  title: "Components/vl-toggle-switch",
  component: "vl-toggle-switch",
  tags: ["autodocs"],
  argTypes: {
    checked: { control: "boolean" },
    disabled: { control: "boolean" },
  },
  args: {
    checked: false,
    disabled: false,
  },
};

export default meta;
type Story = StoryObj;

const render = (args: Record<string, unknown>) => html`
  <vl-toggle-switch
    ?checked=${args.checked as boolean}
    ?disabled=${args.disabled as boolean}
  ></vl-toggle-switch>
`;

export const Off: Story = { render };

export const On: Story = { render, args: { checked: true } };

export const Disabled: Story = { render, args: { disabled: true } };

export const DisabledOn: Story = {
  render,
  args: { checked: true, disabled: true },
};
