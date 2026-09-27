import { createClient } from '@supabase/supabase-js';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

let supabase = null;
let storageAdmin = null;

export function getSupabaseAdmin() {
  if (!supabase) {
    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      throw new Error('SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be configured');
    }
    supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
      auth: { autoRefreshToken: false, persistSession: false },
    });
  }
  return supabase;
}

// Dedicated storage-only client. The auth admin client picks up a session after
// signInWithPassword, and that user token breaks bucket/upload RLS. Storage is
// always called with this separate client so it keeps the service-role key.
export function getSupabaseStorage() {
  if (!storageAdmin) {
    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      throw new Error('SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be configured');
    }
    storageAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
      auth: { autoRefreshToken: false, persistSession: false },
    });
  }
  return storageAdmin;
}

// Verify a Supabase access token and return the auth user, or null if invalid.
export async function verifySupabaseToken(token) {
  if (!token) return null;
  try {
    const { data, error } = await getSupabaseAdmin().auth.getUser(token);
    if (error || !data?.user) return null;
    return data.user;
  } catch {
    return null;
  }
}

// Create a new auth user in Supabase. Returns { user, error }.
export async function createAuthUser(email, password, fullName, role) {
  return getSupabaseAdmin().auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { full_name: fullName, role },
  });
}

// Mirror the app-level User row in our own DB, linked to the Supabase auth user id.
export async function createAppUser({ id, email, passwordHash, role, fullName, status }) {
  return prisma.user.create({
    data: { id, email, passwordHash, role, fullName, status },
  });
}

export { prisma };