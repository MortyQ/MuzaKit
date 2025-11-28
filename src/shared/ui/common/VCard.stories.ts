import type { Meta, StoryObj } from "@storybook/vue3-vite";

import VCard from "./VCard.vue";
import VIcon from "./VIcon.vue";

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
export const Glass: Story = {
  args: {
    variant: "glass",
    title: "Glass Card",
    description: "Beautiful glassmorphism design with blur effect",
  },
};

export const GlassElevated: Story = {
  args: {
    variant: "glass-elevated",
    title: "Glass Elevated Card",
    description: "Glass card with shadow elevation",
  },
};

export const Elevated: Story = {
  args: {
    variant: "elevated",
    title: "Elevated Card",
    description: "Card with strong shadow elevation",
  },
};

export const Outlined: Story = {
  args: {
    variant: "outlined",
    title: "Outlined Card",
    description: "Card with border outline",
  },
};

export const Ghost: Story = {
  args: {
    variant: "ghost",
    title: "Ghost Card",
    description: "Minimal card with no background",
  },
};

// Card with icon
export const WithIcon: Story = {
  args: {
    variant: "glass",
    icon: "lucide:star",
    title: "Featured Card",
    subtitle: "Special feature",
    description: "This card has an icon in the header",
  },
};

// Different sizes
export const SmallCard: Story = {
  args: {
    variant: "glass",
    size: "sm",
    title: "Small Card",
    description: "A smaller width card",
  },
};

export const MediumCard: Story = {
  args: {
    variant: "glass",
    size: "md",
    title: "Medium Card",
    description: "Medium width card",
  },
};

// Loading state
export const Loading: Story = {
  args: {
    variant: "glass",
    title: "Loading Card",
    loading: true,
  },
};

// Clickable card
export const Clickable: Story = {
  args: {
    variant: "glass",
    title: "Clickable Card",
    description: "This card responds to click events",
    clickable: true,
  },
};

// Card with custom content
export const WithSlotContent: Story = {
  render: (args) => ({
    components: { VCard, VIcon },
    setup() {
      return { args };
    },
    template: `
      <VCard v-bind="args">
        <div class="space-y-4">
          <div class="flex items-center gap-3">
            <VIcon icon="lucide:check-circle" :size="24" class="text-green-500" />
            <span>Custom content with icon</span>
          </div>
          <p class="text-sm opacity-75">
            You can put any content inside the card using slots.
          </p>
          <div class="flex gap-2">
            <button class="px-4 py-2 bg-blue-500 text-white rounded">Action 1</button>
            <button class="px-4 py-2 bg-gray-300 rounded">Action 2</button>
          </div>
        </div>
      </VCard>
    `,
  }),
  args: {
    variant: "glass",
  },
};

// Card with header and footer slots
export const WithHeaderFooter: Story = {
  render: (args) => ({
    components: { VCard, VIcon },
    setup() {
      return { args };
    },
    template: `
      <VCard v-bind="args">
        <template #header>
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
              <VIcon icon="lucide:bell" :size="20" />
              <h3 class="font-semibold">Custom Header</h3>
            </div>
            <VIcon icon="lucide:more-vertical" :size="20" class="cursor-pointer" />
          </div>
        </template>
        
        <p>Main content goes here in the default slot.</p>
        
        <template #footer>
          <div class="flex justify-end gap-2">
            <button class="px-3 py-1 text-sm rounded hover:bg-gray-100">Cancel</button>
            <button class="px-3 py-1 text-sm bg-blue-500 text-white rounded">Confirm</button>
          </div>
        </template>
      </VCard>
    `,
  }),
  args: {
    variant: "glass",
  },
};

