/// <reference types="cypress" />

import { createClient } from '@supabase/supabase-js';

// Custom command type declarations
declare global {
  namespace Cypress {
    interface Chainable {
      /**
       * Custom command to log in a test user programmatically
       * @example cy.loginTestUser()
       */
      loginTestUser(): Chainable<void>;
      
      /**
       * Custom command to clean up test documents from the database
       * @example cy.cleanupTestDocuments()
       */
      cleanupTestDocuments(): Chainable<void>;
      
      /**
       * Custom command to wait for document analysis to complete
       * @param documentId - The ID of the document to monitor
       * @param timeout - Maximum time to wait in milliseconds (default: 120000)
       * @example cy.waitForAnalysisComplete('doc-id-123')
       */
      waitForAnalysisComplete(documentId: string, timeout?: number): Chainable<void>;
      
      /**
       * Custom command to verify insights were generated
       * @param documentId - The ID of the document
       * @example cy.verifyInsightsGenerated('doc-id-123')
       */
      verifyInsightsGenerated(documentId: string): Chainable<void>;
      
      /**
       * Custom command to get or create test family and student
       * @example cy.setupTestFamilyAndStudent()
       */
      setupTestFamilyAndStudent(): Chainable<{ familyId: string; studentId: string }>;
    }
  }
}

// Initialize Supabase client for direct database access
const getSupabaseClient = () => {
  const supabaseUrl = Cypress.env('SUPABASE_URL');
  const supabaseKey = Cypress.env('SUPABASE_ANON_KEY');
  return createClient(supabaseUrl, supabaseKey);
};

// Command: Login test user
Cypress.Commands.add('loginTestUser', () => {
  const email = Cypress.env('TEST_USER_EMAIL');
  const password = Cypress.env('TEST_USER_PASSWORD');

  cy.session(
    email,
    () => {
      cy.visit('/auth');
      cy.get('input[type="email"]').type(email);
      cy.get('input[type="password"]').type(password);
      cy.contains('button', /sign in|login/i).click();
      
      // Wait for redirect to main page
      cy.url().should('not.include', '/auth');
      cy.wait(1000); // Allow session to fully establish
    },
    {
      validate() {
        // Verify localStorage has session data
        cy.window().then((win) => {
          const session = win.localStorage.getItem('sb-pnxwemmpxldriwaomiey-auth-token');
          expect(session).to.exist;
        });
      },
    }
  );
});

// Command: Setup test family and student
Cypress.Commands.add('setupTestFamilyAndStudent', () => {
  return cy.wrap(null).then(async () => {
    const supabase = getSupabaseClient();
    
    // Get current session
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) throw new Error('No active session for test setup');
    
    const userId = session.user.id;
    
    // Check if test family exists
    let { data: family } = await supabase
      .from('families')
      .select('*')
      .eq('user_id', userId)
      .eq('name', 'Sentinel Test Family')
      .single();
    
    // Create if doesn't exist
    if (!family) {
      const { data: newFamily, error: familyError } = await supabase
        .from('families')
        .insert({
          user_id: userId,
          name: 'Sentinel Test Family',
          created_at: new Date().toISOString()
        })
        .select()
        .single();
      
      if (familyError) throw familyError;
      family = newFamily;
    }
    
    // Check if test student exists
    let { data: student } = await supabase
      .from('students')
      .select('*')
      .eq('family_id', family.id)
      .eq('name', 'Test Student')
      .single();
    
    // Create if doesn't exist
    if (!student) {
      const { data: newStudent, error: studentError } = await supabase
        .from('students')
        .insert({
          family_id: family.id,
          name: 'Test Student',
          created_at: new Date().toISOString()
        })
        .select()
        .single();
      
      if (studentError) throw studentError;
      student = newStudent;
    }
    
    return { familyId: family.id, studentId: student.id };
  });
});

// Command: Clean up test documents
Cypress.Commands.add('cleanupTestDocuments', () => {
  cy.wrap(null).then(async () => {
    const supabase = getSupabaseClient();
    
    // Delete test documents with 'cypress-test' in filename
    const { error: docsError } = await supabase
      .from('bedrock_documents')
      .delete()
      .ilike('file_name', '%cypress-test%');
    
    if (docsError) {
      console.warn('Error cleaning up test documents:', docsError);
    }
    
    // Clean up insights for test documents
    const { error: insightsError } = await supabase
      .from('student_insights')
      .delete()
      .ilike('content', '%cypress-test%');
    
    if (insightsError) {
      console.warn('Error cleaning up test insights:', insightsError);
    }
    
    cy.log('✅ Test documents cleaned up');
  });
});

// Command: Wait for analysis to complete
Cypress.Commands.add('waitForAnalysisComplete', (documentId: string, timeout = 120000) => {
  const pollInterval = 5000; // Poll every 5 seconds
  const startTime = Date.now();
  
  const checkStatus = (): Cypress.Chainable<void> => {
    return cy.wrap(null).then(async () => {
      const supabase = getSupabaseClient();
      
      const { data: doc, error } = await supabase
        .from('bedrock_documents')
        .select('status, metadata')
        .eq('id', documentId)
        .single();
      
      if (error) {
        throw new Error(`Failed to query document status: ${error.message}`);
      }
      
      const analysisStatus = doc?.status;
      cy.log(`📊 Document status: ${analysisStatus}`);
      
      if (analysisStatus === 'completed') {
        cy.log('✅ Analysis completed!');
        return;
      }
      
      if (analysisStatus === 'failed') {
        throw new Error('Document analysis failed');
      }
      
      const elapsed = Date.now() - startTime;
      if (elapsed > timeout) {
        throw new Error(`Analysis timeout after ${timeout}ms`);
      }
      
      // Continue polling
      cy.wait(pollInterval);
      return checkStatus();
    });
  };
  
  return checkStatus();
});

// Command: Verify insights were generated
Cypress.Commands.add('verifyInsightsGenerated', (documentId: string) => {
  cy.wrap(null).then(async () => {
    const supabase = getSupabaseClient();
    
    const { data: insights, error } = await supabase
      .from('student_insights')
      .select('*')
      .eq('document_id', documentId);
    
    if (error) {
      throw new Error(`Failed to query insights: ${error.message}`);
    }
    
    expect(insights).to.exist;
    expect(insights.length).to.be.greaterThan(0);
    cy.log(`✅ ${insights.length} insights generated`);
  });
});

// Export empty object to make this a module
export {};
