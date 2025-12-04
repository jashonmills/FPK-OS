import { useNavigate } from "react-router-dom";
import NavMenu from "./NavMenu";

const Header = () => {
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-30 w-full border-b border-white/10 bg-white/70 backdrop-blur-lg">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-6 px-6 py-4">
        <div className="flex items-center gap-2 text-lg font-semibold tracking-tight text-slate-900">
          <span className="rounded-full bg-slate-900 px-2 py-1 text-xs font-bold uppercase text-white">
            FPK
          </span>
          <span className="text-sm text-slate-600">OS Ecosystem</span>
        </div>

        <NavMenu />

        <div className="flex items-center gap-3">
          <button
            className="rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-300 hover:bg-white"
            onClick={() => navigate("/access?tab=signin")}
          >
            Login
          </button>
          <button
            className="rounded-full bg-slate-900 px-5 py-2 text-sm font-semibold text-white shadow-lg shadow-slate-900/10 transition hover:-translate-y-0.5 hover:bg-slate-800"
            onClick={() => navigate("/access")}
          >
            Sign Up
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
