import {
  Users,
  FileText,
  ChevronRight,
} from "lucide-react";
import { cn } from "../ui/utils";
import { useNavigate, useLocation } from "react-router-dom";

const navigation = [
  { name: "Submissions", href: "/admin/submissions", icon: FileText },
  { name: "Users", href: "/admin/users", icon: Users },
];

interface AdminLayoutProps {
  children: React.ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
      {/* Sidebar */}
      <div className="hidden md:flex md:w-64 md:flex-col">
        <div className="flex flex-col flex-grow pt-5 overflow-y-auto border-r bg-white dark:bg-gray-800">
          <div className="flex items-center flex-shrink-0 px-4">
            <span className="text-xl font-semibold">Admin Dashboard</span>
          </div>
          <div className="mt-5 flex-1 flex flex-col">
            <nav className="flex-1 px-2 pb-4 space-y-1">
              {navigation.map((item) => (
                <button
                  key={item.name}
                  onClick={() => navigate(item.href)}
                  className={cn(
                    "group flex items-center px-2 py-2 text-sm font-medium rounded-md w-full",
                    location.pathname === item.href
                      ? "bg-gray-100 dark:bg-gray-900 text-primary"
                      : "text-gray-600 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-700"
                  )}
                >
                  <item.icon className="mr-3 flex-shrink-0 h-6 w-6" />
                  {item.name}
                  <ChevronRight
                    className={cn(
                      "ml-auto h-5 w-5 transform transition-transform duration-200",
                      location.pathname === item.href ? "rotate-90" : ""
                    )}
                  />
                </button>
              ))}
            </nav>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex flex-col flex-1">
        <main className="flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-900">
          <div className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
            </div>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}