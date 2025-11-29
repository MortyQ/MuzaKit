import type { Meta, StoryObj } from "@storybook/vue3-vite";
import { ref } from "vue";

import VCheckbox from "../VCheckbox.vue";

const meta = {
  title: "UI/Common/VCheckbox",
  component: VCheckbox,
  tags: ["autodocs"],
  argTypes: {
    label: {
      control: "text",
      description: "Checkbox label text",
    },
    disabled: {
      control: "boolean",
      description: "Disable checkbox",
    },
    indeterminate: {
      control: "boolean",
      description: "Show indeterminate state",
    },
  },
  args: {
    disabled: false,
    indeterminate: false,
  },
} satisfies Meta<typeof VCheckbox>;

export default meta;
type Story = StoryObj<typeof meta>;

// Basic checkbox
export const Default: Story = {
  render: (args) => ({
    components: { VCheckbox },
    setup() {
      const checked = ref(false);
      return { args, checked };
    },
    template: `
      <div>
        <VCheckbox v-model="checked" v-bind="args" label="Accept terms and conditions" />
        <p class="mt-2 text-sm">Checked: {{ checked }}</p>
      </div>
    `,
  }),
};
