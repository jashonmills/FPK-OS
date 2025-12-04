import { defineConfig } from 'cypress';
import * as fs from 'fs';
import * as path from 'path';

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:8080',
    supportFile: 'cypress/support/e2e.ts',
    specPattern: 'cypress/e2e/**/*.cy.{js,jsx,ts,tsx}',
    experimentalStudio: true,
    video: true,
    screenshotOnRunFailure: true,
    viewportWidth: 1280,
    viewportHeight: 720,
    defaultCommandTimeout: 10000,
    requestTimeout: 15000,
    responseTimeout: 15000,
    
    // Mochawesome reporter configuration
    reporter: 'cypress-multi-reporters',
    reporterOptions: {
      reporterEnabled: 'mochawesome',
      mochawesomeReporterOptions: {
        reportDir: 'cypress/reports/mochawesome',
        overwrite: false,
        html: false,
        json: true,
        timestamp: 'mmddyyyy_HHMMss'
      }
    },
    
    setupNodeEvents(on, config) {
      // Task: Log performance metrics to file
      on('task', {
        logPerformanceMetrics({ testTitle, metrics }: { testTitle: string; metrics: Record<string, number[]> }) {
          const metricsDir = path.join(__dirname, 'cypress', 'reports', 'performance');
          if (!fs.existsSync(metricsDir)) {
            fs.mkdirSync(metricsDir, { recursive: true });
          }
          
          const timestamp = new Date().toISOString();
          const metricsFile = path.join(metricsDir, 'metrics.jsonl');
          
          const entry = {
            timestamp,
            test: testTitle,
            metrics
          };
          
          fs.appendFileSync(metricsFile, JSON.stringify(entry) + '\n');
          
          return null;
        },
        
        log(message: string) {
          console.log(message);
          return null;
        }
      });
      
      return config;
    },
    
    env: {
      // These will be overridden by cypress.env.json
      SUPABASE_URL: '',
      SUPABASE_ANON_KEY: '',
      TEST_USER_EMAIL: '',
      TEST_USER_PASSWORD: '',
      
      // Performance thresholds (milliseconds)
      UPLOAD_THRESHOLD: 15000,
      ANALYSIS_THRESHOLD: 120000,
      PAGE_LOAD_THRESHOLD: 3000,
    }
  },
});
