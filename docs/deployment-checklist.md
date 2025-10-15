# FPX MyCNS-App: Production Deployment Checklist

## Pre-Deployment Verification

### Database & Backend

- [ ] **Run final database migration**: Ensure all schema changes are applied
- [ ] **Verify RLS policies**: All 39 tables have appropriate row-level security
- [ ] **Test database functions**: Confirm all custom functions execute correctly
- [ ] **Verify triggers**: All triggers (credit sync, document analysis, etc.) are active
- [ ] **Check indexes**: Ensure vector indexes on embeddings tables are optimized
- [ ] **Verify storage buckets**: All 3 buckets (log-images, app-assets, family-documents) configured
- [ ] **Test storage policies**: Upload/download permissions working correctly
- [ ] **Verify auth configuration**: Auto-confirm email enabled, anonymous signups disabled

### Edge Functions

- [ ] **Deploy all edge functions**: 45 total functions deployed
- [ ] **Test critical functions**:
  - [ ] `chat-with-data`: AI assistant responding correctly
  - [ ] `analyze-document`: Document analysis pipeline working
  - [ ] `generate-daily-briefing`: Briefing generation successful
  - [ ] `purchase-credits`: Credit purchase flow functional
  - [ ] `stripe-webhook`: Webhook handling subscription events
  - [ ] `embed-family-data`: Embedding generation operational
- [ ] **Verify function logs**: No persistent errors in edge function logs
- [ ] **Test function timeouts**: Confirm no timeout issues on complex operations

### Secrets & Environment Variables

- [ ] **Verify all secrets set**:
  - [ ] `LOVABLE_API_KEY`
  - [ ] `STRIPE_SECRET_KEY`
  - [ ] `STRIPE_WEBHOOK_SECRET`
  - [ ] `SUPABASE_SERVICE_ROLE_KEY`
  - [ ] `SUPABASE_URL`
  - [ ] `SUPABASE_ANON_KEY`
  - [ ] `GOOGLE_CALENDAR_CLIENT_ID`
  - [ ] `RESEND_API_KEY` (if using email features)
- [ ] **Test secret access**: Edge functions can retrieve secrets
- [ ] **Rotate development secrets**: Ensure production uses unique keys

### Stripe Integration

- [ ] **Verify Stripe products created**: Run `setup-stripe-products` function
- [ ] **Confirm product/price IDs**: Free, Team Monthly, Team Annual, Pro Monthly, Pro Annual
- [ ] **Test webhook endpoint**: Stripe webhook pointing to production edge function
- [ ] **Verify webhook secret**: Correct secret in Supabase secrets
- [ ] **Test subscription flow**: End-to-end subscription purchase works
- [ ] **Test credit purchase**: À la carte credit purchase works
- [ ] **Verify tier limits**: Max students/users enforced correctly
- [ ] **Test subscription changes**: Upgrade/downgrade/cancel working

### Frontend & Assets

- [ ] **Build production bundle**: Run `npm run build`
- [ ] **Verify environment variables**: `.env` has correct production values
- [ ] **Test all routes**: No 404s or broken navigation
- [ ] **Verify logo/assets**: All images loading correctly
- [ ] **Test responsive design**: Mobile, tablet, desktop views functional
- [ ] **Check browser compatibility**: Chrome, Safari, Firefox, Edge
- [ ] **Test PWA**: Service worker registered, offline fallback working
- [ ] **Verify meta tags**: SEO tags, Open Graph, favicons correct

### Feature Flags

- [ ] **Verify feature flag table**: All 34 flags configured
- [ ] **Set production rollout percentages**:
  - [ ] Core features: 100%
  - [ ] Beta features (Garmin, Live Data Hub): 0% or controlled rollout
- [ ] **Test flag toggling**: Feature flags correctly hide/show features
- [ ] **Admin access**: Platform admin can update flags

### Security

