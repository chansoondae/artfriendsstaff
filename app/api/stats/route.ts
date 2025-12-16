import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import type { Stats } from '@/types';

export async function GET() {
  try {
    // 전체 의견 수
    const { count: total, error: totalError } = await supabase
      .from('opinions')
      .select('*', { count: 'exact', head: true });

    if (totalError) {
      console.error('Total count error:', totalError);
      return NextResponse.json(
        { error: 'Failed to fetch stats' },
        { status: 500 }
      );
    }

    const stats: Stats = {
      total: total || 0,
    };

    return NextResponse.json(stats);
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
