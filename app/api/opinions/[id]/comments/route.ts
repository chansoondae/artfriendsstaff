import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { generateNickname, hasBadWords } from '@/lib/utils';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const { data, error } = await supabase
      .from('comments')
      .select('*')
      .eq('opinion_id', id)
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json(
        { error: 'Failed to fetch comments' },
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

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { content, temp_user_id } = body;

    if (!content || !temp_user_id) {
      return NextResponse.json(
        { error: 'Content and temp_user_id are required' },
        { status: 400 }
      );
    }

    if (content.length < 2) {
      return NextResponse.json(
        { error: '댓글은 최소 2자 이상이어야 합니다' },
        { status: 400 }
      );
    }

    if (hasBadWords(content)) {
      return NextResponse.json(
        { error: '부적절한 내용이 포함되어 있습니다' },
        { status: 400 }
      );
    }

    // 닉네임 생성
    const nickname = generateNickname();

    // DB에 저장
    const { data, error } = await supabase
      .from('comments')
      .insert({
        opinion_id: id,
        content,
        nickname,
        temp_user_id,
      })
      .select()
      .single();

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json(
        { error: 'Failed to create comment' },
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
