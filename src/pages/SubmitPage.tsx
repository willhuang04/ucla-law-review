import { useState } from "react";
import { Card } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import { Label } from "../components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Upload, CheckCircle } from "lucide-react";
import { supabase } from "../lib/supabase";
import { useUser } from "@clerk/clerk-react";

export function SubmitPage() {
  const { user } = useUser();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedArea, setSelectedArea] = useState<string>("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    // Validate area selection
    if (!selectedArea) {
      setError('Please select a legal area for your article.');
      setIsSubmitting(false);
      return;
    }

    try {
      const formData = new FormData(e.target as HTMLFormElement);
      
      // Extract form data
      const submission = {
        title: formData.get('title') as string,
        abstract: formData.get('abstract') as string,
        author_name: formData.get('name') as string,
        author_email: formData.get('email') as string,
        author_id: user?.id || null,
        area: selectedArea,
        status: 'pending' as const,
        // Note: thumbnail_url and pdf_url will be added when file upload is implemented
      };

      // Insert into Supabase
      const { data, error: insertError } = await supabase
        .from('submissions')
        .insert(submission)
        .select();

      if (insertError) {
        throw insertError;
      }

      console.log('Submission created:', data);
      setSubmitted(true);
      
    } catch (err: any) {
      console.error('Submission error:', err);
      setError(err.message || 'Failed to submit. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Boilerplate */}
        <div className="max-w-3xl mx-auto mb-12">
          <h1 className="mb-6 text-center">Submit Your Article</h1>
          <Card className="p-8 bg-muted/30">
            <div className="space-y-4 text-sm text-muted-foreground">
              <p>
                Thank you for your interest in submitting to the UCLA Undergraduate Law Journal. 
                We accept original, unpublished legal scholarship from undergraduate students across all institutions.
              </p>
              <p>
                <strong className="text-foreground">Submission Requirements:</strong>
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Article must be 5,000-10,000 words (excluding footnotes)</li>
                <li>Proper legal citation format (Bluebook 21st edition)</li>
                <li>Abstract of 150-250 words required</li>
                <li>Must select primary legal area (Administrative, Civil, Criminal, Environmental, or National Security)</li>
                <li>Author must be currently enrolled as an undergraduate student</li>
                <li>Submit as a PDF document</li>
              </ul>
              <p>
                All submissions undergo a rigorous peer-review process. You will receive a response within 6-8 weeks.
              </p>
            </div>
          </Card>
        </div>

        {/* Submission Form */}
        <div className="max-w-2xl mx-auto">
          <Card className="p-8">
            {submitted ? (
              <div className="text-center space-y-4">
                <CheckCircle className="h-16 w-16 text-green-500 mx-auto" />
                <h2 className="text-2xl font-bold">Submission Received!</h2>
                <p className="text-muted-foreground">
                  Thank you for your submission. We'll review it and get back to you within 6-8 weeks.
                </p>
                <Button onClick={() => {
                  setSubmitted(false);
                  setError(null);
                  setSelectedArea("");
                  (document.getElementById('submission-form') as HTMLFormElement)?.reset();
                }}>
                  Submit Another Article
                </Button>
              </div>
            ) : (
              <form id="submission-form" onSubmit={handleSubmit} className="space-y-6">
                {error && (
                  <div className="p-4 border border-red-200 bg-red-50 text-red-700 rounded">
                    {error}
                  </div>
                )}
                
                {/* Your Name */}
                <div className="space-y-2">
                  <Label htmlFor="name" className="uppercase tracking-wider text-xs">
                    Your Name
                  </Label>
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    required
                    className="bg-input"
                    disabled={isSubmitting}
                  />
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <Label htmlFor="email" className="uppercase tracking-wider text-xs">
                    Current Email Address
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    required
                    className="bg-input"
                    disabled={isSubmitting}
                  />
                </div>

                {/* Title */}
                <div className="space-y-2">
                  <Label htmlFor="title" className="uppercase tracking-wider text-xs">
                    Article Title
                  </Label>
                  <Input
                    id="title"
                    name="title"
                    type="text"
                    required
                    className="bg-input"
                    disabled={isSubmitting}
                  />
                </div>

                {/* Area */}
                <div className="space-y-2">
                  <Label htmlFor="area" className="uppercase tracking-wider text-xs">
                    Legal Area
                  </Label>
                  <Select value={selectedArea} onValueChange={setSelectedArea} required disabled={isSubmitting}>
                    <SelectTrigger className="bg-input">
                      <SelectValue placeholder="Select the primary legal area of your article" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Administrative">Administrative Law</SelectItem>
                      <SelectItem value="Civil">Civil Law</SelectItem>
                      <SelectItem value="Criminal">Criminal Law</SelectItem>
                      <SelectItem value="Environmental">Environmental Law</SelectItem>
                      <SelectItem value="National Security">National Security Law</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Abstract */}
                <div className="space-y-2">
                  <Label htmlFor="abstract" className="uppercase tracking-wider text-xs">
                    Abstract (150-250 Words)
                  </Label>
                  <Textarea
                    id="abstract"
                    name="abstract"
                    rows={6}
                    required
                    className="bg-input resize-none"
                    maxLength={1500}
                    disabled={isSubmitting}
                    placeholder="Provide a concise summary of your legal research and findings..."
                  />
                </div>

                {/* Upload PDF - Placeholder for now */}
                <div className="space-y-2">
                  <Label htmlFor="pdf" className="uppercase tracking-wider text-xs">
                    Upload PDF (Coming Soon)
                  </Label>
                  <div className="p-4 border border-dashed border-muted-foreground/25 rounded text-center text-muted-foreground">
                    <Upload className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">PDF upload will be available soon</p>
                    <p className="text-xs">For now, your submission will be saved without the file</p>
                  </div>
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  size="lg"
                  className="w-full mt-8"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Article'}
                </Button>
              </form>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
