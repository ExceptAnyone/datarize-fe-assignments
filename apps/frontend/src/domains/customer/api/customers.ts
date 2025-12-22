import { Customer } from '../types'

export interface CustomersParams {
  /** 정렬 기준 (구매 금액 순) */
  sortBy?: 'asc' | 'desc'
  /** 이름 검색 */
  name?: string
}

const CUSTOMERS_ENDPOINT = '/api/customers'

export async function fetchCustomers(params?: CustomersParams): Promise<Customer[]> {
  const queryString = params ? `?${new URLSearchParams(params as Record<string, string>).toString()}` : ''

  const response = await fetch(`${CUSTOMERS_ENDPOINT}${queryString}`)

  // 404는 검색 결과가 없는 것으로 처리 (빈 배열 반환)
  if (response.status === 404) {
    return []
  }

  if (!response.ok) {
    throw new Error(`고객 목록을 불러오는데 실패했습니다: ${response.statusText}`)
  }

  const result: Customer[] = await response.json()
  return result
}
