import { useState, useCallback } from 'react'
import type { PurchaseFrequencyParams } from '../api/purchaseFrequency'

/**
 * 날짜 범위 필터 상태를 관리하는 훅
 * @param initialRange 초기 날짜 범위
 * @returns 날짜 범위 상태 및 업데이트 함수들
 */
export function useDateRangeFilter(initialRange?: PurchaseFrequencyParams) {
  const [dateRange, setDateRange] = useState<PurchaseFrequencyParams>(initialRange ?? {})

  /**
   * 시작 날짜 설정
   */
  const setFromDate = useCallback((date: string) => {
    setDateRange((prev) => ({ ...prev, from: date }))
  }, [])

  /**
   * 종료 날짜 설정
   */
  const setToDate = useCallback((date: string) => {
    setDateRange((prev) => ({ ...prev, to: date }))
  }, [])

  /**
   * 날짜 범위 초기화
   */
  const resetDateRange = useCallback(() => {
    setDateRange({})
  }, [])

  /**
   * 단일 날짜 선택 (from과 to를 동일하게 설정)
   */
  const setSingleDate = useCallback((date: string) => {
    setDateRange({ from: date, to: date })
  }, [])

  /**
   * 날짜 범위가 유효한지 확인
   */
  const isValid = useCallback((): boolean => {
    if (!dateRange.from || !dateRange.to) {
      return true // 둘 다 없으면 필터 없음 (유효)
    }

    const fromDate = new Date(dateRange.from)
    const toDate = new Date(dateRange.to)

    return fromDate <= toDate
  }, [dateRange])

  return {
    dateRange,
    setDateRange,
    setFromDate,
    setToDate,
    resetDateRange,
    setSingleDate,
    isValid,
  }
}
