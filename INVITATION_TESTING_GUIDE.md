# Organization Invitation System - Testing Guide

## Phase 4: Testing & Verification

This guide covers comprehensive testing of the unified organization invitation system after Phase 1-3 implementation.

---

## System Architecture Overview

### Invitation Flow Types
1. **Email Invitation Flow** (Token-based)
   - Admin sends email → User receives link with token → User joins via `/org/join?token=xxx`

2. **Code Invitation Flow** (Shareable code)
   - Admin generates code → User manually enters code → User joins via `/org/join?code=xxx`

3. **Unified Flow** (New in Phase 3)
   - Single input field accepts both formats automatically
   - Backend intelligently detects and processes invitation type

---

## Pre-Testing Checklist

### Database Status
- [ ] Run cleanup function to remove expired invitations
  ```sql
  SELECT * FROM cleanup_expired_invitations();
  ```
- [ ] Verify no orphaned records exist
- [ ] Check invitation counts:
  ```sql
  SELECT 'user_invites' as table_name, COUNT(*) as count FROM user_invites
  UNION ALL
  SELECT 'org_invites', COUNT(*) FROM org_invites;
  ```

### Edge Functions Status
- [ ] `generate-org-invite` - Creates email invitations (verify_jwt: true)
- [ ] `generate-org-invite-code` - Creates shareable codes (verify_jwt: true)
- [ ] `validate-org-invite` - Validates tokens/codes (verify_jwt: false)
- [ ] `accept-org-invite` - Processes invitations (verify_jwt: true)

### Frontend Components
- [ ] `/org/join` page uses unified `joinOrganization()` function
- [ ] Automatic invitation type detection working
- [ ] Loading states and error messages display properly

---

## Test Scenarios

### 1. Email Invitation Flow (Token-Based)

#### Test 1.1: Happy Path - Email Invitation
**Steps:**
1. As org owner/instructor, navigate to organization members page
2. Click "Invite Member" or "Send Email Invitation"
3. Enter valid email address
4. Select role (student/instructor)
5. Send invitation
6. Check recipient's email for invitation link
7. Click link from email (should include `?token=xxx`)
8. Verify automatic redirect to `/org/join?token=xxx`
9. Confirm token is pre-filled and disabled
10. Click "Join Organization"

**Expected Results:**
- ✅ Email sent successfully
- ✅ Token link format: `/org/join?token=[64-char-hex]`
- ✅ Automatic detection shows "Email invitation detected"
- ✅ User added to organization with correct role
- ✅ Redirected to appropriate dashboard
- ✅ `user_invites` record marked as `is_used: true`

**Edge Cases:**
- Token expires after 7 days
- Token can only be used once
- Invalid/tampered tokens show error
- Expired tokens show friendly error

#### Test 1.2: Unauthenticated User with Email Token
**Steps:**
1. Open email invitation link while logged out
2. Verify redirect to `/auth` with return URL
3. Sign in or register
4. Verify automatic redirect back to `/org/join?token=xxx`
5. Accept invitation

**Expected Results:**
- ✅ Token preserved through auth flow
- ✅ Seamless return to invitation after login
- ✅ No need to re-enter invitation

---

### 2. Code Invitation Flow (Shareable)

#### Test 2.1: Happy Path - Invitation Code
**Steps:**
1. As org owner/instructor, generate shareable code
2. Copy code to clipboard
3. Share code with user (via chat, SMS, etc.)
4. As new user, navigate to `/org/join`
5. Paste code into input field
6. Click "Join Organization"

**Expected Results:**
- ✅ Code format: `inv_[32-char-hex]`
- ✅ Code works for multiple users (until max_uses reached)
- ✅ User added to organization
- ✅ `org_invites.uses_count` incremented
- ✅ Code expires after set duration

**Edge Cases:**
- Code at max_uses shows "invitation limit reached"
- Expired code shows friendly error
- Already a member shows appropriate message

#### Test 2.2: Direct URL with Code
**Steps:**
1. Navigate to `/org/join?code=inv_xxxxx`
2. Verify code is pre-filled
3. Accept invitation

**Expected Results:**
- ✅ Code automatically populated from URL
- ✅ Same flow as manual entry

---

### 3. Unified Experience (Phase 3 Implementation)

#### Test 3.1: Mixed Format Handling
**Steps:**
1. Paste email token into invitation field
2. Verify system detects it as token
3. Clear field, paste invitation code
4. Verify system processes as code
5. Try various formats

**Expected Results:**
- ✅ Both formats work in same input field
- ✅ No need to specify invitation type
- ✅ Smart detection with visual feedback
- ✅ Consistent user experience

