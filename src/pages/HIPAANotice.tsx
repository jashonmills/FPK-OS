import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const HIPAANotice = () => {
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

          <h1 className="text-4xl font-bold mb-2">HIPAA Notice of Privacy Practices</h1>
          <p className="text-muted-foreground mb-8">Last updated: {new Date().toLocaleDateString()}</p>

          <div className="prose prose-slate dark:prose-invert max-w-none space-y-6">
            <section className="space-y-4">
              <h2 className="text-2xl font-semibold">THIS NOTICE DESCRIBES HOW HEALTH INFORMATION ABOUT YOU MAY BE USED AND DISCLOSED AND HOW YOU CAN GET ACCESS TO THIS INFORMATION. PLEASE REVIEW IT CAREFULLY.</h2>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold">1. Our Commitment to Your Privacy</h2>
              <p className="text-muted-foreground">
                FPX CNS-App is committed to protecting the privacy of your Protected Health Information (PHI). We are required by law to:
              </p>
              <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                <li>Maintain the privacy and security of your PHI</li>
                <li>Provide you with this Notice of our legal duties and privacy practices</li>
                <li>Follow the terms of the Notice currently in effect</li>
                <li>Notify you if we are unable to agree to a requested restriction</li>
                <li>Accommodate reasonable requests to communicate health information by alternative means or locations</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold">2. What is Protected Health Information (PHI)?</h2>
              <p className="text-muted-foreground">
                PHI is information that identifies you and relates to:
              </p>
              <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                <li>Your past, present, or future physical or mental health condition</li>
                <li>Healthcare services provided to you</li>
                <li>Past, present, or future payment for healthcare services</li>
              </ul>
              <p className="text-muted-foreground mt-2">
                In FPX CNS-App, PHI includes behavioral logs, incident reports, sleep records, medical documents, IEP/504 plans, progress notes, and biometric data from wearable devices.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold">3. How We May Use and Disclose Your PHI</h2>
              
              <h3 className="text-xl font-semibold">3.1 Uses and Disclosures WITH Your Authorization</h3>
              <p className="text-muted-foreground">
                We will obtain your written authorization before using or disclosing your PHI for purposes other than those listed below. You may revoke your authorization at any time by writing to us.
              </p>

              <h3 className="text-xl font-semibold mt-4">3.2 Uses and Disclosures WITHOUT Your Authorization</h3>
              <p className="text-muted-foreground">
                We may use and disclose your PHI without your authorization in the following situations:
              </p>

              <h4 className="text-lg font-semibold mt-3">Treatment</h4>
              <p className="text-muted-foreground">
                We may disclose your PHI to coordinate your care or the care of your student. For example, sharing behavioral data with educators or therapists you've invited to your family account.
              </p>

              <h4 className="text-lg font-semibold mt-3">Payment</h4>
              <p className="text-muted-foreground">
                We may use and disclose your PHI for payment purposes, such as processing subscription fees or insurance billing (if applicable).
              </p>

              <h4 className="text-lg font-semibold mt-3">Healthcare Operations</h4>
              <p className="text-muted-foreground">
                We may use PHI for healthcare operations including:
              </p>
              <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                <li>Quality assessment and improvement activities</li>
                <li>Reviewing the competence or qualifications of healthcare professionals</li>
                <li>Conducting training programs</li>
                <li>Conducting or arranging for medical review, legal services, and auditing functions</li>
                <li>Business planning and development</li>
              </ul>

              <h4 className="text-lg font-semibold mt-3">Business Associates</h4>
              <p className="text-muted-foreground">
                We may disclose your PHI to our business associates who perform services on our behalf. All business associates are required to sign agreements to protect your PHI.
              </p>

              <h4 className="text-lg font-semibold mt-3">As Required by Law</h4>
              <p className="text-muted-foreground">
                We may use or disclose your PHI when required by federal, state, or local law.
              </p>

              <h4 className="text-lg font-semibold mt-3">Public Health Activities</h4>
              <p className="text-muted-foreground">
                We may disclose PHI for public health activities to:
              </p>
              <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                <li>Prevent or control disease, injury, or disability</li>
                <li>Report births and deaths</li>
                <li>Report child abuse or neglect</li>
                <li>Report adverse reactions to medications</li>
                <li>Notify people of recalls of products they may be using</li>
              </ul>

              <h4 className="text-lg font-semibold mt-3">Health Oversight Activities</h4>
              <p className="text-muted-foreground">
                We may disclose PHI to health oversight agencies for audits, investigations, inspections, and licensing purposes.
              </p>

              <h4 className="text-lg font-semibold mt-3">Judicial and Administrative Proceedings</h4>
              <p className="text-muted-foreground">
                We may disclose PHI in response to a court order, subpoena, discovery request, or other lawful process.
              </p>

              <h4 className="text-lg font-semibold mt-3">Law Enforcement</h4>
              <p className="text-muted-foreground">
                We may disclose PHI for law enforcement purposes as required by law or in response to a valid subpoena.
              </p>

              <h4 className="text-lg font-semibold mt-3">Threat to Health or Safety</h4>
              <p className="text-muted-foreground">
                We may disclose PHI when necessary to prevent a serious threat to the health and safety of you, another person, or the public.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold">4. Your Rights Regarding Your PHI</h2>

              <h3 className="text-xl font-semibold">4.1 Right to Inspect and Copy</h3>
              <p className="text-muted-foreground">
                You have the right to inspect and obtain a copy of your PHI. You can access your data through the app or request an export in Settings → Privacy → Export My Data.
              </p>

              <h3 className="text-xl font-semibold mt-4">4.2 Right to Amend</h3>
              <p className="text-muted-foreground">
                You have the right to request that we amend your PHI if you believe it is incorrect or incomplete. You can edit most information directly in the app.
              </p>

              <h3 className="text-xl font-semibold mt-4">4.3 Right to an Accounting of Disclosures</h3>
              <p className="text-muted-foreground">
                You have the right to request an accounting of certain disclosures of your PHI. Contact privacy@fpxcns.app to request this information.
              </p>

              <h3 className="text-xl font-semibold mt-4">4.4 Right to Request Restrictions</h3>
              <p className="text-muted-foreground">
                You have the right to request restrictions on how we use or disclose your PHI. We are not required to agree to your request, but we will accommodate reasonable requests.
              </p>

              <h3 className="text-xl font-semibold mt-4">4.5 Right to Request Confidential Communications</h3>
              <p className="text-muted-foreground">
                You have the right to request that we communicate with you about health matters in a certain way or at a certain location. For example, you can request that we contact you only at work or by email.
              </p>

              <h3 className="text-xl font-semibold mt-4">4.6 Right to a Paper Copy of This Notice</h3>
              <p className="text-muted-foreground">
                You have the right to receive a paper copy of this Notice upon request, even if you have agreed to receive it electronically.
              </p>

              <h3 className="text-xl font-semibold mt-4">4.7 Right to Notification of a Breach</h3>
              <p className="text-muted-foreground">
                You have the right to be notified in the event of a breach of your unsecured PHI.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold">5. How We Protect Your PHI</h2>
              <p className="text-muted-foreground">
                We implement comprehensive security measures to protect your PHI:
              </p>
              <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                <li><strong>Encryption:</strong> All PHI is encrypted in transit (TLS 1.3) and at rest (AES-256)</li>
                <li><strong>Access Controls:</strong> Strict authentication and authorization mechanisms</li>
                <li><strong>Audit Logs:</strong> Comprehensive logging of all access to PHI</li>
                <li><strong>Employee Training:</strong> Regular HIPAA compliance training for all staff</li>
                <li><strong>Physical Security:</strong> Secure data centers with 24/7 monitoring</li>
                <li><strong>Incident Response:</strong> Documented procedures for security incidents</li>
                <li><strong>Regular Assessments:</strong> Annual security risk assessments and audits</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold">6. Breach Notification</h2>
              <p className="text-muted-foreground">
                In the event of a breach of unsecured PHI, we will notify you:
              </p>
              <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                <li>Without unreasonable delay, no later than 60 days after discovery</li>
                <li>Via email or mail to the address on file</li>
                <li>With a description of what happened and what information was involved</li>
                <li>With steps you can take to protect yourself</li>
                <li>With information about our investigation and corrective actions</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold">7. Changes to This Notice</h2>
              <p className="text-muted-foreground">
                We reserve the right to change this Notice. We will post the revised Notice in the app and on our website. The new Notice will be effective for all PHI that we maintain.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold">8. Complaints</h2>
              <p className="text-muted-foreground">
                If you believe your privacy rights have been violated, you may file a complaint with:
              </p>
              <div className="text-muted-foreground pl-6 space-y-2">
                <p><strong>FPX CNS-App Privacy Officer:</strong></p>
                <p>Email: privacy@fpxcns.app</p>
                <p className="mt-4"><strong>U.S. Department of Health and Human Services:</strong></p>
                <p>Office for Civil Rights</p>
                <p>200 Independence Avenue, S.W.</p>
                <p>Washington, D.C. 20201</p>
                <p>Phone: 1-877-696-6775</p>
                <p>Website: www.hhs.gov/ocr/privacy/hipaa/complaints/</p>
              </div>
              <p className="text-muted-foreground mt-4">
                <strong>You will not be retaliated against for filing a complaint.</strong>
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold">9. Contact Information</h2>
              <p className="text-muted-foreground">
                For questions about this Notice or to exercise your rights:
              </p>
              <div className="text-muted-foreground pl-6 space-y-1">
                <p>Privacy Officer: privacy@fpxcns.app</p>
                <p>Support: support@fpxcns.app</p>
              </div>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold">10. Effective Date</h2>
              <p className="text-muted-foreground">
                This Notice is effective as of {new Date().toLocaleDateString()}.
              </p>
            </section>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default HIPAANotice;