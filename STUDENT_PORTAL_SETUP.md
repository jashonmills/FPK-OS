# Student Portal PIN-Based Authentication System

## Overview
This system allows organizations to create student accounts and provide PIN-based authentication for a passwordless, secure student portal experience.

## Architecture

### Database Schema
- **org_students table**: Stores student profiles with activation tokens and PIN hashes
- **activation_token**: One-time use token for account activation (48-hour expiry)
- **pin_hash**: Bcrypt-hashed 6-digit PIN for authentication
- **activation_status**: Tracks activation state (pending, activated, expired)

### Edge Functions

#### 1. generate-student-activation
**Purpose**: Generate one-time activation links for students
**Endpoint**: `supabase.functions.invoke('generate-student-activation')`
**Auth**: Required (instructor/admin)
**Input**:
```typescript
{
  student_id: string,
  org_slug: string
}
```
**Output**:
```typescript
{
  success: true,
  token: string,
  activation_url: string,
  expires_at: string,
  student_name: string
}
```

#### 2. activate-student-account
**Purpose**: Process student activation and set PIN
**Endpoint**: `supabase.functions.invoke('activate-student-account')`
**Auth**: Not required (public)
**Input**:
```typescript
{
  token: string,
  full_name: string,
  pin: string  // 6 digits
}
```
**Output**:
```typescript
{
  success: true,
  session: AuthSession,
  student_id: string,
  org_id: string,
  redirect_url: string
}
```

#### 3. student-pin-login
**Purpose**: Authenticate students with name and PIN
**Endpoint**: `supabase.functions.invoke('student-pin-login')`
**Auth**: Not required (public)
**Input**:
```typescript
{
  org_id: string,
  full_name: string,
  pin: string  // 6 digits
}
```
**Output**:
```typescript
{
  success: true,
  session: AuthSession,
  student_id: string,
  org_id: string,
  redirect_url: string
}
```

## User Flow

### For Administrators/Instructors

1. **Add Student Profile**
   - Navigate to Organization → Students
   - Click "Add Student"
   - Enter student details (name, grade, etc.)
   - Save profile

2. **Generate Activation Link**
   - Click the actions menu (⋮) next to the student
   - Select "Generate Activation Link"
   - Copy the generated link
   - Share with student (via email, print, etc.)

### For Students

#### First-Time Activation
1. **Receive Activation Link**
   - Get link from instructor: `https://yoursite.com/{org-slug}/activate?token=XXXXX`

2. **Activate Account**
   - Click the activation link
   - Verify name matches the account
   - Create a 6-digit PIN
   - Confirm PIN
   - Submit to activate

3. **Automatic Login**
   - Redirected to student dashboard
   - Account is now active

#### Subsequent Logins
1. **Navigate to Portal**
   - Go to: `https://yoursite.com/{org-slug}`
   - Click "Student Login"

2. **Enter Credentials**
   - Full Name: (exact match required)
   - PIN: 6-digit PIN created during activation
   - Submit

3. **Access Dashboard**
   - Redirected to personalized student dashboard
   - View courses, progress, and activities

## Routes

### Public Routes
- `/{org-slug}` - Organization portal landing page
- `/{org-slug}/login` - Student PIN login
- `/{org-slug}/activate?token=XXXXX` - Account activation

### Protected Routes
- `/students/dashboard?org={org-id}` - Student dashboard (requires auth)

## Security Features

### PIN Security
- 6-digit numeric PIN requirement
- Bcrypt hashing with secure salts
- Rate limiting on login attempts
- No password recovery (contact admin to reset)

### Token Security
- One-time use activation tokens
- 48-hour expiration
- Cryptographically secure random generation
- Automatic cleanup of expired tokens

### Session Management
- Supabase Auth session handling
- Auto-refresh tokens
- Secure session storage
- Logout functionality

## Admin Features

