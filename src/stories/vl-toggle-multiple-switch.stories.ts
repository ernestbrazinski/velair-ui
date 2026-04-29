import type { Meta, StoryObj } from "@storybook/web-components-vite";
import { html } from "lit";
import "../components/vl-toggle-multiple-switch.js";

const meta: Meta = {
  title: "Components/vl-toggle-multiple-switch",
  component: "vl-toggle-multiple-switch",
  tags: ["autodocs"],
  argTypes: {
    value: { control: "text" },
    disabled: { control: "boolean" },
  },
  args: {
    value: "day",
    disabled: false,
  },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: (args) => html`
    <vl-toggle-multiple-switch
      .value=${args.value as string}
      ?disabled=${args.disabled as boolean}
    >
      <button value="day">Day</button>
      <button value="week">Week</button>
      <button value="month">Month</button>
    </vl-toggle-multiple-switch>
  `,
};

export const Two: Story = {
  render: () => html`
    <vl-toggle-multiple-switch value="on">
      <button value="off">Off</button>
      <button value="on">On</button>
    </vl-toggle-multiple-switch>
  `,
};

export const Four: Story = {
  render: () => html`
    <vl-toggle-multiple-switch value="m">
      <button value="xs">XS</button>
      <button value="s">S</button>
      <button value="m">M</button>
      <button value="l">L</button>
    </vl-toggle-multiple-switch>
  `,
};

export const Disabled: Story = {
  render: () => html`
    <vl-toggle-multiple-switch value="b" disabled>
      <button value="a">A</button>
      <button value="b">B</button>
      <button value="c">C</button>
    </vl-toggle-multiple-switch>
  `,
};
