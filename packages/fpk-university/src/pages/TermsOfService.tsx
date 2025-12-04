import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowUp } from "lucide-react";
import { useSafeNavigation } from "@/hooks/useSafeNavigation";

export default function TermsOfService() {
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
          <h1 className="text-4xl font-bold mb-4">Terms of Use</h1>
          <p className="text-muted-foreground">Effective Date: October 2, 2025</p>
          <p className="text-sm text-muted-foreground mt-2">
            See also: <a href="/privacy-policy" className="text-primary hover:underline">Privacy Policy</a> | <a href="/gdpr-hipaa-compliance" className="text-primary hover:underline">GDPR/HIPAA Compliance</a>
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>1. Introduction and Acceptance of Terms</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              Welcome to FPK University ("the University," "we," "us," or "our"). These Terms of Use ("Terms") govern your access to and use of all FPK University-provided websites, portals, learning management systems (LMS), mobile applications, networks, and other digital services (collectively, the "Digital Services").
            </p>
            <p>
              By accessing, browsing, or using our Digital Services, you—as a student, faculty member, staff, alumnus, or guest ("User")—acknowledge that you have read, understood, and agree to be bound by these Terms and to comply with all applicable laws and regulations, including the FPK University Code of Conduct and all other institutional policies. If you do not agree to these Terms, you are not authorized to use the Digital Services.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>2. Permitted and Prohibited Use</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">2.1. Permitted Use</h4>
              <p className="mb-2">
                The Digital Services are provided for educational and administrative purposes, including but not limited to teaching, learning, research, and official University business. Users are granted a limited, non-exclusive, non-transferable license to access and use the Digital Services in accordance with their role at the University.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">2.2. Prohibited Conduct</h4>
              <p className="mb-2">You agree not to use the Digital Services to:</p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Violate any applicable local, state, national, or international law, including regulations related to data privacy (GDPR), health information (HIPAA), and intellectual property.</li>
                <li>Transmit or store any material that is unlawful, harassing, defamatory, abusive, threatening, obscene, or otherwise objectionable.</li>
                <li>Engage in any form of academic dishonesty, including plagiarism, cheating, or unauthorized collaboration, as defined in the University's Academic Integrity Policy.</li>
                <li>Distribute viruses, malware, or any other computer code, files, or programs that interrupt, destroy, or limit the functionality of any computer software or hardware.</li>
                <li>Attempt to gain unauthorized access to any University systems, user accounts, or data.</li>
                <li>Use the Digital Services for commercial purposes, including advertising or solicitation, without prior written consent from the University.</li>
                <li>Infringe upon the intellectual property rights of the University or any third party.</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>3. User Accounts and Security</CardTitle>
          </CardHeader>
          <CardContent>
            <p>
              You are responsible for maintaining the confidentiality of your University account credentials (e.g., username, password, multi-factor authentication codes). You are fully responsible for all activities that occur under your account. You agree to immediately notify the FPK University IT Department of any unauthorized use of your account or any other breach of security.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>4. Intellectual Property</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">4.1. University Content</h4>
              <p>
                All content provided through the Digital Services, including text, graphics, logos, images, as well as the compilation thereof, and any software used, is the property of FPK University or its suppliers and protected by copyright and other intellectual property laws.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">4.2. User-Generated Content</h4>
              <p>
                By submitting, posting, or displaying content (e.g., assignments, forum posts, research data) on or through the Digital Services, you grant the University a non-exclusive, royalty-free, worldwide license to use, reproduce, modify, and distribute such content in connection with the educational and research mission of the University, subject to the University's Intellectual Property Policy and your rights therein.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>5. Third-Party Services and Links</CardTitle>
          </CardHeader>
          <CardContent>
            <p>
              The Digital Services may integrate with or contain links to third-party websites or services (e.g., external research databases, educational tools) that are not owned or controlled by FPK University. The University has no control over, and assumes no responsibility for, the content, privacy policies, or practices of any third-party services. Please review our <a href="/privacy-policy" className="text-primary hover:underline">Privacy Policy</a> for more information on data handling.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>6. Disclaimer of Warranties</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="font-semibold uppercase">
              THE DIGITAL SERVICES ARE PROVIDED ON AN "AS IS" AND "AS AVAILABLE" BASIS. FPK UNIVERSITY EXPRESSLY DISCLAIMS ALL WARRANTIES OF ANY KIND, WHETHER EXPRESS OR IMPLIED, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT. THE UNIVERSITY DOES NOT WARRANT THAT THE SERVICES WILL BE UNINTERRUPTED, TIMELY, SECURE, OR ERROR-FREE.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>7. Limitation of Liability</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="font-semibold uppercase">
              TO THE FULLEST EXTENT PERMITTED BY LAW, FPK UNIVERSITY SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR EXEMPLARY DAMAGES, INCLUDING BUT NOT LIMITED TO, DAMAGES FOR LOSS OF PROFITS, GOODWILL, USE, DATA, OR OTHER INTANGIBLE LOSSES, RESULTING FROM THE USE OR THE INABILITY TO USE THE DIGITAL SERVICES.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>8. Changes to Terms</CardTitle>
          </CardHeader>
          <CardContent>
            <p>
              FPK University reserves the right to modify these Terms at any time. We will provide notice of significant changes by posting the new Terms on our website and updating the "Effective Date." Your continued use of the Digital Services after such changes constitutes your acceptance of the new Terms.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>9. Governing Law</CardTitle>
          </CardHeader>
          <CardContent>
            <p>
              These Terms shall be governed by and construed in accordance with the laws of the jurisdiction in which FPK University is located, without regard to its conflict of law provisions.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>10. Contact Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p>For any questions regarding these Terms of Use, please contact:</p>
              <p><strong>FPK University Office of Legal Affairs:</strong> legal@fpkuniversity.com</p>
              <p><strong>General Support:</strong> customerservice@fpkuniversity.com</p>
              <p><strong>IT Department (Security Issues):</strong> customerservice@fpkuniversity.com</p>
              <p className="mt-4 text-sm text-muted-foreground">
                For data protection and compliance information, see our <a href="/gdpr-hipaa-compliance" className="text-primary hover:underline">GDPR/HIPAA Compliance Statement</a>.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Back to Top Button */}
        <div className="flex justify-center mt-12 mb-8">
          <Button
            variant="outline"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="flex items-center gap-2"
          >
            <ArrowUp className="h-4 w-4" />
            Back to Top
          </Button>
        </div>
      </div>
      </div>
    </div>
  );
}