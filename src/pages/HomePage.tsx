import { ArticleCard } from "../components/ArticleCard";
import { Hero } from "../components/Hero";
import { Button } from "../components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { ArrowRight } from "lucide-react";

interface HomePageProps {
  onNavigate: (path: string) => void;
}

export function HomePage({ onNavigate }: HomePageProps) {
  const featuredArticle = {
    title: "The Digital Frontier: Examining Privacy Rights in the Age of Artificial Intelligence",
    abstract: "This comprehensive analysis explores the intersection of constitutional privacy protections and emerging AI technologies. Through comparative analysis of recent case law and regulatory frameworks across jurisdictions, we propose a modernized approach to privacy rights that balances innovation with fundamental civil liberties.",
    author: "Sarah Chen",
    category: "Constitutional Law",
    readTime: "12 min read",
    imageUrl: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsZWdhbCUyMGRvY3VtZW50c3xlbnwxfHx8fDE3NjE1MzQzOTl8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
  };

  const recentArticles = [
    {
      title: "Climate Change Litigation and State Responsibility",
      abstract: "An examination of emerging trends in climate litigation and the evolving doctrine of state responsibility under international law.",
      author: "Marcus Johnson",
      category: "Environmental Law",
      readTime: "8 min read",
      imageUrl: "https://images.unsplash.com/photo-1619806677949-cbae91e82cea?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBjb3VydGhvdXNlfGVufDF8fHx8MTc2MTYwMDg2NXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    },
    {
      title: "Corporate Governance in the Tech Industry: A Regulatory Analysis",
      abstract: "Exploring the regulatory challenges and governance structures unique to technology companies in the modern economy.",
      author: "Emily Rodriguez",
      category: "Corporate Law",
      readTime: "10 min read",
      imageUrl: "https://images.unsplash.com/photo-1701790644702-292e25180524?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsZWdhbCUyMGJvb2tzJTIwbGlicmFyeXxlbnwxfHx8fDE3NjE1NTAxMTJ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    },
    {
      title: "Criminal Justice Reform: Evidence-Based Policy Recommendations",
      abstract: "A data-driven approach to criminal justice reform, analyzing successful interventions and policy implications.",
      author: "James Thompson",
      category: "Criminal Law",
      readTime: "15 min read",
      imageUrl: "https://images.unsplash.com/photo-1701790644702-292e25180524?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsYXclMjBib29rcyUyMGRlc2t8ZW58MXx8fHwxNzYxNjAwODY1fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    },
    {
      title: "Intellectual Property in the Digital Age",
      abstract: "Navigating the complexities of copyright, patent, and trademark law in an increasingly digital marketplace.",
      author: "Priya Patel",
      category: "IP Law",
      readTime: "9 min read",
      imageUrl: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsZWdhbCUyMGRvY3VtZW50c3xlbnwxfHx8fDE3NjE1MzQzOTl8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    },
    {
      title: "International Human Rights and Transnational Advocacy",
      abstract: "Assessing the impact of transnational advocacy networks on human rights enforcement mechanisms.",
      author: "Alexandra Kim",
      category: "International Law",
      readTime: "11 min read",
      imageUrl: "https://images.unsplash.com/photo-1619806677949-cbae91e82cea?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBjb3VydGhvdXNlfGVufDF8fHx8MTc2MTYwMDg2NXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    },
  ];

  return (
    <>
      <Hero />

      {/* Featured Article */}
      <section className="py-16 border-b">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="mb-2">Featured Article</h2>
              <p className="text-muted-foreground">
                Editor's pick from our latest issue
              </p>
            </div>
          </div>
          <ArticleCard {...featuredArticle} featured />
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

          <Tabs defaultValue="all" className="mb-6">
            <TabsList className="flex items-center gap-8">
              <TabsTrigger value="all" className="p-0 font-medium text-muted-foreground hover:text-foreground data-[state=active]:text-foreground bg-transparent hover:bg-transparent">All</TabsTrigger>
              <TabsTrigger value="constitutional" className="p-0 font-medium text-muted-foreground hover:text-foreground data-[state=active]:text-foreground bg-transparent hover:bg-transparent">Constitutional</TabsTrigger>
              <TabsTrigger value="corporate" className="p-0 font-medium text-muted-foreground hover:text-foreground data-[state=active]:text-foreground bg-transparent hover:bg-transparent">Corporate</TabsTrigger>
              <TabsTrigger value="criminal" className="p-0 font-medium text-muted-foreground hover:text-foreground data-[state=active]:text-foreground bg-transparent hover:bg-transparent">Criminal</TabsTrigger>
              <TabsTrigger value="international" className="p-0 font-medium text-muted-foreground hover:text-foreground data-[state=active]:text-foreground bg-transparent hover:bg-transparent">International</TabsTrigger>
            </TabsList>
            <TabsContent value="all" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {recentArticles.map((article, index) => (
                  <ArticleCard key={index} {...article} />
                ))}
              </div>
            </TabsContent>
            <TabsContent value="constitutional" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <ArticleCard {...recentArticles[0]} />
              </div>
            </TabsContent>
            <TabsContent value="corporate" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <ArticleCard {...recentArticles[1]} />
              </div>
            </TabsContent>
            <TabsContent value="criminal" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <ArticleCard {...recentArticles[2]} />
              </div>
            </TabsContent>
            <TabsContent value="international" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <ArticleCard {...recentArticles[4]} />
              </div>
            </TabsContent>
          </Tabs>

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

      {/* Call to Action */}
      <section className="py-20 border-b bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="mb-4">Submit Your Research</h2>
            <p className="text-lg text-muted-foreground mb-8">
              We welcome submissions from undergraduate students across all legal disciplines. 
              Our peer-review process ensures rigorous academic standards while fostering the next generation of legal scholars.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button 
                size="lg" 
                className="group"
                onClick={() => onNavigate('submit')}
              >
                View Submission Guidelines
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                onClick={() => onNavigate('contact')}
              >
                Contact Editorial Board
              </Button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
