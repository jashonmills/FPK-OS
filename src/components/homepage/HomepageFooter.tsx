import React from 'react';
import { Link } from 'react-router-dom';

const HomepageFooter = () => {
  const footerLinks = [
    { label: 'Privacy', href: '/privacy' },
    { label: 'Terms', href: '/terms' },
    { label: 'Contact', href: '/contact' }
  ];

  return (
    <footer className="py-12 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white/75 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-white/20">
          <div className="flex flex-col md:flex-row justify-between items-center">
            {/* Logo and Copyright */}
            <div className="flex items-center space-x-4 mb-6 md:mb-0">
              <div className="w-12 h-12 rounded-lg overflow-hidden bg-white/10">
                <img 
                  src="/lovable-uploads/aee2697b-9823-4ce1-974d-680b18c2921f.png" 
                  alt="FPK University Logo" 
                  className="w-full h-full object-cover rounded-lg"
                />
              </div>
              <div>
                <div className="text-lg font-bold text-slate-900">FPK University</div>
                <div className="text-sm text-slate-700">Built on the Empowering Learning model</div>
              </div>
            </div>
            
            {/* Footer Links */}
            <div className="flex items-center space-x-6">
              {footerLinks.map((link, index) => (
                <React.Fragment key={link.href}>
                  <Link
                    to={link.href}
                    className="text-slate-700 hover:text-orange-500 transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                  {index < footerLinks.length - 1 && (
                    <span className="text-slate-400">·</span>
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>
          
          <div className="mt-8 pt-6 border-t border-slate-200 text-center">
            <p className="text-sm text-slate-600">
              © 2025 FPK University | Empowering Learning by Olive Hickmott
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default HomepageFooter;