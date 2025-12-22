import { useQuery, UseQueryResult } from '@tanstack/react-query'
import { customerQueryKeys } from '../api/queryKeys'
import { Customer } from '../types'
import { CustomersParams } from '../api/customers'

/**
 * 고객 목록을 가져오는 React Query 훅
 * @param params - 정렬 및 검색 파라미터 (선택사항)
 * @returns 고객 목록 쿼리 결과
 */
export function useCustomers(params?: CustomersParams): UseQueryResult<Customer[], Error> {
  return useQuery(customerQueryKeys.list(params))
}
