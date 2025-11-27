# Bulk Invitation System Guide

## Overview

The bulk invitation system allows organization administrators, owners, and instructors to invite multiple members at once via CSV file upload.

## Features

- ✅ CSV file upload with drag-and-drop support
- ✅ CSV template download
- ✅ Real-time validation with error highlighting
- ✅ Support for multiple roles (student, instructor, instructor_aide, admin, viewer)
- ✅ Email delivery via Resend integration
- ✅ Progress tracking with success/failure indicators
- ✅ Individual invitation status reporting

## Accessing Bulk Invite

1. Navigate to your organization settings
2. Go to the **"Invite"** tab
3. Click **"Upload CSV File"** in the "Bulk Invite via CSV" section

## CSV Format

### Required Columns

| Column      | Description                                          | Required |
|------------|------------------------------------------------------|----------|
| `email`    | Valid email address of the invitee                   | Yes      |
| `full_name`| Full name of the invitee (minimum 2 characters)      | Yes      |
| `role`     | One of: student, instructor, instructor_aide, admin, viewer | Yes      |

### Example CSV

```csv
email,full_name,role
john.doe@example.com,John Doe,student
jane.smith@example.com,Jane Smith,instructor
admin@school.com,Admin User,admin
aide@school.com,Teacher Aide,instructor_aide
viewer@school.com,Guest Viewer,viewer
```

### Alternative Column Names

The system also recognizes these alternative column headers:
- Email: `Email`, `email`
- Full Name: `full_name`, `name`, `Name`, `Full Name`
- Role: `role`, `Role`

## Valid Roles

| Role              | Description                                    |
|-------------------|------------------------------------------------|
| `student`         | Access assigned courses                        |
| `instructor`      | Create/assign courses, view analytics          |
| `instructor_aide` | Assist instructors (no org settings access)    |
| `admin`           | Full organization management                   |
| `viewer`          | Read-only access to analytics and rosters      |

## Workflow

### 1. Prepare Your CSV

- Download the template by clicking "Download CSV Template"
- Fill in the required fields for each invitee
- Ensure email addresses are valid
- Use only supported role values

### 2. Upload and Validate

- Drag and drop your CSV file or click to browse
- The system will automatically parse and validate the data
- Review any validation errors displayed
- Fix errors in your CSV and re-upload if needed

### 3. Review Invitations

- Preview all invitations before sending
- Each row shows:
  - Full name
  - Email address
  - Assigned role
  - Validation status

### 4. Send Invitations

- Click "Send X Invitations" to process
- Watch the progress indicator
- Review results:
  - ✅ Green checkmark = Successfully sent
  - ❌ Red X = Failed (with error message)

### 5. Post-Processing

- Successfully sent invitations appear in "Pending Email Invitations"
- Invitees receive email with accept link
- Failed invitations show specific error messages
- You can download results or clear and try again

## Common Validation Errors

| Error | Cause | Solution |
|-------|-------|----------|
| Invalid email address | Email format is incorrect | Ensure proper format: user@domain.com |
| Full name required | Name missing or < 2 chars | Add valid full name |
| Invalid role | Role not in allowed list | Use only: student, instructor, instructor_aide, admin, viewer |
| User already a member | Email exists in organization | Remove from CSV or update existing member |
| Pending invitation exists | Active invite for this email | Cancel existing invite first |

## API Endpoint

### Edge Function: `bulk-invite`

**Authentication**: Required (JWT)

**Permissions**: owner, admin, or instructor roles

**Request Body**:
```json
{
  "org_id": "organization-uuid",
  "invites": [
    {
      "email": "user@example.com",
      "full_name": "User Name",
      "role": "student"
    }
  ]
}
```

**Response**:
```json
{
  "success": true,
  "results": [
    {
      "email": "user@example.com",
      "success": true,
      "error": null
    }
  ],
  "summary": {
    "total": 1,
    "successful": 1,
    "failed": 0
  }
}
```

## Email Integration

Invitations are sent via Resend SMTP:
- **From**: FPK University <noreply@fpkuniversity.com>
- **Subject**: "You're invited to join [Organization Name]"
- **Content**: Personalized invite with accept button
- **Expiration**: 7 days from send date

## Best Practices

1. **Start Small**: Test with 2-3 invites before bulk processing
2. **Verify Emails**: Double-check email addresses for typos
3. **Use Template**: Always start with the CSV template
4. **Check Duplicates**: Remove existing members from your CSV
5. **Batch Size**: Keep batches under 100 for optimal performance
6. **Monitor Results**: Review success/failure status after sending

## Troubleshooting

### No invitations sent
- Check your organization role (must be owner, admin, or instructor)
- Verify CSV format matches template
- Ensure all validation errors are resolved

### Email not received
- Check spam/junk folders
- Verify Resend API is configured
- Check invitation expiration date
- Resend individual invite from "Pending Invitations"

### Permission denied
- Only owners, admins, and instructors can send bulk invitations
- Verify your organization membership status

## Security

- All invitations require authentication
- Permission checks prevent unauthorized access
- Invitations expire after 7 days
- Duplicate invitations are prevented
- Email addresses are normalized (lowercase)

## Monitoring

Track invitation activity in:
- **Pending Invitations**: View all active invites
- **Activity Log**: Audit trail of invitation events
- **Edge Function Logs**: Detailed processing logs

---

**Need Help?** Contact support at jashon@fpkuniversity.com
