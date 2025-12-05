import type { PropsWithChildren } from "react";
import { Link, useLocation } from "react-router-dom";
import { FileText, LayoutDashboard, LifeBuoy, Settings, Users } from "lucide-react";
import { ScrollArea } from "../components/ui/scroll-area";
import { cn } from "../components/ui/utils";

type NavItem = { name: string; href: string; icon: typeof LayoutDashboard };

const navigation: NavItem[] = [
  { name: "Dashboard", href: "/fkpx/dashboard", icon: LayoutDashboard },
  { name: "Students", href: "/fkpx/students", icon: Users },
  { name: "Documents", href: "/fkpx/documents", icon: FileText },
  { name: "Settings", href: "/fkpx/settings", icon: Settings },
];

export function FPKxLayout({ children }: PropsWithChildren) {
  const location = useLocation();
  const isActive = (href: string) => location.pathname.startsWith(href);

  return (
    <div className="flex h-screen bg-slate-50">
      <aside className="w-64 bg-indigo-950 text-white flex flex-col">
        <div className="p-4 border-b border-indigo-900">
          <h1 className="text-xl font-bold">FPKx</h1>
          <p className="text-xs text-indigo-300">Clinical Intelligence</p>
        </div>
        <ScrollArea className="flex-1">
          <nav className="p-4 space-y-2">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={cn(
                  "flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors",
                  isActive(item.href) ? "bg-indigo-800" : "hover:bg-indigo-900"
                )}
              >
                <item.icon className="h-5 w-5 mr-3" />
                {item.name}
              </Link>
            ))}
          </nav>
        </ScrollArea>
        <div className="p-4 border-t border-indigo-900">
          <Link
            to="#"
            className="flex items-center px-3 py-2 text-sm font-medium rounded-md hover:bg-indigo-900 transition-colors"
          >
            <LifeBuoy className="h-5 w-5 mr-3" />
            Support
          </Link>
        </div>
      </aside>
      <main className="flex-1 p-8 overflow-auto bg-slate-100">{children}</main>
    </div>
  );
}

export default FPKxLayout;
