import { useMemo } from 'react'
import type { Customer } from '../types'

interface UsePaginatedCustomersOptions {
  customers: Customer[]
  startIndex: number
  endIndex: number
}

/**
 * 페이지네이션된 고객 목록 반환 훅
 *
 * @param customers - 전체 고객 목록
 * @param startIndex - 시작 인덱스
 * @param endIndex - 끝 인덱스
 * @returns 현재 페이지에 표시할 고객 목록
 */
export function usePaginatedCustomers({ customers, startIndex, endIndex }: UsePaginatedCustomersOptions): Customer[] {
  return useMemo(() => {
    return customers.slice(startIndex, endIndex)
  }, [customers, startIndex, endIndex])
}
