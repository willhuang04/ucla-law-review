import { useState, useEffect, useRef } from "react";
import { ArrowRight, Search, FileText, User } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import { supabase, type Submission } from "../lib/supabase";
import { useNavigate } from "react-router-dom";

export function Hero() {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Submission[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Debounced search effect
  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      if (searchQuery.trim().length >= 2) {
        performSearch(searchQuery.trim());
      } else {
        setSearchResults([]);
        setShowDropdown(false);
      }
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [searchQuery]);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  async function performSearch(query: string) {
    try {
      setIsSearching(true);
      
      const { data, error } = await supabase
        .from('submissions')
        .select('*')
        .eq('status', 'approved')
        .or(`title.ilike.%${query}%,author_name.ilike.%${query}%,abstract.ilike.%${query}%,area.ilike.%${query}%`)
        .order('created_at', { ascending: false })
        .limit(6);

      if (error) {
        console.error('Search error:', error);
        setSearchResults([]);
      } else {
        setSearchResults(data || []);
        setShowDropdown(true);
      }
    } catch (err) {
      console.error('Search failed:', err);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  }

  function handleSearchInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    setSearchQuery(e.target.value);
  }

  function handleSearchSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/publications?search=${encodeURIComponent(searchQuery.trim())}`);
      setShowDropdown(false);
    }
  }

  function handleResultClick(article: Submission) {
    const articlePath = article.slug ? `/article/${article.slug}` : `/article/${article.id}`;
    navigate(articlePath);
    setShowDropdown(false);
    setSearchQuery("");
  }

  function handleViewAllResults() {
    navigate(`/publications?search=${encodeURIComponent(searchQuery.trim())}`);
    setShowDropdown(false);
  }

  return (
  <section className="relative border-b">
      {/* Background image */}
      <div
        className="absolute inset-0 w-full h-full"
        style={{
          backgroundImage: `url('https://www.ppic.org/wp-content/uploads/2017/04/UCLACampusWithFountain.jpg')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          zIndex: 0
        }}
      />
      {/* Semi-transparent overlay */}
      <div
        className="absolute inset-0 bg-background/70 z-10"
      />

      <div className="container relative mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32 z-20">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          {/*
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border bg-background/50 backdrop-blur mb-6">
            <div className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
            <span className="text-xs">
              ISSN 9999-999X • Volume 12, 2025
            </span>
          </div>
          */}

          {/* Main heading */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl mb-6 tracking-tight">
            Undergraduate Student Law Review
            <br />
            <span className="text-muted-foreground">
              @ UCLA
            </span>
          </h1>

          <p className="text-lg text-muted-foreground mb-10 max-w-2xl mx-auto">
            Now accepting applications!
          </p>

          {/* Search bar with dropdown */}
          <div className="max-w-xl mx-auto mb-8" ref={searchRef}>
            <div className="relative w-full">
              <form onSubmit={handleSearchSubmit}>
                <div className="bg-white dark:bg-gray-950 rounded-full shadow-sm relative w-full">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search by topic, author, or keyword..."
                    className="h-14 pl-12 pr-32 bg-white dark:bg-gray-950 border-0 rounded-[2rem] focus-visible:ring-offset-0 w-full"
                    value={searchQuery}
                    onChange={handleSearchInputChange}
                    onFocus={() => searchQuery.trim().length >= 2 && searchResults.length > 0 && setShowDropdown(true)}
                  />
                  <button
                    type="submit"
                    className="absolute right-6 top-1/2 -translate-y-1/2 text-sm font-medium text-foreground cursor-pointer hover:text-primary"
                  >
                    Search
                  </button>
                </div>
              </form>

              {/* Search Dropdown */}
              {(showDropdown || searchQuery.length > 0) && (
                <div className="absolute left-0 right-0 top-full bg-white dark:bg-gray-950 border-2 border-gray-200 dark:border-gray-700 rounded-lg shadow-xl z-[100] max-h-96 overflow-y-auto min-h-[100px] w-full">
                {isSearching ? (
                  <div className="p-4 text-center">
                    <div className="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-primary mb-2"></div>
                    <p className="text-sm text-muted-foreground">Searching...</p>
                  </div>
                ) : searchResults.length > 0 ? (
                  <>
                    {searchResults.map((article) => (
                      <div
                        key={article.id}
                        className="p-4 hover:bg-muted/50 cursor-pointer border-b border-border last:border-b-0"
                        onClick={() => handleResultClick(article)}
                      >
                        <div className="flex items-start gap-3">
                          <FileText className="h-5 w-5 text-muted-foreground mt-0.5 flex-shrink-0" />
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-sm line-clamp-2 mb-1 text-center w-full">
                              {article.title}
                            </h4>
                            <div className="flex items-center gap-2 mb-2 justify-center text-center w-full">
                              <User className="h-3 w-3 text-muted-foreground" />
                              <span className="text-xs text-muted-foreground">
                                {article.author_name}
                              </span>
                              <Badge variant="outline" className="text-xs">
                                {article.area}
                              </Badge>
                            </div>
                            <p className="text-xs text-muted-foreground line-clamp-2">
                              {article.abstract}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                    {searchResults.length === 6 && (
                      <div className="p-3 border-t border-border">
                        <button
                          onClick={handleViewAllResults}
                          className="w-full text-sm text-primary hover:text-primary/80 font-medium"
                        >
                          View all results for "{searchQuery}"
                        </button>
                      </div>
                    )}
                  </>
                ) : searchQuery.trim().length >= 2 ? (
                  <div className="p-4 text-center">
                    <p className="text-sm text-muted-foreground">
                      No articles found for "{searchQuery}"
                    </p>
                  </div>
                ) : null}
              </div>
            )}
          </div>

          {/* CTA Buttons */}
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button size="lg" className="group" onClick={() => navigate('/publications')}>
              Read Latest Issue
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
            <Button size="lg" variant="outline" onClick={() => navigate('/submit')}>
              Submission Guidelines
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}