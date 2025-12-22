import { queryOptions } from '@tanstack/react-query'
import { fetchCustomers, CustomersParams } from './customers'
import { fetchCustomerPurchases } from './customerPurchases'

const CUSTOMERS_STALE_TIME_MS = 5 * 60 * 1000 // 5분
const CUSTOMERS_GC_TIME_MS = 10 * 60 * 1000 // 10분
const CUSTOMER_PURCHASES_STALE_TIME_MS = 3 * 60 * 1000 // 3분
const CUSTOMER_PURCHASES_GC_TIME_MS = 10 * 60 * 1000 // 10분

/**
 * Customer 도메인의 Query Key 팩토리
 */
export const customerQueryKeys = {
  all: () => ['customers'] as const,
  lists: () => [...customerQueryKeys.all(), 'list'] as const,
  list: (params?: CustomersParams) =>
    queryOptions({
      queryKey: [...customerQueryKeys.lists(), params] as const,
      queryFn: () => fetchCustomers(params),
      staleTime: CUSTOMERS_STALE_TIME_MS,
      gcTime: CUSTOMERS_GC_TIME_MS,
    }),
  details: () => [...customerQueryKeys.all(), 'detail'] as const,
  detail: (customerId: string) => [...customerQueryKeys.details(), customerId] as const,
  purchases: (customerId: string) =>
    queryOptions({
      queryKey: [...customerQueryKeys.detail(customerId), 'purchases'] as const,
      queryFn: () => fetchCustomerPurchases(customerId),
      staleTime: CUSTOMER_PURCHASES_STALE_TIME_MS,
      gcTime: CUSTOMER_PURCHASES_GC_TIME_MS,
    }),
}
