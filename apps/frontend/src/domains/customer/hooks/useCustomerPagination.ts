import { useState, useEffect } from 'react'
import { useUrlStateNumber } from '../../../lib/url-state/useUrlState'

/** 고객 목록 페이지당 기본 표시 개수 */
const DEFAULT_ITEMS_PER_PAGE = 10

/** 페이지네이션 시작 페이지 번호 */
const INITIAL_PAGE_NUMBER = 1

export interface UseCustomerPaginationOptions {
  /** 전체 아이템 수 */
  totalItems: number
  /** 페이지당 아이템 수 (기본값: 10) */
  itemsPerPage?: number
  /** 초기 페이지 (기본값: 1) */
  initialPage?: number
}

export interface UseCustomerPaginationReturn {
  /** 현재 페이지 번호 (1부터 시작) */
  currentPage: number
  /** 총 페이지 수 */
  totalPages: number
  /** 현재 페이지의 시작 인덱스 (0부터 시작) */
  startIndex: number
  /** 현재 페이지의 끝 인덱스 (배타적) */
  endIndex: number
  /** 페이지당 아이템 수 */
  itemsPerPage: number
  /** 특정 페이지로 이동 */
  goToPage: (page: number) => void
  /** 다음 페이지로 이동 */
  nextPage: () => void
  /** 이전 페이지로 이동 */
  prevPage: () => void
  /** 첫 페이지로 리셋 */
  resetPage: () => void
  /** 다음 페이지로 이동 가능 여부 */
  canGoNext: boolean
  /** 이전 페이지로 이동 가능 여부 */
  canGoPrev: boolean
}

/**
 * 고객 목록 페이지네이션 훅
 * 클라이언트 사이드 페이지네이션 로직 제공
 * URL을 통해 페이지 번호를 유지하여 새로고침 시에도 보존됩니다.
 *
 * @param options - 페이지네이션 옵션
 * @returns 페이지네이션 상태 및 제어 함수
 */
export function useCustomerPagination({
  totalItems,
  itemsPerPage = DEFAULT_ITEMS_PER_PAGE,
  initialPage = INITIAL_PAGE_NUMBER,
}: UseCustomerPaginationOptions): UseCustomerPaginationReturn {
  // URL에서 페이지 번호 관리
  const [urlPage, setUrlPage] = useUrlStateNumber('page', initialPage)

  // URL 페이지가 유효하지 않으면 내부 상태로 fallback
  const [currentPage, setCurrentPage] = useState(Math.max(1, urlPage))

  // URL 변경 시 내부 상태 동기화
  useEffect(() => {
    setCurrentPage(Math.max(1, urlPage))
  }, [urlPage])

  // 총 페이지 수 계산 (최소 1페이지)
  const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage))

  // 전체 아이템 수가 변경되면 현재 페이지가 범위를 벗어날 수 있으므로 보정
  useEffect(() => {
    if (currentPage > totalPages) {
      const newPage = totalPages
      setCurrentPage(newPage)
      setUrlPage(newPage)
    }
  }, [totalPages, currentPage, setUrlPage])

  // 현재 페이지의 시작/끝 인덱스
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = Math.min(startIndex + itemsPerPage, totalItems)

  // 페이지 이동 함수 (범위 검증 포함)
  const goToPage = (page: number) => {
    const validPage = Math.max(1, Math.min(page, totalPages))
    setCurrentPage(validPage)
    setUrlPage(validPage)
  }

  const nextPage = () => {
    if (currentPage < totalPages) {
      const newPage = currentPage + 1
      setCurrentPage(newPage)
      setUrlPage(newPage)
    }
  }

  const prevPage = () => {
    if (currentPage > 1) {
      const newPage = currentPage - 1
      setCurrentPage(newPage)
      setUrlPage(newPage)
    }
  }

  const resetPage = () => {
    setCurrentPage(1)
    setUrlPage(1)
  }

  // 이동 가능 여부
  const canGoNext = currentPage < totalPages
  const canGoPrev = currentPage > 1

  return {
    currentPage,
    totalPages,
    startIndex,
    endIndex,
    itemsPerPage,
    goToPage,
    nextPage,
    prevPage,
    resetPage,
    canGoNext,
    canGoPrev,
  }
}
