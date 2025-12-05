import type { ReactNode } from "react";
import { ChevronDown } from "lucide-react";
import { Link } from "react-router-dom";

const Header = () => {
  return (
    <header className="bg-white/90 backdrop-blur-sm sticky top-0 z-50 border-b">
      <nav className="max-w-7xl mx-auto px-6 flex justify-between items-center h-16">
        <Link to="/" className="text-2xl font-bold text-slate-800">
          FPK <span className="text-indigo-600">OS</span>
        </Link>

        <ul className="hidden md:flex items-center gap-8">
          <li>
            <Link to="/" className="text-sm font-medium hover:text-indigo-600">
              Home
            </Link>
          </li>

          <li className="group relative">
            <button className="flex items-center gap-1 text-sm font-medium hover:text-indigo-600 py-4">
              Products <ChevronDown className="h-4 w-4 transition-transform group-hover:rotate-180" />
            </button>
            <div className="absolute top-full left-1/2 -translate-x-1/2 pt-4 opacity-0 group-hover:opacity-100 transition-opacity invisible group-hover:visible">
              <div className="w-72 bg-white border rounded-lg shadow-lg">
                <div className="p-4 hover:bg-slate-50">
                  <Link to="/university" className="font-semibold text-slate-800">
                    FPK University
                  </Link>
                  <p className="text-xs text-slate-500">The Action Engine for learning.</p>
                  <ul className="mt-2 text-sm space-y-1 pl-2 border-l">
                    <li>
                      <Link to="/university/institutions" className="hover:text-indigo-600">
                        For Educational Institutions
                      </Link>
                    </li>
                    <li>
                      <Link to="/university/individuals" className="hover:text-indigo-600">
                        For Individuals
                      </Link>
                    </li>
                  </ul>
                </div>
                <hr />

                <div className="p-4 hover:bg-slate-50">
                  <Link to="/fkpx" className="font-semibold text-slate-800">
                    FPK-X
                  </Link>
                  <p className="text-xs text-slate-500">The Insight Engine for therapy & data.</p>
                  <ul className="mt-2 text-sm space-y-1 pl-2 border-l">
                    <li>
                      <Link to="/fkpx/agencies" className="hover:text-indigo-600">
                        For Therapy Centers & Agencies
                      </Link>
                    </li>
                    <li>
                      <Link to="/fkpx/individuals" className="hover:text-indigo-600">
                        For Parents & Individuals
                      </Link>
                    </li>
                  </ul>
                </div>
                <hr />

                <div className="p-4 hover:bg-slate-50">
                  <Link to="/pulse" className="font-semibold text-slate-800">
                    FPK Pulse
                  </Link>
                  <p className="text-xs text-slate-500">The Operations Engine for projects.</p>
                  <ul className="mt-2 text-sm space-y-1 pl-2 border-l">
                    <li>
                      <Link to="/pulse/businesses" className="hover:text-indigo-600">
                        For Businesses & Organizations
                      </Link>
                    </li>
                    <li>
                      <Link to="/pulse/individuals" className="hover:text-indigo-600">
                        For Individuals
                      </Link>
                    </li>
                  </ul>
                </div>
                <hr />

                <div className="p-4 hover:bg-slate-50">
                  <Link to="/nexus" className="font-semibold text-slate-800">
                    FPK Nexus
                  </Link>
                  <p className="text-xs text-slate-500">The private social & community platform.</p>
                  <ul className="mt-2 text-sm space-y-1 pl-2 border-l">
                    <li>
                      <Link to="/nexus/organizations" className="hover:text-indigo-600">
                        For Organizations
                      </Link>
                    </li>
                    <li>
                      <Link to="/nexus/individuals" className="hover:text-indigo-600">
                        For Individuals
                      </Link>
                    </li>
                  </ul>
                </div>
                <hr />

                <div className="p-4 grid grid-cols-2 gap-4">
                  <div>
                    <Link to="/library-portal" className="font-semibold text-slate-800">
                      Library Portal
                    </Link>
                    <p className="text-xs text-slate-500">Free & paid resources for libraries.</p>
                  </div>
                  <div>
                    <Link to="/ai-study-coach" className="font-semibold text-slate-800">
                      AI Study Coach
                    </Link>
                    <p className="text-xs text-slate-500">Standalone B2C & B2B interface.</p>
                  </div>
                </div>
              </div>
            </div>
          </li>

          <li>
            <Link to="/pricing" className="text-sm font-medium hover:text-indigo-600">
              Pricing
            </Link>
          </li>
        </ul>

        <div className="flex items-center gap-4">
          <Link to="/login" className="text-sm font-medium hover:text-indigo-600">
            Login
          </Link>
          <Link to="/signup">
            <Button>Sign Up</Button>
          </Link>
        </div>
      </nav>
    </header>
  );
};

const Button = ({ children }: { children: ReactNode }) => (
  <button className="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-indigo-700">
    {children}
  </button>
);

export default Header;
