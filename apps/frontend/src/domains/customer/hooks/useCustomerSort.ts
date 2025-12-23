import { useCallback } from 'react'
import { useUrlState } from '../../../lib/url-state/useUrlState'

/** 정렬 가능한 필드 타입 */
export type SortField = 'id' | 'count' | 'totalAmount'

/** 정렬 순서 타입 */
export type SortOrder = 'asc' | 'desc'

export interface UseCustomerSortReturn {
  /** 현재 정렬 필드 */
  sortBy: SortField
  /** 현재 정렬 순서 */
  sortOrder: SortOrder
  /** 정렬 토글 함수 */
  toggleSort: (field: SortField) => void
}

/**
 * 고객 정렬 훅
 * 정렬 필드와 순서를 관리합니다.
 * URL을 통해 정렬 상태를 유지하여 새로고침 시에도 보존됩니다.
 *
 * @returns 정렬 상태 및 핸들러
 */
export function useCustomerSort(): UseCustomerSortReturn {
  // URL에서 정렬 필드 관리 (기본값: ID)
  const [sortByUrl, setSortByUrl] = useUrlState('sortBy', 'id')
  const sortBy = (sortByUrl as SortField) || 'id'

  // URL에서 정렬 순서 관리 (기본값: 오름차순)
  const [sortOrderUrl, setSortOrderUrl] = useUrlState('sortOrder', 'asc')
  const sortOrder = (sortOrderUrl as SortOrder) || 'asc'

  /**
   * 정렬 토글 함수
   * 같은 필드를 클릭하면 순서를 반전하고,
   * 다른 필드를 클릭하면 해당 필드로 변경하고 오름차순으로 설정
   *
   * @param field - 정렬할 필드
   */
  const toggleSort = useCallback(
    (field: SortField) => {
      if (sortBy === field) {
        // 같은 필드 클릭: 순서 반전
        const newOrder = sortOrder === 'asc' ? 'desc' : 'asc'
        setSortOrderUrl(newOrder)
      } else {
        // 다른 필드 클릭: 필드 변경 + 오름차순
        setSortByUrl(field)
        setSortOrderUrl('asc')
      }
    },
    [sortBy, sortOrder, setSortByUrl, setSortOrderUrl],
  )

  return {
    sortBy,
    sortOrder,
    toggleSort,
  }
}
