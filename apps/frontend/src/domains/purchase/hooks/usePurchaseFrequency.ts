import { useSuspenseQuery, UseSuspenseQueryResult } from '@tanstack/react-query'
import { purchaseQueryKeys } from '../api/queryKeys'
import { PurchaseFrequencyData, PurchaseFrequencyParams } from '../api/purchaseFrequency'

/**
 * 가격대별 구매 빈도 데이터를 가져오는 React Query 훅
 * @param params - 날짜 범위 파라미터 (선택사항)
 * @returns 구매 빈도 데이터 쿼리 결과
 */
export function usePurchaseFrequency(
  params?: PurchaseFrequencyParams,
): UseSuspenseQueryResult<PurchaseFrequencyData[], Error> {
  return useSuspenseQuery(purchaseQueryKeys.frequency(params))
}
