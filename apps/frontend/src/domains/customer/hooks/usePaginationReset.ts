import { useEffect } from 'react'

interface UsePaginationResetOptions {
  resetPage: () => void
  dependencies: readonly unknown[]
}

/**
 * 의존성 변경 시 페이지를 첫 페이지로 리셋하는 훅
 *
 * @param resetPage - 페이지 리셋 함수
 * @param dependencies - 감지할 의존성 배열
 *
 * @example
 * usePaginationReset({
 *   resetPage: pagination.resetPage,
 *   dependencies: [searchTerm, sortBy, sortOrder]
 * })
 */
export function usePaginationReset({ resetPage, dependencies }: UsePaginationResetOptions): void {
  useEffect(() => {
    resetPage()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, dependencies)
}
