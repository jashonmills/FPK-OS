import { Github, Linkedin, Twitter } from "lucide-react";
import { Link } from "react-router-dom";

const solutions = [
  { name: "Schools & Universities", href: "/solutions/education" },
  { name: "Therapy Centers & Clinics", href: "/solutions/therapy" },
  { name: "Parents & Families", href: "/solutions/parents" },
  { name: "Businesses & Teams", href: "/solutions/business" },
  { name: "Individuals", href: "/solutions/individuals" },
  { name: "Libraries & Communities", href: "/solutions/libraries" },
];

const company = [
  { name: "About Us", href: "/about" },
  { name: "Careers", href: "/careers" },
  { name: "Contact", href: "/contact" },
  { name: "Blog", href: "/blog" },
];

const legal = [
  { name: "Privacy Policy", href: "/privacy" },
  { name: "Terms of Service", href: "/terms" },
];

const Footer = () => {
  return (
    <footer className="bg-slate-900 text-white">
      <div className="mx-auto max-w-6xl px-6 py-12">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4 lg:grid-cols-5">
          <div className="col-span-2 lg:col-span-1">
            <div className="mb-4 flex items-center">
              <div className="mr-2 flex h-8 w-8 items-center justify-center rounded-lg bg-white text-xs font-bold uppercase text-slate-900">
                FPK
              </div>
              <span className="text-xl font-bold">FPK OS</span>
            </div>
            <p className="text-sm text-slate-400">
              The Future-Proof Knowledge Operating System.
            </p>
          </div>

          <div>
            <h3 className="font-semibold uppercase tracking-wider">Solutions</h3>
            <ul className="mt-4 space-y-2">
              {solutions.map((item) => (
                <li key={item.name}>
                  <Link
                    to={item.href}
                    className="text-sm text-slate-400 transition hover:text-white"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold uppercase tracking-wider">Company</h3>
            <ul className="mt-4 space-y-2">
              {company.map((item) => (
                <li key={item.name}>
                  <Link
                    to={item.href}
                    className="text-sm text-slate-400 transition hover:text-white"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold uppercase tracking-wider">Legal</h3>
            <ul className="mt-4 space-y-2">
              {legal.map((item) => (
                <li key={item.name}>
                  <Link
                    to={item.href}
                    className="text-sm text-slate-400 transition hover:text-white"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-slate-800 pt-8 md:flex-row">
          <p className="text-sm text-slate-500">
            &copy; {new Date().getFullYear()} FPK OS, Inc. All rights reserved.
          </p>
          <div className="flex space-x-6 text-slate-500">
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="transition hover:text-white"
            >
              <Twitter className="h-5 w-5" />
            </a>
            <a
              href="https://github.com/jashonmills/FPK-OS"
              target="_blank"
              rel="noopener noreferrer"
              className="transition hover:text-white"
            >
              <Github className="h-5 w-5" />
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="transition hover:text-white"
            >
              <Linkedin className="h-5 w-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
