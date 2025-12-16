'use client';

import { useState, useEffect } from 'react';
import { formatTimeAgo } from '@/lib/utils';
import CommentSection from './CommentSection';
import type { Opinion } from '@/types';

interface OpinionCardProps {
  opinion: Opinion;
  onLike: (opinionId: string) => void;
  isLiked: boolean;
}

export default function OpinionCard({
  opinion,
  onLike,
  isLiked,
}: OpinionCardProps) {
  const [isLiking, setIsLiking] = useState(false);
  const [commentCount, setCommentCount] = useState(0);

  useEffect(() => {
    fetchCommentCount();
  }, [opinion.id]);

  const fetchCommentCount = async () => {
    try {
      const response = await fetch(`/api/opinions/${opinion.id}/comments`);
      if (response.ok) {
        const data = await response.json();
        setCommentCount(data.length);
      }
    } catch (error) {
      console.error('Failed to fetch comment count:', error);
    }
  };

  const handleLike = async () => {
    if (isLiking) return;
    setIsLiking(true);
    await onLike(opinion.id);
    setIsLiking(false);
  };

  return (
    <div className="bg-white rounded-2xl p-4 sm:p-5 border-l-4 border-primary shadow-sm hover:shadow-md transition-shadow duration-200">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-base font-bold text-text-primary">
          {opinion.nickname}
        </span>
        <span className="text-xs text-text-secondary">
          {formatTimeAgo(opinion.created_at)}
        </span>
      </div>

      <p className="text-text-primary text-sm sm:text-base leading-relaxed whitespace-pre-wrap mb-4">
        {opinion.content}
      </p>

      <div className="flex items-center gap-4 mb-2">
        <button
          onClick={handleLike}
          disabled={isLiking}
          className={`flex items-center gap-1.5 transition-all duration-200 ${
            isLiked
              ? 'text-primary animate-like'
              : 'text-text-secondary hover:text-primary'
          }`}
        >
          <span className="text-lg">{isLiked ? '💗' : '🤍'}</span>
          <span className="text-sm font-medium">{opinion.likes}</span>
        </button>

        <div className="flex items-center gap-1.5 text-text-secondary">
          <span className="text-lg">💬</span>
          <span className="text-sm font-medium">{commentCount}</span>
        </div>
      </div>

      <CommentSection
        opinionId={opinion.id}
        isOpen={true}
        onCommentAdded={fetchCommentCount}
      />
    </div>
  );
}
