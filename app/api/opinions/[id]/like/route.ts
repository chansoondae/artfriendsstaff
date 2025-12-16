import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseServerClient } from '@/lib/supabase-admin';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = getSupabaseServerClient();
    const { id } = await params;
    const body = await request.json();
    const { temp_user_id } = body;

    // Debug log to verify server receives like requests
    console.log('[API] /opinions/:id/like POST', {
      opinionId: id,
      temp_user_id,
    });

    if (!temp_user_id) {
      return NextResponse.json(
        { error: 'temp_user_id is required' },
        { status: 400 }
      );
    }

    // 이미 좋아요를 눌렀는지 확인
    const { data: existingLike, error: selectError } = await supabase
      .from('likes')
      .select('id')
      .eq('opinion_id', id)
      .eq('temp_user_id', temp_user_id)
      .maybeSingle();

    if (selectError) {
      console.error('Select like error:', selectError);
      return NextResponse.json(
        { error: 'Failed to check like' },
        { status: 500 }
      );
    }

    if (existingLike) {
      // 좋아요 취소
      const { error: deleteError } = await supabase
        .from('likes')
        .delete()
        .eq('opinion_id', id)
        .eq('temp_user_id', temp_user_id);

      if (deleteError) {
        console.error('Delete like error:', deleteError);
        return NextResponse.json(
          { error: 'Failed to unlike' },
          { status: 500 }
        );
      }

      // likes 카운트 감소
      const { data: currentOpinion, error: opinionError } = await supabase
        .from('opinions')
        .select('likes')
        .eq('id', id)
        .maybeSingle();

      if (opinionError) {
        console.error('Fetch opinion error (unlike):', opinionError);
      }

      if (currentOpinion) {
        const { error: updateError } = await supabase
          .from('opinions')
          .update({ likes: Math.max(0, currentOpinion.likes - 1) })
          .eq('id', id);

        if (updateError) {
          console.error('Decrement likes error:', updateError);
        }
      }

      return NextResponse.json({ liked: false });
    } else {
      // 좋아요 추가
      const { error: insertError } = await supabase.from('likes').insert({
        opinion_id: id,
        temp_user_id,
      });

      if (insertError) {
        console.error('Insert like error:', insertError);
        return NextResponse.json(
          { error: 'Failed to like' },
          { status: 500 }
        );
      }

      // likes 카운트 증가
      const { data: currentOpinion, error: opinionError } = await supabase
        .from('opinions')
        .select('likes')
        .eq('id', id)
        .maybeSingle();

      if (opinionError) {
        console.error('Fetch opinion error (like):', opinionError);
      }

      if (currentOpinion) {
        const { error: updateError } = await supabase
          .from('opinions')
          .update({ likes: currentOpinion.likes + 1 })
          .eq('id', id);

        if (updateError) {
          console.error('Increment likes error:', updateError);
        }
      }

      return NextResponse.json({ liked: true });
    }
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
