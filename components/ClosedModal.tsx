'use client';

interface ClosedModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ClosedModal({ isOpen, onClose }: ClosedModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 sm:p-8 shadow-2xl animate-fade-in">
        <div className="text-center">
          {/* Icon */}
          <div className="mb-4">
            <span className="text-6xl">🎨</span>
          </div>

          {/* Title */}
          <h2 className="text-2xl font-bold text-text-primary mb-3">
            의견 수렴이 종료되었습니다
          </h2>

          {/* Message */}
          <p className="text-text-secondary mb-6 leading-relaxed">
            많은 의견 주셔서 감사합니다!<br />
            더 이상 새로운 의견이나 댓글을 작성할 수 없습니다.<br />
            결과는 아래 링크에서 확인하실 수 있습니다.
          </p>

          {/* Link Button */}
          <a
            href="https://cafe.naver.com/amateurmagician/77071"
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full bg-gradient-to-r from-primary to-primary-accent text-white py-3 px-6 rounded-lg font-semibold hover:opacity-90 transition-opacity mb-3"
          >
            결과 확인하러 가기 →
          </a>

          {/* Close Button */}
          <button
            onClick={onClose}
            className="w-full text-text-secondary py-2 px-6 rounded-lg hover:bg-gray-100 transition-colors"
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
}
