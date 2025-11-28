import type { Meta, StoryObj } from "@storybook/vue3-vite";

import VButton from "./VButton.vue";

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

export const Positive: Story = {
  args: {
    text: "Positive Button",
    variant: "positive",
  },
};

export const Negative: Story = {
  args: {
    text: "Negative Button",
    variant: "negative",
  },
};

export const Warning: Story = {
  args: {
    text: "Warning Button",
    variant: "warning",
  },
};

export const Link: Story = {
  args: {
    text: "Link Button",
    variant: "link",
  },
};

// Button with icon
export const WithIcon: Story = {
  args: {
    text: "Add Item",
    icon: "lucide:plus",
    variant: "primary",
  },
};

// Icon only button
export const IconOnly: Story = {
  args: {
    icon: "lucide:settings",
    variant: "primary",
  },
};

// Loading state
export const Loading: Story = {
  args: {
    text: "Loading...",
    loader: true,
    variant: "primary",
  },
};

// Disabled state
export const Disabled: Story = {
  args: {
    text: "Disabled Button",
    disabled: true,
    variant: "primary",
  },
};

// With slot content
export const WithSlot: Story = {
  render: (args) => ({
    components: { VButton },
    setup() {
      return { args };
    },
    template: `
      <VButton v-bind="args">
        <span>Custom Slot Content</span>
      </VButton>
    `,
  }),
  args: {
    variant: "primary",
  },
};

