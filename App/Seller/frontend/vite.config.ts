import { defineConfig, configDefaults } from "vitest/config";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      "/api": "http://localhost:3013"
    }
  },
  preview: {
    proxy: {
      "/api": "http://localhost:3013"
    }
  },
  test: {
    environment: "jsdom",
    setupFiles: ["./test/setupTests.ts"],
    exclude: [...configDefaults.exclude, "dist/*"],
    coverage: {
      include: ["src/**"],
      exclude: ["src/main.tsx", "**/index.ts"],
    },
  },
});