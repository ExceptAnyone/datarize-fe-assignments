import { useState, useEffect, useCallback } from 'react'
import { getUrlParam, setUrlParam } from './urlState'

/**
 * URL 상태를 관리하는 커스텀 훅
 * useState처럼 동작하지만 상태를 URL에 동기화합니다.
 *
 * @param key - URL 파라미터 키
 * @param defaultValue - 기본값
 * @returns [현재 값, 값 설정 함수]
 *
 * @example
 * const [searchTerm, setSearchTerm] = useUrlState('search', '')
 * // URL: ?search=hello
 */
export function useUrlState(key: string, defaultValue: string = ''): [string, (value: string) => void] {
  // URL에서 초기값 가져오기
  const [state, setState] = useState<string>(() => getUrlParam(key, defaultValue))

  // 상태 변경 시 URL 업데이트
  const setUrlState = useCallback(
    (value: string) => {
      setState(value)
      setUrlParam(key, value || null)
    },
    [key],
  )

  // popstate 이벤트 리스너 (뒤로가기/앞으로가기)
  useEffect(() => {
    const handlePopState = () => {
      const newValue = getUrlParam(key, defaultValue)
      setState(newValue)
    }

    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [key, defaultValue])

  return [state, setUrlState]
}

/**
 * 숫자형 URL 상태 관리 훅
 *
 * @param key - URL 파라미터 키
 * @param defaultValue - 기본값
 * @returns [현재 값, 값 설정 함수]
 */
export function useUrlStateNumber(key: string, defaultValue: number = 0): [number, (value: number) => void] {
  const [stringValue, setStringValue] = useUrlState(key, defaultValue.toString())

  const numberValue = parseInt(stringValue, 10) || defaultValue

  const setNumberValue = useCallback(
    (value: number) => {
      setStringValue(value.toString())
    },
    [setStringValue],
  )

  return [numberValue, setNumberValue]
}

/**
 * 불리언형 URL 상태 관리 훅
 *
 * @param key - URL 파라미터 키
 * @param defaultValue - 기본값
 * @returns [현재 값, 값 설정 함수]
 */
export function useUrlStateBoolean(key: string, defaultValue: boolean = false): [boolean, (value: boolean) => void] {
  const [stringValue, setStringValue] = useUrlState(key, defaultValue ? 'true' : '')

  const booleanValue = stringValue === 'true'

  const setBooleanValue = useCallback(
    (value: boolean) => {
      setStringValue(value ? 'true' : '')
    },
    [setStringValue],
  )

  return [booleanValue, setBooleanValue]
}
