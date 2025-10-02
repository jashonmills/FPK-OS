import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Home } from "lucide-react";
import { useSafeNavigation } from "@/hooks/useSafeNavigation";

export default function PrivacyPolicy() {
  const { navigateBack } = useSafeNavigation();
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-3">
          <Button
            variant="ghost"
            onClick={navigateBack}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Privacy Policy</h1>
          <p className="text-muted-foreground">Effective Date: October 2, 2025</p>
          <p className="text-sm text-muted-foreground mt-2">
            See also: <a href="/terms-of-service" className="text-primary hover:underline">Terms of Use</a> | <a href="/gdpr-hipaa-compliance" className="text-primary hover:underline">GDPR/HIPAA Compliance</a>
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>1. Our Commitment to Privacy</CardTitle>
          </CardHeader>
          <CardContent>
            <p>
              FPK University ("the University," "we," "us," or "our") is committed to protecting the privacy and confidentiality of the personal data of our students, faculty, staff, and other members of our community. This Privacy Policy outlines the types of personal data we collect, how it is used and protected, and the rights individuals have concerning their data when using our digital services and interacting with the University.
            </p>
            <p className="mt-4">
              For detailed information on our GDPR and HIPAA compliance measures, please see our <a href="/gdpr-hipaa-compliance" className="text-primary hover:underline">GDPR and HIPAA Compliance Statement</a>.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>2. Data We Collect</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>We collect personal data necessary for our educational, research, and administrative functions. This may include:</p>
            <div>
              <h4 className="font-semibold mb-2">Identity and Contact Data</h4>
              <ul className="list-disc pl-6 space-y-1">
                <li>Name, date of birth, student/employee ID number</li>
                <li>Postal address, email address, phone number</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Academic and Educational Data</h4>
              <ul className="list-disc pl-6 space-y-1">
                <li>Course enrollment and attendance records</li>
                <li>Grades, academic progress, and performance metrics</li>
                <li>Disciplinary records and academic communications</li>
                <li>Learning preferences and settings</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Financial Data</h4>
              <ul className="list-disc pl-6 space-y-1">
                <li>Tuition and fee payments</li>
                <li>Financial aid information</li>
                <li>Bank account details for payroll or refunds</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Technical Data</h4>
              <ul className="list-disc pl-6 space-y-1">
                <li>IP address and device information</li>
                <li>Browser type and version</li>
                <li>Operating system and screen resolution</li>
                <li>Cookies and similar tracking technologies</li>
                <li>Study session duration and feature usage patterns</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Health Data (Sensitive Personal Data)</h4>
              <ul className="list-disc pl-6 space-y-1">
                <li>Information provided to University Health Services</li>
                <li>Disability accommodation requests</li>
                <li>This data is subject to stricter controls under HIPAA (see Section 9)</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Employment Data (for faculty/staff)</h4>
              <ul className="list-disc pl-6 space-y-1">
                <li>Professional history and qualifications</li>
                <li>Payroll information</li>
                <li>Performance reviews</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>3. How We Use Your Data</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">Your personal data is used for legitimate purposes related to the University's mission, including:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Academic Administration:</strong> To manage admissions, registration, course delivery, grading, and academic advising</li>
              <li><strong>University Operations:</strong> To provide housing, manage financial services, ensure campus security, and communicate official University information</li>
              <li><strong>Support Services:</strong> To provide health and wellness services, career counseling, and disability accommodations</li>
              <li><strong>Personalization:</strong> To personalize your learning experience and provide tailored recommendations</li>
              <li><strong>Analytics:</strong> To track your progress and generate performance analytics</li>
              <li><strong>Platform Improvement:</strong> To improve our platform through usage analysis</li>
              <li><strong>Compliance and Legal Obligations:</strong> To comply with applicable laws and regulations and to respond to legal requests</li>
              <li><strong>Research:</strong> To conduct institutional research for academic improvement (data is typically anonymized or aggregated)</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>4. Legal Basis for Processing (GDPR)</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">We process personal data based on one or more of the following legal grounds:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Contractual Necessity:</strong> To fulfill our contractual obligations to you as a student or employee</li>
              <li><strong>Legal Obligation:</strong> To comply with our legal and regulatory duties</li>
              <li><strong>Legitimate Interests:</strong> To pursue the legitimate interests of the University, provided your rights and freedoms do not override these interests</li>
              <li><strong>Consent:</strong> Where required, we will obtain your explicit consent to process your data (e.g., for certain marketing communications or research projects). You may withdraw your consent at any time</li>
            </ul>
            <p className="mt-4 text-sm text-muted-foreground">
              For comprehensive details on GDPR compliance, see our <a href="/gdpr-hipaa-compliance" className="text-primary hover:underline">GDPR and HIPAA Compliance Statement</a>.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>5. Data Sharing and Disclosure</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">We do not sell your personal data. We may share your data with:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Service Providers (Sub-processors):</strong> Third-party vendors who provide services on our behalf, such as cloud hosting, payment processing, or learning management systems. These providers are contractually obligated to protect your data and use it only for the purposes for which it was disclosed</li>
              <li><strong>Legal and Regulatory Authorities:</strong> When required by law, subpoena, or other legal process</li>
              <li><strong>Accrediting Bodies:</strong> As necessary for accreditation purposes</li>
              <li><strong>Emergency Situations:</strong> To protect the health, safety, or security of individuals or the University community</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>6. Data Security</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">We have implemented robust administrative, technical, and physical security measures to protect your personal data from unauthorized access, use, alteration, or destruction. These measures include:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Encryption in transit (TLS/SSL) and at rest</li>
              <li>Regular security assessments and vulnerability audits</li>
              <li>Multi-factor authentication and access controls</li>
              <li>Employee training on data protection and privacy</li>
              <li>Incident response and breach notification procedures</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>7. Data Retention</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">We retain personal data only for as long as necessary to fulfill the purposes for which it was collected, including for the purposes of satisfying any legal, accounting, or reporting requirements, in accordance with the University's official Data Retention Schedule:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Account information:</strong> Retained while your account is active</li>
              <li><strong>Learning progress and academic records:</strong> Retained for 3 years after account closure or graduation</li>
              <li><strong>Usage analytics:</strong> Aggregated data retained indefinitely for research purposes</li>
              <li><strong>Support communications:</strong> Retained for 2 years</li>
              <li><strong>Marketing communications:</strong> Until you unsubscribe or withdraw consent</li>
              <li><strong>Health records:</strong> Retained according to HIPAA requirements (typically 6 years)</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>8. Your Rights Under GDPR</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">As a data subject, you have the following rights under GDPR:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Right of Access:</strong> Request a copy of your personal data</li>
              <li><strong>Right to Rectification:</strong> Correct inaccurate personal data</li>
              <li><strong>Right to Erasure ("Right to be Forgotten"):</strong> Request deletion of your personal data in certain circumstances</li>
              <li><strong>Right to Data Portability:</strong> Receive your data in a machine-readable format</li>
              <li><strong>Right to Object:</strong> Object to the processing of your personal data</li>
              <li><strong>Right to Restrict Processing:</strong> Limit how we use your data</li>
              <li><strong>Right to Withdraw Consent:</strong> Withdraw consent at any time (where processing is based on consent)</li>
              <li><strong>Right to Lodge a Complaint:</strong> File a complaint with your local data protection supervisory authority</li>
            </ul>
            <p className="mt-4 text-sm text-muted-foreground">
              To exercise these rights, please contact our Data Protection Officer at privacy@fpkuniversity.com or use the account settings in your dashboard.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>9. Cookies and Tracking</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">We use cookies and similar technologies for:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Essential Cookies:</strong> Required for platform functionality (authentication, session management)</li>
              <li><strong>Analytics Cookies:</strong> Help us understand usage patterns and improve our services</li>
              <li><strong>Preference Cookies:</strong> Remember your settings and preferences (language, theme)</li>
            </ul>
            <p className="mt-4 text-sm text-muted-foreground">
              You can manage your cookie preferences through your browser settings or our cookie consent banner. Note that disabling essential cookies may affect platform functionality.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>10. Contact Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p>For any questions about this Privacy Policy or to exercise your data protection rights, please contact:</p>
              <p><strong>Data Protection Officer:</strong> privacy@fpkuniversity.com</p>
              <p><strong>General Support:</strong> customerservice@fpkuniversity.com</p>
              <p><strong>Legal Affairs:</strong> legal@fpkuniversity.com</p>
              <p className="mt-4 text-sm text-muted-foreground">
                <strong>Supervisory Authority:</strong> You have the right to lodge a complaint with your local data protection authority.
              </p>
              <p className="mt-4 text-sm text-muted-foreground">
                For detailed compliance information, see our <a href="/gdpr-hipaa-compliance" className="text-primary hover:underline">GDPR and HIPAA Compliance Statement</a>.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
      </div>
    </div>
  );
}