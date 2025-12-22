import { useState, useEffect } from 'react'

/**
 * 고객 검색 훅
 * 검색어 입력과 디바운스 처리를 관리합니다.
 *
 * @param debounceMs - 디바운스 지연 시간 (기본값: 300ms)
 * @returns 검색어 상태 및 핸들러
 */
export function useCustomerSearch(debounceMs = 300) {
  // 즉시 반영되는 검색어 (Input value)
  const [searchTerm, setSearchTerm] = useState('')

  // 디바운스된 검색어 (실제 API 호출에 사용)
  const [debouncedTerm, setDebouncedTerm] = useState('')

  // 디바운스 로직
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedTerm(searchTerm)
    }, debounceMs)

    // cleanup: 이전 타이머 취소
    return () => {
      clearTimeout(handler)
    }
  }, [searchTerm, debounceMs])

  return {
    /** 현재 입력된 검색어 */
    searchTerm,
    /** 디바운스가 적용된 검색어 (API 호출용) */
    debouncedTerm,
    /** 검색어 변경 핸들러 */
    setSearchTerm,
  }
}
