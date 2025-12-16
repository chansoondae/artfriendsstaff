import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseServerClient } from '@/lib/supabase-admin';
import { generateNickname, hasBadWords } from '@/lib/utils';

export async function GET(request: NextRequest) {
  try {
    const supabase = getSupabaseServerClient();
    const { searchParams } = new URL(request.url);
    const sortBy = searchParams.get('sortBy') || 'latest';
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = parseInt(searchParams.get('offset') || '0');

    let query = supabase.from('opinions').select('*');

    if (sortBy === 'popular') {
      query = query.order('likes', { ascending: false });
    } else {
      query = query.order('created_at', { ascending: false });
    }

    query = query.range(offset, offset + limit - 1);

    const { data, error } = await query;

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json(
        { error: 'Failed to fetch opinions' },
        { status: 500 }
      );
    }

    return NextResponse.json(data || []);
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = getSupabaseServerClient();
    const body = await request.json();
    const { content, temp_user_id } = body;

    if (!content || !temp_user_id) {
      return NextResponse.json(
        { error: 'Content and temp_user_id are required' },
        { status: 400 }
      );
    }

    if (content.length < 10) {
      return NextResponse.json(
        { error: '의견은 최소 10자 이상이어야 합니다' },
        { status: 400 }
      );
    }

    if (hasBadWords(content)) {
      return NextResponse.json(
        { error: '부적절한 내용이 포함되어 있습니다' },
        { status: 400 }
      );
    }

    // 1분 내 중복 제출 체크
    const oneMinuteAgo = new Date(Date.now() - 1 * 60 * 1000).toISOString();
    const { data: recentOpinions } = await supabase
      .from('opinions')
      .select('id')
      .eq('temp_user_id', temp_user_id)
      .gte('created_at', oneMinuteAgo);

    if (recentOpinions && recentOpinions.length > 0) {
      return NextResponse.json(
        { error: '1분 후에 다시 의견을 남겨주세요' },
        { status: 429 }
      );
    }

    // 닉네임 생성
    const nickname = generateNickname();

    // DB에 저장
    const { data, error } = await supabase
      .from('opinions')
      .insert({
        content,
        nickname,
        temp_user_id,
        likes: 0,
      })
      .select()
      .single();

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json(
        { error: 'Failed to create opinion' },
        { status: 500 }
      );
    }

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
