'use client';

import { useState, useEffect } from 'react';
import OpinionCard from './OpinionCard';
import { getLikedOpinions, toggleLikedOpinion, getTempUserId } from '@/lib/utils';
import type { Opinion, SortBy } from '@/types';

interface OpinionListProps {
  opinions: Opinion[];
  onOpinionsUpdate: () => void;
}

export default function OpinionList({
  opinions,
  onOpinionsUpdate,
}: OpinionListProps) {
  const [localOpinions, setLocalOpinions] = useState<Opinion[]>(opinions);
  const [likedOpinions, setLikedOpinions] = useState<Set<string>>(new Set());
  const [sortBy, setSortBy] = useState<SortBy>('latest');

  useEffect(() => {
    setLikedOpinions(getLikedOpinions());
  }, []);

  useEffect(() => {
    setLocalOpinions(opinions);
  }, [opinions]);

  const handleLike = async (opinionId: string) => {
    const tempUserId = getTempUserId();
    const wasLiked = likedOpinions.has(opinionId);
    const isNowLiked = toggleLikedOpinion(opinionId);

    // Debug log to verify client-side like trigger
    // console.log('[Like] sending request', { opinionId, tempUserId, isNowLiked });

    // 즉시 UI 업데이트 (낙관적 업데이트)
    setLikedOpinions(getLikedOpinions());
    setLocalOpinions((prevOpinions) =>
      prevOpinions.map((opinion) =>
        opinion.id === opinionId
          ? { ...opinion, likes: opinion.likes + (isNowLiked ? 1 : -1) }
          : opinion
      )
    );

    try {
      const response = await fetch(`/api/opinions/${opinionId}/like`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ temp_user_id: tempUserId }),
      });

      // Debug response logging
      // try {
      //   const debugBody = await response.clone().json();
      //   console.log('[Like] response', {
      //     status: response.status,
      //     ok: response.ok,
      //     body: debugBody,
      //   });
      // } catch {
      //   console.log('[Like] response (no json)', {
      //     status: response.status,
      //     ok: response.ok,
      //   });
      // }

      if (!response.ok) {
        // 에러 시 롤백
        toggleLikedOpinion(opinionId);
        setLikedOpinions(getLikedOpinions());
        setLocalOpinions((prevOpinions) =>
          prevOpinions.map((opinion) =>
            opinion.id === opinionId
              ? { ...opinion, likes: opinion.likes + (wasLiked ? 1 : -1) }
              : opinion
          )
        );
        return;
      }

      // 성공 시 서버에서 최신 데이터 가져오기 (백그라운드)
      onOpinionsUpdate();
    } catch (error) {
      console.error('Like error:', error);
      // 에러 시 롤백
      toggleLikedOpinion(opinionId);
      setLikedOpinions(getLikedOpinions());
      setLocalOpinions((prevOpinions) =>
        prevOpinions.map((opinion) =>
          opinion.id === opinionId
            ? { ...opinion, likes: opinion.likes + (wasLiked ? 1 : -1) }
            : opinion
        )
      );
    }
  };

  const sortedOpinions = [...localOpinions].sort((a, b) => {
    if (sortBy === 'popular') {
      return b.likes - a.likes;
    }
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
  });

  return (
    <div>
      <div className="flex items-center justify-between px-4 sm:px-6 mb-4">
        <h2 className="text-lg font-semibold text-text-primary">
          {localOpinions.length}개의 의견
        </h2>
        <div className="flex gap-2">
          <button
            onClick={() => setSortBy('latest')}
            className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
              sortBy === 'latest'
                ? 'bg-primary text-white'
                : 'bg-white text-text-secondary hover:bg-primary-pale'
            }`}
          >
            최신순
          </button>
          <button
            onClick={() => setSortBy('popular')}
            className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
              sortBy === 'popular'
                ? 'bg-primary text-white'
                : 'bg-white text-text-secondary hover:bg-primary-pale'
            }`}
          >
            공감순
          </button>
        </div>
      </div>

      <div className="space-y-3 px-4 sm:px-6">
        {sortedOpinions.length === 0 ? (
          <div className="text-center py-12 text-text-secondary">
            아직 의견이 없습니다. 첫 의견을 남겨보세요!
          </div>
        ) : (
          sortedOpinions.map((opinion) => (
            <OpinionCard
              key={opinion.id}
              opinion={opinion}
              onLike={handleLike}
              isLiked={likedOpinions.has(opinion.id)}
            />
          ))
        )}
      </div>
    </div>
  );
}
