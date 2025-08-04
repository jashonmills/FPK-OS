
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Shield, Lock, Eye, FileText } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const PrivacyPolicy = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto p-6">
        <div className="mb-6">
          <Button 
            variant="ghost" 
            onClick={() => navigate(-1)}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          
          <div className="text-center mb-8">
            <Shield className="h-12 w-12 text-primary mx-auto mb-4" />
            <h1 className="text-4xl font-bold">Privacy Policy</h1>
            <p className="text-muted-foreground mt-2">
              Last updated: {new Date().toLocaleDateString()}
            </p>
          </div>
        </div>

        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="prose max-w-none">
              <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                <Eye className="h-6 w-6" />
                Overview
              </h2>
              <p className="mb-4">
                This Privacy Policy describes how we collect, use, and protect your personal information 
                when you use our learning platform. We are committed to maintaining the highest standards 
                of privacy protection in compliance with GDPR, HIPAA, and other applicable regulations.
              </p>

              <h2 className="text-2xl font-semibold mb-4 mt-8 flex items-center gap-2">
                <FileText className="h-6 w-6" />
                Information We Collect
              </h2>
              <h3 className="text-lg font-semibold mb-2">Personal Information</h3>
              <ul className="list-disc pl-6 mb-4">
                <li>Name, email address, and contact information</li>
                <li>Account credentials and profile information</li>
                <li>Educational background and learning preferences</li>
                <li>Payment and billing information</li>
              </ul>

              <h3 className="text-lg font-semibold mb-2">Learning Data</h3>
              <ul className="list-disc pl-6 mb-4">
                <li>Course progress and completion status</li>
                <li>Quiz scores and assessment results</li>
                <li>Study session duration and frequency</li>
                <li>Content interactions and engagement metrics</li>
              </ul>

              <h3 className="text-lg font-semibold mb-2">Technical Data</h3>
              <ul className="list-disc pl-6 mb-4">
                <li>Device information and browser type</li>
                <li>IP address and location data (anonymized)</li>
                <li>Usage patterns and feature utilization</li>
                <li>Error logs and performance metrics</li>
              </ul>

              <h2 className="text-2xl font-semibold mb-4 mt-8 flex items-center gap-2">
                <Lock className="h-6 w-6" />
                How We Use Your Information
              </h2>
              <ul className="list-disc pl-6 mb-4">
                <li><strong>Service Delivery:</strong> Provide personalized learning experiences</li>
                <li><strong>Progress Tracking:</strong> Monitor and improve your learning outcomes</li>
                <li><strong>Communication:</strong> Send important updates and notifications</li>
                <li><strong>Security:</strong> Protect against fraud and unauthorized access</li>
                <li><strong>Improvement:</strong> Enhance our platform and develop new features</li>
                <li><strong>Compliance:</strong> Meet legal and regulatory requirements</li>
              </ul>

              <h2 className="text-2xl font-semibold mb-4 mt-8">Data Protection & Security</h2>
              <h3 className="text-lg font-semibold mb-2">Encryption</h3>
              <ul className="list-disc pl-6 mb-4">
                <li>All data encrypted in transit using TLS 1.3</li>
                <li>Data at rest encrypted using AES-256 encryption</li>
                <li>Database and storage encryption with regular key rotation</li>
              </ul>

              <h3 className="text-lg font-semibold mb-2">Access Controls</h3>
              <ul className="list-disc pl-6 mb-4">
                <li>Role-based access with principle of least privilege</li>
                <li>Multi-factor authentication for all admin accounts</li>
                <li>Regular access reviews and permission audits</li>
                <li>Audit logging of all data access and modifications</li>
              </ul>

              <h3 className="text-lg font-semibold mb-2">HIPAA Compliance (Where Applicable)</h3>
              <ul className="list-disc pl-6 mb-4">
                <li>Business Associate Agreements (BAA) with all vendors</li>
                <li>Administrative, physical, and technical safeguards</li>
                <li>Regular risk assessments and vulnerability testing</li>
                <li>Incident response and breach notification procedures</li>
              </ul>

              <h2 className="text-2xl font-semibold mb-4 mt-8">Your Rights (GDPR)</h2>
              <ul className="list-disc pl-6 mb-4">
                <li><strong>Right to Access:</strong> Request copies of your personal data</li>
                <li><strong>Right to Rectification:</strong> Request correction of inaccurate data</li>
                <li><strong>Right to Erasure:</strong> Request deletion of your personal data</li>
                <li><strong>Right to Portability:</strong> Receive your data in a portable format</li>
                <li><strong>Right to Restrict Processing:</strong> Limit how we process your data</li>
                <li><strong>Right to Object:</strong> Object to certain types of processing</li>
                <li><strong>Right to Withdraw Consent:</strong> Withdraw consent at any time</li>
              </ul>

              <h2 className="text-2xl font-semibold mb-4 mt-8">Data Retention</h2>
              <ul className="list-disc pl-6 mb-4">
                <li><strong>Account Data:</strong> Retained while account is active</li>
                <li><strong>Learning Progress:</strong> Retained for 7 years for educational records</li>
                <li><strong>Chat/Communication Data:</strong> Retained for 2 years</li>
                <li><strong>Analytics Data:</strong> Aggregated and anonymized after 3 years</li>
                <li><strong>Payment Data:</strong> Retained as required by financial regulations</li>
              </ul>

              <h2 className="text-2xl font-semibold mb-4 mt-8">Third-Party Services</h2>
              <p className="mb-4">
                We work with trusted third-party service providers who help us operate our platform. 
                All vendors are carefully vetted and required to maintain the same level of data protection:
              </p>
              <ul className="list-disc pl-6 mb-4">
                <li>Cloud hosting providers (with data processing agreements)</li>
                <li>Payment processors (PCI DSS compliant)</li>
                <li>Analytics services (with data anonymization)</li>
                <li>Communication services (encrypted in transit)</li>
              </ul>

              <h2 className="text-2xl font-semibold mb-4 mt-8">Contact Information</h2>
              <p className="mb-4">
                For any privacy-related questions, concerns, or requests, please contact:
              </p>
              <div className="bg-muted p-4 rounded-lg">
                <p><strong>Data Protection Officer</strong></p>
                <p>Email: privacy@yourplatform.com</p>
                <p>Phone: +1 (555) 123-4567</p>
                <p>Address: [Your Company Address]</p>
              </div>

              <h2 className="text-2xl font-semibold mb-4 mt-8">Changes to This Policy</h2>
              <p className="mb-4">
                We may update this Privacy Policy from time to time. We will notify you of any 
                material changes by email and by posting the updated policy on our website. 
                Your continued use of our services after such changes constitutes acceptance 
                of the updated policy.
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="text-center">
          <Button asChild>
            <a href="/data-protection">Visit Data Protection Center</a>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
