/**
 * OPERATION SENTINEL - Bedrock Pipeline E2E Test
 * 
 * This test validates the entire document analysis pipeline:
 * 1. User authentication
 * 2. Document upload
 * 3. Analysis triggering
 * 4. Status polling and completion verification
 * 5. Insights generation
 * 6. Cleanup
 */

describe('OPERATION SENTINEL: Bedrock Pipeline - The Perfect Run', () => {
  let familyId: string;
  let studentId: string;
  let uploadedDocumentId: string;

  before(() => {
    // Setup: Clean environment before test
    cy.cleanupTestDocuments();
    
    // Login as test user
    cy.loginTestUser();
    
    // Setup test family and student
    cy.setupTestFamilyAndStudent().then((result) => {
      familyId = result.familyId;
      studentId = result.studentId;
      
      // Store in Cypress env for later use
      Cypress.env('TEST_FAMILY_ID', familyId);
      Cypress.env('TEST_STUDENT_ID', studentId);
      
      cy.log(`📋 Test Family: ${familyId}`);
      cy.log(`👤 Test Student: ${studentId}`);
    });
  });

  after(() => {
    // Cleanup: Remove test documents after test completes
    cy.cleanupTestDocuments();
  });

  it('should complete the full pipeline from upload to analysis', () => {
    // Step 1: Navigate to documents page
    cy.visit('/documents');
    cy.url().should('include', '/documents');
    cy.log('✅ Step 1: Navigated to /documents');

    // Step 2: Upload test document
    cy.contains('button', /upload/i, { timeout: 10000 }).should('be.visible').click();
    
    // Wait for upload modal
    cy.get('[role="dialog"]', { timeout: 5000 }).should('be.visible');
    
    // Select the test PDF file
    cy.get('input[type="file"]').selectFile('cypress/fixtures/test-bip.pdf', {
      force: true
    });
    
    // Wait for upload to complete and modal to close
    cy.get('[role="dialog"]', { timeout: 15000 }).should('not.exist');
    cy.log('✅ Step 2: Document uploaded');
    
    // Step 3: Verify document appears in list
    cy.contains('cypress-test', { timeout: 10000 }).should('be.visible');
    
    // Get the document ID from the UI (this may require adding data-testid attributes)
    cy.get('table tbody tr').first().then(($row) => {
      // Extract document ID from the row (you may need to adjust this selector)
      const documentName = $row.find('td').first().text();
      cy.log(`📄 Found document: ${documentName}`);
      
      // Query database to get the document ID
      cy.wrap(null).then(async () => {
        const { createClient } = await import('@supabase/supabase-js');
        const supabase = createClient(
          Cypress.env('SUPABASE_URL'),
          Cypress.env('SUPABASE_ANON_KEY')
        );
        
        const { data: doc } = await supabase
          .from('bedrock_documents')
          .select('id')
          .ilike('file_name', '%cypress-test%')
          .order('created_at', { ascending: false })
          .limit(1)
          .single();
        
        if (doc) {
          uploadedDocumentId = doc.id;
          cy.log(`🔑 Document ID: ${uploadedDocumentId}`);
        }
      });
    });
    
    cy.log('✅ Step 3: Document verified in list');

    // Step 4: Trigger re-analysis
    cy.get('table tbody tr').first().within(() => {
      // Find and click the re-analyze button
      cy.get('button').contains(/re-analyze|analyze/i).click();
    });
    
    cy.log('✅ Step 4: Re-analysis triggered');

    // Step 5: Verify status changes to "Analyzing"
    cy.contains(/analyzing/i, { timeout: 5000 }).should('be.visible');
    cy.log('✅ Step 5: Status changed to Analyzing');

    // Step 6: Poll database for completion (THE WATCH)
    cy.then(() => {
      expect(uploadedDocumentId).to.exist;
      cy.waitForAnalysisComplete(uploadedDocumentId, 120000); // 2 minute timeout
    });
    
    cy.log('✅ Step 6: Analysis completed (verified in database)');

    // Step 7: Verify UI updates to show completion
    cy.reload(); // Refresh to ensure we see the latest status
    cy.contains(/completed/i, { timeout: 10000 }).should('be.visible');
    cy.log('✅ Step 7: UI shows completion status');

    // Step 8: Verify insights were generated
    cy.then(() => {
      cy.verifyInsightsGenerated(uploadedDocumentId);
    });
    
    cy.log('✅ Step 8: Insights verified in database');
    
    // MISSION COMPLETE
    cy.log('🎯 OPERATION SENTINEL: SUCCESS - All pipeline stages verified');
  });

  it('should handle failed analysis gracefully', () => {
    // This test validates error handling
    // TODO: Implement after we have a way to trigger failures
    cy.log('⏭️ Error handling test - to be implemented');
  });
});
