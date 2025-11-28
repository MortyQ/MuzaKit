import type { Meta, StoryObj } from "@storybook/vue3-vite";
import { ref } from "vue";

import VCheckbox from "./VCheckbox.vue";

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

export const WithLabel: Story = {
  render: (args) => ({
    components: { VCheckbox },
    setup() {
      const checked = ref(true);
      return { args, checked };
    },
    template: `
      <VCheckbox v-model="checked" v-bind="args" label="Subscribe to newsletter" />
    `,
  }),
};

export const Checked: Story = {
  render: (args) => ({
    components: { VCheckbox },
    setup() {
      const checked = ref(true);
      return { args, checked };
    },
    template: `
      <VCheckbox v-model="checked" v-bind="args" label="Pre-checked option" />
    `,
  }),
};

export const Disabled: Story = {
  render: (args) => ({
    components: { VCheckbox },
    setup() {
      const checked = ref(false);
      return { args, checked };
    },
    template: `
      <VCheckbox v-model="checked" v-bind="args" disabled label="Disabled checkbox" />
    `,
  }),
};

export const DisabledChecked: Story = {
  render: (args) => ({
    components: { VCheckbox },
    setup() {
      const checked = ref(true);
      return { args, checked };
    },
    template: `
      <VCheckbox v-model="checked" v-bind="args" disabled label="Disabled checked" />
    `,
  }),
};

export const Indeterminate: Story = {
  render: (args) => ({
    components: { VCheckbox },
    setup() {
      const checked = ref(false);
      return { args, checked };
    },
    template: `
      <VCheckbox v-model="checked" v-bind="args" indeterminate label="Indeterminate state" />
    `,
  }),
};

// Multiple checkboxes
export const MultipleOptions: Story = {
  render: () => ({
    components: { VCheckbox },
    setup() {
      const selected = ref<string[]>([]);
      return { selected };
    },
    template: `
      <div class="space-y-3">
        <h3 class="font-semibold mb-2">Select your interests:</h3>
        <VCheckbox v-model="selected" value="design" label="Design" />
        <VCheckbox v-model="selected" value="development" label="Development" />
        <VCheckbox v-model="selected" value="marketing" label="Marketing" />
        <VCheckbox v-model="selected" value="sales" label="Sales" />
        <div class="mt-4 p-3 bg-gray-100 rounded">
          <p class="text-sm font-medium">Selected: {{ selected.join(', ') || 'None' }}</p>
        </div>
      </div>
    `,
  }),
};

// Checkbox group with select all
export const SelectAll: Story = {
  render: () => ({
    components: { VCheckbox },
    setup() {
      const items = [
        "Apple",
        "Banana",
        "Orange",
        "Mango",
      ];
      const selected = ref<string[]>([]);
      const allSelected = ref(false);
      const indeterminate = ref(false);

      const toggleAll = (value: boolean) => {
        if (value) {
          selected.value = [...items];
        } else {
          selected.value = [];
        }
      };

      const updateSelectAll = () => {
        allSelected.value = selected.value.length === items.length;
        indeterminate.value = selected.value.length > 0 && selected.value.length < items.length;
      };

      return { items, selected, allSelected, indeterminate, toggleAll, updateSelectAll };
    },
    template: `
      <div class="space-y-3">
        <VCheckbox 
          v-model="allSelected" 
          :indeterminate="indeterminate"
          label="Select All" 
          @update:model-value="toggleAll"
          class="font-semibold border-b pb-2"
        />
        <div class="pl-6 space-y-2">
          <VCheckbox 
            v-for="item in items" 
            :key="item"
            v-model="selected" 
            :value="item" 
            :label="item"
            @update:model-value="updateSelectAll"
          />
        </div>
        <div class="mt-4 p-3 bg-gray-100 rounded">
          <p class="text-sm">Selected {{ selected.length }} of {{ items.length }} items</p>
        </div>
      </div>
    `,
  }),
};

// Custom label slot
export const CustomLabel: Story = {
  render: () => ({
    components: { VCheckbox },
    setup() {
      const checked = ref(false);
      return { checked };
    },
    template: `
      <VCheckbox v-model="checked">
        <template #label>
          <span class="flex items-center gap-2">
            <span class="font-semibold">Premium Plan</span>
            <span class="text-xs bg-blue-500 text-white px-2 py-0.5 rounded">Popular</span>
          </span>
        </template>
      </VCheckbox>
    `,
  }),
};

