
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Shield, 
  Download, 
  Trash2, 
  Eye, 
  Lock, 
  AlertTriangle,
  CheckCircle,
  FileText,
  Clock
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

const DataProtectionCenter = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isExporting, setIsExporting] = useState(false);
  const [isDeletingAccount, setIsDeletingAccount] = useState(false);

  const handleDataExport = async () => {
    setIsExporting(true);
    try {
      // Implement data export functionality
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate API call
      toast({
        title: "Data Export Initiated",
        description: "Your data export will be ready within 24 hours. We'll email you when it's available.",
      });
    } catch (error) {
      toast({
        title: "Export Failed",
        description: "Unable to initiate data export. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsExporting(false);
    }
  };

  const handleAccountDeletion = async () => {
    if (!confirm("This action cannot be undone. All your data will be permanently deleted.")) {
      return;
    }

    setIsDeletingAccount(true);
    try {
      // Implement account deletion
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate API call
      toast({
        title: "Account Deletion Initiated",
        description: "Your account deletion request has been submitted. This process may take up to 30 days.",
      });
    } catch (error) {
      toast({
        title: "Deletion Failed",
        description: "Unable to process deletion request. Please contact support.",
        variant: "destructive",
      });
    } finally {
      setIsDeletingAccount(false);
    }
  };

  const dataCategories = [
    { name: "Profile Information", collected: "Yes", purpose: "Account management", retention: "As long as account is active" },
    { name: "Learning Progress", collected: "Yes", purpose: "Track progress and provide personalized experience", retention: "7 years" },
    { name: "Chat Messages", collected: "Yes", purpose: "Provide AI tutoring services", retention: "2 years" },
    { name: "Usage Analytics", collected: "Yes", purpose: "Improve service quality", retention: "3 years" },
    { name: "Payment Information", collected: "Partial", purpose: "Process subscriptions", retention: "As required by law" },
  ];

  const complianceFeatures = [
    { title: "Data Encryption", status: "Active", description: "All data encrypted at rest and in transit" },
    { title: "Access Controls", status: "Active", description: "Role-based access with audit trails" },
    { title: "Regular Audits", status: "Active", description: "Quarterly compliance and security audits" },
    { title: "Data Minimization", status: "Active", description: "Only collect necessary data" },
    { title: "Consent Management", status: "Active", description: "Granular consent tracking" },
  ];

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="text-center">
        <Shield className="h-12 w-12 text-primary mx-auto mb-4" />
        <h1 className="text-3xl font-bold">Data Protection Center</h1>
        <p className="text-muted-foreground mt-2">
          Manage your privacy settings and understand how we protect your data
        </p>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="data">Your Data</TabsTrigger>
          <TabsTrigger value="rights">Your Rights</TabsTrigger>
          <TabsTrigger value="compliance">Compliance</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  GDPR Compliant
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  We comply with the EU General Data Protection Regulation, 
                  ensuring your privacy rights are protected.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  HIPAA Ready
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Our infrastructure follows HIPAA guidelines for handling 
                  sensitive health and educational information.
                </p>
              </CardContent>
            </Card>
          </div>

          <Alert className="mt-4">
            <Shield className="h-4 w-4" />
            <AlertDescription>
              Your data is encrypted, regularly audited, and processed only for legitimate business purposes. 
              You have full control over your information.
            </AlertDescription>
          </Alert>
        </TabsContent>

        <TabsContent value="data">
          <Card>
            <CardHeader>
              <CardTitle>Data Collection Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-gray-200">
                  <thead>
                    <tr className="bg-muted">
                      <th className="border border-gray-200 p-2 text-left">Data Category</th>
                      <th className="border border-gray-200 p-2 text-left">Collected</th>
                      <th className="border border-gray-200 p-2 text-left">Purpose</th>
                      <th className="border border-gray-200 p-2 text-left">Retention</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dataCategories.map((category, index) => (
                      <tr key={index}>
                        <td className="border border-gray-200 p-2">{category.name}</td>
                        <td className="border border-gray-200 p-2">
                          <Badge variant={category.collected === 'Yes' ? 'default' : 'secondary'}>
                            {category.collected}
                          </Badge>
                        </td>
                        <td className="border border-gray-200 p-2 text-sm">{category.purpose}</td>
                        <td className="border border-gray-200 p-2 text-sm">{category.retention}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="rights">
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Download className="h-5 w-5" />
                  Export Your Data
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Download a copy of all your personal data in a portable format.
                </p>
                <Button onClick={handleDataExport} disabled={isExporting}>
                  {isExporting ? "Processing..." : "Request Data Export"}
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="h-5 w-5" />
                  Data Transparency
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  View details about what data we collect and how it's used.
                </p>
                <Button variant="outline" asChild>
                  <a href="/privacy-policy" target="_blank">View Privacy Policy</a>
                </Button>
              </CardContent>
            </Card>

            <Card className="border-destructive/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-destructive">
                  <Trash2 className="h-5 w-5" />
                  Delete Account
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Alert className="mb-4">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    This action is permanent and cannot be undone. All your data will be deleted.
                  </AlertDescription>
                </Alert>
                <Button 
                  variant="destructive" 
                  onClick={handleAccountDeletion}
                  disabled={isDeletingAccount}
                >
                  {isDeletingAccount ? "Processing..." : "Delete My Account"}
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="compliance">
          <div className="space-y-4">
            {complianceFeatures.map((feature, index) => (
              <Card key={index}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold">{feature.title}</h3>
                      <p className="text-sm text-muted-foreground">{feature.description}</p>
                    </div>
                    <Badge variant="default" className="bg-green-100 text-green-800">
                      {feature.status}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Compliance Documentation
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="outline" asChild className="w-full justify-start">
                  <a href="/privacy-policy" target="_blank">
                    <FileText className="h-4 w-4 mr-2" />
                    Privacy Policy
                  </a>
                </Button>
                <Button variant="outline" asChild className="w-full justify-start">
                  <a href="/terms-of-service" target="_blank">
                    <FileText className="h-4 w-4 mr-2" />
                    Terms of Service
                  </a>
                </Button>
                <Button variant="outline" asChild className="w-full justify-start">
                  <a href="/data-processing-agreement" target="_blank">
                    <FileText className="h-4 w-4 mr-2" />
                    Data Processing Agreement
                  </a>
                </Button>
                <Button variant="outline" asChild className="w-full justify-start">
                  <a href="/security-practices" target="_blank">
                    <Lock className="h-4 w-4 mr-2" />
                    Security Practices
                  </a>
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DataProtectionCenter;
