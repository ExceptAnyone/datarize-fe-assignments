import { useState, useEffect } from 'react'
import { useUrlState } from '../../../lib/url-state/useUrlState'

/**
 * 고객 검색 훅
 * 검색어 입력과 디바운스 처리를 관리합니다.
 * URL을 통해 검색어를 유지하여 새로고침 시에도 검색 상태가 보존됩니다.
 *
 * @param debounceMs - 디바운스 지연 시간 (기본값: 300ms)
 * @returns 검색어 상태 및 핸들러
 */
export function useCustomerSearch(debounceMs = 300) {
  // URL에서 검색어 상태 관리
  const [urlSearchTerm, setUrlSearchTerm] = useUrlState('search', '')

  // 즉시 반영되는 검색어 (Input value)
  const [searchTerm, setSearchTerm] = useState(urlSearchTerm)

  // 디바운스된 검색어 (실제 API 호출에 사용)
  const [debouncedTerm, setDebouncedTerm] = useState(urlSearchTerm)

  // URL에서 초기값 로드
  useEffect(() => {
    setSearchTerm(urlSearchTerm)
    setDebouncedTerm(urlSearchTerm)
  }, [urlSearchTerm])

  // 디바운스 로직 + URL 동기화
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedTerm(searchTerm)
      setUrlSearchTerm(searchTerm) // URL에 반영
    }, debounceMs)

    // cleanup: 이전 타이머 취소
    return () => {
      clearTimeout(handler)
    }
  }, [searchTerm, debounceMs, setUrlSearchTerm])

  return {
    /** 현재 입력된 검색어 */
    searchTerm,
    /** 디바운스가 적용된 검색어 (API 호출용) */
    debouncedTerm,
    /** 검색어 변경 핸들러 */
    setSearchTerm,
  }
}
