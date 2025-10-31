import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Trash2, Download } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const DataDeletion = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1">
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          <Button 
            variant="ghost" 
            onClick={() => navigate(-1)}
            className="mb-6"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>

          <h1 className="text-4xl font-bold mb-2">Data Deletion & Export</h1>
          <p className="text-muted-foreground mb-8">Manage your data and exercise your privacy rights</p>

          <Alert className="mb-8">
            <AlertDescription>
              Under GDPR and HIPAA regulations, you have the right to access, export, and delete your personal data. 
              This page explains how to exercise these rights.
            </AlertDescription>
          </Alert>

          <div className="space-y-8">
            <section className="space-y-4">
              <h2 className="text-2xl font-semibold">Your Data Rights</h2>
              <p className="text-muted-foreground">
                As a user of FPK-X.com, you have comprehensive rights over your data:
              </p>
              <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                <li><strong>Right to Access:</strong> View all personal data we have about you</li>
                <li><strong>Right to Export:</strong> Download your data in a portable format</li>
                <li><strong>Right to Rectification:</strong> Correct any inaccurate data</li>
                <li><strong>Right to Erasure:</strong> Request complete deletion of your account and data</li>
                <li><strong>Right to Restrict Processing:</strong> Limit how we process your data</li>
                <li><strong>Right to Data Portability:</strong> Transfer your data to another service</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold">Quick Actions</h2>
              <div className="grid md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Download className="h-5 w-5" />
                      Export Your Data
                    </CardTitle>
                    <CardDescription>
                      Download all your data in JSON format
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">
                      Get a complete copy of all your personal information, student records, logs, documents, and settings.
                    </p>
                    <Button 
                      onClick={() => navigate('/settings?tab=credits')}
                      className="w-full"
                    >
                      Go to Settings to Export
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Trash2 className="h-5 w-5" />
                      Delete Your Account
                    </CardTitle>
                    <CardDescription>
                      Permanently remove all your data
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">
                      This action is irreversible. All data will be permanently deleted within 30 days.
                    </p>
                    <Button 
                      variant="destructive"
                      onClick={() => navigate('/settings?tab=profile')}
                      className="w-full"
                    >
                      Go to Settings to Delete
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold">How to Export Your Data</h2>
              <ol className="list-decimal pl-6 text-muted-foreground space-y-3">
                <li>
                  <strong>Navigate to Settings:</strong> Go to Settings → Privacy → Export My Data
                </li>
                <li>
                  <strong>Request Export:</strong> Click the "Export My Data" button
                </li>
                <li>
                  <strong>Processing:</strong> We'll compile all your data into a downloadable file (usually takes a few minutes)
                </li>
                <li>
                  <strong>Download:</strong> You'll receive an email with a download link (valid for 7 days)
                </li>
                <li>
                  <strong>Review:</strong> The export includes all personal data, student records, logs, documents, and account settings in JSON format
                </li>
              </ol>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold">What Data is Included in Exports?</h2>
              <p className="text-muted-foreground">Your export will contain:</p>
              <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                <li><strong>Profile Information:</strong> Name, email, phone number, user preferences</li>
                <li><strong>Family Data:</strong> Family member information and roles</li>
                <li><strong>Student Information:</strong> Names, ages, diagnoses, educational records</li>
                <li><strong>Logs:</strong> All incident logs, parent logs, educator logs, sleep records</li>
                <li><strong>Documents:</strong> Links to uploaded documents (you'll need to download separately)</li>
                <li><strong>Goals:</strong> IEP goals, activities, and progress tracking</li>
                <li><strong>Analytics Data:</strong> Progress reports and insights generated</li>
                <li><strong>Subscription Information:</strong> Current plan and payment history</li>
                <li><strong>Integration Data:</strong> Connected services (Garmin, Google Calendar)</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold">How to Delete Your Account</h2>
              
              <Alert variant="destructive" className="mb-4">
                <AlertDescription>
                  <strong>Warning:</strong> Account deletion is permanent and irreversible. All data will be permanently deleted and cannot be recovered.
                </AlertDescription>
              </Alert>

              <ol className="list-decimal pl-6 text-muted-foreground space-y-3">
                <li>
                  <strong>Export Your Data First:</strong> We recommend exporting your data before deletion
                </li>
                <li>
                  <strong>Navigate to Settings:</strong> Go to Settings → Profile → Delete Account
                </li>
                <li>
                  <strong>Confirm Identity:</strong> You'll need to re-enter your password for security
                </li>
                <li>
                  <strong>Understand Consequences:</strong> Review what will be deleted
                </li>
                <li>
                  <strong>Confirm Deletion:</strong> Type "DELETE" to confirm and click the final confirmation button
                </li>
                <li>
                  <strong>Processing:</strong> Your account will be immediately deactivated
                </li>
                <li>
                  <strong>Grace Period:</strong> Data will be retained for 30 days in case you change your mind
                </li>
                <li>
                  <strong>Permanent Deletion:</strong> After 30 days, all data is permanently deleted from our systems
                </li>
              </ol>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold">What Happens When You Delete Your Account?</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold mb-2">Immediately Deleted:</h3>
                  <ul className="list-disc pl-6 text-muted-foreground space-y-1">
                    <li>Account access is revoked</li>
                    <li>Active subscriptions are cancelled</li>
                    <li>API keys and integrations are disconnected</li>
                    <li>Pending invitations are cancelled</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2">Deleted Within 30 Days:</h3>
                  <ul className="list-disc pl-6 text-muted-foreground space-y-1">
                    <li>All personal information and profile data</li>
                    <li>All student records and logs</li>
                    <li>All uploaded documents</li>
                    <li>All generated analytics and insights</li>
                    <li>Family account (if you're the owner)</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2">Retained for Legal Compliance:</h3>
                  <ul className="list-disc pl-6 text-muted-foreground space-y-1">
                    <li>Transaction records (as required by tax law)</li>
                    <li>Audit logs (as required by HIPAA)</li>
                    <li>Anonymized usage statistics (no personal identifiers)</li>
                  </ul>
                  <p className="text-sm text-muted-foreground mt-2">
                    These records are kept in secure, access-controlled systems and are deleted according to legal retention requirements.
                  </p>
                </div>
              </div>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold">Family Accounts</h2>
              <p className="text-muted-foreground">
                If you're part of a family account:
              </p>
              <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                <li><strong>Family Owner:</strong> Deleting your account will delete the entire family account and all associated data for all members</li>
                <li><strong>Family Member:</strong> Deleting your account only removes your access; the family account and data remain intact</li>
                <li><strong>Recommendation:</strong> Family owners should transfer ownership before deleting their account, or ensure all members have exported necessary data</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold">Partial Data Deletion</h2>
              <p className="text-muted-foreground">
                You can delete specific data without closing your account:
              </p>
              <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                <li><strong>Individual Logs:</strong> Delete specific incident logs, parent logs, or educator logs from their respective pages</li>
                <li><strong>Documents:</strong> Delete uploaded documents from the Documents page</li>
                <li><strong>Students:</strong> Remove individual students from your family account in Settings</li>
                <li><strong>Family Members:</strong> Remove family members in Settings → Family</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold">Request Assistance</h2>
              <p className="text-muted-foreground">
                If you need help with data export or deletion, or have questions about your data rights:
              </p>
              <div className="text-muted-foreground space-y-2">
                <p><strong>Email:</strong> privacy@fpxcns.app</p>
                <p><strong>Support:</strong> support@fpxcns.app</p>
                <p><strong>Response Time:</strong> We respond to all data rights requests within 30 days</p>
              </div>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold">Technical Details</h2>
              <p className="text-muted-foreground">For transparency, here's how we handle deletion:</p>
              <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                <li><strong>Database Records:</strong> Permanently deleted using secure deletion methods</li>
                <li><strong>File Storage:</strong> All uploaded files are permanently removed from storage buckets</li>
                <li><strong>Backups:</strong> Your data is removed from active backups within 90 days</li>
                <li><strong>Third-Party Services:</strong> We notify all business associates to delete your data</li>
                <li><strong>Encryption Keys:</strong> All encryption keys specific to your data are destroyed</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold">Regulatory Compliance</h2>
              <p className="text-muted-foreground">
                Our data deletion practices comply with:
              </p>
              <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                <li><strong>GDPR:</strong> Right to erasure ("right to be forgotten") under Article 17</li>
                <li><strong>HIPAA:</strong> Individual's right to request restriction of uses and disclosures</li>
                <li><strong>CCPA:</strong> Right to deletion under the California Consumer Privacy Act</li>
                <li><strong>COPPA:</strong> Parental right to delete children's information</li>
                <li><strong>FERPA:</strong> Educational records privacy and deletion rights</li>
              </ul>
            </section>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default DataDeletion;