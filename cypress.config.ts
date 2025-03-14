import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:3000',
    viewportWidth: 1280,
    viewportHeight: 720,
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
  env: {
    // Add your test credentials here
    TEST_USER_EMAIL: 'test@example.com',
    TEST_USER_PASSWORD: 'testpassword',
  },
});
