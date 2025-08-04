import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Home } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function TermsOfService() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-3">
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
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
          <h1 className="text-4xl font-bold mb-4">Terms of Service</h1>
          <p className="text-muted-foreground">Last updated: {new Date().toLocaleDateString()}</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>1. Acceptance of Terms</CardTitle>
          </CardHeader>
          <CardContent>
            <p>
              By accessing and using this learning platform, you accept and agree to be bound by the terms 
              and provision of this agreement. These Terms of Service govern your use of our platform, 
              including all content, services, and products available through the platform.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>2. Use License</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">Permission is granted to:</h4>
              <ul className="list-disc pl-6 space-y-1">
                <li>Access and use the platform for personal, educational purposes</li>
                <li>Download course materials for offline study</li>
                <li>Share progress and achievements on social media</li>
                <li>Participate in community discussions and forums</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">This license does not allow you to:</h4>
              <ul className="list-disc pl-6 space-y-1">
                <li>Modify or copy the materials for commercial use</li>
                <li>Attempt to reverse engineer the platform</li>
                <li>Remove any copyright or proprietary notations</li>
                <li>Transfer the materials to another person or server</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>3. User Accounts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Account Responsibility</h4>
                <ul className="list-disc pl-6 space-y-1">
                  <li>You are responsible for maintaining the confidentiality of your account</li>
                  <li>You agree to provide accurate and complete information</li>
                  <li>You must notify us immediately of any unauthorized use</li>
                  <li>You are responsible for all activities under your account</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Account Termination</h4>
                <p>We reserve the right to terminate accounts that violate these terms or engage in prohibited activities.</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>4. User Content</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Content You Create</h4>
                <ul className="list-disc pl-6 space-y-1">
                  <li>You retain ownership of content you create (notes, comments, etc.)</li>
                  <li>You grant us a license to use your content to provide our services</li>
                  <li>You are responsible for ensuring your content doesn't violate any laws</li>
                  <li>We may remove content that violates our community guidelines</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Prohibited Content</h4>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Harmful, offensive, or inappropriate material</li>
                  <li>Copyright or trademark infringement</li>
                  <li>Spam or commercial solicitation</li>
                  <li>Malicious code or security threats</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>5. Privacy and Data Protection</CardTitle>
          </CardHeader>
          <CardContent>
            <p>
              Your privacy is important to us. Our Privacy Policy explains how we collect, use, and protect 
              your information when you use our services. By using our platform, you agree to the collection 
              and use of information in accordance with our Privacy Policy.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>6. Subscription and Payments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Subscription Terms</h4>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Subscriptions are billed in advance on a recurring basis</li>
                  <li>You can cancel your subscription at any time</li>
                  <li>Refunds are provided according to our refund policy</li>
                  <li>Price changes will be communicated 30 days in advance</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Free Trial</h4>
                <p>Free trials are offered to new users only and are limited to one per person.</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>7. Limitation of Liability</CardTitle>
          </CardHeader>
          <CardContent>
            <p>
              In no event shall the company be liable for any damages (including, without limitation, 
              damages for loss of data or profit, or due to business interruption) arising out of the 
              use or inability to use the materials on our platform, even if we have been notified 
              orally or in writing of the possibility of such damage.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>8. Governing Law</CardTitle>
          </CardHeader>
          <CardContent>
            <p>
              These terms and conditions are governed by and construed in accordance with the laws 
              of the jurisdiction in which our company is registered, and you irrevocably submit 
              to the exclusive jurisdiction of the courts in that location.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>9. Changes to Terms</CardTitle>
          </CardHeader>
          <CardContent>
            <p>
              We reserve the right to revise these terms at any time. By using this platform, 
              you agree to be bound by the current version of these Terms of Service. 
              Material changes will be communicated to users via email or platform notification.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>10. Contact Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p><strong>Legal Inquiries:</strong> legal@company.com</p>
              <p><strong>General Support:</strong> support@company.com</p>
              <p><strong>Address:</strong> [Company Address]</p>
            </div>
          </CardContent>
        </Card>
      </div>
      </div>
    </div>
  );
}