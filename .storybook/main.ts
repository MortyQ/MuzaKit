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
    "@chromatic-com/storybook",
    "@storybook/addon-a11y",
    "@storybook/addon-docs",
  ],
  framework: {
    name: "@storybook/vue3-vite",
    options: {},
  },
  // Configure base path for GitHub Pages
  ...(process.env.NODE_ENV === "production" && {
    managerHead: (head) => `
      ${head}
      <base href="/MuzaKit/storybook/" />
    `,
  }),
  viteFinal: async (config) => {
    return mergeConfig(config, {
      // Set base path for GitHub Pages deployment
      base: process.env.NODE_ENV === "production" ? "/MuzaKit/storybook/" : "/",
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