#### Test 3.2: Error Handling
**Test Invalid Inputs:**
- Empty input → Shows "Invalid invitation" error
- Random text → Shows "Invalid or expired" error
- Used token → Shows "Already used" error
- Expired invitation → Shows "Expired" error
- Already member → Shows "Already a member" error
- Org at capacity → Shows "Member limit reached" error

**Expected Results:**
- ✅ All errors display user-friendly messages
- ✅ No technical jargon in error messages
- ✅ Helpful suggestions where applicable

---

### 4. Multi-User Scenarios

#### Test 4.1: Seat Limits
**Steps:**
1. Set organization seat_cap to 3
2. Add 3 members
3. Try to accept 4th invitation

**Expected Results:**
- ✅ 4th user sees "No seats available" error
- ✅ Organization owners notified of capacity
- ✅ Invitation remains valid for future use

#### Test 4.2: Role-Based Limits
**Steps:**
1. Set instructor_limit to 2
2. Add 2 instructors
3. Try to accept instructor invitation as 3rd user

**Expected Results:**
- ✅ Shows "Instructor limit reached"
- ✅ Student invitations still work

---

### 5. Security Testing

#### Test 5.1: Authentication Requirements
**Steps:**
1. Try to access `/org/join` while logged out
2. Try to call edge functions without auth token
3. Verify JWT validation on protected endpoints

**Expected Results:**
- ✅ Unauthenticated users redirected to login
- ✅ Edge functions return 401 for missing auth
- ✅ No data leakage in error messages

#### Test 5.2: Authorization Checks
**Steps:**
1. Try to generate invitation for org you don't own
2. Try to accept invitation twice with same token
3. Try to modify token in URL

**Expected Results:**
- ✅ Proper "Unauthorized" errors
- ✅ Token tampering detected
- ✅ Duplicate use prevented

#### Test 5.3: SQL Injection Prevention
**Test Inputs:**
- `'; DROP TABLE users; --`
- `1' OR '1'='1`
- `<script>alert('xss')</script>`

**Expected Results:**
- ✅ All malicious inputs safely handled
- ✅ No database errors
- ✅ No XSS vulnerabilities

---

### 6. Database Integrity

#### Test 6.1: Transaction Consistency
**Steps:**
1. Accept invitation
2. Verify atomic operations:
   - Member added to `org_members`
   - Invitation marked used/incremented
   - User quota initialized if needed
   - Audit log created

**Expected Results:**
- ✅ All operations complete or all rollback
- ✅ No partial states
- ✅ Consistent data across tables

#### Test 6.2: Cleanup Function
**Steps:**
1. Create test invitations with past expiry
2. Run `cleanup_expired_invitations()`
3. Verify cleanup results

**Expected Results:**
- ✅ Expired invitations removed
- ✅ Used invitations removed
- ✅ Orphaned invitations removed
- ✅ Active invitations preserved

---

### 7. User Experience Testing

#### Test 7.1: Loading States
**Verify:**
- [ ] Spinner shows during invitation processing
- [ ] Button disabled while loading
- [ ] "Joining..." text displayed
- [ ] No duplicate submissions possible

#### Test 7.2: Success Feedback
**Verify:**
- [ ] Success toast notification shown
- [ ] Organization name in success message
- [ ] Automatic redirect to dashboard
- [ ] New organization visible in org selector

#### Test 7.3: Error Recovery
**Steps:**
1. Trigger network error (disconnect during join)
2. Retry with valid invitation
3. Verify graceful recovery

**Expected Results:**
- ✅ Clear error message
- ✅ Invitation still valid for retry
- ✅ No data corruption

---

### 8. Performance Testing

#### Test 8.1: Response Times
**Measure:**
- Generate invitation: < 2 seconds
- Validate invitation: < 1 second
- Accept invitation: < 3 seconds
- Cleanup function: < 5 seconds (for 1000 records)

#### Test 8.2: Concurrent Joins
**Steps:**
1. Create shareable code
2. Have 5 users accept simultaneously

**Expected Results:**
- ✅ All users processed correctly
- ✅ uses_count accurately incremented
- ✅ No race conditions

---

## Verification Checklist

### Phase 1: Database Structure ✅
- [x] Tables optimized and indexed
- [x] RLS policies correct
- [x] Foreign key constraints proper

### Phase 2: Cleanup & Maintenance ✅
- [x] Cleanup function created
- [x] Expired records removed
- [x] No orphaned data

### Phase 3: Unified UX ✅
- [x] Single join function implemented
- [x] Smart format detection working
- [x] Improved error messages
- [x] Loading states proper

