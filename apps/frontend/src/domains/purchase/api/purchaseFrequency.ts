export interface PurchaseFrequencyData {
  /** 가격 범위 (예: "0-20000", "20000-30000") */
  range: string
  /** 해당 가격대의 구매 횟수 */
  count: number
}

export interface PurchaseFrequencyResponse {
  data: PurchaseFrequencyData[]
}

/**
 * API 요청 파라미터 타입
 */
export interface PurchaseFrequencyParams {
  /** 시작 날짜  */
  from?: string
  /** 종료 날짜  */
  to?: string
}

const PURCHASE_FREQUENCY_ENDPOINT = '/api/purchase-frequency'

/**
 * 가격대별 구매 빈도 데이터를 가져오는 API 함수
 * @param params - 날짜 범위 파라미터 (선택사항)
 * @returns 가격대별 구매 빈도 데이터 배열
 */
export async function fetchPurchaseFrequency(params?: PurchaseFrequencyParams): Promise<PurchaseFrequencyData[]> {
  const queryString = params ? `?${new URLSearchParams(params as Record<string, string>).toString()}` : ''

  const response = await fetch(`${PURCHASE_FREQUENCY_ENDPOINT}${queryString}`)

  if (!response.ok) {
    throw new Error(`구매 빈도 데이터를 불러오는데 실패했습니다: ${response.statusText}`)
  }

  const result: PurchaseFrequencyResponse = await response.json()
  return result.data
}
