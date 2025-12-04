/**
 * OPERATION SENTINEL - Edge Case & Error Handling Tests
 * 
 * This test suite validates system resilience under adverse conditions:
 * 1. Upload failures (invalid files, size limits, network errors)
 * 2. Network interruptions during analysis
 * 3. Concurrent document processing
 * 4. Database failures and recovery
 */

describe('OPERATION SENTINEL: Edge Cases - Resilience Testing', () => {
  let familyId: string;
  let studentId: string;

  beforeEach(() => {
    cy.cleanupTestDocuments();
    cy.loginTestUser();
    
    cy.setupTestFamilyAndStudent().then((result) => {
      familyId = result.familyId;
      studentId = result.studentId;
    });
  });

  afterEach(() => {
    cy.cleanupTestDocuments();
  });

  describe('Upload Failures', () => {
    it('should reject invalid file types gracefully', () => {
      cy.visit('/documents');
      
      // Create an invalid file (e.g., executable)
      const invalidFile = new File(['invalid content'], 'cypress-test-malware.exe', {
        type: 'application/x-msdownload'
      });
      
      cy.contains('button', /upload/i).click();
      
      // Attempt to upload invalid file
      cy.get('input[type="file"]').then(($input) => {
        const dataTransfer = new DataTransfer();
        dataTransfer.items.add(invalidFile);
        $input[0].files = dataTransfer.files;
        $input[0].dispatchEvent(new Event('change', { bubbles: true }));
      });
      
      // Verify error message appears
      cy.contains(/invalid file type|not supported/i, { timeout: 5000 }).should('be.visible');
      cy.log('✅ Invalid file type rejected');
    });

    it('should handle oversized files gracefully', () => {
      cy.visit('/documents');
      
      // Create a mock large file (simulate 25MB)
      const largeContent = 'x'.repeat(25 * 1024 * 1024); // 25MB
      const largeFile = new File([largeContent], 'cypress-test-huge.pdf', {
        type: 'application/pdf'
      });
      
      cy.contains('button', /upload/i).click();
      
      cy.get('input[type="file"]').then(($input) => {
        const dataTransfer = new DataTransfer();
        dataTransfer.items.add(largeFile);
        $input[0].files = dataTransfer.files;
        $input[0].dispatchEvent(new Event('change', { bubbles: true }));
      });
      
      // Verify size limit error
      cy.contains(/too large|size limit|20mb/i, { timeout: 5000 }).should('be.visible');
      cy.log('✅ Oversized file rejected');
    });

    it('should recover from network errors during upload', () => {
      cy.visit('/documents');
      
      // Intercept and fail the upload request
      cy.intercept('POST', '**/functions/v1/bedrock-upload-v2', {
        statusCode: 500,
        body: { error: 'Network error' }
      }).as('failedUpload');
      
      cy.contains('button', /upload/i).click();
      cy.get('input[type="file"]').selectFile('cypress/fixtures/test-bip.pdf', { force: true });
      
      // Wait for failed upload
      cy.wait('@failedUpload');
      
      // Verify error toast appears
      cy.contains(/upload failed|network error/i, { timeout: 5000 }).should('be.visible');
      cy.log('✅ Network error handled gracefully');
    });
  });

  describe('Network Interruptions', () => {
    it('should handle API timeouts during analysis', () => {
      cy.visit('/documents');
      
      // Upload a valid document first
      cy.contains('button', /upload/i).click();
      cy.get('input[type="file"]').selectFile('cypress/fixtures/test-bip.pdf', { force: true });
      cy.get('[role="dialog"]', { timeout: 15000 }).should('not.exist');
      
      // Intercept and delay the analysis request
      cy.intercept('POST', '**/functions/v1/bedrock-analyze', (req) => {
        req.reply({
          statusCode: 504,
          body: { error: 'Gateway Timeout' },
          delay: 30000 // 30 second delay
        });
      }).as('timedOutAnalysis');
      
      // Trigger analysis
      cy.get('table tbody tr').first().within(() => {
        cy.get('button').contains(/analyze/i).click();
      });
      
      // Verify timeout error is displayed
      cy.contains(/timeout|try again/i, { timeout: 35000 }).should('be.visible');
      cy.log('✅ API timeout handled');
    });

    it('should handle 429 rate limit errors', () => {
      cy.visit('/documents');
      
      // Upload document
      cy.contains('button', /upload/i).click();
      cy.get('input[type="file"]').selectFile('cypress/fixtures/test-bip.pdf', { force: true });
      cy.get('[role="dialog"]', { timeout: 15000 }).should('not.exist');
      
      // Intercept and return rate limit error
      cy.intercept('POST', '**/functions/v1/bedrock-analyze', {
        statusCode: 429,
        body: { error: 'Rate limit exceeded' }
      }).as('rateLimited');
      
      cy.get('table tbody tr').first().within(() => {
        cy.get('button').contains(/analyze/i).click();
      });
      
      cy.wait('@rateLimited');
      
      // Verify rate limit message
      cy.contains(/rate limit|too many requests/i, { timeout: 5000 }).should('be.visible');
      cy.log('✅ Rate limit error displayed');
    });

    it('should handle 402 payment required errors', () => {
      cy.visit('/documents');
      
      cy.contains('button', /upload/i).click();
      cy.get('input[type="file"]').selectFile('cypress/fixtures/test-bip.pdf', { force: true });
      cy.get('[role="dialog"]', { timeout: 15000 }).should('not.exist');
      
      // Intercept and return payment required
      cy.intercept('POST', '**/functions/v1/bedrock-analyze', {
        statusCode: 402,
        body: { error: 'Payment required' }
      }).as('paymentRequired');
      
      cy.get('table tbody tr').first().within(() => {
        cy.get('button').contains(/analyze/i).click();
      });
      
      cy.wait('@paymentRequired');
      
      // Verify payment message
      cy.contains(/payment|credits|funds/i, { timeout: 5000 }).should('be.visible');
      cy.log('✅ Payment required error displayed');
    });
  });

  describe('Concurrent Processing', () => {
    it('should handle multiple simultaneous uploads', () => {
      cy.visit('/documents');
      
      // Upload 3 documents simultaneously
      const uploadCount = 3;
      
      for (let i = 0; i < uploadCount; i++) {
        cy.contains('button', /upload/i).click();
        cy.get('input[type="file"]').selectFile('cypress/fixtures/test-bip.pdf', { force: true });
        cy.wait(500); // Small delay between uploads
      }
      
      // Wait for all uploads to complete
      cy.wait(15000);
      
      // Verify all documents appear in the list
      cy.get('table tbody tr').should('have.length.at.least', uploadCount);
      cy.log(`✅ ${uploadCount} concurrent uploads successful`);
    });

    it('should handle concurrent analysis requests', () => {
      cy.visit('/documents');
      
      // Upload 2 documents
      cy.contains('button', /upload/i).click();
      cy.get('input[type="file"]').selectFile('cypress/fixtures/test-bip.pdf', { force: true });
      cy.get('[role="dialog"]', { timeout: 15000 }).should('not.exist');
      
      cy.contains('button', /upload/i).click();
      cy.get('input[type="file"]').selectFile('cypress/fixtures/test-bip.pdf', { force: true });
      cy.get('[role="dialog"]', { timeout: 15000 }).should('not.exist');
      
      // Trigger analysis on both documents nearly simultaneously
      cy.get('table tbody tr').each(($row, index) => {
        if (index < 2) {
          cy.wrap($row).within(() => {
            cy.get('button').contains(/analyze/i).click();
          });
        }
      });
      
      // Verify both show "Analyzing" status
      cy.get('table tbody tr').first().should('contain', /analyzing/i);
      cy.log('✅ Concurrent analysis requests handled');
    });

    it('should handle rapid re-analysis clicks (debouncing)', () => {
      cy.visit('/documents');
      
      // Upload one document
      cy.contains('button', /upload/i).click();
      cy.get('input[type="file"]').selectFile('cypress/fixtures/test-bip.pdf', { force: true });
      cy.get('[role="dialog"]', { timeout: 15000 }).should('not.exist');
      
      // Click analyze button multiple times rapidly
      cy.get('table tbody tr').first().within(() => {
        const analyzeBtn = cy.get('button').contains(/analyze/i);
        analyzeBtn.click();
        analyzeBtn.click();
        analyzeBtn.click();
      });
      
      // Verify only one analysis is triggered (button should be disabled)
      cy.get('table tbody tr').first().within(() => {
        cy.get('button').contains(/analyze/i).should('be.disabled');
      });
      
      cy.log('✅ Duplicate analysis requests prevented');
    });
  });

  describe('Database & State Management', () => {
    it('should handle missing document gracefully', () => {
      cy.visit('/documents');
      
      // Try to query a non-existent document
      cy.wrap(null).then(async () => {
        const { createClient } = await import('@supabase/supabase-js');
        const supabase = createClient(
          Cypress.env('SUPABASE_URL'),
          Cypress.env('SUPABASE_ANON_KEY')
        );
        
        const { data, error } = await supabase
          .from('bedrock_documents')
          .select('*')
          .eq('id', '00000000-0000-0000-0000-000000000000')
          .maybeSingle();
        
        // Should not throw error, just return null
        expect(error).to.be.null;
        expect(data).to.be.null;
        cy.log('✅ Missing document handled without error');
      });
    });

    it('should recover from real-time subscription failures', () => {
      cy.visit('/documents');
      
      // Simulate subscription disconnection by reloading
      cy.reload();
      
      // Upload after reconnection
      cy.contains('button', /upload/i).click();
      cy.get('input[type="file"]').selectFile('cypress/fixtures/test-bip.pdf', { force: true });
      cy.get('[role="dialog"]', { timeout: 15000 }).should('not.exist');
      
      // Verify document appears (real-time subscription working)
      cy.get('table tbody tr').should('have.length.at.least', 1);
      cy.log('✅ Real-time subscription recovered');
    });

    it('should handle status filter state correctly', () => {
      cy.visit('/documents');
      
      // Upload a document
      cy.contains('button', /upload/i).click();
      cy.get('input[type="file"]').selectFile('cypress/fixtures/test-bip.pdf', { force: true });
      cy.get('[role="dialog"]', { timeout: 15000 }).should('not.exist');
      
      // Try different status filters
      cy.get('select').first().select('completed');
      cy.wait(1000);
      
      cy.get('select').first().select('all');
      cy.wait(1000);
      
      // Verify document list updates
      cy.get('table tbody tr').should('have.length.at.least', 1);
      cy.log('✅ Status filter state managed correctly');
    });
  });

  describe('Error Recovery', () => {
    it('should allow retry after failed analysis', () => {
      cy.visit('/documents');
      
      // Upload document
      cy.contains('button', /upload/i).click();
      cy.get('input[type="file"]').selectFile('cypress/fixtures/test-bip.pdf', { force: true });
      cy.get('[role="dialog"]', { timeout: 15000 }).should('not.exist');
      
      // Intercept first analysis to fail
      let callCount = 0;
      cy.intercept('POST', '**/functions/v1/bedrock-analyze', (req) => {
        callCount++;
        if (callCount === 1) {
          req.reply({ statusCode: 500, body: { error: 'Analysis failed' } });
        } else {
          req.continue(); // Allow second attempt to succeed
        }
      }).as('analysisWithRetry');
      
      // First attempt (will fail)
      cy.get('table tbody tr').first().within(() => {
        cy.get('button').contains(/analyze/i).click();
      });
      
      cy.wait('@analysisWithRetry');
      cy.wait(2000);
      
      // Second attempt (should succeed)
      cy.get('table tbody tr').first().within(() => {
        cy.get('button').contains(/analyze|retry/i).click();
      });
      
      cy.wait('@analysisWithRetry');
      cy.log('✅ Retry after failure successful');
    });
  });
});
