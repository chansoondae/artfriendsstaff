'use client';

interface FloatingWriteButtonProps {
  onClick: () => void;
}

export default function FloatingWriteButton({
  onClick,
}: FloatingWriteButtonProps) {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-6 right-6 w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-primary to-primary-accent text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 active:scale-95 flex items-center justify-center z-50 animate-pulse-subtle"
      aria-label="의견 작성"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={2}
        stroke="currentColor"
        className="w-6 h-6 sm:w-7 sm:h-7"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
        />
      </svg>
    </button>
  );
}
