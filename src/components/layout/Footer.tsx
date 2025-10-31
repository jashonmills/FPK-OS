import { Link } from 'react-router-dom';
import { Shield, FileText, Cookie, Trash2, Heart } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* About Section */}
          <div className="space-y-3">
            <h3 className="font-semibold text-foreground">FPK-X.com</h3>
            <p className="text-sm text-muted-foreground">
              Care coordination and progress tracking putting Parents in control.
            </p>
          </div>

          {/* Legal Links */}
          <div className="space-y-3">
            <h3 className="font-semibold text-foreground">Legal</h3>
            <nav className="flex flex-col space-y-2">
              <Link 
                to="/privacy-policy" 
                className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2"
              >
                <Shield className="h-4 w-4" />
                Privacy Policy
              </Link>
              <Link 
                to="/terms-of-service" 
                className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2"
              >
                <FileText className="h-4 w-4" />
                Terms of Service
              </Link>
              <Link 
                to="/cookie-policy" 
                className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2"
              >
                <Cookie className="h-4 w-4" />
                Cookie Policy
              </Link>
            </nav>
          </div>

          {/* Compliance Links */}
          <div className="space-y-3">
            <h3 className="font-semibold text-foreground">Compliance</h3>
            <nav className="flex flex-col space-y-2">
              <Link 
                to="/hipaa-notice" 
                className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2"
              >
                <Heart className="h-4 w-4" />
                HIPAA Notice
              </Link>
              <Link 
                to="/data-deletion" 
                className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2"
              >
                <Trash2 className="h-4 w-4" />
                Data Deletion
              </Link>
            </nav>
          </div>

          {/* Contact Info */}
          <div className="space-y-3">
            <h3 className="font-semibold text-foreground">Support</h3>
            <div className="text-sm text-muted-foreground space-y-1">
              <p>Need help?</p>
              <a 
                href="mailto:support@fpxcns.app" 
                className="hover:text-foreground transition-colors block"
              >
                support@fpxcns.app
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 pt-8 border-t">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} FPK-X.com. All rights reserved.
            </p>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span>HIPAA Compliant</span>
              <span>•</span>
              <span>GDPR Compliant</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};