import { useCallback, useEffect } from 'react'
import { useUrlState } from '../../../lib/url-state/useUrlState'
import type { PurchaseFrequencyParams } from '../api/purchaseFrequency'

/**
 * 날짜 범위 필터 상태를 관리하는 훅
 * URL을 통해 상태를 유지하여 새로고침 시에도 날짜 범위가 보존됩니다.
 *
 * @param initialRange 초기 날짜 범위
 * @returns 날짜 범위 상태 및 업데이트 함수들
 */
export function useDateRangeFilter(initialRange?: PurchaseFrequencyParams) {
  // URL에서 날짜 범위 상태 관리
  const [fromDate, setFromDateInternal] = useUrlState('from', initialRange?.from || '')
  const [toDate, setToDateInternal] = useUrlState('to', initialRange?.to || '')

  // 초기 마운트 시 initialRange가 있고 URL에 값이 없으면 URL 업데이트
  useEffect(() => {
    if (initialRange?.from && !fromDate) {
      setFromDateInternal(initialRange.from)
    }
    if (initialRange?.to && !toDate) {
      setToDateInternal(initialRange.to)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const dateRange: PurchaseFrequencyParams = {
    ...(fromDate && { from: fromDate }),
    ...(toDate && { to: toDate }),
  }

  /**
   * 시작 날짜 설정
   */
  const setFromDate = useCallback(
    (date: string) => {
      setFromDateInternal(date)
    },
    [setFromDateInternal],
  )

  /**
   * 종료 날짜 설정
   */
  const setToDate = useCallback(
    (date: string) => {
      setToDateInternal(date)
    },
    [setToDateInternal],
  )

  /**
   * 날짜 범위 초기화
   */
  const resetDateRange = useCallback(() => {
    setFromDateInternal('')
    setToDateInternal('')
  }, [setFromDateInternal, setToDateInternal])

  /**
   * 단일 날짜 선택 (from과 to를 동일하게 설정)
   */
  const setSingleDate = useCallback(
    (date: string) => {
      setFromDateInternal(date)
      setToDateInternal(date)
    },
    [setFromDateInternal, setToDateInternal],
  )

  /**
   * 날짜 범위가 유효한지 확인
   */
  const isValid = useCallback((): boolean => {
    if (!dateRange.from || !dateRange.to) {
      return true // 둘 다 없으면 필터 없음 (유효)
    }

    const fromDateObj = new Date(dateRange.from)
    const toDateObj = new Date(dateRange.to)

    return fromDateObj <= toDateObj
  }, [dateRange])

  return {
    dateRange,
    setFromDate,
    setToDate,
    resetDateRange,
    setSingleDate,
    isValid,
  }
}
