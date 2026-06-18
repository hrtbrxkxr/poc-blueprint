import { defineConfig } from "vitest/config";
import path from "node:path";

export default defineConfig({
  test: {
    environment: "node",
    include: ["tests/**/*.test.ts", "shell/**/*.test.ts"],
    coverage: { reporter: ["text", "html"] },
  },
  resolve: {
    alias: {
      "@/shell": path.resolve(__dirname, "shell"),
      "@/configs": path.resolve(__dirname, "configs"),
      "@hrtbrxkxr/shared-ui": path.resolve(__dirname, "packages/shared-ui/src/index.ts"),
      "@hrtbrxkxr/shared-utils": path.resolve(__dirname, "packages/shared-utils/src/index.ts"),
    },
  },
});
