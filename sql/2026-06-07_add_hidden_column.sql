-- Add a "hidden" flag to submissions for the secret/easter-egg articles.
-- Hidden articles are still approved, but are excluded from the public
-- Publications listing and search unless the visitor unlocks secret mode.
-- Run this in the Supabase SQL Editor for your project.

ALTER TABLE public.submissions
  ADD COLUMN IF NOT EXISTS hidden boolean DEFAULT false;

-- Optional: backfill any existing rows to be explicitly non-hidden.
UPDATE public.submissions
  SET hidden = false
  WHERE hidden IS NULL;
