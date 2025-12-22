export interface PurchaseFrequencyData {
  /** 가격 범위 (예: "0-20000", "20000-30000") */
  range: string
  /** 해당 가격대의 구매 횟수 */
  count: number
}

/**
 * API 요청 파라미터 타입
 */
export interface PurchaseFrequencyParams {
  /** 시작 날짜 (ISO 8601 형식) */
  from?: string
  /** 종료 날짜 (ISO 8601 형식) */
  to?: string
}

const PURCHASE_FREQUENCY_ENDPOINT = '/api/purchase-frequency'

/**
 * 가격대별 구매 빈도 데이터를 가져오는 API 함수
 * @param params - 날짜 범위 파라미터 (선택사항)
 * @returns 가격대별 구매 빈도 데이터 배열
 */
export async function fetchPurchaseFrequency(params?: PurchaseFrequencyParams): Promise<PurchaseFrequencyData[]> {
  // 날짜를 ISO 8601 형식으로 변환
  const queryParams: Record<string, string> = {}

  if (params?.from) {
    // YYYY-MM-DD를 ISO 8601로 변환 (시작 시간: 00:00:00)
    const fromDate = new Date(params.from)
    fromDate.setHours(0, 0, 0, 0)
    queryParams.from = fromDate.toISOString()
  }

  if (params?.to) {
    // YYYY-MM-DD를 ISO 8601로 변환 (종료 시간: 23:59:59)
    const toDate = new Date(params.to)
    toDate.setHours(23, 59, 59, 999)
    queryParams.to = toDate.toISOString()
  }

  const queryString = Object.keys(queryParams).length > 0 ? `?${new URLSearchParams(queryParams).toString()}` : ''

  const response = await fetch(`${PURCHASE_FREQUENCY_ENDPOINT}${queryString}`)

  if (!response.ok) {
    throw new Error(`구매 빈도 데이터를 불러오는데 실패했습니다: ${response.statusText}`)
  }

  const result: PurchaseFrequencyData[] = await response.json()
  return result
}
