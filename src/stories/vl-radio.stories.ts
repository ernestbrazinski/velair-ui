import type { Meta, StoryObj } from "@storybook/web-components-vite";
import { html } from "lit";
import "../components/vl-radio.js";

const meta: Meta = {
  title: "Components/vl-radio",
  component: "vl-radio",
  tags: ["autodocs"],
  argTypes: {
    name: { control: "text" },
    value: { control: "text" },
    error: { control: "text" },
    label: { control: "text" },
    checked: { control: "boolean" },
    disabled: { control: "boolean" },
  },
  args: {
    name: "group",
    value: "a",
    label: "Option A",
    checked: false,
    disabled: false,
    error: "",
  },
};

export default meta;
type Story = StoryObj;

const render = (args: Record<string, unknown>) => html`
  <vl-radio
    name=${args.name as string}
    value=${args.value as string}
    error=${args.error as string}
    ?checked=${args.checked as boolean}
    ?disabled=${args.disabled as boolean}
  >${args.label as string}</vl-radio>
`;

export const Default: Story = { render };

export const Group: Story = {
  render: () => html`
    <div style="display:flex;gap:1rem;">
      <vl-radio name="g" value="a" checked>Option A</vl-radio>
      <vl-radio name="g" value="b">Option B</vl-radio>
      <vl-radio name="g" value="c">Option C</vl-radio>
    </div>
  `,
};

export const Checked: Story = { render, args: { checked: true } };

export const Disabled: Story = { render, args: { disabled: true, checked: true } };
