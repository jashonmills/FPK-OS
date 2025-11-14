import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:8080',
    supportFile: 'cypress/support/e2e.ts',
    specPattern: 'cypress/e2e/**/*.cy.{js,jsx,ts,tsx}',
    experimentalStudio: true,
    video: false,
    screenshotOnRunFailure: true,
    viewportWidth: 1280,
    viewportHeight: 720,
    defaultCommandTimeout: 10000,
    requestTimeout: 15000,
    responseTimeout: 15000,
    env: {
      // These will be overridden by cypress.env.json
      SUPABASE_URL: '',
      SUPABASE_ANON_KEY: '',
      TEST_USER_EMAIL: '',
      TEST_USER_PASSWORD: '',
    }
  },
});
