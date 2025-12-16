import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl) {
  throw new Error('Missing Supabase URL environment variable');
}

// 이 키는 서버 전용으로 사용해야 합니다. 클라이언트에 노출 금지.
export const supabaseAdmin = supabaseServiceKey
  ? createClient(supabaseUrl, supabaseServiceKey, {
      auth: { persistSession: false },
      realtime: { params: { eventsPerSecond: 10 } },
    })
  : null;

export function getSupabaseServerClient() {
  if (!supabaseAdmin) {
    throw new Error('SUPABASE_SERVICE_ROLE_KEY is not set');
  }
  return supabaseAdmin;
}

