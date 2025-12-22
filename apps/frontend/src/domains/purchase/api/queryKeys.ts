import { queryOptions } from '@tanstack/react-query'
import { fetchPurchaseFrequency, PurchaseFrequencyParams } from './purchaseFrequency'

const PURCHASE_FREQUENCY_STALE_TIME_MS = 5 * 60 * 1000 // 5분
const PURCHASE_FREQUENCY_GC_TIME_MS = 10 * 60 * 1000 // 10분

export const purchaseQueryKeys = {
  all: () => ['purchases'] as const,

  /**
   * 구매 빈도 관련 쿼리들의 상위 키
   */
  frequencies: () => [...purchaseQueryKeys.all(), 'frequency'] as const,

  /**
   * 특정 파라미터를 가진 구매 빈도 쿼리
   * @param params - 날짜 범위 파라미터
   */
  frequency: (params?: PurchaseFrequencyParams) =>
    queryOptions({
      queryKey: [...purchaseQueryKeys.frequencies(), params] as const,
      queryFn: () => fetchPurchaseFrequency(params),
      staleTime: PURCHASE_FREQUENCY_STALE_TIME_MS,
      gcTime: PURCHASE_FREQUENCY_GC_TIME_MS,
    }),
}
