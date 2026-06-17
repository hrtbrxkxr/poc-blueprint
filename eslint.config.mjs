import nextConfig from "eslint-config-next";
import boundaries from "eslint-plugin-boundaries";

const config = [
  ...nextConfig,
  {
    files: ["**/*.{ts,tsx}"],
    plugins: { boundaries },
    settings: {
      "boundaries/elements": [
        { type: "shell", pattern: "shell/**" },
        { type: "module-a", pattern: "modules/module-a/**" },
        { type: "module-b", pattern: "modules/module-b/**" },
        { type: "module-c", pattern: "modules/module-c/**" },
        { type: "shared-ui", pattern: "packages/shared-ui/**" },
        { type: "shared-utils", pattern: "packages/shared-utils/**" },
        { type: "branding", pattern: "branding/**" },
        { type: "app", pattern: "app/**" },
      ],
    },
    rules: {
      "boundaries/element-types": [
        "error",
        {
          default: "disallow",
          rules: [
            { from: "app", allow: ["shell", "shared-ui", "shared-utils", "branding"] },
            { from: "shell", allow: ["shared-ui", "shared-utils", "branding", "module-a", "module-b", "module-c"] },
            { from: "module-a", allow: ["shared-ui", "shared-utils"] },
            { from: "module-b", allow: ["shared-ui", "shared-utils"] },
            { from: "module-c", allow: ["shared-ui", "shared-utils"] },
            { from: "shared-ui", allow: [] },
            { from: "shared-utils", allow: [] },
            { from: "branding", allow: [] },
          ],
        },
      ],
    },
  },
];

export default config;
