
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Shield, ArrowLeft, Settings } from 'lucide-react';
import { Link } from 'react-router-dom';

const PrivacyDeclined = () => {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="max-w-2xl w-full">
        <CardContent className="p-8 text-center">
          <Shield className="h-16 w-16 text-muted-foreground mx-auto mb-6" />
          
          <h1 className="text-3xl font-bold mb-4">Privacy Settings Required</h1>
          
          <p className="text-muted-foreground mb-6 text-lg">
            We respect your privacy choices. However, some essential cookies are required 
            for our platform to function properly and provide you with basic services.
          </p>
          
          <div className="bg-muted p-4 rounded-lg mb-6 text-left">
            <h3 className="font-semibold mb-2">What this means:</h3>
            <ul className="text-sm space-y-1 list-disc list-inside">
              <li>You can still browse our public content and information pages</li>
              <li>Account creation and personalized features require essential cookies</li>
              <li>You can change your preferences at any time</li>
              <li>We only use cookies that are necessary for core functionality</li>
            </ul>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild>
              <Link to="/privacy-preferences">
                <Settings className="h-4 w-4 mr-2" />
                Review Privacy Settings
              </Link>
            </Button>
            
            <Button variant="outline" asChild>
              <Link to="/">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Homepage
              </Link>
            </Button>
          </div>
          
          <div className="mt-6 pt-6 border-t border-border">
            <p className="text-sm text-muted-foreground">
              Need help? Contact our privacy team at{' '}
              <a href="mailto:privacy@yourplatform.com" className="text-primary hover:underline">
                privacy@yourplatform.com
              </a>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PrivacyDeclined;
