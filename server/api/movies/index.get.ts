import { defineEventHandler,  getQuery } from 'h3';
import { useSupabaseAdmin } from '~/server/utils/supabase';

export default defineEventHandler(async (event) => {
  const queryParams = getQuery(event);
  const search = Array.isArray(queryParams.search) ? queryParams.search[0] : queryParams.search;
  const supabase = useSupabaseAdmin();

  let req = supabase.from('movies').select('*').order('created_at', { ascending: false }).limit(20);
  if (search) {
    // Use ilike for case-insensitive match on title
    req = req.ilike('title', `%${search}%`);
  }
  const { data, error } = await req;
  if (error) {
    throw createError({ statusCode: 500, statusMessage: error.message })
  }
  return data ?? [];
});
