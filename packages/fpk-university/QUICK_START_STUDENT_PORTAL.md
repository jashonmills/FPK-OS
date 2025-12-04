# Quick Start: Student Portal Setup

## Step-by-Step Guide for Admins/Instructors

### 1️⃣ Add Student Profile

1. Navigate to your **Organization → Students** page
2. Click **"Add Student"** button
3. Fill in student information:
   - Full Name (required) - *student will use this to login*
   - Grade Level
   - Student ID
   - Date of Birth
   - Parent Email (optional)
4. Click **"Save"**

### 2️⃣ Generate Activation Link

1. In the students table, find your student
2. Click the **⋮ (actions menu)** next to their name
3. Select **"Generate Activation Link"**
4. The link is automatically created and displayed:
   ```
   https://yoursite.com/your-org/activate?token=XXXXXXXXXXXXX
   ```
5. Click **"Copy"** to copy the link
6. Share with student via:
   - Email
   - Printed paper
   - Parent communication
   - SMS/text message

⏰ **Important**: Links expire in 48 hours!

### 3️⃣ Student Activates Account

**What the student does:**

1. Click the activation link
2. Verify their name is correct
3. Create a 6-digit PIN (like 123456)
4. Confirm the PIN
5. Click "Activate Account"
6. ✅ Automatically logged in to their dashboard!

### 4️⃣ Student Future Logins

**How students login after activation:**

1. Go to: `https://yoursite.com/your-org/login`
   - Or click "Student Login" from your org landing page
2. Enter their **Full Name** (exact match)
3. Enter their **6-digit PIN**
4. Click "Login"
5. Access their dashboard!

---

## Status Indicators

In your students table, you'll see these statuses:

| Badge | Meaning | Action Needed |
|-------|---------|---------------|
| 🟢 **Active Account** | Student activated, can login | None |
| 🟡 **Activation Pending** | Link sent, waiting for activation | Remind student |
| 🟠 **Link Expired** | Activation window passed | Generate new link |
| ⚪ **Profile Only** | No link generated yet | Generate link |

---

## Quick Tips

### ✅ Do's
- Use consistent name formatting (First Last)
- Generate links when ready for student to activate
- Keep track of who needs reminders
- Regenerate expired links as needed

### ❌ Don'ts
- Don't wait too long to share links (48hr expiry)
- Don't include middle initials unless consistent
- Don't share one student's link with another
- Don't worry about password resets - just generate new links

---

## Common Issues & Solutions

### "Student can't activate"
- **Problem**: Link expired or already used
- **Solution**: Generate a new activation link

### "Student can't login"
- **Problem**: Name doesn't match exactly
- **Solution**: Check spelling, regenerate link if needed

### "Wrong organization"
- **Problem**: Student using wrong org URL
- **Solution**: Verify the org slug in the URL matches

---

## Student Portal Features

Students get access to:
- 📚 Assigned courses and learning materials
- 📊 Progress tracking and achievements
- 🎯 Learning goals and objectives
- 🏆 Gamification and badges
- 💬 AI learning coach (if enabled)

---

## Testing the System

### Test Flow (Recommended)
1. Create a test student profile (use your name + "Test")
2. Generate activation link
3. Open in incognito/private window
4. Complete activation process
5. Test login/logout
6. Verify dashboard access

### Security Check
- ✓ Activation links expire properly
- ✓ PINs are required for login
- ✓ Only correct name+PIN combination works
- ✓ Students only see their own data

---

## Need Help?

### For Admin Issues
- Check student activation status in dashboard
- Review activity log for login attempts
- Verify organization settings are correct

### For Student Issues
- Generate fresh activation link
- Verify exact name spelling
- Confirm PIN was set during activation
- Test in different browser if needed

---

**Quick Reference URLs:**
- **Admin Dashboard**: `/org/{your-org-id}/students`
- **Org Landing**: `/{your-org-slug}`
- **Student Login**: `/{your-org-slug}/login`
- **Activation**: `/{your-org-slug}/activate?token=XXXXX`
- **Student Dashboard**: `/students/dashboard?org={org-id}`

---

*For detailed documentation, see STUDENT_PORTAL_SETUP.md*
