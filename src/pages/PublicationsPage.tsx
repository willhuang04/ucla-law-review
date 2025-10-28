import { useState } from "react";
import { ArticleCard } from "../components/ArticleCard";
import { Input } from "../components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Search } from "lucide-react";

export function PublicationsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");

  const allArticles = [
    {
      title: "The Digital Frontier: Examining Privacy Rights in the Age of Artificial Intelligence",
      abstract: "This comprehensive analysis explores the intersection of constitutional privacy protections and emerging AI technologies.",
      author: "Sarah Chen",
      category: "Civil",
      readTime: "12 min read",
      imageUrl: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsZWdhbCUyMGRvY3VtZW50c3xlbnwxfHx8fDE3NjE1MzQzOTl8MA&ixlib=rb-4.1.0&q=80&w=1080",
    },
    {
      title: "Climate Change Litigation and State Responsibility",
      abstract: "An examination of emerging trends in climate litigation and the evolving doctrine of state responsibility under international law.",
      author: "Marcus Johnson",
      category: "Environmental",
      readTime: "8 min read",
      imageUrl: "https://images.unsplash.com/photo-1619806677949-cbae91e82cea?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBjb3VydGhvdXNlfGVufDF8fHx8MTc2MTYwMDg2NXww&ixlib=rb-4.1.0&q=80&w=1080",
    },
    {
      title: "Administrative Procedure and Regulatory Compliance in Financial Markets",
      abstract: "Exploring the administrative law framework governing financial regulation and the challenges of regulatory compliance.",
      author: "Emily Rodriguez",
      category: "Administrative",
      readTime: "10 min read",
      imageUrl: "https://images.unsplash.com/photo-1701790644702-292e25180524?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsZWdhbCUyMGJvb2tzJTIwbGlicmFyeXxlbnwxfHx8fDE3NjE1NTAxMTJ8MA&ixlib=rb-4.1.0&q=80&w=1080",
    },
    {
      title: "Criminal Justice Reform: Evidence-Based Policy Recommendations",
      abstract: "A data-driven approach to criminal justice reform, analyzing successful interventions and policy implications.",
      author: "James Thompson",
      category: "Criminal",
      readTime: "15 min read",
      imageUrl: "https://images.unsplash.com/photo-1701790644702-292e25180524?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsYXclMjBib29rcyUyMGRlc2t8ZW58MXx8fHwxNzYxNjAwODY1fDA&ixlib=rb-4.1.0&q=80&w=1080",
    },
    {
      title: "Cybersecurity Law and National Defense Policy",
      abstract: "Navigating the legal framework for cybersecurity in critical infrastructure and its implications for national security.",
      author: "Priya Patel",
      category: "National Security",
      readTime: "9 min read",
      imageUrl: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsZWdhbCUyMGRvY3VtZW50c3xlbnwxfHx8fDE3NjE1MzQzOTl8MA&ixlib=rb-4.1.0&q=80&w=1080",
    },
    {
      title: "Intelligence Surveillance and Fourth Amendment Protections",
      abstract: "Assessing the balance between national security surveillance programs and constitutional privacy protections.",
      author: "Alexandra Kim",
      category: "National Security",
      readTime: "11 min read",
      imageUrl: "https://images.unsplash.com/photo-1619806677949-cbae91e82cea?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBjb3VydGhvdXNlfGVufDF8fHx8MTc2MTYwMDg2NXww&ixlib=rb-4.1.0&q=80&w=1080",
    },
  ];

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

        {/* Results */}
        <div className="mb-4 text-sm text-muted-foreground">
          Showing {filteredArticles.length} {filteredArticles.length === 1 ? 'article' : 'articles'}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredArticles.map((article, index) => (
            <ArticleCard key={index} {...article} />
          ))}
        </div>

        {filteredArticles.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No articles found matching your criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
}
