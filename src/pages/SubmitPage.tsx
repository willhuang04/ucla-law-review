import { useState } from "react";
import { Card } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import { Label } from "../components/ui/label";
import { Upload } from "lucide-react";

export function SubmitPage() {
  const [fileName, setFileName] = useState<string>("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log("Form submitted");
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
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Your Name */}
              <div className="space-y-2">
                <Label htmlFor="name" className="uppercase tracking-wider text-xs">
                  Your Name
                </Label>
                <Input
                  id="name"
                  type="text"
                  required
                  className="bg-input"
                />
              </div>

              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email" className="uppercase tracking-wider text-xs">
                  Current Email Address
                </Label>
                <Input
                  id="email"
                  type="email"
                  required
                  className="bg-input"
                />
              </div>

              {/* Phone */}
              <div className="space-y-2">
                <Label htmlFor="phone" className="uppercase tracking-wider text-xs">
                  Phone Number
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  required
                  className="bg-input"
                />
              </div>

              {/* College/University */}
              <div className="space-y-2">
                <Label htmlFor="college" className="uppercase tracking-wider text-xs">
                  College/University
                </Label>
                <Input
                  id="college"
                  type="text"
                  required
                  className="bg-input"
                />
              </div>

              {/* Year of Graduation */}
              <div className="space-y-2">
                <Label htmlFor="graduation" className="uppercase tracking-wider text-xs">
                  Year of Graduation
                </Label>
                <Input
                  id="graduation"
                  type="text"
                  placeholder="e.g., 2025"
                  required
                  className="bg-input"
                />
              </div>

              {/* Title */}
              <div className="space-y-2">
                <Label htmlFor="title" className="uppercase tracking-wider text-xs">
                  Title
                </Label>
                <Input
                  id="title"
                  type="text"
                  required
                  className="bg-input"
                />
              </div>

              {/* Abstract */}
              <div className="space-y-2">
                <Label htmlFor="abstract" className="uppercase tracking-wider text-xs">
                  Abstract (Max 250 Words)
                </Label>
                <Textarea
                  id="abstract"
                  rows={6}
                  required
                  className="bg-input resize-none"
                  maxLength={1500}
                />
              </div>

              {/* Short Explanation */}
              <div className="space-y-2">
                <Label htmlFor="explanation" className="uppercase tracking-wider text-xs">
                  Short Explanation
                </Label>
                <Input
                  id="explanation"
                  type="text"
                  required
                  className="bg-input"
                />
              </div>

              {/* Upload PDF */}
              <div className="space-y-2">
                <Label htmlFor="pdf" className="uppercase tracking-wider text-xs">
                  Upload PDF
                </Label>
                <div className="flex items-center gap-4">
                  <label
                    htmlFor="pdf"
                    className="inline-flex items-center gap-2 px-6 py-2.5 border border-border bg-input hover:bg-accent/10 transition-colors cursor-pointer"
                  >
                    <Upload className="h-4 w-4" />
                    <span>Choose PDF File</span>
                  </label>
                  <input
                    id="pdf"
                    type="file"
                    accept=".pdf"
                    onChange={handleFileChange}
                    className="hidden"
                    required
                  />
                  {fileName && (
                    <span className="text-sm text-muted-foreground truncate max-w-xs">
                      {fileName}
                    </span>
                  )}
                </div>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                size="lg"
                className="w-full mt-8"
              >
                Submit
              </Button>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
}
