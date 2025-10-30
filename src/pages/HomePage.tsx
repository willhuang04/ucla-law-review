import { useState, useEffect } from "react";
import { ArticleCard } from "../components/ArticleCard";
import { Hero } from "../components/Hero";
import { Button } from "../components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { ArrowRight } from "lucide-react";
import { supabase, type Submission } from "../lib/supabase";

interface HomePageProps {
  onNavigate: (path: string) => void;
}

export function HomePage({ onNavigate }: HomePageProps) {
  const [featuredArticles, setFeaturedArticles] = useState<Submission[]>([]);
  const [currentFeaturedIndex, setCurrentFeaturedIndex] = useState(0);
  const [recentArticlesByCategory, setRecentArticlesByCategory] = useState<Record<string, Submission[]>>({});
  const [loading, setLoading] = useState(true);
  const [recentLoading, setRecentLoading] = useState(true);

  useEffect(() => {
    fetchFeaturedArticles();
    fetchRecentArticlesByCategory();
  }, []);

  useEffect(() => {
    // Auto-slide carousel every 5 seconds if there are multiple featured articles
    if (featuredArticles.length > 1) {
      const interval = setInterval(() => {
        setCurrentFeaturedIndex((prev) => (prev + 1) % featuredArticles.length);
      }, 2500);

      return () => clearInterval(interval);
    }
  }, [featuredArticles.length]);

  async function fetchFeaturedArticles() {
    try {
      const { data, error } = await supabase
        .from('submissions')
        .select('*')
        .eq('status', 'approved')
        .eq('featured', true)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching featured articles:', error);
      } else if (data && data.length > 0) {
        setFeaturedArticles(data);
      }
    } catch (err) {
      console.error('Error fetching featured articles:', err);
    } finally {
      setLoading(false);
    }
  }

  async function fetchRecentArticlesByCategory() {
    try {
      setRecentLoading(true);
  const categories = ['Administrative', 'Civil', 'Criminal', 'Environmental', 'National Security', 'NBA'];
      const articlesByCategory: Record<string, Submission[]> = {};

      // Fetch the 6 most recent articles for each category
      for (const category of categories) {
        const { data, error } = await supabase
          .from('submissions')
          .select('*')
          .eq('status', 'approved')
          .eq('area', category)
          .order('created_at', { ascending: false })
          .limit(6);

        if (error) {
          console.error(`Error fetching ${category} articles:`, error);
        } else if (data) {
          articlesByCategory[category] = data;
        }
      }

      setRecentArticlesByCategory(articlesByCategory);
    } catch (err) {
      console.error('Error fetching recent articles:', err);
    } finally {
      setRecentLoading(false);
    }
  }



  return (
    <>
            <Hero />

      {/* Featured Article */}
      <section className="py-16 border-b">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="mb-2">Featured Articles</h2>
              <p className="text-muted-foreground">
                Editor's picks from our latest issues
              </p>
            </div>
          </div>
          {loading ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">Loading featured articles...</p>
            </div>
          ) : featuredArticles.length > 0 ? (
            <div className="relative overflow-hidden">
              {/* Carousel Container with Fixed Height */}
              <div 
                className="flex transition-transform duration-500 ease-in-out h-[600px]"
                style={{ transform: `translateX(-${currentFeaturedIndex * 100}%)` }}
              >
                {featuredArticles.map((article) => (
                  <div key={article.id} className="w-full flex-shrink-0 h-full">
                    <div className="h-full">
                      <ArticleCard 
                        title={article.title}
                        abstract={article.abstract}
                        author={article.author_name}
                        category={article.area}
                        readTime="Featured Article"
                        imageUrl={article.thumbnail_url || ""}
                        submissionId={article.id}
                        slug={article.slug}
                        featured 
                      />
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Carousel Indicators */}
              {featuredArticles.length > 1 && (
                <div className="flex justify-center mt-4 space-x-2">
                  {featuredArticles.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentFeaturedIndex(index)}
                      className={`w-2 h-2 rounded-full transition-colors ${
                        index === currentFeaturedIndex 
                          ? 'bg-primary' 
                          : 'bg-muted-foreground/30'
                      }`}
                      aria-label={`Go to featured article ${index + 1}`}
                    />
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No featured articles available yet.</p>
              <p className="text-sm text-muted-foreground mt-2">Check back soon for featured content!</p>
            </div>
          )}
        </div>
      </section>

      {/* Recent Publications */}
      <section className="py-16 border-b">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="mb-2">Recent Publications</h2>
              <p className="text-muted-foreground">
                Latest peer-reviewed articles from our contributors
              </p>
            </div>
            <Button 
              variant="ghost" 
              className="group hidden sm:flex"
              onClick={() => onNavigate('publications')}
            >
              View All
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </div>

          {recentLoading ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">Loading recent publications...</p>
            </div>
          ) : (
            <Tabs defaultValue="Administrative" className="mb-6">
              <TabsList className="flex items-center gap-4">
                <TabsTrigger value="Administrative" className="p-0 font-medium text-muted-foreground hover:text-foreground data-[state=active]:text-foreground bg-transparent hover:bg-transparent">Administrative</TabsTrigger>
                <TabsTrigger value="Civil" className="p-0 font-medium text-muted-foreground hover:text-foreground data-[state=active]:text-foreground bg-transparent hover:bg-transparent">Civil</TabsTrigger>
                <TabsTrigger value="Criminal" className="p-0 font-medium text-muted-foreground hover:text-foreground data-[state=active]:text-foreground bg-transparent hover:bg-transparent">Criminal</TabsTrigger>
                <TabsTrigger value="Environmental" className="p-0 font-medium text-muted-foreground hover:text-foreground data-[state=active]:text-foreground bg-transparent hover:bg-transparent">Environmental</TabsTrigger>
                <TabsTrigger value="National Security" className="p-0 font-medium text-muted-foreground hover:text-foreground data-[state=active]:text-foreground bg-transparent hover:bg-transparent">National Security</TabsTrigger>
                <TabsTrigger value="NBA" className="p-0 font-medium text-muted-foreground hover:text-foreground data-[state=active]:text-foreground bg-transparent hover:bg-transparent">NBA</TabsTrigger>
              </TabsList>
              
              {Object.entries(recentArticlesByCategory).map(([category, articles]) => (
                <TabsContent key={category} value={category} className="mt-6">
                  <div className="mb-4">
                    <h3 className="text-lg font-semibold mb-2">{category} Law</h3>
                    <p className="text-sm text-muted-foreground">Latest {articles.length} articles in {category} Law</p>
                  </div>
                  {articles.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {articles.map((article) => (
                        <ArticleCard 
                          key={article.id}
                          title={article.title}
                          abstract={article.abstract}
                          author={article.author_name}
                          category={article.area}
                          readTime="Article"
                          imageUrl={article.thumbnail_url || ""}
                          submissionId={article.id}
                          slug={article.slug}
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <p>No articles available in {category} Law yet.</p>
                      <p className="text-sm mt-2">Check back soon for new publications!</p>
                    </div>
                  )}
                </TabsContent>
              ))}
            </Tabs>
          )}

          <Button 
            variant="ghost" 
            className="group w-full sm:hidden"
            onClick={() => onNavigate('publications')}
          >
            View All Articles
            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Button>
        </div>
      </section>
    </>
  );
}
