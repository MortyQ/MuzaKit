import type { Meta, StoryObj } from "@storybook/vue3-vite";

import VCard from "../VCard.vue";
import VIcon from "../VIcon.vue";

const meta = {
  title: "UI/Common/VCard",
  component: VCard,
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: [
        "default",
        "elevated",
        "outlined",
        "ghost",
        "glass",
        "glass-elevated",
      ],
      description: "Card visual style variant",
    },
    size: {
      control: "select",
      options: [
        "fit",
        "sm",
        "md",
        "lg",
        "xl",
        "full",
      ],
      description: "Card width preset",
    },
    radius: {
      control: "select",
      options: [
        "none",
        "sm",
        "md",
        "lg",
        "xl",
        "full",
      ],
      description: "Border radius",
    },
    padding: {
      control: "select",
      options: [
        "none",
        "sm",
        "md",
        "lg",
        "xl",
      ],
      description: "Internal padding",
    },
    title: {
      control: "text",
      description: "Card title",
    },
    subtitle: {
      control: "text",
      description: "Card subtitle",
    },
    description: {
      control: "text",
      description: "Card description",
    },
    loading: {
      control: "boolean",
      description: "Show loading state",
    },
    disabled: {
      control: "boolean",
      description: "Disable card interaction",
    },
    clickable: {
      control: "boolean",
      description: "Make card clickable",
    },
  },
  args: {
    variant: "glass",
    size: "full",
    radius: "md",
    padding: "sm",
    loading: false,
    disabled: false,
    clickable: false,
  },
} satisfies Meta<typeof VCard>;

export default meta;
type Story = StoryObj<typeof meta>;

// Basic card variants
export const Default: Story = {
  args: {
    variant: "default",
    title: "Default Card",
    description: "Default Card",
  },
};

export const GlassElevated: Story = {
  args: {
    variant: "glass-elevated",
    title: "Glass Elevated Card",
    description: "Glass card with shadow elevation",
  },
};

// export const Elevated: Story = {
//   args: {
//     variant: "elevated",
//     title: "Elevated Card",
//     description: "Card with strong shadow elevation",
//   },
// };
