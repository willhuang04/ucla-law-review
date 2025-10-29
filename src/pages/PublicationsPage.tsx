import { useState, useEffect } from "react";
import { ArticleCard } from "../components/ArticleCard";
import { Input } from "../components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Search } from "lucide-react";
import { supabase } from "../lib/supabase";
import type { Submission } from "../lib/supabase";

export function PublicationsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch approved submissions from database
  useEffect(() => {
    fetchApprovedSubmissions();
  }, []);

  async function fetchApprovedSubmissions() {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('submissions')
        .select('*')
        .eq('status', 'approved')
        .not('thumbnail_url', 'is', null)
        .not('pdf_url', 'is', null)
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      setSubmissions(data || []);
    } catch (err: any) {
      setError('Failed to load publications. Please try again later.');
      console.error('Failed to fetch publications:', err);
    } finally {
      setLoading(false);
    }
  }

  // Convert submissions to article format
  const allArticles = submissions.map(submission => ({
    title: submission.title,
    abstract: submission.abstract,
    author: submission.author_name,
    category: submission.area,
    readTime: "8 min read", // We'll calculate this later or make it dynamic
    imageUrl: submission.thumbnail_url || "",
    pdfUrl: submission.pdf_url || "",
    submissionId: submission.id,
    slug: submission.slug
  }));

  

  const filteredArticles = allArticles.filter(article => {
    const matchesSearch = article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         article.author.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === "all" || article.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12">
          <h1 className="mb-4">All Publications</h1>
          <p className="text-lg text-muted-foreground max-w-2xl">
            Browse our complete archive of peer-reviewed legal scholarship from undergraduate researchers.
          </p>
        </div>

        {/* Filters */}
        <div className="mb-8 flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search by title or author..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-full sm:w-[200px]">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="Administrative">Administrative</SelectItem>
              <SelectItem value="Civil">Civil</SelectItem>
              <SelectItem value="Criminal">Criminal</SelectItem>
              <SelectItem value="Environmental">Environmental</SelectItem>
              <SelectItem value="National Security">National Security</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Loading publications...</p>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="text-center py-12">
            <p className="text-red-600">{error}</p>
            <button 
              onClick={fetchApprovedSubmissions}
              className="mt-4 text-blue-600 hover:text-blue-800 underline"
            >
              Try again
            </button>
          </div>
        )}

        {/* Results */}
        {!loading && !error && (
          <>
            <div className="mb-4 text-sm text-muted-foreground">
              Showing {filteredArticles.length} {filteredArticles.length === 1 ? 'article' : 'articles'}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredArticles.map((article, index) => (
                <ArticleCard key={article.submissionId || index} {...article} />
              ))}
            </div>

            {filteredArticles.length === 0 && submissions.length === 0 && (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No published articles yet.</p>
                <p className="text-xs text-muted-foreground mt-2">Articles will appear here once they are approved by administrators.</p>
              </div>
            )}

            {filteredArticles.length === 0 && submissions.length > 0 && (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No articles found matching your criteria.</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
