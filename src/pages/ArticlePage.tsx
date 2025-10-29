import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { ArrowLeft, ExternalLink, User, Calendar } from "lucide-react";
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

  async function fetchArticle(articleId: string) {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('submissions')
        .select('*')
        .eq('id', articleId)
        .eq('status', 'approved')
        .single();

      if (error) {
        throw error;
      }

      if (!data) {
        throw new Error('Article not found');
      }

      setArticle(data);
      
      // Extract text from DOCX
      if (data.pdf_url) {
        await extractDocxText(data.pdf_url);
      }
      
    } catch (err: any) {
      setError(err.message || 'Failed to load article');
      console.error('Failed to fetch article:', err);
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
    <div className="py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Back Button */}
          <Button 
            onClick={() => navigate('/publications')} 
            variant="ghost" 
            className="mb-8"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Publications
          </Button>

          {/* Article Header */}
          <div className="mb-8">
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <Badge>{article.area}</Badge>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <User className="h-4 w-4" />
                  <span>{article.author_name}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <span>{new Date(article.created_at).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
            
            <h1 className="text-3xl md:text-4xl font-bold mb-4">{article.title}</h1>
            
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              {article.pdf_url && (
                <Button asChild>
                  <a 
                    href={article.pdf_url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    View Original DOCX
                  </a>
                </Button>
              )}
            </div>
          </div>

          {/* Article Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Abstract */}
              <Card className="p-6">
                <h2 className="text-xl font-semibold mb-4">Abstract</h2>
                <p className="text-muted-foreground leading-relaxed">
                  {article.abstract}
                </p>
              </Card>

              {/* DOCX Text Content */}
              <Card className="p-6">
                <h2 className="text-xl font-semibold mb-4">Full Text</h2>
                {extractingText ? (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">Extracting text from DOCX...</p>
                  </div>
                ) : (
                  <div className="prose max-w-none">
                    <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                      {docxText}
                    </p>
                  </div>
                )}
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Thumbnail */}
              {article.thumbnail_url && (
                <Card className="p-4">
                  <img 
                    src={article.thumbnail_url} 
                    alt={article.title}
                    className="w-full rounded-lg"
                  />
                </Card>
              )}

              {/* Article Info */}
              <Card className="p-6">
                <h3 className="font-semibold mb-4">Article Information</h3>
                <div className="space-y-3 text-sm">
                  <div>
                    <span className="font-medium">Author:</span>
                    <p className="text-muted-foreground">{article.author_name}</p>
                  </div>
                  <div>
                    <span className="font-medium">Email:</span>
                    <p className="text-muted-foreground">{article.author_email}</p>
                  </div>
                  <div>
                    <span className="font-medium">Area:</span>
                    <p className="text-muted-foreground">{article.area}</p>
                  </div>
                  <div>
                    <span className="font-medium">Published:</span>
                    <p className="text-muted-foreground">
                      {new Date(article.created_at).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}