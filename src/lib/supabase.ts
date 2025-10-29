import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

console.log('Supabase URL:', supabaseUrl)
console.log('Supabase Key exists:', !!supabaseAnonKey)

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types
export interface Submission {
  id: string
  // Author information
  author_name: string
  author_email: string
  author_id?: string
  // Article information
  title: string
  slug?: string
  area: 'Administrative' | 'Civil' | 'Criminal' | 'Environmental' | 'National Security'
  abstract: string
  // Files
  thumbnail_url?: string
  pdf_url?: string
  // Status and review
  status: 'pending' | 'approved' | 'rejected'
  featured?: boolean
  submitted_at: string
  reviewed_at?: string
  reviewed_by?: string
  feedback?: string
  keywords?: string[]
  // Timestamps
  created_at: string
  updated_at: string
}