### Phase 4: Testing (Current)
- [ ] All 8 test scenarios completed
- [ ] Edge cases verified
- [ ] Security validated
- [ ] Performance acceptable
- [ ] Documentation updated

---

## Common Issues & Solutions

### Issue: "Invalid or expired invitation"
**Causes:**
- Token actually expired (7 days)
- Token already used
- Token malformed/tampered
- Database records cleaned up

**Solution:**
- Generate fresh invitation
- Check expiration dates
- Verify token format

### Issue: "No seats available"
**Causes:**
- Organization at seat_cap limit
- Role-specific limit reached

**Solution:**
- Increase seat_cap in org settings
- Remove inactive members
- Upgrade organization plan

### Issue: Invitation not received via email
**Causes:**
- Email in spam folder
- Invalid email address
- Resend service issues
- SMTP configuration

**Solution:**
- Check spam/junk folders
- Verify email address
- Use shareable code as fallback
- Check Resend dashboard for delivery status

### Issue: "Already a member"
**Causes:**
- User already joined this organization
- Duplicate invitation attempt

**Solution:**
- Navigate directly to organization dashboard
- Check active memberships

---

## Database Queries for Testing

### Check Invitation Status
```sql
-- View all active user invites
SELECT ui.*, o.name as org_name 
FROM user_invites ui
JOIN organizations o ON o.id = ui.org_id
WHERE ui.is_used = false 
AND ui.expires_at > NOW();

-- View all active org invites
SELECT oi.*, o.name as org_name
FROM org_invites oi
JOIN organizations o ON o.id = oi.org_id
WHERE oi.uses_count < oi.max_uses
AND oi.expires_at > NOW();
```

### Check Member Counts
```sql
-- Verify seat usage
SELECT 
  o.name,
  o.seat_cap,
  COUNT(CASE WHEN om.role = 'student' THEN 1 END) as students,
  o.instructor_limit,
  COUNT(CASE WHEN om.role = 'instructor' THEN 1 END) as instructors
FROM organizations o
LEFT JOIN org_members om ON om.org_id = o.id AND om.status = 'active'
GROUP BY o.id, o.name, o.seat_cap, o.instructor_limit;
```

### Test Cleanup Function
```sql
-- Run cleanup and view results
SELECT * FROM cleanup_expired_invitations();

-- Verify results
SELECT 
  'user_invites' as table_name,
  COUNT(*) FILTER (WHERE is_used = true) as used,
  COUNT(*) FILTER (WHERE expires_at < NOW()) as expired,
  COUNT(*) FILTER (WHERE is_used = false AND expires_at > NOW()) as active
FROM user_invites
UNION ALL
SELECT 
  'org_invites',
  COUNT(*) FILTER (WHERE uses_count >= max_uses) as maxed,
  COUNT(*) FILTER (WHERE expires_at < NOW()) as expired,
  COUNT(*) FILTER (WHERE uses_count < max_uses AND expires_at > NOW()) as active
FROM org_invites;
```

---

## Sign-Off Criteria

Before considering Phase 4 complete:

✅ **Functional Requirements**
- [ ] Both invitation types work end-to-end
- [ ] Unified UX handles all formats
- [ ] Error handling comprehensive
- [ ] Security measures validated

✅ **Performance Requirements**
- [ ] Response times within limits
- [ ] Concurrent operations handled
- [ ] No memory leaks observed

✅ **Security Requirements**
- [ ] Authentication enforced
- [ ] Authorization validated
- [ ] Input sanitization working
- [ ] No data leaks

✅ **User Experience**
- [ ] Intuitive workflow
- [ ] Clear error messages
- [ ] Proper loading states
- [ ] Successful feedback

✅ **Documentation**
- [ ] Testing guide complete
- [ ] Edge functions documented
- [ ] Database schema documented
- [ ] Troubleshooting guide ready

---

## Next Steps After Testing

1. **Monitor Production**
   - Track invitation success rates
   - Monitor error frequencies
   - Collect user feedback

2. **Optimize**
   - Add analytics for invitation flow
   - Implement rate limiting if needed
   - Cache frequently accessed data

3. **Enhance**
   - Add invitation templates
   - Implement bulk invitations
   - Add invitation preview
   - Support custom expiration times

---

## Support Resources

- Edge Function Logs: `https://supabase.com/dashboard/project/zgcegkmqfgznbpdplscz/functions/[function-name]/logs`
- Database Logs: Supabase Dashboard → Logs → Postgres
- RLS Debugger: Enable RLS logging in Supabase settings
- Documentation: This guide + inline code comments

---

**Last Updated:** Phase 4 Implementation
**Status:** Ready for Testing
**Version:** 1.0.0
