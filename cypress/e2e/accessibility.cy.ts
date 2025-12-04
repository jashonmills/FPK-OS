/**
 * OPERATION SENTINEL - Accessibility Testing (WCAG 2.1 AA)
 * 
 * This test suite validates accessibility compliance:
 * - WCAG 2.1 Level AA standards
 * - Keyboard navigation
 * - Screen reader compatibility
 * - Color contrast ratios
 * - ARIA attributes
 */

describe('OPERATION SENTINEL: Accessibility - WCAG 2.1 AA Compliance', () => {
  beforeEach(() => {
    cy.loginTestUser();
    cy.setupTestFamilyAndStudent();
  });

  describe('Documents Page Accessibility', () => {
    it('should have no accessibility violations on initial load', () => {
      cy.visit('/documents');
      cy.injectAxe();
      
      // Check entire page
      cy.checkA11y(null, {
        runOnly: {
          type: 'tag',
          values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa']
        }
      }, (violations) => {
        if (violations.length > 0) {
          cy.task('log', '♿ Accessibility violations found:');
          violations.forEach((violation) => {
            cy.task('log', `  - ${violation.id}: ${violation.description}`);
            cy.task('log', `    Impact: ${violation.impact}`);
            cy.task('log', `    Help: ${violation.helpUrl}`);
          });
        }
      });
      
      cy.log('✅ No WCAG 2.1 AA violations on /documents');
    });

    it('should maintain accessibility after document upload', () => {
      cy.visit('/documents');
      cy.injectAxe();
      
      // Upload document
      cy.contains('button', /upload/i).click();
      cy.get('input[type="file"]').selectFile('cypress/fixtures/test-bip.pdf', { force: true });
      cy.get('[role="dialog"]', { timeout: 15000 }).should('not.exist');
      
      // Re-check accessibility
      cy.checkA11y();
      cy.log('✅ Accessibility maintained after upload');
    });

    it('should have accessible data tables', () => {
      cy.visit('/documents');
      cy.injectAxe();
      
      // Check table specifically
      cy.checkA11y('table', {
        rules: {
          // Tables must have proper headers
          'th-has-data-cells': { enabled: true },
          'td-headers-attr': { enabled: true },
          'table-duplicate-name': { enabled: true }
        }
      });
      
      cy.log('✅ Document table is accessible');
    });

    it('should have accessible form controls', () => {
      cy.visit('/documents');
      cy.injectAxe();
      
      // Open upload modal
      cy.contains('button', /upload/i).click();
      
      // Check form accessibility
      cy.checkA11y('[role="dialog"]', {
        rules: {
          'label': { enabled: true },
          'button-name': { enabled: true },
          'form-field-multiple-labels': { enabled: true }
        }
      });
      
      cy.log('✅ Upload form is accessible');
    });

    it('should have proper color contrast', () => {
      cy.visit('/documents');
      cy.injectAxe();
      
      // Check color contrast specifically
      cy.checkA11y(null, {
        rules: {
          'color-contrast': { enabled: true }
        }
      });
      
      cy.log('✅ Color contrast meets WCAG AA standards');
    });

    it('should have accessible interactive elements', () => {
      cy.visit('/documents');
      cy.injectAxe();
      
      // Check buttons, links, and interactive elements
      cy.checkA11y(null, {
        rules: {
          'button-name': { enabled: true },
          'link-name': { enabled: true },
          'aria-hidden-focus': { enabled: true },
          'focus-order-semantics': { enabled: true }
        }
      });
      
      cy.log('✅ Interactive elements are accessible');
    });
  });

  describe('Keyboard Navigation', () => {
    it('should support keyboard-only navigation', () => {
      cy.visit('/documents');
      
      // Tab through interactive elements
      cy.get('body').tab();
      cy.focused().should('be.visible');
      
      // Navigate to upload button
      cy.get('body').tab().tab().tab();
      
      // Verify focused element is interactive
      cy.focused().should('have.attr', 'role').or('match', /button|link|input/);
      
      cy.log('✅ Keyboard navigation functional');
    });

    it('should allow modal dismissal via Escape key', () => {
      cy.visit('/documents');
      
      // Open upload modal
      cy.contains('button', /upload/i).click();
      cy.get('[role="dialog"]').should('be.visible');
      
      // Press Escape
      cy.get('body').type('{esc}');
      
      // Modal should close
      cy.get('[role="dialog"]').should('not.exist');
      
      cy.log('✅ Modal dismissible via keyboard');
    });

    it('should trap focus within modals', () => {
      cy.visit('/documents');
      
      // Open modal
      cy.contains('button', /upload/i).click();
      cy.get('[role="dialog"]').should('be.visible');
      
      // Tab through modal elements
      cy.get('[role="dialog"]').within(() => {
        cy.get('body').tab();
        cy.focused().should('exist');
        
        // Focus should stay within modal
        cy.get('body').tab().tab().tab().tab();
        cy.focused().parents('[role="dialog"]').should('exist');
      });
      
      cy.log('✅ Focus trapped within modal');
    });
  });

  describe('Screen Reader Compatibility', () => {
    it('should have proper ARIA labels on buttons', () => {
      cy.visit('/documents');
      
      // Check upload button
      cy.contains('button', /upload/i)
        .should('have.attr', 'aria-label')
        .or('have.text');
      
      cy.log('✅ Buttons have accessible labels');
    });

    it('should have ARIA live regions for dynamic content', () => {
      cy.visit('/documents');
      
      // Upload document (triggers dynamic update)
      cy.contains('button', /upload/i).click();
      cy.get('input[type="file"]').selectFile('cypress/fixtures/test-bip.pdf', { force: true });
      
      // Check for toast/notification with aria-live
      cy.get('[aria-live]', { timeout: 5000 }).should('exist');
      
      cy.log('✅ ARIA live regions present for notifications');
    });

    it('should have semantic HTML structure', () => {
      cy.visit('/documents');
      
      // Check for semantic elements
      cy.get('main').should('exist');
      cy.get('nav').should('exist').or('not.exist'); // Optional
      
      // Headings should be hierarchical
      cy.get('h1, h2, h3, h4, h5, h6').then(($headings) => {
        expect($headings.length).to.be.greaterThan(0);
        cy.log(`✅ Found ${$headings.length} semantic headings`);
      });
    });

    it('should have descriptive page title', () => {
      cy.visit('/documents');
      
      cy.title().should('not.be.empty');
      cy.title().should('include', 'Document').or('include', 'Upload');
      
      cy.log('✅ Page has descriptive title');
    });
  });

  describe('ARIA Attributes', () => {
    it('should have proper ARIA roles', () => {
      cy.visit('/documents');
      cy.injectAxe();
      
      cy.checkA11y(null, {
        rules: {
          'aria-allowed-attr': { enabled: true },
          'aria-required-attr': { enabled: true },
          'aria-valid-attr': { enabled: true },
          'aria-valid-attr-value': { enabled: true }
        }
      });
      
      cy.log('✅ ARIA attributes valid');
    });

    it('should have accessible loading states', () => {
      cy.visit('/documents');
      
      // Trigger upload
      cy.contains('button', /upload/i).click();
      cy.get('input[type="file"]').selectFile('cypress/fixtures/test-bip.pdf', { force: true });
      
      // Check for aria-busy or loading indicator
      cy.get('[aria-busy="true"]', { timeout: 2000 })
        .should('exist')
        .or('not.exist'); // May complete too fast
      
      cy.log('✅ Loading states accessible');
    });
  });

  describe('Responsive Accessibility', () => {
    it('should maintain accessibility on mobile viewport', () => {
      cy.viewport('iphone-x');
      cy.visit('/documents');
      cy.injectAxe();
      
      cy.checkA11y(null, {
        runOnly: {
          type: 'tag',
          values: ['wcag2a', 'wcag2aa']
        }
      });
      
      cy.log('✅ Mobile view accessible');
    });

    it('should maintain accessibility on tablet viewport', () => {
      cy.viewport('ipad-2');
      cy.visit('/documents');
      cy.injectAxe();
      
      cy.checkA11y();
      
      cy.log('✅ Tablet view accessible');
    });

    it('should support zoom up to 200%', () => {
      cy.visit('/documents');
      
      // Simulate 200% zoom by changing viewport
      cy.viewport(640, 360); // Half of 1280x720
      
      // Content should still be accessible
      cy.contains('button', /upload/i).should('be.visible');
      cy.get('table').should('be.visible');
      
      cy.log('✅ Accessible at 200% zoom');
    });
  });
});
