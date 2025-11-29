import type { Meta, StoryObj } from "@storybook/vue3-vite";

import VButton from "../VButton.vue";

const meta = {
  title: "UI/Common/VButton",
  component: VButton,
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: [
        "default",
        "primary",
        "positive",
        "negative",
        "warning",
        "link",
      ],
      description: "Button variant style",
    },
    type: {
      control: "select",
      options: [
        "button",
        "submit",
        "reset",
      ],
      description: "HTML button type",
    },
    text: {
      control: "text",
      description: "Button text content",
    },
    icon: {
      control: "text",
      description: 'Icon identifier (e.g., "lucide:plus")',
    },
    disabled: {
      control: "boolean",
      description: "Disable button interaction",
    },
    loader: {
      control: "boolean",
      description: "Show loading spinner",
    },
  },
  args: {
    variant: "primary",
    type: "button",
    disabled: false,
    loader: false,
  },
} satisfies Meta<typeof VButton>;

export default meta;
type Story = StoryObj<typeof meta>;

// Basic button with text
export const Primary: Story = {
  args: {
    text: "Primary Button",
    variant: "primary",
  },
};

