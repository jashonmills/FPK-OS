# 🎯 Operation Sentinel - Cypress E2E Testing

## Quick Start

### Local Development

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Create test user:**
   - Visit your app's auth page
   - Sign up: `test@bedrock-sentinel.local` / `SentinelGuard2025!`

3. **Run tests:**
   ```bash
   # Interactive mode (recommended for development)
   npm run cypress:open

   # Headless mode (CI-style)
   npm run cypress:run

   # Single test file
   npm run test:e2e
   ```

### CI/CD Setup

See [.github/CYPRESS_SETUP.md](.github/CYPRESS_SETUP.md) for GitHub Actions configuration.

## Test Suites

### 1. Perfect Run (`bedrock-pipeline.cy.ts`)
**Mission:** Validate the complete happy path from upload to analysis completion.

**Test Flow:**
1. Login → Navigate to /documents
2. Upload test PDF → Verify in list
3. Trigger analysis → Confirm "Analyzing" status
4. Poll database every 5s → Wait for "Completed"
5. Verify UI updates → Check insights generated
6. Cleanup

**Expected Duration:** ~30-60 seconds

### 2. Edge Cases (`bedrock-edge-cases.cy.ts`)
**Mission:** Stress test system resilience under adverse conditions.

**Test Categories:**

#### Upload Failures
- ❌ Invalid file types (`.exe`, `.zip`)
- ❌ Oversized files (>20MB)
- ❌ Network errors during upload

#### Network Interruptions
- ⚠️ API timeouts (504)
- ⚠️ Rate limits (429)
- ⚠️ Payment required (402)

#### Concurrent Processing
- 🔄 Multiple simultaneous uploads
- 🔄 Concurrent analysis requests
- 🔄 Rapid re-analysis clicks (debouncing)

#### Database & State
- 🗄️ Missing document handling
- 🗄️ Real-time subscription recovery
- 🗄️ Status filter state management

#### Error Recovery
- 🔁 Retry after failed analysis
- 🔁 Session recovery after reload

**Expected Duration:** ~3-5 minutes

## Custom Commands

### Authentication
```typescript
cy.loginTestUser()
```
Programmatically logs in the test user with session caching.

### Setup
```typescript
cy.setupTestFamilyAndStudent()
  .then(({ familyId, studentId }) => {
    // Use IDs in test
  })
```
Creates or retrieves test family and student.

### Cleanup
```typescript
cy.cleanupTestDocuments()
```
Removes all test documents and associated data.

### Analysis Monitoring
```typescript
cy.waitForAnalysisComplete(documentId, timeout)
```
Polls database every 5s until document analysis completes or times out.

### Verification
```typescript
cy.verifyInsightsGenerated(documentId)
```
Confirms AI insights were created for the document.

## Configuration

### `cypress.config.ts`
- Base URL: `http://localhost:8080`
- Default timeout: 10s
- Request timeout: 15s
- Viewport: 1280x720

### `cypress.env.json`
Contains sensitive test credentials:
```json
{
  "SUPABASE_URL": "...",
  "SUPABASE_ANON_KEY": "...",
  "TEST_USER_EMAIL": "...",
  "TEST_USER_PASSWORD": "..."
}
```
⚠️ **Never commit this file to version control!**

## Fixtures

### `test-bip.pdf`
Minimal 1-page BIP document for fast tests.

### `test-iep.pdf`
Sample IEP document for concurrent processing tests.

## Best Practices

### 1. Test Isolation
- Always clean up test data before and after tests
- Use unique identifiers (e.g., `cypress-test` prefix)
- Don't rely on existing database state

### 2. Retry Logic
- Use `.should()` for assertions (auto-retry)
- Set appropriate timeouts for async operations
- Handle network flakiness gracefully

### 3. Debugging
```typescript
// Add debug statements
cy.log('🐛 Debug: Document ID =', documentId)

// Take screenshots
cy.screenshot('before-upload')

// Pause execution
cy.pause()
```

### 4. Performance
- Use `cy.session()` to cache login state
- Minimize database queries
- Run tests in parallel (CI only)

## Troubleshooting

### "No session" error
**Cause:** Test user doesn't exist or session expired  
**Fix:** Create test user account and ensure auto-confirm email is enabled

### "Timeout waiting for analysis"
**Cause:** Analysis stuck or Bedrock pipeline down  
**Fix:** Check edge function logs, verify Document AI credentials

### "Element not found"
**Cause:** Selector changed or timing issue  
**Fix:** Add `cy.wait()` or increase `defaultCommandTimeout`

### "Network error"
**Cause:** Dev server not running or wrong baseUrl  
**Fix:** Run `npm run dev` and verify `baseUrl` in config

## CI/CD Integration

Tests run automatically on:
- ✅ Push to main/master/develop
- ✅ Pull requests
- ✅ Manual workflow dispatch

**Parallelization:** Tests split across 2 containers for faster execution.

**Artifacts:** Screenshots (on failure) and videos (always) are uploaded.

## Metrics & Monitoring

### Key Indicators
- **Pass Rate:** Should be >95%
- **Duration:** <5 minutes total
- **Flakiness:** Retry <3 times per test

### Alerts
- ❌ Test failure on main branch → Immediate investigation required
- ⚠️ Increased timeouts → Possible pipeline degradation
- 🔄 High retry count → Flaky test, needs stabilization

## Contributing

When adding new tests:
1. Follow existing patterns and naming conventions
2. Add descriptive `cy.log()` statements
3. Clean up test data in `afterEach()` or `after()`
4. Update this README with new test coverage

---

**🎯 MISSION STATUS: OPERATIONAL**

The Sentinel stands watch. No regression shall pass undetected.
