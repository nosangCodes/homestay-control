import { Config } from "tailwindcss/types/config";
import sharedConfig from "@repo/tailwind-config";

const config: Pick<Config, "prefix" | "presets" | "content"> = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  prefix: "ui-",
  presets: [sharedConfig],
};

export default config;