### Student Management
- Add/edit student profiles
- Track activation status:
  - **Profile Only**: No activation link generated
  - **Activation Pending**: Link generated, not yet activated
  - **Active Account**: Student has activated and set PIN
  - **Link Expired**: Activation link expired (generate new one)

### Activation Status Badges
- Green "Active Account": Student fully activated
- Yellow "Activation Pending": Waiting for student activation
- Orange "Link Expired": Need to generate new link
- Gray "Profile Only": No activation initiated

### Actions Available
- **View Profile**: See student details
- **Edit Profile**: Update student information
- **Generate Activation Link**: Create/regenerate activation link
- **Remove Student**: Delete student profile

## Troubleshooting

### Student Can't Activate
- **Check token expiration**: Links expire after 48 hours
- **Verify exact name match**: Full name must match exactly
- **Generate new link**: Create fresh activation link if expired

### Student Can't Login
- **Verify name spelling**: Must match profile exactly
- **Check PIN entry**: Ensure 6-digit PIN is correct
- **Check activation status**: Student must have completed activation
- **Try password reset**: Admin can regenerate activation link

### Link Issues
- **404 on activation link**: Check org slug is correct
- **Invalid token error**: Token may be expired or already used
- **Organization not found**: Verify org slug in URL

## Best Practices

### For Admins
1. **Consistent Naming**: Use consistent name format for all students
2. **Timely Sharing**: Share activation links promptly (48-hour window)
3. **Track Status**: Monitor activation status in dashboard
4. **Regenerate When Needed**: Don't hesitate to create new links

### For Students
1. **Remember Your Name**: Use exact name as provided by admin
2. **Secure PIN**: Choose memorable but secure 6-digit PIN
3. **Private Credentials**: Don't share PIN with others
4. **Contact Admin**: If locked out, contact admin for new link

## API Integration

### Generate Link Programmatically
```typescript
const { data, error } = await supabase.functions.invoke(
  'generate-student-activation',
  {
    body: {
      student_id: 'uuid-here',
      org_slug: 'your-org'
    }
  }
);

console.log(data.activation_url);
```

### Check Activation Status
```typescript
const { data } = await supabase
  .from('org_students')
  .select('activation_status, activation_token, token_expires_at')
  .eq('id', studentId)
  .single();
```

## Database Functions

### validate_student_pin
Validates student credentials and returns student info if valid.

### generate_activation_token
Generates cryptographically secure unique activation token.

### activate_student_account
Processes activation: validates token, updates student record, links user.

## RLS Policies

### org_students Table
- **Students can view own record**: `linked_user_id = auth.uid()`
- **Activation tokens can be validated publicly**: For activation flow
- **System can update during activation**: Allows edge functions to process

## Monitoring

### Activity Logging
All authentication events are logged to `activity_log`:
- `student_activation_link_generated`
- `student_activated`
- `student_pin_login`
- `student_pin_login_failed`

### Metrics to Track
- Activation rate (activated / total students)
- Average activation time
- Failed login attempts
- Token expiration rate

## Future Enhancements

### Potential Features
- [ ] SMS-based activation links
- [ ] PIN reset via verified email
- [ ] Multi-factor authentication option
- [ ] Custom PIN requirements per org
- [ ] Batch activation link generation
- [ ] QR code activation links
- [ ] Session timeout configuration
- [ ] Biometric authentication support

## Support

### Common Questions

**Q: Can students use email/password?**
A: No, this system uses PIN-only authentication for simplicity and security.

**Q: What if a student forgets their PIN?**
A: Admin must generate a new activation link for the student to set a new PIN.

**Q: Can one link be used multiple times?**
A: No, activation links are one-time use and expire after 48 hours.

**Q: How do I change a student's name?**
A: Edit the student profile in the admin dashboard. Student will need to use the new name to login.

**Q: Is the PIN stored in plain text?**
A: No, PINs are bcrypt-hashed before storage, same security as passwords.

---

**Version**: 1.0.0
**Last Updated**: 2025-10-07
**System**: FPK University Student Portal
