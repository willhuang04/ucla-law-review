import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { ArrowLeft, ExternalLink, User } from "lucide-react";
import { supabase } from "../lib/supabase";
import { extractTextFromDOCX } from "../lib/docxUtils";
import type { Submission } from "../lib/supabase";

export function ArticlePage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [article, setArticle] = useState<Submission | null>(null);
  const [docxText, setDocxText] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [extractingText, setExtractingText] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      fetchArticle(id);
    }
  }, [id]);

  async function fetchArticle(articleIdOrSlug: string) {
    try {
      setLoading(true);
      
      // First try to fetch by slug
      let { data, error } = await supabase
        .from('submissions')
        .select('*')
        .eq('slug', articleIdOrSlug)
        .eq('status', 'approved')
        .single();

      // If not found by slug, try by ID (for backward compatibility)
      if (error && error.code === 'PGRST116') {
        ({ data, error } = await supabase
          .from('submissions')
          .select('*')
          .eq('id', articleIdOrSlug)
          .eq('status', 'approved')
          .single());
      }

      if (error) {
        console.error('Error fetching article:', error);
        setError(error.message || 'Article not found');
      } else if (data) {
        setArticle(data);
        if (data.docx_url) {
          extractDocxText(data.docx_url);
        }
      }
    } catch (err: any) {
      console.error('Failed to fetch article:', err);
      setError(err.message || 'Failed to load article');
    } finally {
      setLoading(false);
    }
  }

  async function extractDocxText(docxUrl: string) {
    try {
      setExtractingText(true);
      
      // Extract text using Mammoth.js
      const text = await extractTextFromDOCX(docxUrl);
      setDocxText(text || "No text could be extracted from this DOCX file.");
      
    } catch (err: any) {
      console.error('Failed to extract DOCX text:', err);
      setDocxText("Unable to extract text from DOCX file. Please view the original document using the link above.");
    } finally {
      setExtractingText(false);
    }
  }

  if (loading) {
    return (
      <div className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center py-12">
              <p className="text-muted-foreground">Loading article...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center py-12">
              <p className="text-red-600 mb-4">{error || 'Article not found'}</p>
              <Button onClick={() => navigate('/publications')} variant="outline">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Publications
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Back Button - Fixed at top */}
      <div className="border-b bg-background/95 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Button 
            onClick={() => navigate('/publications')} 
            variant="ghost" 
            size="sm"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Publications
          </Button>
        </div>
      </div>

      {/* NYT-style Article Layout */}
      <article className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Article Category & Metadata */}
        <div className="mb-6">
          <Badge variant="outline" className="mb-4 text-xs uppercase tracking-wide">
            {article.area}
          </Badge>
        </div>

        {/* Article Title */}
        <header className="mb-8">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6 text-foreground">
            {article.title}
          </h1>
        </header>

        {/* Hero Image - Full width of text column */}
        {article.thumbnail_url && (
          <figure className="mb-8">
            <img 
              src={article.thumbnail_url} 
              alt={article.title}
              className="w-full h-auto rounded-sm"
            />
            <figcaption className="text-sm text-muted-foreground mt-2 italic">
              Illustration for "{article.title}"
            </figcaption>
          </figure>
        )}

        {/* Author Info Section */}
        <div className="border-t border-b border-border py-6 mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center">
                  <User className="h-6 w-6 text-muted-foreground" />
                </div>
              </div>
              <div>
                <div className="font-medium text-foreground">By {article.author_name}</div>
                <div className="text-sm text-muted-foreground">{article.author_email}</div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-muted-foreground">
                {new Date(article.created_at).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </div>
              {article.pdf_url && (
                <Button asChild variant="outline" size="sm" className="mt-2">
                  <a 
                    href={article.pdf_url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                  >
                    <ExternalLink className="h-3 w-3 mr-1" />
                    DOCX
                  </a>
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Abstract - Above full text */}
        <div className="mb-8">
          <p className="text-xl md:text-2xl leading-relaxed text-muted-foreground font-light italic">
            {article.abstract}
          </p>
        </div>

        {/* Article Content */}
        <div className="prose prose-lg max-w-none">
          {extractingText ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-foreground mb-4"></div>
              <p className="text-muted-foreground">Loading article content...</p>
            </div>
          ) : (
            <div className="text-foreground leading-relaxed">
              {docxText ? (
                <div className="whitespace-pre-wrap text-lg leading-8">
                  {docxText}
                </div>
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  <p className="mb-4">Article text extraction is in progress.</p>
                  <p className="text-sm">Please check back shortly or view the original document.</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <footer className="mt-16 pt-8 border-t border-border">
          <div className="text-center text-sm text-muted-foreground">
            <p>Published in UCLA Law Review • {article.area}</p>
          </div>
        </footer>
      </article>
    </div>
  );
}