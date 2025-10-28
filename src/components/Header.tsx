import { Search, Menu, Moon, Sun } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

interface HeaderProps {
  darkMode: boolean;
  setDarkMode: (value: boolean) => void;
  currentPage: string;
  onNavigate: (page: string) => void;
}

export function Header({ darkMode, setDarkMode, currentPage, onNavigate }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <button 
            onClick={() => onNavigate('home')}
            className="flex items-center gap-2 hover:opacity-80 transition-opacity"
          >
            <div className="h-8 w-8 rounded bg-primary" />
            <div className="flex flex-col text-left">
              <span className="tracking-tight">UCLA</span>
              <span className="text-xs text-muted-foreground tracking-tight">Law Journal</span>
            </div>
          </button>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <button 
              onClick={() => onNavigate('about')}
              className={`text-sm transition-colors hover:text-primary ${currentPage === 'about' ? 'text-primary' : ''}`}
            >
              About
            </button>
            <button 
              onClick={() => onNavigate('publications')}
              className={`text-sm transition-colors hover:text-primary ${currentPage === 'publications' ? 'text-primary' : ''}`}
            >
              Publications
            </button>
            <button 
              onClick={() => onNavigate('submit')}
              className={`text-sm transition-colors hover:text-primary ${currentPage === 'submit' ? 'text-primary' : ''}`}
            >
              Submit
            </button>
            <button 
              onClick={() => onNavigate('about-us')}
              className={`text-sm transition-colors hover:text-primary ${currentPage === 'about-us' ? 'text-primary' : ''}`}
            >
              About Us
            </button>
          </nav>

          {/* Search & CTA */}
          <div className="hidden md:flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search articles..."
                className="w-[200px] pl-8"
              />
            </div>
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
            <Button size="sm" onClick={() => onNavigate('submit')}>Submit Article</Button>
          </div>

          {/* Mobile Menu & Theme Toggle */}
          <div className="flex items-center gap-2 md:hidden">
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
            <Button variant="ghost" size="icon">
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
