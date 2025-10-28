import { useState, useEffect } from "react";
import { Header } from "./components/Header";
import { Footer } from "./components/Footer";
import { HomePage } from "./pages/HomePage";
import { AboutPage } from "./pages/AboutPage";
import { PublicationsPage } from "./pages/PublicationsPage";
import { SubmitPage } from "./pages/SubmitPage";
import { AboutUsPage } from "./pages/AboutUsPage";

export default function App() {
  const [darkMode, setDarkMode] = useState(true);
  const [currentPage, setCurrentPage] = useState("home");

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  const handleNavigation = (page: string) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderPage = () => {
    switch (currentPage) {
      case "home":
        return <HomePage onNavigate={handleNavigation} />;
      case "about":
        return <AboutPage />;
      case "publications":
        return <PublicationsPage />;
      case "submit":
        return <SubmitPage />;
      case "about-us":
        return <AboutUsPage />;
      default:
        return <HomePage onNavigate={handleNavigation} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col overflow-x-hidden">
      <Header 
        darkMode={darkMode} 
        setDarkMode={setDarkMode}
        currentPage={currentPage}
        onNavigate={handleNavigation}
      />
      <main className="flex-1">
        {renderPage()}
      </main>
      <Footer onNavigate={handleNavigation} />
    </div>
  );
}
