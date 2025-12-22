import { MouseEvent, useCallback } from 'react';

/**
 * 오버레이 클릭 처리를 위한 훅
 * @param onClose 오버레이 클릭 시 실행할 콜백
 * @returns handleClickOverlay 함수
 */
export function useOverlay(onClose: () => void) {
  const handleClickOverlay = useCallback(
    (e: MouseEvent<HTMLDivElement>, overlayId: string) => {
      // 오버레이 자체를 클릭한 경우에만 닫기 (자식 요소 클릭은 제외)
      if (e.target instanceof HTMLElement && e.target.id === overlayId) {
        onClose();
      }
    },
    [onClose]
  );

  return { handleClickOverlay };
}
