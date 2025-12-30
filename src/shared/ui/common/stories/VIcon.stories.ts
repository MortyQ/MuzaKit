import type { Meta, StoryObj } from "@storybook/vue3-vite";

import VIcon from "../VIcon.vue";

const meta = {
  title: "UI/Common/VIcon",
  component: VIcon,
  tags: ["autodocs"],
  argTypes: {
    icon: {
      control: "text",
      description: "Icon identifier (e.g., \"lucide:heart\", \"mdi:home\")",
    },
    size: {
      control: "number",
      description: "Icon size in pixels",
    },
    color: {
      control: "color",
      description: "Icon color",
    },
    loading: {
      control: "boolean",
      description: "Animate icon rotation",
    },
  },
  args: {
    icon: "lucide:star",
    size: 24,
  },
} satisfies Meta<typeof VIcon>;

export default meta;
type Story = StoryObj<typeof meta>;

// Basic icons
export const Default: Story = {
  args: {
    icon: "lucide:star",
    size: 24,
  },
};

export const Heart: Story = {
  args: {
    icon: "lucide:heart",
    size: 24,
  },
};

export const Settings: Story = {
  args: {
    icon: "lucide:settings",
    size: 24,
  },
};

// Different sizes
export const Small: Story = {
  args: {
    icon: "lucide:star",
    size: 16,
  },
};

export const Medium: Story = {
  args: {
    icon: "lucide:star",
    size: 24,
  },
};

export const Large: Story = {
  args: {
    icon: "lucide:star",
    size: 32,
  },
};

export const ExtraLarge: Story = {
  args: {
    icon: "lucide:star",
    size: 48,
  },
};

// With color
export const Colored: Story = {
  args: {
    icon: "lucide:heart",
    size: 32,
    color: "#ef4444",
  },
};

// Loading/animated
export const Loading: Story = {
  args: {
    icon: "mdi:loading",
    size: 32,
    loading: true,
  },
};

// Icon showcase
export const IconShowcase: Story = {
  render: () => ({
    components: { VIcon },
    template: `
      <div class="grid grid-cols-4 gap-4 p-4">
        <div class="flex flex-col items-center gap-2">
          <VIcon icon="lucide:home" :size="32" />
          <span class="text-xs">home</span>
        </div>
        <div class="flex flex-col items-center gap-2">
          <VIcon icon="lucide:user" :size="32" />
          <span class="text-xs">user</span>
        </div>
        <div class="flex flex-col items-center gap-2">
          <VIcon icon="lucide:settings" :size="32" />
          <span class="text-xs">settings</span>
        </div>
        <div class="flex flex-col items-center gap-2">
          <VIcon icon="lucide:heart" :size="32" />
          <span class="text-xs">heart</span>
        </div>
        <div class="flex flex-col items-center gap-2">
          <VIcon icon="lucide:star" :size="32" />
          <span class="text-xs">star</span>
        </div>
        <div class="flex flex-col items-center gap-2">
          <VIcon icon="lucide:bell" :size="32" />
          <span class="text-xs">bell</span>
        </div>
        <div class="flex flex-col items-center gap-2">
          <VIcon icon="lucide:mail" :size="32" />
          <span class="text-xs">mail</span>
        </div>
        <div class="flex flex-col items-center gap-2">
          <VIcon icon="lucide:search" :size="32" />
          <span class="text-xs">search</span>
        </div>
        <div class="flex flex-col items-center gap-2">
          <VIcon icon="lucide:plus" :size="32" />
          <span class="text-xs">plus</span>
        </div>
        <div class="flex flex-col items-center gap-2">
          <VIcon icon="lucide:minus" :size="32" />
          <span class="text-xs">minus</span>
        </div>
        <div class="flex flex-col items-center gap-2">
          <VIcon icon="lucide:check" :size="32" />
          <span class="text-xs">check</span>
        </div>
        <div class="flex flex-col items-center gap-2">
          <VIcon icon="lucide:x" :size="32" />
          <span class="text-xs">x</span>
        </div>
      </div>
    `,
  }),
};
