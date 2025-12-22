import { CustomerPurchase } from '../types'

export interface CustomerPurchasesResponse {
  data: CustomerPurchase[]
}

const CUSTOMERS_ENDPOINT = '/api/customers'

export async function fetchCustomerPurchases(customerId: string): Promise<CustomerPurchase[]> {
  const response = await fetch(`${CUSTOMERS_ENDPOINT}/${customerId}/purchases`)

  if (!response.ok) {
    throw new Error(`고객 구매 내역을 불러오는데 실패했습니다: ${response.statusText}`)
  }

  const result: CustomerPurchasesResponse = await response.json()
  return result.data
}
