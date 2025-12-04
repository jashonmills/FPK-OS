// ***********************************************************
// This file is processed and loaded automatically before test files.
// This is where you load custom commands and overrides.
// ***********************************************************

import './commands';
import 'cypress-axe';

// Hide fetch/XHR logs to reduce noise in the command log
const app = window.top;
if (app && !app.document.head.querySelector('[data-hide-command-log-request]')) {
  const style = app.document.createElement('style');
  style.innerHTML = '.command-name-request, .command-name-xhr { display: none }';
  style.setAttribute('data-hide-command-log-request', '');
  app.document.head.appendChild(style);
}

// Prevent uncaught exception failures from breaking tests
Cypress.on('uncaught:exception', (err) => {
  // Return false to prevent test failure
  // Log it for debugging but don't fail the test
  console.log('Uncaught exception:', err.message);
  return false;
});

// Performance metrics collection
let performanceMetrics: Record<string, number[]> = {};

Cypress.on('test:before:run', () => {
  // Reset metrics for each test
  performanceMetrics = {};
});

Cypress.on('test:after:run', (test) => {
  // Log performance metrics after each test
  if (Object.keys(performanceMetrics).length > 0) {
    cy.task('logPerformanceMetrics', {
      testTitle: test.title,
      metrics: performanceMetrics
    }, { log: false });
  }
});

// Make performance metrics available globally
(window as any).performanceMetrics = performanceMetrics;
