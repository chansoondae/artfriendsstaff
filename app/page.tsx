'use client';

import { useState, useEffect } from 'react';
import OpinionList from '@/components/OpinionList';
import FloatingWriteButton from '@/components/FloatingWriteButton';
import WriteModal from '@/components/WriteModal';
import type { Opinion, Stats } from '@/types';

export default function Home() {
  const [opinions, setOpinions] = useState<Opinion[]>([]);
  const [stats, setStats] = useState<Stats>({ total: 0 });
  const [isWriteModalOpen, setIsWriteModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showToast, setShowToast] = useState(false);

  const fetchOpinions = async () => {
    try {
      const response = await fetch('/api/opinions');
      if (response.ok) {
        const data = await response.json();
        setOpinions(data);
      }
    } catch (error) {
      console.error('Failed to fetch opinions:', error);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/stats');
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    }
  };

  const loadData = async () => {
    setIsLoading(true);
    await Promise.all([fetchOpinions(), fetchStats()]);
    setIsLoading(false);
  };

  const refreshOpinions = async () => {
    // 로딩 스피너 없이 조용히 데이터만 갱신
    await fetchOpinions();
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleWriteSuccess = () => {
    setShowToast(true);
    loadData();
    setTimeout(() => setShowToast(false), 3000);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <main className="min-h-screen bg-primary-pale pb-24">
      {/* Header */}
      <header className="bg-gradient-to-r from-primary to-primary-accent text-white py-6 sm:py-8 px-4 sm:px-6 shadow-lg">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl sm:text-3xl font-bold mb-2 flex items-center gap-2">
            <span>🎨</span>
            <span>아프 스탭 선발 의견 수렴</span>
          </h1>
          <p className="text-primary-pale text-sm sm:text-base">
            여러분의 생각을 들려주세요
          </p>
        </div>
      </header>

      {/* Stats */}
      <div className="bg-white border-b border-gray-100 py-4 px-4 sm:px-6 sticky top-0 z-10 shadow-sm">
        <div className="max-w-4xl mx-auto">
          <p className="text-text-primary font-semibold">
            📊 전체 <span className="text-primary">{stats.total}</span>개 의견
          </p>
        </div>
      </div>

      {/* Opinions List */}
      <div className="max-w-4xl mx-auto py-6">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent" />
          </div>
        ) : (
          <OpinionList opinions={opinions} onOpinionsUpdate={refreshOpinions} />
        )}
      </div>

      {/* Floating Write Button */}
      <FloatingWriteButton onClick={() => setIsWriteModalOpen(true)} />

      {/* Write Modal */}
      <WriteModal
        isOpen={isWriteModalOpen}
        onClose={() => setIsWriteModalOpen(false)}
        onSuccess={handleWriteSuccess}
      />

      {/* Toast Notification */}
      {showToast && (
        <div className="fixed top-20 left-1/2 transform -translate-x-1/2 bg-primary text-white px-6 py-3 rounded-full shadow-lg z-50 animate-bounce-in">
          의견이 등록되었어요!
        </div>
      )}
    </main>
  );
}
