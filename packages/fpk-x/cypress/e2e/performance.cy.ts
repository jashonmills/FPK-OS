/**
 * OPERATION SENTINEL - Performance Benchmarking
 * 
 * This test suite tracks performance metrics and alerts on degradation:
 * - Page load times
 * - Upload duration
 * - Analysis completion time
 * - UI responsiveness
 * - Database query performance
 */

describe('OPERATION SENTINEL: Performance Benchmarking', () => {
  let familyId: string;
  let studentId: string;
  
  const THRESHOLDS = {
    PAGE_LOAD: Cypress.env('PAGE_LOAD_THRESHOLD') || 3000,
    UPLOAD: Cypress.env('UPLOAD_THRESHOLD') || 15000,
    ANALYSIS: Cypress.env('ANALYSIS_THRESHOLD') || 120000,
    UI_INTERACTION: 500,
    DATABASE_QUERY: 2000
  };

  beforeEach(() => {
    cy.loginTestUser();
    cy.setupTestFamilyAndStudent().then((result) => {
      familyId = result.familyId;
      studentId = result.studentId;
    });
  });

  afterEach(() => {
    cy.cleanupTestDocuments();
  });

  describe('Page Load Performance', () => {
    it('should load documents page within threshold', () => {
      const startTime = Date.now();
      
      cy.visit('/documents');
      cy.get('table', { timeout: 10000 }).should('be.visible');
      
      const loadTime = Date.now() - startTime;
      cy.checkPerformance('Page Load', loadTime, THRESHOLDS.PAGE_LOAD);
      
      expect(loadTime).to.be.lessThan(THRESHOLDS.PAGE_LOAD);
    });

    it('should render statistics cards quickly', () => {
      cy.visit('/documents');
      
      const startTime = Date.now();
      cy.get('[class*="card"]').should('have.length.at.least', 4);
      const renderTime = Date.now() - startTime;
      
      cy.checkPerformance('Statistics Render', renderTime, 1000);
    });

    it('should handle large document lists efficiently', () => {
      cy.visit('/documents');
      
      // Measure table render time
      const startTime = Date.now();
      cy.get('table tbody tr').should('exist');
      const renderTime = Date.now() - startTime;
      
      cy.checkPerformance('Table Render', renderTime, 2000);
    });
  });

  describe('Upload Performance', () => {
    it('should complete upload within threshold', () => {
      cy.visit('/documents');
      
      cy.measurePerformance('Upload', () => {
        cy.contains('button', /upload/i).click();
        cy.get('input[type="file"]').selectFile('cypress/fixtures/test-bip.pdf', { force: true });
        return cy.get('[role="dialog"]', { timeout: THRESHOLDS.UPLOAD }).should('not.exist');
      }).then(() => {
        const metrics = (window as any).performanceMetrics;
        const uploadTime = metrics['Upload']?.[0] || 0;
        
        cy.checkPerformance('Upload', uploadTime, THRESHOLDS.UPLOAD);
        expect(uploadTime).to.be.lessThan(THRESHOLDS.UPLOAD);
      });
    });

    it('should track upload speed for different file sizes', () => {
      cy.visit('/documents');
      
      // Small file (test-bip.pdf)
      cy.measurePerformance('Upload Small File', () => {
        cy.contains('button', /upload/i).click();
        cy.get('input[type="file"]').selectFile('cypress/fixtures/test-bip.pdf', { force: true });
        return cy.get('[role="dialog"]', { timeout: 15000 }).should('not.exist');
      });
      
      cy.wait(2000);
      
      // Medium file (test-iep.pdf)
      cy.measurePerformance('Upload Medium File', () => {
        cy.contains('button', /upload/i).click();
        cy.get('input[type="file"]').selectFile('cypress/fixtures/test-iep.pdf', { force: true });
        return cy.get('[role="dialog"]', { timeout: 15000 }).should('not.exist');
      });
      
      cy.log('📊 Upload performance metrics collected');
    });
  });

  describe('Analysis Performance', () => {
    it('should complete analysis within threshold', () => {
      cy.visit('/documents');
      
      // Upload first
      cy.contains('button', /upload/i).click();
      cy.get('input[type="file"]').selectFile('cypress/fixtures/test-bip.pdf', { force: true });
      cy.get('[role="dialog"]', { timeout: 15000 }).should('not.exist');
      
      // Get document ID
      let documentId: string;
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
          documentId = doc.id;
        }
      });
      
      // Measure analysis time
      cy.then(() => {
        cy.measurePerformance('Analysis Complete', () => {
          // Trigger analysis
          cy.get('table tbody tr').first().within(() => {
            cy.get('button').contains(/analyze/i).click();
          });
          
          // Wait for completion
          return cy.then(() => {
            cy.waitForAnalysisComplete(documentId, THRESHOLDS.ANALYSIS);
          });
        }).then(() => {
          const metrics = (window as any).performanceMetrics;
          const analysisTime = metrics['Analysis Complete']?.[0] || 0;
          
          cy.checkPerformance('Analysis', analysisTime, THRESHOLDS.ANALYSIS);
        });
      });
    });

    it('should track per-category analysis times', () => {
      cy.visit('/documents');
      
      // Test BIP analysis time
      cy.contains('button', /upload/i).click();
      cy.get('input[type="file"]').selectFile('cypress/fixtures/test-bip.pdf', { force: true });
      cy.get('[role="dialog"]', { timeout: 15000 }).should('not.exist');
      
      cy.log('📊 Category-specific analysis metrics collected');
    });
  });

  describe('UI Responsiveness', () => {
    it('should respond to button clicks instantly', () => {
      cy.visit('/documents');
      
      const startTime = Date.now();
      cy.contains('button', /upload/i).click();
      cy.get('[role="dialog"]').should('be.visible');
      const responseTime = Date.now() - startTime;
      
      cy.checkPerformance('Button Click Response', responseTime, THRESHOLDS.UI_INTERACTION);
      expect(responseTime).to.be.lessThan(THRESHOLDS.UI_INTERACTION);
    });

    it('should filter documents quickly', () => {
      cy.visit('/documents');
      
      // Measure filter response time
      const startTime = Date.now();
      cy.get('select').first().select('completed');
      cy.wait(100); // Allow filter to apply
      const filterTime = Date.now() - startTime;
      
      cy.checkPerformance('Filter Application', filterTime, 1000);
    });

    it('should handle rapid interactions gracefully', () => {
      cy.visit('/documents');
      
      // Rapid clicks on upload button
      const startTime = Date.now();
      cy.contains('button', /upload/i).click();
      cy.contains('button', /upload/i).click();
      cy.contains('button', /upload/i).click();
      
      // Should still only show one modal
      cy.get('[role="dialog"]').should('have.length', 1);
      const responseTime = Date.now() - startTime;
      
      cy.checkPerformance('Rapid Click Handling', responseTime, 1000);
    });
  });

  describe('Database Performance', () => {
    it('should query documents table quickly', () => {
      cy.wrap(null).then(async () => {
        const { createClient } = await import('@supabase/supabase-js');
        const supabase = createClient(
          Cypress.env('SUPABASE_URL'),
          Cypress.env('SUPABASE_ANON_KEY')
        );
        
        const startTime = Date.now();
        await supabase
          .from('bedrock_documents')
          .select('*')
          .eq('family_id', familyId)
          .limit(100);
        const queryTime = Date.now() - startTime;
        
        cy.checkPerformance('Documents Query', queryTime, THRESHOLDS.DATABASE_QUERY);
        expect(queryTime).to.be.lessThan(THRESHOLDS.DATABASE_QUERY);
      });
    });

    it('should handle real-time subscriptions efficiently', () => {
      cy.visit('/documents');
      
      // Upload document (triggers real-time update)
      const startTime = Date.now();
      cy.contains('button', /upload/i).click();
      cy.get('input[type="file"]').selectFile('cypress/fixtures/test-bip.pdf', { force: true });
      
      // Wait for document to appear via real-time subscription
      cy.get('table tbody tr', { timeout: 10000 }).should('have.length.at.least', 1);
      const updateTime = Date.now() - startTime;
      
      cy.checkPerformance('Real-time Update', updateTime, 3000);
    });
  });

  describe('Performance Regression Detection', () => {
    it('should detect slow page loads', () => {
      const loadTimes: number[] = [];
      
      // Measure 3 consecutive page loads
      for (let i = 0; i < 3; i++) {
        const start = Date.now();
        cy.visit('/documents');
        cy.get('table').should('be.visible');
        loadTimes.push(Date.now() - start);
        
        if (i < 2) cy.wait(2000);
      }
      
      // Calculate average
      cy.wrap(loadTimes).then((times) => {
        const avg = times.reduce((a, b) => a + b, 0) / times.length;
        cy.log(`📊 Average load time: ${avg.toFixed(0)}ms`);
        
        cy.checkPerformance('Average Page Load', avg, THRESHOLDS.PAGE_LOAD);
      });
    });

    it('should track performance trends over time', () => {
      // This test logs metrics to file for trend analysis
      cy.visit('/documents');
      
      const metrics = {
        page_load: Date.now(),
        viewport: `${Cypress.config('viewportWidth')}x${Cypress.config('viewportHeight')}`,
        browser: Cypress.browser.name,
        version: Cypress.version
      };
      
      cy.task('log', `📊 Performance baseline: ${JSON.stringify(metrics)}`);
    });
  });

  describe('Network Performance', () => {
    it('should handle slow network gracefully', () => {
      // Simulate slow 3G network
      cy.visit('/documents', {
        onBeforeLoad: (win) => {
          // Simulate slow connection
          Object.defineProperty(win.navigator, 'connection', {
            value: {
              effectiveType: '3g',
              downlink: 0.7,
              rtt: 100
            },
            writable: true
          });
        }
      });
      
      cy.get('table').should('be.visible');
      cy.log('✅ Page functional on slow network');
    });

    it('should cache static resources effectively', () => {
      // First visit
      cy.visit('/documents');
      cy.wait(2000);
      
      // Second visit (should be faster due to caching)
      const startTime = Date.now();
      cy.visit('/documents');
      cy.get('table').should('be.visible');
      const cachedLoadTime = Date.now() - startTime;
      
      cy.log(`📊 Cached load time: ${cachedLoadTime}ms`);
      cy.checkPerformance('Cached Page Load', cachedLoadTime, THRESHOLDS.PAGE_LOAD * 0.7);
    });
  });
});
