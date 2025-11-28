import type { Preview } from "@storybook/vue3-vite";
import { setup } from "@storybook/vue3-vite";
import "../src/app/main.scss";

// Register global components if needed
setup((_app) => {
  // You can register global components here if needed
  // _app.component('GlobalComponent', GlobalComponent)
});

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    backgrounds: {
      default: "light",
      values: [
        {
          name: "light",
          value: "#f5f5f5",
        },
        {
          name: "dark",
          value: "#1a1a1a",
        },
      ],
    },
  },
};

export default preview;
