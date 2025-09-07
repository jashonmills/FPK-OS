import { supabase } from '@/integrations/supabase/client';

/**
 * Convert a string to a URL-friendly slug
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/[\s_-]+/g, '-') // Replace spaces and underscores with hyphens
    .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
}

/**
 * Ensure a slug is unique by checking the database and appending a number if needed
 */
export async function ensureUniqueSlug(baseSlug: string): Promise<string> {
  const cleanSlug = slugify(baseSlug);
  
  // First, check if the base slug is available
  const { data: existing } = await supabase
    .from('organizations')
    .select('slug')
    .eq('slug', cleanSlug)
    .single();

  if (!existing) {
    return cleanSlug;
  }

  // If taken, find all similar slugs and determine next number
  const { data: similarSlugs } = await supabase
    .from('organizations')
    .select('slug')
    .like('slug', `${cleanSlug}%`);

  if (!similarSlugs || similarSlugs.length === 0) {
    return cleanSlug;
  }

  // Find the highest number suffix
  let maxSuffix = 1;
  const pattern = new RegExp(`^${cleanSlug}-(\\d+)$`);
  
  for (const row of similarSlugs) {
    const match = row.slug.match(pattern);
    if (match) {
      const num = parseInt(match[1], 10);
      if (num >= maxSuffix) {
        maxSuffix = num + 1;
      }
    }
  }

  return `${cleanSlug}-${maxSuffix}`;
}

/**
 * Validate slug format
 */
export function isValidSlug(slug: string): boolean {
  const slugPattern = /^[a-z0-9-]+$/;
  return slugPattern.test(slug) && slug.length >= 3 && slug.length <= 50;
}