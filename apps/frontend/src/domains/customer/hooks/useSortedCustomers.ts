import { useMemo } from 'react'
import type { Customer } from '../types'

interface UseSortedCustomersOptions {
  customers: Customer[] | undefined
  sortBy: 'id' | 'name' | 'count' | 'totalAmount'
  sortOrder: 'asc' | 'desc'
}

/**
 * 고객 목록 정렬 훅
 * API가 totalAmount만 정렬하므로, 나머지는 클라이언트에서 정렬
 *
 * @param customers - 고객 목록
 * @param sortBy - 정렬 기준
 * @param sortOrder - 정렬 순서
 * @returns 정렬된 고객 목록
 */
export function useSortedCustomers({ customers, sortBy, sortOrder }: UseSortedCustomersOptions): Customer[] {
  return useMemo(() => {
    if (!customers) return []

    // API가 이미 totalAmount로 정렬한 경우 그대로 반환
    if (sortBy === 'totalAmount') {
      return customers
    }

    // 클라이언트 사이드 정렬
    const sorted = [...customers].sort((a, b) => {
      let comparison = 0

      switch (sortBy) {
        case 'id':
          comparison = a.id - b.id
          break
        case 'count':
          comparison = a.count - b.count
          break
        case 'name':
          comparison = a.name.localeCompare(b.name)
          break
        default:
          return 0
      }

      return sortOrder === 'asc' ? comparison : -comparison
    })

    return sorted
  }, [customers, sortBy, sortOrder])
}
