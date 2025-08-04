import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function PrivacyPolicy() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Privacy Policy</h1>
          <p className="text-muted-foreground">Last updated: {new Date().toLocaleDateString()}</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>1. Information We Collect</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">Personal Information</h4>
              <ul className="list-disc pl-6 space-y-1">
                <li>Email address and account credentials</li>
                <li>Full name and display name</li>
                <li>Profile information and bio</li>
                <li>Learning preferences and settings</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Usage Data</h4>
              <ul className="list-disc pl-6 space-y-1">
                <li>Learning progress and course completions</li>
                <li>Study session duration and frequency</li>
                <li>Quiz results and performance metrics</li>
                <li>Feature usage and interaction patterns</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Technical Data</h4>
              <ul className="list-disc pl-6 space-y-1">
                <li>IP address and device information</li>
                <li>Browser type and version</li>
                <li>Operating system and screen resolution</li>
                <li>Cookies and similar tracking technologies</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>2. How We Use Your Information</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc pl-6 space-y-2">
              <li>Provide and maintain our learning platform services</li>
              <li>Personalize your learning experience and recommendations</li>
              <li>Track your progress and generate performance analytics</li>
              <li>Send important service notifications and updates</li>
              <li>Improve our platform through usage analysis</li>
              <li>Provide customer support and respond to inquiries</li>
              <li>Ensure platform security and prevent fraud</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>3. Your Rights Under GDPR</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">As a data subject, you have the following rights:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Right of Access:</strong> Request a copy of your personal data</li>
              <li><strong>Right to Rectification:</strong> Correct inaccurate personal data</li>
              <li><strong>Right to Erasure:</strong> Request deletion of your personal data</li>
              <li><strong>Right to Data Portability:</strong> Receive your data in a portable format</li>
              <li><strong>Right to Object:</strong> Object to processing of your personal data</li>
              <li><strong>Right to Restrict Processing:</strong> Limit how we use your data</li>
              <li><strong>Right to Withdraw Consent:</strong> Withdraw consent at any time</li>
            </ul>
            <p className="mt-4 text-sm text-muted-foreground">
              To exercise these rights, please contact us at privacy@company.com or use the account settings in your dashboard.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>4. Data Retention</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc pl-6 space-y-2">
              <li>Account information: Retained while your account is active</li>
              <li>Learning progress: Retained for 3 years after account closure</li>
              <li>Usage analytics: Aggregated data retained indefinitely</li>
              <li>Support communications: Retained for 2 years</li>
              <li>Marketing communications: Until you unsubscribe</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>5. Data Security</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">We implement appropriate technical and organizational measures to protect your personal data:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Encryption in transit and at rest</li>
              <li>Regular security assessments and audits</li>
              <li>Access controls and authentication</li>
              <li>Employee training on data protection</li>
              <li>Incident response procedures</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>6. Cookies and Tracking</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">We use cookies and similar technologies for:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Essential Cookies:</strong> Required for platform functionality</li>
              <li><strong>Analytics Cookies:</strong> Help us understand usage patterns</li>
              <li><strong>Preference Cookies:</strong> Remember your settings and preferences</li>
            </ul>
            <p className="mt-4 text-sm text-muted-foreground">
              You can manage your cookie preferences through your browser settings or our cookie consent banner.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>7. Contact Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p><strong>Data Protection Officer:</strong> privacy@company.com</p>
              <p><strong>General Inquiries:</strong> support@company.com</p>
              <p><strong>Supervisory Authority:</strong> You have the right to lodge a complaint with your local data protection authority.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}