-- Add asset URL columns to submissions
-- Run this in the Supabase SQL Editor for your project

ALTER TABLE public.submissions
  ADD COLUMN IF NOT EXISTS docx_url text;

ALTER TABLE public.submissions
  ADD COLUMN IF NOT EXISTS thumbnail_url text;

-- Optional but recommended: store slug and featured flag
ALTER TABLE public.submissions
  ADD COLUMN IF NOT EXISTS slug text;

ALTER TABLE public.submissions
  ADD COLUMN IF NOT EXISTS featured boolean DEFAULT false;
