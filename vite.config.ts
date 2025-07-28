import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig({
  test: {
    environment: "jsdom",
  },
  plugins: [react()],
});
