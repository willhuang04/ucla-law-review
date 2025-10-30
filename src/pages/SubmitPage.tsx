import { useState } from "react";
import { Card } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import { Label } from "../components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Upload, CheckCircle, FileText, X } from "lucide-react";
import { supabase } from "../lib/supabase";
import { createClient } from '@supabase/supabase-js';
import { useUser, SignInButton } from "@clerk/clerk-react";

// Safe storage client: use Service Key only if present (local dev/admin),
// otherwise fall back to anon key so production doesn't crash.
// Never require the service key on the client.
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_SERVICE_KEY = import.meta.env.VITE_SUPABASE_SERVICE_KEY;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Lazily create a storage-capable client only when needed.
function getSupabaseService() {
  const url = SUPABASE_URL;
  const key = SUPABASE_SERVICE_KEY || SUPABASE_ANON_KEY;
  if (!url || !key) {
    // eslint-disable-next-line no-console
    console.error('Supabase storage client not configured', {
      hasUrl: !!url,
      hasServiceKey: !!SUPABASE_SERVICE_KEY,
      hasAnonKey: !!SUPABASE_ANON_KEY,
    });
    return null;
  }
  return createClient(url, key);
}

export function SubmitPage() {
  const devLog = (...args: any[]) => { if (import.meta.env.DEV) console.log(...args); };
  const { user, isLoaded } = useUser();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedArea, setSelectedArea] = useState<string>("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedThumbnail, setSelectedThumbnail] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [abstractText, setAbstractText] = useState<string>("");
  const abstractWordCount = abstractText.trim()
    ? abstractText.trim().split(/\s+/).filter(Boolean).length
    : 0;
  const abstractTooLong = abstractWordCount > 250;

  // Allow only UCLA institutional emails
  const isAllowedInstitutionEmail = (email: string) => {
    const match = email.toLowerCase().trim().match(/^[^@]+@([^@]+)$/);
    if (!match) return false;
    const domain = match[1];
    return domain === 'ucla.edu' || domain === 'g.ucla.edu';
  };

  // Show loading state while checking authentication
  if (!isLoaded) {
    return (
      <div className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto text-center">
            <p className="text-muted-foreground">Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  // Redirect to sign-in if not authenticated
  if (!user) {
    return (
      <div className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto text-center">
            <div className="mb-8">
              <FileText className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h1 className="text-3xl font-bold mb-4">Submit Your Article</h1>
              <p className="text-lg text-muted-foreground mb-8">
                You need to be signed in to submit an article to UCLA Law Review.
              </p>
            </div>
            
            <div className="space-y-4">
              <SignInButton mode="modal">
                <Button size="lg" className="w-full sm:w-auto">
                  Sign In to Submit
                </Button>
              </SignInButton>
              
              <p className="text-sm text-muted-foreground">
                Don't have an account? Signing in will create one automatically.
              </p>
            </div>

            <div className="mt-12 p-6 bg-muted/30 rounded-lg text-left">
              <h3 className="font-semibold mb-3">Submission Requirements:</h3>
              <ul className="text-sm text-muted-foreground space-y-2">
                <li>• Must be a UCLA undergraduate student</li>
                <li>• Article must be in DOCX format (Microsoft Word)</li>
                <li>• Include a thumbnail image for your article</li>
                <li>• All submissions go through peer review</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type (DOCX only)
      if (file.type !== 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
        setError('Please select a DOCX file (Microsoft Word document).');
        return;
      }
      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        setError('File size must be less than 10MB.');
        return;
      }
      setSelectedFile(file);
      setError(null);
    }
  };

  const handleThumbnailSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type (images only) - more permissive
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
      if (!file.type.startsWith('image/') && !allowedTypes.includes(file.type)) {
        setError('Please select an image file (PNG, JPG, GIF, WebP).');
        return;
      }
      // Validate file size (max 5MB for images)
      if (file.size > 5 * 1024 * 1024) {
        setError('Image size must be less than 5MB.');
        return;
      }
      setSelectedThumbnail(file);
      setError(null);
    }
  };

  const removeFile = () => {
    setSelectedFile(null);
    // Reset file input
    const fileInput = document.getElementById('docx') as HTMLInputElement;
    if (fileInput) fileInput.value = '';
  };

  const removeThumbnail = () => {
    setSelectedThumbnail(null);
    // Reset thumbnail input
    const thumbnailInput = document.getElementById('thumbnail') as HTMLInputElement;
    if (thumbnailInput) thumbnailInput.value = '';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    // Check if user is logged in
    if (!user) {
      setError('You must be logged in to submit an article.');
      setIsSubmitting(false);
      return;
    }

    // Validate area selection
    if (!selectedArea) {
      setError('Please select a legal area for your article.');
      setIsSubmitting(false);
      return;
    }

    // Validate file selections
    if (!selectedFile) {
      setError('Please select a DOCX file to upload.');
      setIsSubmitting(false);
      return;
    }
    
    if (!selectedThumbnail) {
      setError('Please select a thumbnail image for your article.');
      setIsSubmitting(false);
      return;
    }

    try {
      const formData = new FormData(e.target as HTMLFormElement);
      
      // Extract form data
      const submission = {
        title: formData.get('title') as string,
        abstract: abstractText.trim(),
        author_name: formData.get('name') as string,
        author_email: formData.get('email') as string,
        author_id: user?.id || null,
        area: selectedArea,
        status: 'pending' as const,
      };

      // Enforce abstract <= 250 words
      if (abstractTooLong) {
        setError('Abstract must be 250 words or fewer.');
        setIsSubmitting(false);
        return;
      }

      // Enforce UCLA email domain restriction
      if (!isAllowedInstitutionEmail(submission.author_email)) {
        setError('Please use your UCLA email address (…@ucla.edu or …@g.ucla.edu).');
        setIsSubmitting(false);
        return;
      }

  devLog('Attempting to insert submission:', submission);

      // Insert into Supabase first to get the submission ID
      const submissionWithUser = {
        ...submission,
        author_id: user?.id || null // Safely add Clerk user ID for RLS
      };
      
      const { data, error: insertError } = await supabase
        .from('submissions')
        .insert(submissionWithUser)
        .select();

      if (insertError) {
        console.error('Database insert error:', insertError);
        throw new Error(`Database error: ${insertError.message}`);
      }

  devLog('Submission inserted successfully:', data);
      const submissionId = data[0].id;

      // Upload both DOCX and thumbnail
  devLog('Starting file uploads...');
      setUploadProgress(10);
      
      // Create storage client lazily (prevents crashes if env is missing at import time)
      const supabaseService = getSupabaseService();
      if (!supabaseService) {
        throw new Error('Storage is not configured. Please try again later.');
      }

      // Upload DOCX
      const docxExt = selectedFile.name.split('.').pop();
      const docxFileName = `${submissionId}.${docxExt}`;

  devLog('Uploading DOCX:', docxFileName);
      const { data: docxUploadData, error: docxUploadError } = await supabaseService.storage
        .from('submissions')
        .upload(docxFileName, selectedFile, {
          cacheControl: '3600',
          upsert: true,
          contentType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        });

      if (docxUploadError) {
        console.error('DOCX upload error:', docxUploadError);
        throw new Error(`DOCX upload failed: ${docxUploadError.message}`);
      }

  devLog('DOCX upload successful:', docxUploadData);
      setUploadProgress(40);

      // Upload thumbnail
      const thumbnailExt = selectedThumbnail.name.split('.').pop();
      const thumbnailFileName = `${submissionId}_thumb.${thumbnailExt}`;
      
  devLog('Uploading thumbnail:', thumbnailFileName);
      
      const { data: thumbnailUploadData, error: thumbnailUploadError } = await supabaseService.storage
        .from('submissions')
        .upload(thumbnailFileName, selectedThumbnail, {
          cacheControl: '3600',
          upsert: true,
          contentType: selectedThumbnail.type
        });

      if (thumbnailUploadError) {
        console.error('Thumbnail upload error:', thumbnailUploadError);
        throw new Error(`Thumbnail upload failed: ${thumbnailUploadError.message}`);
      }

  devLog('Thumbnail upload successful:', thumbnailUploadData);
      setUploadProgress(70);

      // Get public URLs
      const { data: { publicUrl: docxPublicUrl } } = supabaseService.storage
        .from('submissions')
        .getPublicUrl(docxFileName);

      const { data: { publicUrl: thumbnailPublicUrl } } = supabaseService.storage
        .from('submissions')
        .getPublicUrl(thumbnailFileName);

  devLog('Generated DOCX URL:', docxPublicUrl);
  devLog('Generated thumbnail URL:', thumbnailPublicUrl);
      setUploadProgress(90);

      // Update submission with both URLs
      const { error: updateError } = await supabase
        .from('submissions')
        .update({ 
          docx_url: docxPublicUrl,
          thumbnail_url: thumbnailPublicUrl
        })
        .eq('id', submissionId);

      if (updateError) {
        console.error('Update error:', updateError);
        throw new Error(`Update error: ${updateError.message}`);
      }

      setUploadProgress(100);
  devLog('Submission created with DOCX:', data);
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
                <li>Submit as a DOCX document</li>
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
                  setSelectedFile(null);
                  setSelectedThumbnail(null);
                  setUploadProgress(0);
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
                    pattern="^[^@]+@(ucla\.edu|g\.ucla\.edu)$"
                    title="Use your UCLA email (…@ucla.edu or …@g.ucla.edu)"
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
                    Abstract (up to 250 words)
                  </Label>
                  <Textarea
                    id="abstract"
                    name="abstract"
                    rows={6}
                    required
                    className={`bg-input resize-none ${abstractTooLong ? 'border-red-300 focus-visible:ring-red-400' : ''}`}
                    value={abstractText}
                    onChange={(e) => setAbstractText(e.target.value)}
                    disabled={isSubmitting}
                    placeholder="Provide a concise summary of your legal research and findings..."
                  />
                  <div className="flex justify-between text-xs mt-1">
                    <span className={`text-muted-foreground ${abstractTooLong ? 'text-red-600' : ''}`}>
                      Word count: {abstractWordCount} / 250
                    </span>
                    {abstractTooLong && (
                      <span className="text-red-600">Reduce by {abstractWordCount - 250} words</span>
                    )}
                  </div>
                </div>

                {/* Upload DOCX */}
                <div className="space-y-2">
                  <Label htmlFor="docx" className="uppercase tracking-wider text-xs">
                    Upload DOCX *
                  </Label>
                  {!selectedFile ? (
                    <div className="relative">
                      <input
                        id="docx"
                        name="docx"
                        type="file"
                        accept=".docx"
                        onChange={handleFileSelect}
                        disabled={isSubmitting}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      />
                      <div className="p-6 border border-dashed border-muted-foreground/25 rounded text-center hover:border-muted-foreground/50 transition-colors cursor-pointer">
                        <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                        <p className="text-sm font-medium">Click to upload DOCX</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Maximum file size: 10MB
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="p-4 border rounded bg-muted/30">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <FileText className="h-8 w-8 text-red-500" />
                          <div>
                            <p className="text-sm font-medium">{selectedFile.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                            </p>
                          </div>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={removeFile}
                          disabled={isSubmitting}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                      {uploadProgress > 0 && uploadProgress < 100 && (
                        <div className="mt-3">
                          <div className="flex justify-between text-xs text-muted-foreground mb-1">
                            <span>Uploading...</span>
                            <span>{uploadProgress}%</span>
                          </div>
                          <div className="w-full bg-muted rounded-full h-1.5">
                            <div 
                              className="bg-blue-600 h-1.5 rounded-full transition-all duration-300" 
                              style={{ width: `${uploadProgress}%` }}
                            ></div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Upload Thumbnail */}
                <div className="space-y-2">
                  <Label htmlFor="thumbnail" className="uppercase tracking-wider text-xs">
                    Article Thumbnail *
                  </Label>
                  {!selectedThumbnail ? (
                    <div className="relative">
                      <input
                        id="thumbnail"
                        name="thumbnail"
                        type="file"
                        accept="image/png,image/jpeg,image/jpg,image/gif,image/webp"
                        onChange={handleThumbnailSelect}
                        disabled={isSubmitting}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      />
                      <div className="p-6 border border-dashed border-muted-foreground/25 rounded text-center hover:border-muted-foreground/50 transition-colors cursor-pointer">
                        <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                        <p className="text-sm font-medium">Click to upload thumbnail image</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          PNG, JPG, or other image formats • Max 5MB
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="p-4 border rounded bg-muted/30">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="relative h-12 w-12 rounded overflow-hidden bg-muted">
                            <img 
                              src={URL.createObjectURL(selectedThumbnail)} 
                              alt="Thumbnail preview"
                              className="h-full w-full object-cover"
                            />
                          </div>
                          <div>
                            <p className="text-sm font-medium">{selectedThumbnail.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {(selectedThumbnail.size / (1024 * 1024)).toFixed(2)} MB
                            </p>
                          </div>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={removeThumbnail}
                          disabled={isSubmitting}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  size="lg"
                  className="w-full mt-8"
                  disabled={isSubmitting || abstractTooLong}
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
