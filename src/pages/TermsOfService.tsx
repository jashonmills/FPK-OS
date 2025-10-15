import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const TermsOfService = () => {
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

          <h1 className="text-4xl font-bold mb-2">Terms of Service</h1>
          <p className="text-muted-foreground mb-8">Last updated: {new Date().toLocaleDateString()}</p>

          <div className="prose prose-slate dark:prose-invert max-w-none space-y-6">
            <section className="space-y-4">
              <h2 className="text-2xl font-semibold">1. Acceptance of Terms</h2>
              <p className="text-muted-foreground">
                By accessing and using FPX CNS-App ("the Service"), you accept and agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use the Service.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold">2. Description of Service</h2>
              <p className="text-muted-foreground">
                FPX CNS-App provides a care coordination and progress tracking platform designed to help parents, educators, and caregivers manage and monitor student development, behavior, and educational goals.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold">3. User Accounts</h2>
              <h3 className="text-xl font-semibold">3.1 Account Creation</h3>
              <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                <li>You must provide accurate and complete information when creating an account</li>
                <li>You are responsible for maintaining the confidentiality of your account credentials</li>
                <li>You must be at least 18 years old to create an account</li>
                <li>You are responsible for all activities that occur under your account</li>
              </ul>

              <h3 className="text-xl font-semibold mt-4">3.2 Account Security</h3>
              <p className="text-muted-foreground">
                You agree to notify us immediately of any unauthorized use of your account. We are not liable for any loss resulting from unauthorized account access.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold">4. Acceptable Use</h2>
              <p className="text-muted-foreground">You agree NOT to:</p>
              <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                <li>Use the Service for any illegal purpose or in violation of any laws</li>
                <li>Upload false, inaccurate, or misleading information</li>
                <li>Impersonate any person or entity</li>
                <li>Interfere with or disrupt the Service or servers</li>
                <li>Attempt to gain unauthorized access to any part of the Service</li>
                <li>Use automated systems to access the Service without permission</li>
                <li>Share student information without proper consent</li>
                <li>Use the Service to harm, threaten, or harass others</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold">5. Data and Privacy</h2>
              <h3 className="text-xl font-semibold">5.1 Your Data</h3>
              <p className="text-muted-foreground">
                You retain ownership of all data you submit to the Service. By submitting data, you grant us a license to use, store, and process it solely for providing the Service.
              </p>

              <h3 className="text-xl font-semibold mt-4">5.2 Student Data</h3>
              <p className="text-muted-foreground">
                You represent that you have the legal authority to provide student information and consent to its processing. We comply with FERPA, HIPAA, and COPPA regulations regarding student data.
              </p>

              <h3 className="text-xl font-semibold mt-4">5.3 Privacy Policy</h3>
              <p className="text-muted-foreground">
                Our Privacy Policy governs the collection and use of your information. By using the Service, you consent to our data practices as described in the Privacy Policy.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold">6. Subscription and Payments</h2>
              <h3 className="text-xl font-semibold">6.1 Fees</h3>
              <p className="text-muted-foreground">
                Certain features require a paid subscription. All fees are non-refundable unless otherwise specified or required by law.
              </p>

              <h3 className="text-xl font-semibold mt-4">6.2 Billing</h3>
              <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                <li>Subscriptions automatically renew unless cancelled</li>
                <li>You authorize us to charge your payment method for recurring fees</li>
                <li>We may change pricing with 30 days notice</li>
                <li>Failed payments may result in service suspension</li>
              </ul>

              <h3 className="text-xl font-semibold mt-4">6.3 Cancellation</h3>
              <p className="text-muted-foreground">
                You may cancel your subscription at any time. Cancellation takes effect at the end of the current billing period.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold">7. Intellectual Property</h2>
              <h3 className="text-xl font-semibold">7.1 Our IP</h3>
              <p className="text-muted-foreground">
                The Service, including all content, features, and functionality, is owned by FPX CNS-App and protected by copyright, trademark, and other laws.
              </p>

              <h3 className="text-xl font-semibold mt-4">7.2 License</h3>
              <p className="text-muted-foreground">
                We grant you a limited, non-exclusive, non-transferable license to access and use the Service for personal or educational purposes.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold">8. Third-Party Services</h2>
              <p className="text-muted-foreground">
                The Service may integrate with third-party services (e.g., Garmin, Google Calendar). We are not responsible for third-party services, and your use of them is subject to their terms.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold">9. Disclaimer of Warranties</h2>
              <p className="text-muted-foreground">
                THE SERVICE IS PROVIDED "AS IS" WITHOUT WARRANTIES OF ANY KIND. WE DISCLAIM ALL WARRANTIES, EXPRESS OR IMPLIED, INCLUDING MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE.
              </p>
              <p className="text-muted-foreground">
                We do not guarantee that the Service will be uninterrupted, error-free, or secure. The Service is not a substitute for professional medical, educational, or therapeutic advice.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold">10. Limitation of Liability</h2>
              <p className="text-muted-foreground">
                TO THE MAXIMUM EXTENT PERMITTED BY LAW, FPX CNS-APP SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, OR ANY LOSS OF PROFITS OR REVENUES.
              </p>
              <p className="text-muted-foreground">
                Our total liability shall not exceed the amount you paid us in the 12 months preceding the claim.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold">11. Indemnification</h2>
              <p className="text-muted-foreground">
                You agree to indemnify and hold harmless FPX CNS-App from any claims, damages, or expenses arising from your use of the Service or violation of these Terms.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold">12. Termination</h2>
              <p className="text-muted-foreground">
                We may suspend or terminate your account at any time for violations of these Terms or other reasons. Upon termination:
              </p>
              <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                <li>Your right to use the Service immediately ceases</li>
                <li>You may export your data within 30 days</li>
                <li>We may delete your data after the retention period</li>
                <li>Paid fees are non-refundable</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold">13. Dispute Resolution</h2>
              <h3 className="text-xl font-semibold">13.1 Governing Law</h3>
              <p className="text-muted-foreground">
                These Terms are governed by the laws of [Your Jurisdiction], without regard to conflict of law principles.
              </p>

              <h3 className="text-xl font-semibold mt-4">13.2 Arbitration</h3>
              <p className="text-muted-foreground">
                Any disputes shall be resolved through binding arbitration, except where prohibited by law. You waive your right to a jury trial.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold">14. Changes to Terms</h2>
              <p className="text-muted-foreground">
                We may modify these Terms at any time. Material changes will be notified via email or in-app notification. Continued use after changes constitutes acceptance.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold">15. Miscellaneous</h2>
              <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                <li><strong>Severability:</strong> If any provision is invalid, the remaining provisions remain in effect</li>
                <li><strong>Waiver:</strong> Failure to enforce any right does not waive that right</li>
                <li><strong>Assignment:</strong> You may not assign these Terms without our consent</li>
                <li><strong>Entire Agreement:</strong> These Terms constitute the entire agreement between you and FPX CNS-App</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold">16. Contact Information</h2>
              <p className="text-muted-foreground">
                For questions about these Terms:
              </p>
              <div className="text-muted-foreground pl-6 space-y-1">
                <p>Email: legal@fpxcns.app</p>
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

export default TermsOfService;