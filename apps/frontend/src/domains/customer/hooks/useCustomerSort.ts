import { useState } from 'react'

/** 정렬 가능한 필드 타입 */
export type SortField = 'id' | 'count' | 'totalAmount'

/** 정렬 순서 타입 */
export type SortOrder = 'asc' | 'desc'

/**
 * 고객 정렬 훅
 * 정렬 필드와 순서를 관리합니다.
 *
 * @returns 정렬 상태 및 핸들러
 */
export function useCustomerSort() {
  // 정렬 필드 (기본값: ID)
  const [sortBy, setSortBy] = useState<SortField>('id')

  // 정렬 순서 (기본값: 오름차순)
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc')

  /**
   * 정렬 토글 함수
   * 같은 필드를 클릭하면 순서를 반전하고,
   * 다른 필드를 클릭하면 해당 필드로 변경하고 오름차순으로 설정
   *
   * @param field - 정렬할 필드
   */
  const toggleSort = (field: SortField) => {
    if (sortBy === field) {
      // 같은 필드 클릭: 순서 반전
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      // 다른 필드 클릭: 필드 변경 + 오름차순
      setSortBy(field)
      setSortOrder('asc')
    }
  }

  return {
    /** 현재 정렬 필드 */
    sortBy,
    /** 현재 정렬 순서 */
    sortOrder,
    /** 정렬 토글 핸들러 */
    toggleSort,
  }
}
