import { useState } from "react";
import { Link } from "react-router-dom";

const NavMenu = () => {
  const [open, setOpen] = useState(false);

  const toggle = () => setOpen((prev) => !prev);
  const close = () => setOpen(false);

  return (
    <nav className="hidden items-center gap-6 text-sm font-semibold text-slate-700 md:flex">
      <Link
        to="/"
        className="transition hover:text-slate-900 hover:underline underline-offset-4"
      >
        Home
      </Link>

      <div className="relative">
        <button
          type="button"
          onClick={toggle}
          className="flex items-center gap-2 rounded-full border border-transparent px-3 py-2 transition hover:border-slate-200 hover:bg-white"
        >
          Solutions
          <span className={`text-xs transition ${open ? "rotate-180" : ""}`}>
            ▼
          </span>
        </button>

        {open && (
          <div className="absolute left-0 top-full mt-2 w-72 rounded-xl border border-slate-200 bg-white shadow-xl shadow-slate-900/10">
            <div className="flex flex-col divide-y divide-slate-100">
              <Link
                to="/solutions/education"
                onClick={close}
                className="px-4 py-3 text-left text-sm font-semibold text-slate-800 transition hover:bg-slate-50"
              >
                For Schools & Universities
              </Link>
              <Link
                to="/solutions/therapy"
                onClick={close}
                className="px-4 py-3 text-left text-sm font-semibold text-slate-800 transition hover:bg-slate-50"
              >
                For Therapy Centers & Clinics
              </Link>
              <Link
                to="/solutions/parents"
                onClick={close}
                className="px-4 py-3 text-left text-sm font-semibold text-slate-800 transition hover:bg-slate-50"
              >
                For Parents & Families
              </Link>
              <Link
                to="/solutions/business"
                onClick={close}
                className="px-4 py-3 text-left text-sm font-semibold text-slate-800 transition hover:bg-slate-50"
              >
                For Businesses & Teams
              </Link>
              <Link
                to="/solutions/individuals"
                onClick={close}
                className="px-4 py-3 text-left text-sm font-semibold text-slate-800 transition hover:bg-slate-50"
              >
                For Individuals
              </Link>
              <Link
                to="/solutions/libraries"
                onClick={close}
                className="px-4 py-3 text-left text-sm font-semibold text-slate-800 transition hover:bg-slate-50"
              >
                For Libraries & Communities
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default NavMenu;
