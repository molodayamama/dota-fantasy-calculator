import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "tests/ui",
  webServer: {
    command: "python -m fantasy_calculator web --port 8000",
    url: "http://127.0.0.1:8000",
    reuseExistingServer: true
  },
  use: {
    baseURL: "http://127.0.0.1:8000"
  }
});

