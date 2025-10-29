import { Search, Menu, Moon, Sun } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { AuthCheck } from "./auth/AuthCheck";
import { useUser, useOrganization } from "@clerk/clerk-react";
import { isAdmin } from "./auth/AdminRoute";
import { useState, useEffect } from "react";

interface HeaderProps {
  darkMode: boolean;
  setDarkMode: (value: boolean) => void;
  currentPage: string;
  onNavigate: (path: string) => void;
}

export function Header({ darkMode, setDarkMode, currentPage, onNavigate }: HeaderProps) {
  const { isLoaded, isSignedIn, user } = useUser();
  const { organization, isLoaded: orgLoaded } = useOrganization();
  const [isOrgAdmin, setIsOrgAdmin] = useState(false);

  useEffect(() => {
    async function checkOrgAdmin() {
      if (!orgLoaded || !organization || !user) {
        setIsOrgAdmin(false);
        return;
      }
      
      try {
        const memberships = await organization.getMemberships();
        const userMembership = memberships.data.find((m: any) => 
          m.publicUserData?.userId === user.id ||
          m.publicUserData?.identifier === user.primaryEmailAddress?.emailAddress ||  
          m.publicUserData?.identifier === user.id ||
          m.userId === user.id
        );
        setIsOrgAdmin(userMembership?.role === "org:admin");
      } catch (error) {
        setIsOrgAdmin(false);
      }
    }

    checkOrgAdmin();
  }, [organization, orgLoaded, user]);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <button 
            onClick={() => onNavigate('/')}
            className="flex items-center gap-2 hover:opacity-80 transition-opacity"
          >
            <img 
              src="https://logos-world.net/wp-content/uploads/2021/11/University-of-California-Los-Angeles-UCLA-Emblem.png" 
              alt="UCLA Law Journal" 
              className="h-8 w-8 rounded object-contain"
            />
            <div className="flex flex-col text-left">
              <span className="tracking-tight">UCLA</span>
              <span className="text-xs text-muted-foreground tracking-tight">Undergraduate Law Review</span>
            </div>
          </button>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <button 
              onClick={() => onNavigate('/about')}
              className={`text-sm transition-colors hover:text-primary ${currentPage === '/about' ? 'text-primary' : ''}`}
            >
              About
            </button>
            <button 
              onClick={() => onNavigate('/publications')}
              className={`text-sm transition-colors hover:text-primary ${currentPage === '/publications' ? 'text-primary' : ''}`}
            >
              Publications
            </button>
            <button 
              onClick={() => onNavigate('/submit')}
              className={`text-sm transition-colors hover:text-primary ${currentPage === '/submit' ? 'text-primary' : ''}`}
            >
              Submit
            </button>
            <button 
              onClick={() => onNavigate('/about-us')}
              className={`text-sm transition-colors hover:text-primary ${currentPage === '/about-us' ? 'text-primary' : ''}`}
            >
              About Us
            </button>
            {isLoaded && isSignedIn && user && (isAdmin(user.id) || isOrgAdmin) && (
              <button 
                onClick={() => onNavigate('/admin')}
                className={`text-sm transition-colors hover:text-primary ${currentPage === '/admin' ? 'text-primary' : ''}`}
              >
                Admin
              </button>
            )}
          </nav>

          {/* Search, Auth & Theme */}
          <div className="flex items-center gap-4">
            <AuthCheck />
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setDarkMode(!darkMode)}
              aria-label="Toggle theme"
            >
              {darkMode ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </Button>
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
