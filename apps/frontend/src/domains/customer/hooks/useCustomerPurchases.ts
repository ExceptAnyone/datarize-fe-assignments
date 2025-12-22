import { useQuery, UseQueryResult } from '@tanstack/react-query'
import { customerQueryKeys } from '../api/queryKeys'
import { CustomerPurchase } from '../types'

/**
 * 특정 고객의 구매 내역을 가져오는 React Query 훅
 * @param customerId - 고객 ID
 * @param enabled - 쿼리 실행 여부 (선택사항)
 * @returns 고객 구매 내역 쿼리 결과
 */
export function useCustomerPurchases(customerId: string, enabled = true): UseQueryResult<CustomerPurchase[], Error> {
  return useQuery({
    ...customerQueryKeys.purchases(customerId),
    enabled: enabled && !!customerId, // customerId가 있고 enabled가 true일 때만 실행
  })
}
