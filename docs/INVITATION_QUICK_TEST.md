# Quick Testing Guide - Organization Invitations

**5-Minute Validation** - Run these essential tests to verify the invitation system works.

---

## 🚀 Quick Start Tests

### Test 1: Email Invitation (2 min)
```
1. Login as org owner
2. Go to Members → Invite Member
3. Enter test email
4. Check email for invitation link
5. Click link (opens /org/join?token=xxx)
6. Click "Join Organization"
✅ Success: User added, redirected to dashboard
```

### Test 2: Code Invitation (2 min)
```
1. Login as org owner
2. Go to Members → Generate Code
3. Copy code (inv_xxxxx format)
4. Open new private/incognito window
5. Login as different user
6. Navigate to /org/join
7. Paste code
8. Click "Join Organization"
✅ Success: User added, redirected to dashboard
```

### Test 3: Error Handling (1 min)
```
1. Navigate to /org/join
2. Enter invalid code: "INVALID123"
3. Submit
✅ Success: Shows "Invalid or expired" error

4. Clear and try empty submission
✅ Success: Shows validation error
```

---

## 🔍 Critical Checks

### Database Verification
```sql
-- Run this after Test 1 & 2
SELECT 
  'Email Invites' as type,
  COUNT(*) FILTER (WHERE is_used = true) as used,
  COUNT(*) FILTER (WHERE is_used = false) as active
FROM user_invites
UNION ALL
SELECT 
  'Code Invites',
  COUNT(*) FILTER (WHERE uses_count > 0) as used,
  COUNT(*) FILTER (WHERE uses_count = 0) as active
FROM org_invites;
```

**Expected:** 
- Email invite marked `is_used: true`
- Code invite `uses_count` incremented

### Edge Function Health
```bash
# Check recent logs for errors
1. Open Supabase Dashboard
2. Functions → accept-org-invite → Logs
3. Verify successful invocation logs
4. No error logs present
```

---

## ⚠️ Red Flags

**Stop and investigate if you see:**

❌ "User authenticated but token invalid" → RLS policy issue
❌ "Organization not found" → Foreign key constraint issue  
❌ "Seat cap undefined" → Database null handling issue
❌ Invitation accepted but user not in org → Transaction rollback issue

---

## ✅ Success Criteria

All tests pass when:

- [x] Email invitations deliver and work
- [x] Code invitations work for multiple users
- [x] Invalid inputs show friendly errors
- [x] Users added to correct organization
- [x] Proper redirects after join
- [x] Database records updated correctly
- [x] No console errors

---

## 🐛 Found an Issue?

1. Note the exact error message
2. Check browser console (F12)
3. Check edge function logs
4. Check database logs
5. Reference full `INVITATION_TESTING_GUIDE.md` for detailed troubleshooting

---

**Time to Complete:** ~5 minutes
**Frequency:** Run after any invitation system changes
**Last Validated:** Phase 4 Implementation
