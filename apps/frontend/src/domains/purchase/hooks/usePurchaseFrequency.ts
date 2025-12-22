import { useQuery, UseQueryResult } from '@tanstack/react-query'
import { purchaseQueryKeys } from '../api/queryKeys'
import { PurchaseFrequencyData, PurchaseFrequencyParams } from '../api/purchaseFrequency'

/**
 * 가격대별 구매 빈도 데이터를 가져오는 React Query 훅
 * @param params - 날짜 범위 파라미터 (선택사항)
 * @returns 구매 빈도 데이터 쿼리 결과
 */
export function usePurchaseFrequency(params?: PurchaseFrequencyParams): UseQueryResult<PurchaseFrequencyData[], Error> {
  // 날짜 범위가 부분적으로만 입력된 경우 API 호출하지 않음
  // from과 to가 모두 있거나, 모두 없을 때만 실행
  const hasFrom = !!params?.from
  const hasTo = !!params?.to
  const isValidRange = (hasFrom && hasTo) || (!hasFrom && !hasTo)

  return useQuery({
    ...purchaseQueryKeys.frequency(params),
    enabled: isValidRange,
  })
}
