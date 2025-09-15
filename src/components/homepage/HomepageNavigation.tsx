import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';

const HomepageNavigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navLinks = [
    { label: 'Courses', href: '/courses' },
    { label: 'Empowering Learning', href: 'https://empoweringlearning.fpkadapt.com/', external: true },
    { label: 'Learning Portal', href: '/dashboard/learner' },
    { label: 'Games', href: 'https://fpk-games.lovable.app/', external: true },
    { 
      label: 'Organizations', 
      href: '/organizations',
      dropdown: [
        { label: 'Create Organization', href: '/organization-signup' },
        { label: 'Join with Invite Code', href: '/join' }
      ]
    },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/70 backdrop-blur-md border-b border-white/20 shadow-sm w-full">
      <div className="w-full px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-12 h-12 rounded-lg overflow-hidden flex items-center justify-center bg-white/10">
              <img 
                src="/lovable-uploads/aee2697b-9823-4ce1-974d-680b18c2921f.png" 
                alt="FPK University Logo" 
                className="w-full h-full object-cover rounded-lg"
              />
            </div>
            <span className="text-xl font-bold text-slate-900">FPK University</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              link.dropdown ? (
                <div key={link.label} className="relative group">
                  <button className="text-slate-700 hover:text-fpk-orange transition-colors duration-200 font-medium flex items-center gap-1">
                    {link.label}
                    <span className="text-xs">▼</span>
                  </button>
                  <div className="absolute top-full left-0 bg-white rounded-lg shadow-lg border p-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 min-w-48">
                    {link.dropdown.map((item) => (
                      <Link
                        key={item.href}
                        to={item.href}
                        className="block px-3 py-2 text-slate-700 hover:text-fpk-orange hover:bg-gray-50 rounded transition-colors text-sm whitespace-nowrap"
                      >
                        {item.label}
                      </Link>
                    ))}
                  </div>
                </div>
              ) : link.external ? (
                <a
                  key={link.href}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-700 hover:text-fpk-orange transition-colors duration-200 font-medium"
                >
                  {link.label}
                </a>
              ) : (
                <Link
                  key={link.href}
                  to={link.href}
                  className="text-slate-700 hover:text-fpk-orange transition-colors duration-200 font-medium"
                >
                  {link.label}
                </Link>
              )
            ))}
            <Button 
              asChild 
              className="bg-fpk-orange hover:bg-fpk-orange/90 text-white px-6 py-2 rounded-lg"
            >
              <Link to="/login">Sign Up</Link>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <div className="flex flex-col space-y-3">
              {navLinks.map((link) => (
                link.dropdown ? (
                  <div key={link.label} className="space-y-2">
                    <div className="text-slate-700 font-medium py-2">
                      {link.label}
                    </div>
                    <div className="ml-4 space-y-2">
                      {link.dropdown.map((item) => (
                        <Link
                          key={item.href}
                          to={item.href}
                          className="block text-slate-700 hover:text-fpk-orange transition-colors duration-200 py-2"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          {item.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                ) : link.external ? (
                  <a
                    key={link.href}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-slate-700 hover:text-fpk-orange transition-colors duration-200 font-medium py-2"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {link.label}
                  </a>
                ) : (
                  <Link
                    key={link.href}
                    to={link.href}
                    className="text-slate-700 hover:text-fpk-orange transition-colors duration-200 font-medium py-2"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {link.label}
                  </Link>
                )
              ))}
              <Button 
                asChild 
                className="bg-fpk-orange hover:bg-fpk-orange/90 text-white w-full mt-4"
              >
                <Link to="/login" onClick={() => setIsMenuOpen(false)}>Sign Up</Link>
              </Button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default HomepageNavigation;