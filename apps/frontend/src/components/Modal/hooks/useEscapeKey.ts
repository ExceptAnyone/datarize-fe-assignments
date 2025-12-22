import { useEffect } from 'react';

/**
 * ESC 키를 감지하여 콜백을 실행하는 훅
 * @param callback ESC 키가 눌렸을 때 실행할 콜백 함수
 * @param enabled 훅 활성화 여부
 */
export function useEscapeKey(callback: () => void, enabled = true) {
  useEffect(() => {
    if (!enabled) return;

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        callback();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [callback, enabled]);
}
