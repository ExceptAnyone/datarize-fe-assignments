import { useEffect } from 'react';

/**
 * body 스크롤을 막는 훅
 * @param enabled 스크롤 잠금 활성화 여부
 */
export function useBodyScrollLock(enabled = true) {
  useEffect(() => {
    if (!enabled) return;

    // 현재 스크롤 위치 저장
    const originalOverflow = document.body.style.overflow;

    // 스크롤 잠금
    document.body.style.overflow = 'hidden';

    // 클린업: 스크롤 복원
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [enabled]);
}
