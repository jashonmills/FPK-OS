import fpkLogo from '@/assets/fpk-nexus-logo.png';

export const LandingFooter = () => {
  return (
    <footer className="border-t bg-background py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-3">
            <img src={fpkLogo} alt="FPK Nexus" className="h-8 w-auto" />
            <p>© 2025 FPK Nexus. All Rights Reserved.</p>
          </div>
          
          <nav className="flex flex-wrap justify-center gap-4 md:gap-6">
            <a 
              href="#" 
              className="hover:text-primary transition-colors"
              onClick={(e) => e.preventDefault()}
            >
              Community Guidelines
            </a>
            <a 
              href="#" 
              className="hover:text-primary transition-colors"
              onClick={(e) => e.preventDefault()}
            >
              Privacy Policy
            </a>
            <a 
              href="#" 
              className="hover:text-primary transition-colors"
              onClick={(e) => e.preventDefault()}
            >
              Terms of Service
            </a>
            <a 
              href="#" 
              className="hover:text-primary transition-colors"
              onClick={(e) => e.preventDefault()}
            >
              Contact Us
            </a>
          </nav>
        </div>
      </div>
    </footer>
  );
};