- [ ] **Run security scan**: Use `security--run_security_scan` tool
- [ ] **Review findings**: Address all critical/high-severity issues
- [ ] **Verify RLS on all tables**: No tables without RLS policies
- [ ] **Test unauthorized access**: Confirm users can't access other families' data
- [ ] **Verify CORS settings**: Proper origins configured for edge functions
- [ ] **Check CSP headers**: Content Security Policy configured
- [ ] **Test XSS prevention**: Forms sanitize input correctly
- [ ] **Verify HTTPS**: All traffic over SSL

### AI & Knowledge Base

- [ ] **Verify KB populated**: Knowledge base has content from scrapers
- [ ] **Test embedding generation**: New data creates embeddings correctly
- [ ] **Test semantic search**: `match_kb_chunks` and `match_family_data` working
- [ ] **Verify AI responses**: Chat answers are accurate and cite sources
- [ ] **Test credit consumption**: AI actions deduct correct credit amounts
- [ ] **Test credit limits**: Users blocked when out of credits
- [ ] **Verify monthly reset**: Credit allowances reset correctly

### Data Integrity

- [ ] **Test family creation**: New families created with correct defaults
- [ ] **Test user onboarding**: New users go through onboarding wizard
- [ ] **Verify student limits**: Tier limits enforced (1/5/unlimited)
- [ ] **Test data export**: Users can download their data as JSON
- [ ] **Test account deletion**: Cascade deletes work correctly
- [ ] **Verify audit logs**: Critical actions logged to `ai_credit_ledger`, etc.

---

## Deployment Steps

### Step 1: Backup Current State (if applicable)

- [ ] **Export database schema**: Save current migration state
- [ ] **Backup production data**: If migrating from another system
- [ ] **Document current version**: Tag in version control

### Step 2: Deploy Backend

- [ ] **Apply database migrations**: Run pending migrations
- [ ] **Deploy edge functions**: Push all 45 functions
- [ ] **Update secrets**: Set production values
- [ ] **Configure auth**: Enable auto-confirm, disable signups if needed
- [ ] **Set up Stripe webhook**: Point to production endpoint

### Step 3: Deploy Frontend

- [ ] **Build production bundle**: `npm run build`
- [ ] **Deploy to hosting**: Upload to Lovable Cloud or custom host
- [ ] **Verify deployment**: Site loads correctly
- [ ] **Test critical paths**: Login, logging, AI chat, subscription

### Step 4: Configure Integrations

- [ ] **Google Calendar OAuth**: Configure redirect URIs for production domain
- [ ] **Stripe**: Update webhook endpoint, test events
- [ ] **Email (Resend)**: Configure sending domain, test invitations

### Step 5: Seed Data (if needed)

- [ ] **Create test family**: For demos and screenshots
- [ ] **Populate KB**: Run knowledge base scrapers if empty
- [ ] **Generate embeddings**: Ensure vector search is functional

---

## Post-Deployment Testing

### Smoke Tests (Critical Paths)

- [ ] **User registration**: New user can sign up
- [ ] **User login**: Existing user can log in
- [ ] **Create family**: New family created successfully
- [ ] **Add student**: Student profile saved
- [ ] **Log incident**: Incident log created and saved
- [ ] **Upload document**: Document uploaded and analyzed
- [ ] **AI chat**: User can ask question and receive answer
- [ ] **View analytics**: Charts load with data
- [ ] **Subscribe**: User can upgrade to paid tier
- [ ] **Purchase credits**: User can buy credit pack
- [ ] **Invite member**: Invitation sent and accepted
- [ ] **Mobile access**: Platform works on mobile devices

### Performance Tests

- [ ] **Page load times**: All pages load in < 3 seconds
- [ ] **AI response time**: Chat responses in < 10 seconds
- [ ] **Document analysis**: Analysis completes within 2 minutes
- [ ] **Chart rendering**: Analytics load without lag
- [ ] **Database queries**: No slow queries (check logs)

