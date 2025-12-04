import { Link } from "react-router-dom";

const NavMenu = () => {
  return (
    <nav className="hidden items-center gap-6 text-sm font-semibold text-slate-700 md:flex">
      <Link
        to="/"
        className="transition hover:text-slate-900 hover:underline underline-offset-4"
      >
        Home
      </Link>
      <Link
        to="/solutions/education"
        className="transition hover:text-slate-900 hover:underline underline-offset-4"
      >
        Solutions
      </Link>
    </nav>
  );
};

export default NavMenu;
