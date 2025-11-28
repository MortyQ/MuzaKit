import type { Meta, StoryObj } from "@storybook/vue3-vite";
import { ref } from "vue";

import VSwitch from "./VSwitch.vue";

const meta = {
  title: "UI/Common/VSwitch",
  component: VSwitch,
  tags: ["autodocs"],
  argTypes: {
    disabled: {
      control: "boolean",
      description: "Disable switch",
    },
    trueLabel: {
      control: "text",
      description: "Label when switch is ON",
    },
    falseLabel: {
      control: "text",
      description: "Label when switch is OFF",
    },
    trueIcon: {
      control: "text",
      description: "Icon when switch is ON",
    },
    falseIcon: {
      control: "text",
      description: "Icon when switch is OFF",
    },
    color: {
      control: "color",
      description: "Custom color for switch",
    },
  },
  args: {
    disabled: false,
  },
} satisfies Meta<typeof VSwitch>;

export default meta;
type Story = StoryObj<typeof meta>;

// Basic switch
export const Default: Story = {
  render: (args) => ({
    components: { VSwitch },
    setup() {
      const enabled = ref(false);
      return { args, enabled };
    },
    template: `
      <div>
        <VSwitch v-model="enabled" v-bind="args" />
        <p class="mt-2 text-sm">Enabled: {{ enabled }}</p>
      </div>
    `,
  }),
};

export const Checked: Story = {
  render: (args) => ({
    components: { VSwitch },
    setup() {
      const enabled = ref(true);
      return { args, enabled };
    },
    template: `
      <VSwitch v-model="enabled" v-bind="args" />
    `,
  }),
};

export const WithLabels: Story = {
  render: (args) => ({
    components: { VSwitch },
    setup() {
      const enabled = ref(false);
      return { args, enabled };
    },
    template: `
      <div>
        <VSwitch 
          v-model="enabled" 
          v-bind="args" 
          true-label="Enabled" 
          false-label="Disabled" 
        />
        <p class="mt-2 text-sm">Status: {{ enabled ? 'ON' : 'OFF' }}</p>
      </div>
    `,
  }),
};

export const WithIcons: Story = {
  render: (args) => ({
    components: { VSwitch },
    setup() {
      const enabled = ref(false);
      return { args, enabled };
    },
    template: `
      <VSwitch 
        v-model="enabled" 
        v-bind="args" 
        true-icon="lucide:check" 
        false-icon="lucide:x" 
      />
    `,
  }),
};

export const Disabled: Story = {
  render: (args) => ({
    components: { VSwitch },
    setup() {
      const enabled = ref(false);
      return { args, enabled };
    },
    template: `
      <VSwitch v-model="enabled" v-bind="args" disabled />
    `,
  }),
};

export const DisabledChecked: Story = {
  render: (args) => ({
    components: { VSwitch },
    setup() {
      const enabled = ref(true);
      return { args, enabled };
    },
    template: `
      <VSwitch v-model="enabled" v-bind="args" disabled />
    `,
  }),
};

export const CustomColor: Story = {
  render: (args) => ({
    components: { VSwitch },
    setup() {
      const enabled = ref(true);
      return { args, enabled };
    },
    template: `
      <VSwitch v-model="enabled" v-bind="args" color="#10b981" />
    `,
  }),
};

// Form example
export const SettingsForm: Story = {
  render: () => ({
    components: { VSwitch },
    setup() {
      const settings = ref({
        notifications: true,
        darkMode: false,
        autoSave: true,
        publicProfile: false,
      });
      return { settings };
    },
    template: `
      <div class="space-y-4 max-w-md">
        <h3 class="font-semibold mb-4">Settings</h3>
        
        <div class="flex items-center justify-between p-3 rounded-lg bg-gray-50">
          <div>
            <p class="font-medium">Notifications</p>
            <p class="text-xs text-gray-500">Receive push notifications</p>
          </div>
          <VSwitch v-model="settings.notifications" />
        </div>
        
        <div class="flex items-center justify-between p-3 rounded-lg bg-gray-50">
          <div>
            <p class="font-medium">Dark Mode</p>
            <p class="text-xs text-gray-500">Switch to dark theme</p>
          </div>
          <VSwitch v-model="settings.darkMode" />
        </div>
        
        <div class="flex items-center justify-between p-3 rounded-lg bg-gray-50">
          <div>
            <p class="font-medium">Auto Save</p>
            <p class="text-xs text-gray-500">Automatically save changes</p>
          </div>
          <VSwitch v-model="settings.autoSave" />
        </div>
        
        <div class="flex items-center justify-between p-3 rounded-lg bg-gray-50">
          <div>
            <p class="font-medium">Public Profile</p>
            <p class="text-xs text-gray-500">Make your profile visible</p>
          </div>
          <VSwitch v-model="settings.publicProfile" />
        </div>
        
        <div class="mt-4 p-3 bg-blue-50 rounded text-sm">
          <pre>{{ settings }}</pre>
        </div>
      </div>
    `,
  }),
};