### User Acceptance Tests

- [ ] **Onboarding flow**: New user can complete wizard
- [ ] **Product tour**: Joyride tours work correctly
- [ ] **Error handling**: User-friendly error messages display
- [ ] **Success notifications**: Toasts show for actions
- [ ] **Form validation**: Required fields enforced
- [ ] **Navigation**: No broken links or missing pages

---

## Monitoring & Alerts

### Set Up Monitoring

- [ ] **Database monitoring**: Track query performance, errors
- [ ] **Edge function logs**: Monitor for errors, timeouts
- [ ] **Error tracking**: Set up Sentry or equivalent
- [ ] **Uptime monitoring**: Ping production site every 5 minutes
- [ ] **Stripe webhooks**: Monitor webhook delivery success rate
- [ ] **AI credit usage**: Track consumption patterns

### Configure Alerts

- [ ] **Error rate > 5%**: Alert dev team
- [ ] **Edge function timeout**: Alert if timeouts spike
- [ ] **Database connections**: Alert if connection pool saturated
- [ ] **Stripe webhook failures**: Alert immediately
- [ ] **Storage approaching limit**: Alert at 80% capacity
- [ ] **Downtime**: Alert if site unreachable

---

## Documentation

- [ ] **User guides published**: Owner, Contributor, Viewer guides accessible
- [ ] **FAQ created**: Common questions answered
- [ ] **Support email set**: support@fpxcns.com monitored
- [ ] **Privacy policy live**: Legal pages accessible
- [ ] **Terms of service live**: Legal compliance confirmed
- [ ] **HIPAA notice live**: Healthcare compliance notice posted

---

## Marketing & Launch

- [ ] **Landing page live**: Marketing site accessible
- [ ] **Pricing page accurate**: Tiers and prices match Stripe
- [ ] **Demo video**: Walkthrough video on homepage
- [ ] **Social media**: Accounts created and first posts scheduled
- [ ] **Press release**: Ready to send to media outlets
- [ ] **Email sequence**: Onboarding emails configured in Resend
- [ ] **Analytics**: Google Analytics or equivalent tracking set up

---

## Rollback Plan

### If Critical Issues Arise

- [ ] **Database rollback script**: SQL to revert last migration
- [ ] **Previous frontend version**: Build artifact saved
- [ ] **Edge function rollback**: Previous versions tagged
- [ ] **Communication plan**: Email template to notify users of issues
- [ ] **Status page**: Public-facing status page updated

---

## Launch Day Checklist

### Morning of Launch

- [ ] **Final backup**: One last data backup
- [ ] **Team available**: Dev team on standby for issues
- [ ] **Support ready**: Support email monitored
- [ ] **Monitoring active**: All alerts and dashboards live

### Launch

- [ ] **Flip DNS**: Point domain to production (if applicable)
- [ ] **Send launch email**: Notify beta users / waitlist
- [ ] **Post on social media**: Announce launch
- [ ] **Monitor logs**: Watch for errors in real-time
- [ ] **Test live site**: Verify everything works post-launch

### Post-Launch (First 24 Hours)

- [ ] **Monitor error rates**: Check for spikes
- [ ] **Check support email**: Respond to user questions
- [ ] **Review analytics**: Track user signups and engagement
- [ ] **Fix critical bugs**: Hotfix any P0 issues immediately
- [ ] **Celebrate**: You've launched! 🎉

---

## Week 1 Post-Launch

- [ ] **User feedback review**: Read all support emails and feedback
- [ ] **Bug triage**: Prioritize non-critical bugs
- [ ] **Performance optimization**: Address any slow queries or pages
- [ ] **Feature usage analysis**: See which features are used most
- [ ] **Conversion tracking**: Monitor free → paid conversion rate
- [ ] **Content marketing**: Publish first blog post or case study

---

**Document Version**: 1.0  
**Last Updated**: October 2025  
**Platform**: FPX MyCNS-App Production Release
