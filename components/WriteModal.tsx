'use client';

import { useState, useEffect, useRef } from 'react';
import {
  getTempUserId,
  checkRateLimit,
  setLastSubmitTime,
  hasBadWords,
} from '@/lib/utils';

interface WriteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function WriteModal({
  isOpen,
  onClose,
  onSuccess,
}: WriteModalProps) {
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (isOpen && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleSubmit = async () => {
    setError('');

    if (content.length < 10) {
      setError('의견은 최소 10자 이상이어야 합니다');
      return;
    }

    if (hasBadWords(content)) {
      setError('부적절한 내용이 포함되어 있습니다');
      return;
    }

    const tempUserId = getTempUserId();
    if (!checkRateLimit(tempUserId)) {
      setError('1분 후에 다시 의견을 남겨주세요');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/opinions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content,
          temp_user_id: tempUserId,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || '의견 등록에 실패했습니다');
        setIsSubmitting(false);
        return;
      }

      setLastSubmitTime(tempUserId);
      setContent('');
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Submit error:', error);
      setError('의견 등록에 실패했습니다');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      <div
        className="absolute inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
      />

      <div className="relative w-full sm:max-w-lg bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl animate-slide-up max-h-[90vh] flex flex-col">
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-xl font-bold text-text-primary">
              의견 남기기
            </h2>
            <button
              onClick={onClose}
              className="text-text-secondary hover:text-text-primary transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
          <p className="text-sm text-text-secondary">
            스탭 선발 방식에 대한 여러분의 생각을 자유롭게 들려주세요
          </p>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          <textarea
            ref={textareaRef}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="최소 10자 이상 입력해주세요..."
            className="w-full h-40 p-4 border border-gray-200 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-text-primary placeholder:text-text-secondary"
            maxLength={1000}
          />
          <div className="flex items-center justify-between mt-2">
            <span
              className={`text-sm ${
                content.length >= 10 ? 'text-primary' : 'text-text-secondary'
              }`}
            >
              {content.length} / 1000
            </span>
            <span className="text-xs text-text-secondary">
              최소 10자 이상 필요
            </span>
          </div>

          {error && (
            <div className="mt-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm">
              {error}
            </div>
          )}
        </div>

        <div className="p-6 border-t border-gray-100">
          <button
            onClick={handleSubmit}
            disabled={isSubmitting || content.length < 10}
            className={`w-full py-3 rounded-xl font-semibold transition-all ${
              isSubmitting || content.length < 10
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-primary to-primary-accent text-white hover:shadow-lg active:scale-95'
            }`}
          >
            {isSubmitting ? '등록 중...' : '의견 등록하기'}
          </button>
        </div>
      </div>
    </div>
  );
}
