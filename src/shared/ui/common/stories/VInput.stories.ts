import type { Meta, StoryObj } from "@storybook/vue3-vite";
import { ref } from "vue";

import VInput from "../VInput.vue";

const meta = {
  title: "UI/Common/VInput",
  component: VInput,
  tags: ["autodocs"],
  argTypes: {
    type: {
      control: "select",
      options: [
        "text",
        "email",
        "password",
        "number",
        "tel",
        "url",
      ],
      description: "Input type",
    },
    size: {
      control: "select",
      options: [
        "sm",
        "md",
        "lg",
      ],
      description: "Input size",
    },
    disabled: {
      control: "boolean",
      description: "Disable input",
    },
    loading: {
      control: "boolean",
      description: "Show loading state",
    },
    textarea: {
      control: "boolean",
      description: "Use textarea instead of input",
    },
    icon: {
      control: "text",
      description: "Icon identifier",
    },
    helperText: {
      control: "text",
      description: "Helper text below input",
    },
  },
  args: {
    type: "text",
    size: "md",
    disabled: false,
    loading: false,
    textarea: false,
  },
} satisfies Meta<typeof VInput>;

export default meta;
type Story = StoryObj<typeof meta>;

// Basic inputs
export const Default: Story = {
  render: (args) => ({
    components: { VInput },
    setup() {
      const value = ref("");
      return { args, value };
    },
    template: `
      <VInput
        v-model="value"
        v-bind="args"
        placeholder="Enter text..."
      />
    `,
  }),
};

export const WithLabel: Story = {
  render: (args) => ({
    components: { VInput },
    setup() {
      const value = ref("");
      return { args, value };
    },
    template: `
      <div>
        <label class="block mb-2 text-sm font-medium">Username</label>
        <VInput
          v-model="value"
          v-bind="args"
          placeholder="Enter username..."
        />
      </div>
    `,
  }),
};

export const WithIcon: Story = {
  render: (args) => ({
    components: { VInput },
    setup() {
      const value = ref("");
      return { args, value };
    },
    template: `
      <VInput
        v-model="value"
        v-bind="args"
        icon="lucide:search"
        placeholder="Search..."
      />
    `,
  }),
};

export const WithHelperText: Story = {
  render: (args) => ({
    components: { VInput },
    setup() {
      const value = ref("");
      return { args, value };
    },
    template: `
      <div>
        <label class="block mb-2 text-sm font-medium">Email</label>
        <VInput
          v-model="value"
          v-bind="args"
          type="email"
          placeholder="your@email.com"
          helper-text="We'll never share your email"
        />
      </div>
    `,
  }),
};

// Different types
export const Email: Story = {
  render: (args) => ({
    components: { VInput },
    setup() {
      const value = ref("");
      return { args, value };
    },
    template: `
      <VInput
        v-model="value"
        v-bind="args"
        type="email"
        icon="lucide:mail"
        placeholder="your@email.com"
      />
    `,
  }),
};

export const Password: Story = {
  render: (args) => ({
    components: { VInput },
    setup() {
      const value = ref("");
      return { args, value };
    },
    template: `
      <VInput
        v-model="value"
        v-bind="args"
        type="password"
        icon="lucide:lock"
        placeholder="Enter password..."
      />
    `,
  }),
};

export const Number: Story = {
  render: (args) => ({
    components: { VInput },
    setup() {
      const value = ref("");
      return { args, value };
    },
    template: `
      <VInput
        v-model="value"
        v-bind="args"
        type="number"
        placeholder="Enter number..."
      />
    `,
  }),
};

// Different sizes
export const Small: Story = {
  render: (args) => ({
    components: { VInput },
    setup() {
      const value = ref("");
      return { args, value };
    },
    template: `
      <VInput
        v-model="value"
        v-bind="args"
        size="sm"
        placeholder="Small input"
      />
    `,
  }),
};

export const Medium: Story = {
  render: (args) => ({
    components: { VInput },
    setup() {
      const value = ref("");
      return { args, value };
    },
    template: `
      <VInput
        v-model="value"
        v-bind="args"
        size="md"
        placeholder="Medium input"
      />
    `,
  }),
};

export const Large: Story = {
  render: (args) => ({
    components: { VInput },
    setup() {
      const value = ref("");
      return { args, value };
    },
    template: `
      <VInput
        v-model="value"
        v-bind="args"
        size="lg"
        placeholder="Large input"
      />
    `,
  }),
};

// States
export const Disabled: Story = {
  render: (args) => ({
    components: { VInput },
    setup() {
      const value = ref("Disabled value");
      return { args, value };
    },
    template: `
      <VInput
        v-model="value"
        v-bind="args"
        disabled
      />
    `,
  }),
};

export const Loading: Story = {
  render: (args) => ({
    components: { VInput },
    setup() {
      const value = ref("");
      return { args, value };
    },
    template: `
      <VInput
        v-model="value"
        v-bind="args"
        loading
        placeholder="Loading..."
      />
    `,
  }),
};

// Textarea
export const Textarea: Story = {
  render: (args) => ({
    components: { VInput },
    setup() {
      const value = ref("");
      return { args, value };
    },
    template: `
      <div>
        <label class="block mb-2 text-sm font-medium">Description</label>
        <VInput
          v-model="value"
          v-bind="args"
          textarea
          :rows="4"
          placeholder="Enter description..."
        />
      </div>
    `,
  }),
};

// Form example
export const FormExample: Story = {
  render: () => ({
    components: { VInput },
    setup() {
      const form = ref({
        username: "",
        email: "",
        password: "",
        bio: "",
      });
      return { form };
    },
    template: `
      <div class="space-y-4 max-w-md">
        <div>
          <label class="block mb-2 text-sm font-medium">Username</label>
          <VInput
            v-model="form.username"
            icon="lucide:user"
            placeholder="Enter username..."
          />
        </div>
        
        <div>
          <label class="block mb-2 text-sm font-medium">Email</label>
          <VInput
            v-model="form.email"
            type="email"
            icon="lucide:mail"
            placeholder="your@email.com"
            helper-text="We'll never share your email"
          />
        </div>
        
        <div>
          <label class="block mb-2 text-sm font-medium">Password</label>
          <VInput
            v-model="form.password"
            type="password"
            icon="lucide:lock"
            placeholder="Enter password..."
          />
        </div>
        
        <div>
          <label class="block mb-2 text-sm font-medium">Bio</label>
          <VInput
            v-model="form.bio"
            textarea
            :rows="4"
            placeholder="Tell us about yourself..."
          />
        </div>
      </div>
    `,
  }),
};
