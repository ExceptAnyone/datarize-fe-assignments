/**
 * URL 상태 관리 유틸리티
 * Query Parameters를 통해 애플리케이션 상태를 URL에 저장하고 복원합니다.
 * 새로고침 시에도 상태가 유지되어 사용자 경험을 개선합니다.
 */

/**
 * URL Search Params를 객체로 변환
 */
export function getSearchParams(): URLSearchParams {
  return new URLSearchParams(window.location.search)
}

/**
 * URL에서 특정 파라미터 값 가져오기
 *
 * @param key - 파라미터 키
 * @param defaultValue - 기본값
 * @returns 파라미터 값 또는 기본값
 */
export function getUrlParam(key: string, defaultValue: string = ''): string {
  const params = getSearchParams()
  return params.get(key) || defaultValue
}

/**
 * URL에 파라미터 설정 (브라우저 히스토리에 추가하지 않음)
 *
 * @param key - 파라미터 키
 * @param value - 파라미터 값 (null이면 삭제)
 */
export function setUrlParam(key: string, value: string | null): void {
  const params = getSearchParams()

  if (value === null || value === '') {
    params.delete(key)
  } else {
    params.set(key, value)
  }

  const newUrl = params.toString() ? `${window.location.pathname}?${params.toString()}` : window.location.pathname

  window.history.replaceState({}, '', newUrl)
}

/**
 * 여러 파라미터를 한 번에 설정
 *
 * @param updates - 키-값 쌍 객체
 */
export function setUrlParams(updates: Record<string, string | null>): void {
  const params = getSearchParams()

  Object.entries(updates).forEach(([key, value]) => {
    if (value === null || value === '') {
      params.delete(key)
    } else {
      params.set(key, value)
    }
  })

  const newUrl = params.toString() ? `${window.location.pathname}?${params.toString()}` : window.location.pathname

  window.history.replaceState({}, '', newUrl)
}

/**
 * URL 파라미터 삭제
 *
 * @param key - 삭제할 파라미터 키
 */
export function removeUrlParam(key: string): void {
  setUrlParam(key, null)
}

/**
 * 여러 URL 파라미터 삭제
 *
 * @param keys - 삭제할 파라미터 키 배열
 */
export function removeUrlParams(keys: string[]): void {
  const params = getSearchParams()

  keys.forEach((key) => params.delete(key))

  const newUrl = params.toString() ? `${window.location.pathname}?${params.toString()}` : window.location.pathname

  window.history.replaceState({}, '', newUrl)
}

/**
 * 모든 URL 파라미터 초기화
 */
export function clearUrlParams(): void {
  window.history.replaceState({}, '', window.location.pathname)
}
