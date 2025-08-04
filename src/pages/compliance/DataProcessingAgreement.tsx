
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, FileText, Shield, Users, Lock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const DataProcessingAgreement = () => {
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
            <FileText className="h-12 w-12 text-primary mx-auto mb-4" />
            <h1 className="text-4xl font-bold">Data Processing Agreement</h1>
            <p className="text-muted-foreground mt-2">
              GDPR Article 28 Compliance Document
            </p>
            <p className="text-sm text-muted-foreground">
              Last updated: {new Date().toLocaleDateString()}
            </p>
          </div>
        </div>

        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="prose max-w-none">
              <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                <Shield className="h-6 w-6" />
                Agreement Overview
              </h2>
              <p className="mb-4">
                This Data Processing Agreement ("DPA") forms part of the Terms of Service between 
                you ("Controller") and our platform ("Processor") regarding the processing of 
                personal data in compliance with the General Data Protection Regulation (GDPR).
              </p>

              <h2 className="text-2xl font-semibold mb-4 mt-8">1. Definitions</h2>
              <ul className="list-disc pl-6 mb-4">
                <li><strong>"Personal Data"</strong> has the meaning set out in Article 4(1) of the GDPR</li>
                <li><strong>"Controller"</strong> means the entity that determines purposes and means of processing</li>
                <li><strong>"Processor"</strong> means our platform that processes personal data on behalf of the Controller</li>
                <li><strong>"Data Subject"</strong> means the identified or identifiable natural person</li>
                <li><strong>"Processing"</strong> has the meaning set out in Article 4(2) of the GDPR</li>
              </ul>

              <h2 className="text-2xl font-semibold mb-4 mt-8">2. Data Processing Details</h2>
              <div className="bg-muted p-4 rounded-lg mb-4">
                <h3 className="text-lg font-semibold mb-2">Subject Matter</h3>
                <p>Provision of learning management and educational technology services</p>
                
                <h3 className="text-lg font-semibold mb-2 mt-4">Duration</h3>
                <p>For the duration of the service agreement and data retention periods</p>
                
                <h3 className="text-lg font-semibold mb-2 mt-4">Nature and Purpose</h3>
                <ul className="list-disc pl-6">
                  <li>User account management and authentication</li>
                  <li>Educational content delivery and progress tracking</li>
                  <li>Assessment scoring and performance analytics</li>
                  <li>Communication and notification services</li>
                </ul>
              </div>

              <h2 className="text-2xl font-semibold mb-4 mt-8">3. Categories of Personal Data</h2>
              <div className="grid md:grid-cols-2 gap-4 mb-4">
                <div className="bg-muted p-4 rounded-lg">
                  <h3 className="text-lg font-semibold mb-2">Identity Data</h3>
                  <ul className="list-disc pl-6 text-sm">
                    <li>Name and email address</li>
                    <li>Profile information</li>
                    <li>Account identifiers</li>
                  </ul>
                </div>
                
                <div className="bg-muted p-4 rounded-lg">
                  <h3 className="text-lg font-semibold mb-2">Educational Data</h3>
                  <ul className="list-disc pl-6 text-sm">
                    <li>Learning progress and scores</li>
                    <li>Course enrollment data</li>
                    <li>Assessment results</li>
                  </ul>
                </div>
                
                <div className="bg-muted p-4 rounded-lg">
                  <h3 className="text-lg font-semibold mb-2">Technical Data</h3>
                  <ul className="list-disc pl-6 text-sm">
                    <li>IP addresses (anonymized)</li>
                    <li>Device information</li>
                    <li>Usage analytics</li>
                  </ul>
                </div>
                
                <div className="bg-muted p-4 rounded-lg">
                  <h3 className="text-lg font-semibold mb-2">Communication Data</h3>
                  <ul className="list-disc pl-6 text-sm">
                    <li>Support messages</li>
                    <li>Chat transcripts</li>
                    <li>Notification preferences</li>
                  </ul>
                </div>
              </div>

              <h2 className="text-2xl font-semibold mb-4 mt-8 flex items-center gap-2">
                <Users className="h-6 w-6" />
                4. Categories of Data Subjects
              </h2>
              <ul className="list-disc pl-6 mb-4">
                <li>Registered users and learners</li>
                <li>Course instructors and content creators</li>
                <li>Educational institution staff and administrators</li>
                <li>Support and customer service contacts</li>
              </ul>

              <h2 className="text-2xl font-semibold mb-4 mt-8">5. Processor Obligations</h2>
              <h3 className="text-lg font-semibold mb-2">5.1 General Obligations</h3>
              <ul className="list-disc pl-6 mb-4">
                <li>Process personal data only for the documented purposes</li>
                <li>Ensure confidentiality of personal data</li>
                <li>Implement appropriate technical and organizational measures</li>
                <li>Assist the Controller in fulfilling data subject requests</li>
                <li>Notify the Controller of personal data breaches without undue delay</li>
              </ul>

              <h3 className="text-lg font-semibold mb-2">5.2 Security Measures</h3>
              <ul className="list-disc pl-6 mb-4">
                <li>Encryption of personal data in transit and at rest</li>
                <li>Regular security assessments and vulnerability testing</li>
                <li>Access controls and authentication mechanisms</li>
                <li>Incident response and business continuity planning</li>
                <li>Staff training on data protection and security</li>
              </ul>

              <h2 className="text-2xl font-semibold mb-4 mt-8">6. Sub-Processors</h2>
              <p className="mb-4">
                We may engage sub-processors to assist in providing our services. All sub-processors:
              </p>
              <ul className="list-disc pl-6 mb-4">
                <li>Are bound by data protection obligations equivalent to those in this DPA</li>
                <li>Have been assessed for their data protection and security capabilities</li>
                <li>Are subject to regular audits and compliance monitoring</li>
                <li>Are listed in our current Sub-Processor Register</li>
              </ul>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                <h3 className="text-lg font-semibold mb-2">Current Sub-Processors</h3>
                <ul className="list-disc pl-6 text-sm">
                  <li><strong>Cloud Infrastructure:</strong> AWS/Google Cloud (Data hosting and processing)</li>
                  <li><strong>Analytics:</strong> Internal analytics only (Usage metrics)</li>
                  <li><strong>Payment Processing:</strong> Stripe (Payment transactions)</li>
                  <li><strong>Email Services:</strong> Resend (Transactional emails)</li>
                </ul>
              </div>

              <h2 className="text-2xl font-semibold mb-4 mt-8">7. Data Transfers</h2>
              <p className="mb-4">
                Personal data may be transferred outside the European Economic Area (EEA) only:
              </p>
              <ul className="list-disc pl-6 mb-4">
                <li>To countries with adequacy decisions from the European Commission</li>
                <li>Under appropriate safeguards (Standard Contractual Clauses)</li>
                <li>With explicit consent from the data subject where required</li>
                <li>Subject to binding corporate rules where applicable</li>
              </ul>

              <h2 className="text-2xl font-semibold mb-4 mt-8">8. Data Subject Rights Support</h2>
              <p className="mb-4">
                We will assist Controllers in fulfilling data subject rights requests:
              </p>
              <ul className="list-disc pl-6 mb-4">
                <li><strong>Right of Access:</strong> Provide data extraction tools and reports</li>
                <li><strong>Right to Rectification:</strong> Enable data correction through user interfaces</li>
                <li><strong>Right to Erasure:</strong> Provide data deletion capabilities</li>
                <li><strong>Right to Portability:</strong> Export data in structured, machine-readable formats</li>
                <li><strong>Right to Restrict Processing:</strong> Implement processing limitations</li>
              </ul>

              <h2 className="text-2xl font-semibold mb-4 mt-8">9. Audits and Compliance</h2>
              <ul className="list-disc pl-6 mb-4">
                <li>Annual third-party security audits and penetration testing</li>
                <li>SOC 2 Type II compliance certification</li>
                <li>Regular internal compliance assessments</li>
                <li>Audit reports available upon reasonable request</li>
                <li>On-site audits permitted with reasonable notice</li>
              </ul>

              <h2 className="text-2xl font-semibold mb-4 mt-8">10. Data Breach Notification</h2>
              <p className="mb-4">
                In the event of a personal data breach, we will:
              </p>
              <ul className="list-disc pl-6 mb-4">
                <li>Notify the Controller without undue delay (within 72 hours when feasible)</li>
                <li>Provide available information about the breach and affected data</li>
                <li>Assist in breach assessment and regulatory notification</li>
                <li>Implement immediate containment and remediation measures</li>
                <li>Conduct post-incident analysis and implement preventive measures</li>
              </ul>

              <h2 className="text-2xl font-semibold mb-4 mt-8">11. Termination</h2>
              <p className="mb-4">
                Upon termination of services:
              </p>
              <ul className="list-disc pl-6 mb-4">
                <li>All personal data will be returned or securely deleted as instructed</li>
                <li>Data deletion will be completed within 30 days unless legal obligations require retention</li>
                <li>Certificates of deletion will be provided upon request</li>
                <li>All copies and backups will be securely destroyed</li>
              </ul>

              <h2 className="text-2xl font-semibold mb-4 mt-8">12. Contact Information</h2>
              <div className="bg-muted p-4 rounded-lg">
                <p><strong>Data Protection Officer</strong></p>
                <p>Email: dpo@yourplatform.com</p>
                <p>Phone: +1 (555) 123-4567</p>
                <p>Address: [Your Company Address]</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DataProcessingAgreement;
