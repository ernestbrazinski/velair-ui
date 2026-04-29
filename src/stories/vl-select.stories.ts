import type { Meta, StoryObj } from "@storybook/web-components-vite";
import { html } from "lit";
import "../components/vl-select.js";

const sample = [
  { value: "a", label: "Option A" },
  { value: "b", label: "Option B" },
  { value: "c", label: "Option C", disabled: true },
  { value: "d", label: "Option D" },
];

const meta: Meta = {
  title: "Components/vl-select",
  component: "vl-select",
  tags: ["autodocs"],
  argTypes: {
    value: { control: "text" },
    name: { control: "text" },
    disabled: { control: "boolean" },
    wide: { control: "boolean" },
    options: { control: "object" },
  },
  args: {
    value: "a",
    disabled: false,
    wide: false,
    options: sample,
  },
};

export default meta;
type Story = StoryObj;

const render = (args: Record<string, unknown>) => html`
  <vl-select
    .options=${args.options as unknown[]}
    .value=${args.value as string}
    name=${(args.name as string) ?? ""}
    ?disabled=${args.disabled as boolean}
    ?wide=${args.wide as boolean}
  ></vl-select>
`;

export const Default: Story = { render };

export const Wide: Story = { render, args: { wide: true } };

export const Disabled: Story = { render, args: { disabled: true } };

export const WithIcons: Story = {
  render,
  args: {
    options: [
      { value: "ru", label: "Russian", iconUrl: "https://flagcdn.com/24x18/ru.png" },
      { value: "us", label: "English", iconUrl: "https://flagcdn.com/24x18/us.png" },
      { value: "fr", label: "French", iconUrl: "https://flagcdn.com/24x18/fr.png" },
    ],
    value: "ru",
  },
};
