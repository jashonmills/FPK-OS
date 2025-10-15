import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const PrivacyPolicy = () => {
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

          <h1 className="text-4xl font-bold mb-2">Privacy Policy</h1>
          <p className="text-muted-foreground mb-8">Last updated: {new Date().toLocaleDateString()}</p>

          <div className="prose prose-slate dark:prose-invert max-w-none space-y-6">
            <section className="space-y-4">
              <h2 className="text-2xl font-semibold">1. Introduction</h2>
              <p className="text-muted-foreground">
                FPX CNS-App ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our mobile application and services.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold">2. Information We Collect</h2>
              <h3 className="text-xl font-semibold">2.1 Personal Information</h3>
              <p className="text-muted-foreground">We collect information that you provide directly to us, including:</p>
              <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                <li>Name and contact information (email address, phone number)</li>
                <li>Account credentials</li>
                <li>Student information (names, dates of birth, educational records)</li>
                <li>Health information (behavioral logs, sleep records, medical documents)</li>
                <li>Family member information</li>
                <li>Communication preferences</li>
              </ul>

              <h3 className="text-xl font-semibold mt-4">2.2 Health Information (PHI)</h3>
              <p className="text-muted-foreground">
                We collect Protected Health Information (PHI) as defined under HIPAA, including:
              </p>
              <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                <li>Incident logs and behavioral data</li>
                <li>Sleep and activity records</li>
                <li>Medical documents and IEP/504 plans</li>
                <li>Progress notes and educator observations</li>
                <li>Biometric data (if integrated with wearable devices)</li>
              </ul>

              <h3 className="text-xl font-semibold mt-4">2.3 Usage Information</h3>
              <p className="text-muted-foreground">
                We automatically collect certain information about your device and usage patterns:
              </p>
              <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                <li>Device information (type, operating system, unique identifiers)</li>
                <li>Log data (IP address, access times, pages viewed)</li>
                <li>Usage patterns and feature interactions</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold">3. How We Use Your Information</h2>
              <p className="text-muted-foreground">We use collected information for:</p>
              <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                <li>Providing and improving our services</li>
                <li>Personalizing your experience</li>
                <li>Generating insights and analytics about student progress</li>
                <li>Communicating with you about updates and features</li>
                <li>Ensuring security and preventing fraud</li>
                <li>Complying with legal obligations</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold">4. HIPAA Compliance</h2>
              <p className="text-muted-foreground">
                FPX CNS-App is HIPAA compliant. We implement appropriate administrative, physical, and technical safeguards to protect your Protected Health Information (PHI):
              </p>
              <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                <li>All PHI is encrypted in transit (TLS 1.3) and at rest (AES-256)</li>
                <li>Access to PHI is strictly limited to authorized personnel</li>
                <li>We maintain comprehensive audit logs of all PHI access</li>
                <li>Regular security assessments and vulnerability testing</li>
                <li>Business Associate Agreements with all third-party service providers</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold">5. GDPR Compliance</h2>
              <p className="text-muted-foreground">
                For users in the European Economic Area (EEA), we comply with GDPR requirements:
              </p>
              <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                <li><strong>Right to Access:</strong> You can request a copy of your personal data</li>
                <li><strong>Right to Rectification:</strong> You can correct inaccurate data</li>
                <li><strong>Right to Erasure:</strong> You can request deletion of your data</li>
                <li><strong>Right to Data Portability:</strong> You can receive your data in a machine-readable format</li>
                <li><strong>Right to Restriction:</strong> You can limit how we process your data</li>
                <li><strong>Right to Object:</strong> You can object to certain processing activities</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold">6. Data Sharing and Disclosure</h2>
              <p className="text-muted-foreground">We do not sell your personal information. We may share information with:</p>
              <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                <li><strong>Family Members:</strong> Information shared within your family account</li>
                <li><strong>Service Providers:</strong> Third-party vendors who assist in providing our services (under strict confidentiality agreements)</li>
                <li><strong>Legal Requirements:</strong> When required by law or to protect rights and safety</li>
                <li><strong>Business Transfers:</strong> In connection with mergers or acquisitions (with your consent)</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold">7. Data Security</h2>
              <p className="text-muted-foreground">We implement industry-standard security measures:</p>
              <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                <li>End-to-end encryption for sensitive data</li>
                <li>Regular security audits and penetration testing</li>
                <li>Multi-factor authentication options</li>
                <li>Secure cloud infrastructure with automatic backups</li>
                <li>Employee training on data protection and privacy</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold">8. Data Retention</h2>
              <p className="text-muted-foreground">
                We retain your information for as long as your account is active or as needed to provide services. You may request deletion of your data at any time through the Data Deletion page or by contacting us.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold">9. Children's Privacy</h2>
              <p className="text-muted-foreground">
                Our service is designed for use by parents and educators to track student information. We do not knowingly collect information directly from children under 13 without parental consent. Parents have full control over student data and can request deletion at any time.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold">10. Your Rights and Choices</h2>
              <p className="text-muted-foreground">You have the right to:</p>
              <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                <li>Access and review your personal information</li>
                <li>Correct or update your information</li>
                <li>Delete your account and associated data</li>
                <li>Export your data in a portable format</li>
                <li>Opt-out of marketing communications</li>
                <li>Withdraw consent for data processing</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold">11. International Data Transfers</h2>
              <p className="text-muted-foreground">
                Your information may be transferred to and processed in countries other than your own. We ensure appropriate safeguards are in place to protect your data in accordance with this Privacy Policy and applicable laws.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold">12. Changes to This Privacy Policy</h2>
              <p className="text-muted-foreground">
                We may update this Privacy Policy from time to time. We will notify you of material changes by email or through the app. Your continued use of the service after changes indicates acceptance.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold">13. Contact Us</h2>
              <p className="text-muted-foreground">
                If you have questions about this Privacy Policy or our privacy practices:
              </p>
              <div className="text-muted-foreground pl-6 space-y-1">
                <p>Email: privacy@fpxcns.app</p>
                <p>Support: support@fpxcns.app</p>
              </div>
            </section>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default PrivacyPolicy;