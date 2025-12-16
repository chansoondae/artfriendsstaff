'use client';

import { useState, useEffect } from 'react';
import { formatTimeAgo, getTempUserId } from '@/lib/utils';
import type { Comment } from '@/types';

interface CommentSectionProps {
  opinionId: string;
  isOpen: boolean;
  onCommentAdded?: () => void;
}

export default function CommentSection({
  opinionId,
  isOpen,
  onCommentAdded,
}: CommentSectionProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      fetchComments();
    }
  }, [isOpen, opinionId]);

  const fetchComments = async () => {
    try {
      const response = await fetch(`/api/opinions/${opinionId}/comments`);
      if (response.ok) {
        const data = await response.json();
        setComments(data);
      }
    } catch (error) {
      console.error('Failed to fetch comments:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (newComment.trim().length < 2) {
      setError('댓글은 최소 2자 이상이어야 합니다');
      return;
    }

    setIsSubmitting(true);

    try {
      const tempUserId = getTempUserId();
      const response = await fetch(`/api/opinions/${opinionId}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: newComment,
          temp_user_id: tempUserId,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || '댓글 등록에 실패했습니다');
        setIsSubmitting(false);
        return;
      }

      setNewComment('');
      fetchComments();
      if (onCommentAdded) {
        onCommentAdded();
      }
    } catch (error) {
      console.error('Submit error:', error);
      setError('댓글 등록에 실패했습니다');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="mt-4 pt-4 border-t border-gray-200">
      {/* 댓글 목록 */}
      <div className="space-y-3 mb-4">
        {comments.length === 0 ? (
          <p className="text-sm text-text-secondary text-center py-2">
            첫 댓글을 남겨보세요!
          </p>
        ) : (
          comments.map((comment) => (
            <div
              key={comment.id}
              className="bg-gray-50 rounded-lg p-3 text-sm"
            >
              <div className="flex items-center gap-2 mb-1">
                <span className="font-medium text-text-primary text-xs">
                  {comment.nickname}
                </span>
                <span className="text-text-secondary text-xs">
                  {formatTimeAgo(comment.created_at)}
                </span>
              </div>
              <p className="text-text-primary">{comment.content}</p>
            </div>
          ))
        )}
      </div>

      {/* 댓글 작성 폼 */}
      <form onSubmit={handleSubmit} className="space-y-2">
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="댓글을 입력하세요..."
          className="w-full p-3 border border-gray-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
          rows={2}
          maxLength={500}
        />
        {error && (
          <p className="text-xs text-red-600">{error}</p>
        )}
        <div className="flex items-center justify-between">
          <span className="text-xs text-text-secondary">
            {newComment.length} / 500
          </span>
          <button
            type="submit"
            disabled={isSubmitting || newComment.trim().length < 2}
            className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              isSubmitting || newComment.trim().length < 2
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                : 'bg-primary text-white hover:bg-primary-accent'
            }`}
          >
            {isSubmitting ? '등록 중...' : '댓글 등록'}
          </button>
        </div>
      </form>
    </div>
  );
}
