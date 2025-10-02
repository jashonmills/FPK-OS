import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useSafeNavigation } from "@/hooks/useSafeNavigation";

export default function GDPRHIPAACompliance() {
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
            <h1 className="text-4xl font-bold mb-4">GDPR and HIPAA Compliance Statement</h1>
            <p className="text-muted-foreground">FPK University Data Protection and Health Information Privacy</p>
            <p className="text-sm text-muted-foreground mt-2">
              This document supplements our <a href="/privacy-policy" className="text-primary hover:underline">Privacy Policy</a> and <a href="/terms-of-service" className="text-primary hover:underline">Terms of Use</a>
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Purpose</CardTitle>
            </CardHeader>
            <CardContent>
              <p>
                This document outlines the specific principles and measures FPK University ("the University") has implemented to comply with two key data protection regulations: the General Data Protection Regulation (GDPR) for individuals in the European Union, and the Health Insurance Portability and Accountability Act (HIPAA) for protected health information in the United States.
              </p>
            </CardContent>
          </Card>

          <div className="text-center my-8">
            <h2 className="text-3xl font-bold text-primary">Part I: GDPR Compliance</h2>
            <p className="text-muted-foreground mt-2">
              For individuals in the European Economic Area (EEA)
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>GDPR Commitment</CardTitle>
            </CardHeader>
            <CardContent>
              <p>
                FPK University is committed to upholding the principles of GDPR for the processing of personal data of students, faculty, staff, and other individuals located in the European Economic Area (EEA).
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>1. Lawfulness, Fairness, and Transparency</CardTitle>
            </CardHeader>
            <CardContent>
              <p>
                We process personal data only when we have a lawful basis to do so, and we are transparent about our data processing activities as detailed in our Privacy Policy. All processing is conducted fairly and in accordance with data subjects' reasonable expectations.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>2. Purpose Limitation</CardTitle>
            </CardHeader>
            <CardContent>
              <p>
                Data is collected for specified, explicit, and legitimate purposes and not further processed in a manner that is incompatible with those purposes. We clearly communicate the purpose of data collection at the point of collection.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>3. Data Minimization</CardTitle>
            </CardHeader>
            <CardContent>
              <p>
                We only collect and process personal data that is adequate, relevant, and limited to what is necessary for the intended purpose. We regularly review our data collection practices to ensure compliance with this principle.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>4. Accuracy</CardTitle>
            </CardHeader>
            <CardContent>
              <p>
                We take reasonable steps to ensure that personal data is accurate and, where necessary, kept up to date. We provide mechanisms for data subjects to update their information and promptly correct any inaccuracies brought to our attention.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>5. Storage Limitation</CardTitle>
            </CardHeader>
            <CardContent>
              <p>
                We retain personal data in a form which permits identification of data subjects for no longer than is necessary, in accordance with our Data Retention Policy. Different categories of data are subject to different retention periods based on legal, operational, and educational requirements.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>6. Integrity and Confidentiality</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4">
                We implement appropriate technical and organizational security measures to protect personal data against unauthorized or unlawful processing and against accidental loss, destruction, or damage:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Encryption:</strong> Data encrypted in transit (TLS/SSL) and at rest (AES-256)</li>
                <li><strong>Access Controls:</strong> Role-based access control (RBAC) and multi-factor authentication (MFA)</li>
                <li><strong>Security Audits:</strong> Regular vulnerability assessments and penetration testing</li>
                <li><strong>Monitoring:</strong> Continuous security monitoring and intrusion detection systems</li>
                <li><strong>Incident Response:</strong> Documented procedures for data breach notification and response</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>7. Accountability</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                FPK University demonstrates accountability through several measures:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Data Protection Officer (DPO):</strong> We have appointed a DPO to oversee our GDPR compliance strategy and serve as a point of contact for data subjects and supervisory authorities</li>
                <li><strong>Records of Processing:</strong> We maintain detailed records of our processing activities</li>
                <li><strong>Data Protection Impact Assessments (DPIAs):</strong> We conduct DPIAs for high-risk processing activities</li>
                <li><strong>Privacy by Design:</strong> We integrate data protection into all new systems and processes</li>
                <li><strong>Staff Training:</strong> Regular training for all staff who handle personal data</li>
                <li><strong>Data Subject Rights Procedures:</strong> Established processes to handle data subject rights requests within the required timeframes</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>8. International Data Transfers</CardTitle>
            </CardHeader>
            <CardContent>
              <p>
                When transferring personal data outside the EEA, we ensure appropriate safeguards are in place to protect the data. We use mechanisms such as:
              </p>
              <ul className="list-disc pl-6 space-y-2 mt-2">
                <li>Standard Contractual Clauses (SCCs) approved by the European Commission</li>
                <li>Adequacy decisions where data is transferred to countries deemed to provide adequate protection</li>
                <li>Binding Corporate Rules for intra-organizational transfers</li>
                <li>Additional security measures and encryption to supplement transfer mechanisms</li>
              </ul>
            </CardContent>
          </Card>

          <div className="text-center my-8">
            <h2 className="text-3xl font-bold text-primary">Part II: HIPAA Compliance</h2>
            <p className="text-muted-foreground mt-2">
              For Protected Health Information in the United States
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>HIPAA Hybrid Entity Status</CardTitle>
            </CardHeader>
            <CardContent>
              <p>
                FPK University is a "hybrid entity" under HIPAA, meaning that while the entire University is not a covered entity, certain components, such as University Health Services and certain employee health benefit plans, are designated as "health care components" and must comply with HIPAA. We have clearly designated these components and ensure they operate under HIPAA requirements.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>1. Protected Health Information (PHI)</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4">
                We are committed to protecting the privacy and security of all PHI created or maintained by our health care components. PHI includes any individually identifiable health information related to:
              </p>
              <ul className="list-disc pl-6 space-y-1">
                <li>The past, present, or future physical or mental health of an individual</li>
                <li>The provision of health care to an individual</li>
                <li>Past, present, or future payment for the provision of health care</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>2. Notice of Privacy Practices</CardTitle>
            </CardHeader>
            <CardContent>
              <p>
                Our health care components provide a detailed Notice of Privacy Practices to individuals at the first point of service. This notice explains:
              </p>
              <ul className="list-disc pl-6 space-y-1 mt-2">
                <li>How their PHI may be used and disclosed</li>
                <li>Their rights regarding their PHI</li>
                <li>The University's legal duties with respect to PHI</li>
                <li>How to file a complaint if they believe their privacy rights have been violated</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>3. Use and Disclosure of PHI</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4">
                We will not use or disclose PHI except as permitted or required by law:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Treatment:</strong> To provide, coordinate, or manage health care and related services</li>
                <li><strong>Payment:</strong> To obtain payment for health care services</li>
                <li><strong>Health Care Operations:</strong> For quality assessment, training, and other operational purposes</li>
                <li><strong>With Authorization:</strong> All other uses and disclosures require the individual's written authorization, which can be revoked at any time</li>
                <li><strong>Required by Law:</strong> As mandated by federal, state, or local law</li>
                <li><strong>Public Health Activities:</strong> To prevent or control disease, injury, or disability</li>
                <li><strong>Emergency Situations:</strong> To avert serious threats to health or safety</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>4. Individual Rights</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4">We uphold individuals' rights regarding their PHI:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Right to Access:</strong> Individuals can inspect and obtain a copy of their PHI</li>
                <li><strong>Right to Amend:</strong> Individuals can request amendments to their PHI</li>
                <li><strong>Right to an Accounting:</strong> Individuals can receive an accounting of disclosures of their PHI</li>
                <li><strong>Right to Request Restrictions:</strong> Individuals can request restrictions on certain uses and disclosures</li>
                <li><strong>Right to Confidential Communications:</strong> Individuals can request to receive communications of PHI by alternative means or at alternative locations</li>
                <li><strong>Right to a Paper Copy of the Notice:</strong> Individuals can request a paper copy of the Notice of Privacy Practices</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>5. Administrative, Physical, and Technical Safeguards</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>We have implemented comprehensive safeguards to protect electronic PHI (e-PHI):</p>
              
              <div>
                <h4 className="font-semibold mb-2">Administrative Safeguards</h4>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Designated HIPAA Privacy Officer and Security Officer</li>
                  <li>Comprehensive workforce training and management</li>
                  <li>Information access management policies</li>
                  <li>Security incident procedures and response plans</li>
                  <li>Contingency planning for emergencies</li>
                  <li>Regular evaluation of security measures</li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Physical Safeguards</h4>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Facility access controls with badge systems and surveillance</li>
                  <li>Workstation security policies and procedures</li>
                  <li>Device and media controls for secure disposal and reuse</li>
                  <li>Restricted access to areas containing PHI</li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Technical Safeguards</h4>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Unique user identification and automatic logoff</li>
                  <li>Encryption of e-PHI in transit and at rest</li>
                  <li>Audit controls and access logs</li>
                  <li>Integrity controls to ensure e-PHI is not improperly altered</li>
                  <li>Authentication mechanisms (passwords, tokens, biometrics)</li>
                  <li>Transmission security protocols (TLS/SSL)</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>6. Business Associate Agreements</CardTitle>
            </CardHeader>
            <CardContent>
              <p>
                We enter into legally binding Business Associate Agreements (BAAs) with third-party vendors who perform functions on our behalf that involve the use or disclosure of PHI. These agreements require business associates to:
              </p>
              <ul className="list-disc pl-6 space-y-1 mt-2">
                <li>Implement appropriate safeguards to protect PHI</li>
                <li>Report any security incidents or breaches</li>
                <li>Ensure their subcontractors also comply with HIPAA requirements</li>
                <li>Return or destroy PHI at the end of the contract</li>
                <li>Make their practices and records available for compliance reviews</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>7. Breach Notification</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4">
                In the event of a breach of unsecured PHI, we will provide notification in accordance with HIPAA requirements:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Individual Notification:</strong> Affected individuals will be notified without unreasonable delay and no later than 60 days after discovery</li>
                <li><strong>HHS Notification:</strong> The U.S. Department of Health and Human Services will be notified as required</li>
                <li><strong>Media Notification:</strong> For breaches affecting more than 500 residents of a state or jurisdiction, prominent media outlets will be notified</li>
                <li><strong>Business Associate Notification:</strong> Business associates must notify us of breaches they discover</li>
              </ul>
              <p className="mt-4">
                Breach notifications will include a description of the breach, types of information involved, steps individuals should take to protect themselves, what we are doing to investigate and mitigate harm, and contact information.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p>For questions specific to GDPR or HIPAA compliance, please contact:</p>
                <p><strong>Data Protection Officer (GDPR):</strong> privacy@fpkuniversity.com</p>
                <p><strong>HIPAA Privacy Officer:</strong> compliance@fpkuniversity.edu</p>
                <p><strong>HIPAA Security Officer:</strong> compliance@fpkuniversity.edu</p>
                <p><strong>FPK University Compliance Office:</strong> compliance@fpkuniversity.edu</p>
                <p className="mt-4 text-sm text-muted-foreground">
                  To file a complaint regarding potential GDPR violations, you may contact your local data protection supervisory authority. To file a complaint regarding potential HIPAA violations, you may contact the U.S. Department of Health and Human Services Office for Civil Rights.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
