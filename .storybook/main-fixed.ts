import type { StorybookConfig } from "@storybook/vue3-vite";
import path from "path";
import { fileURLToPath } from "url";
import { mergeConfig } from "vite";

// Get __dirname equivalent in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const config: StorybookConfig = {
  stories: ["../src/**/*.mdx", "../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"],
  addons: [
    "@storybook/addon-onboarding",
    "@chromatic-com/storybook",
    "@storybook/addon-a11y",
  ],
  framework: {
    name: "@storybook/vue3-vite",
    options: {},
  },
  viteFinal: async (config) => {
    return mergeConfig(config, {
      resolve: {
        alias: {
          "@": path.resolve(__dirname, "../src"),
        },
      },
      css: {
        preprocessorOptions: {
          scss: {
            api: "modern-compiler",
          },
        },
      },
    });
  },
};
export default config;

