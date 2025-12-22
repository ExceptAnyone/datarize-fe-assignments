import { QueryClient } from '@tanstack/react-query'

const DEFAULT_STALE_TIME_MS = 5 * 60 * 1000 // 5분
const DEFAULT_GC_TIME_MS = 10 * 60 * 1000 // 10분
const DEFAULT_RETRY_COUNT = 1

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: DEFAULT_STALE_TIME_MS,
      gcTime: DEFAULT_GC_TIME_MS,
      retry: DEFAULT_RETRY_COUNT,
      refetchOnWindowFocus: false,
    },
  },
})
