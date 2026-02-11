import { Menu, Moon, Sun } from "lucide-react";
import { AuthCheck } from "./auth/AuthCheck";
import { useUser, useOrganization } from "@clerk/clerk-react";
import { isAdmin } from "./auth/AdminRoute";
import { useState, useEffect } from "react";
import clubLogo from "../assets/clublogo.png";

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
            className="flex items-center gap-2 hover:opacity-80 transition-opacity flex-shrink-0"
          >
            <img 
              src={clubLogo} 
              alt="UCLA Law Journal" 
              className="h-10 w-auto rounded object-contain flex-shrink-0"
            />
            <div className="flex flex-col text-left">
              <span className="tracking-tight">Undergraduate Student Law Review</span>
              <span className="text-xs text-muted-foreground tracking-tight">@ UCLA</span>
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
          <div className="flex items-center gap-4 flex-shrink-0">
            <AuthCheck />
            <button
              onClick={() => setDarkMode(!darkMode)}
              aria-label="Toggle theme"
              className="p-2 hover:opacity-70 transition-opacity"
            >
              {darkMode ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </button>
            <button className="md:hidden p-2 hover:opacity-70 transition-opacity">
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
