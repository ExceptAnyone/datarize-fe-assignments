import { Customer } from '../types'

export interface CustomersResponse {
  data: Customer[]
}

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

  if (!response.ok) {
    throw new Error(`고객 목록을 불러오는데 실패했습니다: ${response.statusText}`)
  }

  const result: CustomersResponse = await response.json()
  return result.data
}
