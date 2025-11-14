# 🎯 Operation Sentinel - GitHub Actions Setup Guide

## Required GitHub Secrets

To run Cypress E2E tests in GitHub Actions, you need to configure the following secrets in your repository:

### Navigate to: Settings → Secrets and variables → Actions → New repository secret

### Required Secrets:

1. **VITE_SUPABASE_URL**
   - Value: `https://pnxwemmpxldriwaomiey.supabase.co`
   - Description: Your Supabase project URL

2. **VITE_SUPABASE_PUBLISHABLE_KEY**
   - Value: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBueHdlbW1weGxkcml3YW9taWV5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk5OTQ4OTcsImV4cCI6MjA3NTU3MDg5N30.zASmJMJUvvKq2E87YhVALYJIhSbjoZnFD1QFB9v8Ar4`
   - Description: Your Supabase anon/publishable key

3. **CYPRESS_TEST_USER_EMAIL**
   - Value: `test@bedrock-sentinel.local`
   - Description: Email for the dedicated Cypress test user

4. **CYPRESS_TEST_USER_PASSWORD**
   - Value: `SentinelGuard2025!`
   - Description: Password for the dedicated Cypress test user

### Optional Secrets (for Cypress Cloud recording):

5. **CYPRESS_RECORD_KEY** (Optional)
   - Get this from: https://cloud.cypress.io/
   - Enables test recording and parallelization insights
   - Leave blank if not using Cypress Cloud

## Creating the Test User

Before running tests, you must create the test user account:

1. Visit your deployed app's auth page
2. Sign up with:
   - Email: `test@bedrock-sentinel.local`
   - Password: `SentinelGuard2025!`
3. Confirm the email (if auto-confirm is disabled)
4. Create a test family and student for this user (tests will auto-create if missing)

## Workflow Triggers

The Cypress tests run automatically on:
- ✅ Push to `main`, `master`, or `develop` branches
- ✅ Pull requests to `main`, `master`, or `develop`
- ✅ Manual trigger via GitHub Actions UI

## Viewing Test Results

After a workflow run:

1. Go to **Actions** tab in your repository
2. Click on the workflow run
3. View the test summary in the job summary
4. Download artifacts (screenshots/videos) if tests failed

## Test Coverage

### bedrock-pipeline.cy.ts (The Perfect Run)
- ✅ User authentication
- ✅ Document upload
- ✅ Analysis triggering
- ✅ Database polling for completion
- ✅ Insights verification
- ✅ Cleanup

### bedrock-edge-cases.cy.ts (Resilience Testing)
- ✅ Invalid file type rejection
- ✅ Oversized file handling
- ✅ Network error recovery
- ✅ API timeouts
- ✅ Rate limiting (429)
- ✅ Payment errors (402)
- ✅ Concurrent uploads
- ✅ Concurrent analysis
- ✅ Rapid click debouncing
- ✅ Missing document handling
- ✅ Real-time subscription recovery
- ✅ Error retry logic

## Running Tests Locally

```bash
# Interactive mode (Cypress UI)
npm run cypress:open

# Headless mode (same as CI)
npm run cypress:run

# Specific test file
npm run test:e2e

# With headed browser
npm run test:e2e:headed
```

## Troubleshooting

### Tests fail with "No session" error
- Ensure the test user exists in your database
- Check that `cypress.env.json` has correct credentials

### Tests timeout during analysis
- Increase timeout in `cypress.config.ts`: `defaultCommandTimeout: 20000`
- Check that Bedrock pipeline is operational

### GitHub Actions fails to start dev server
- Verify build succeeds locally: `npm run build`
- Check environment variables are set in GitHub Secrets

### Parallel tests conflict
- Tests should clean up after themselves
- Check `cleanupTestDocuments()` is working properly

## CI/CD Best Practices

1. **Always run tests on pull requests** - Catch issues before merge
2. **Review test artifacts on failures** - Screenshots show exactly what went wrong
3. **Monitor test duration** - Slow tests indicate pipeline issues
4. **Keep test data isolated** - Use dedicated test user and clean up after runs

---

**🎯 OPERATION SENTINEL ACTIVE**
Your pipeline is now protected by automated E2E testing on every commit.
