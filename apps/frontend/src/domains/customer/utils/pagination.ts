/**
 * 페이지네이션 관련 유틸리티 함수
 */

/** 현재 페이지 좌우로 표시할 페이지 개수 */
const DEFAULT_PAGE_DELTA = 2

/** 모든 페이지를 표시할 최대 페이지 수 임계값 */
const FULL_PAGINATION_THRESHOLD = 7

/**
 * 표시할 페이지 번호 배열 계산
 * 예: 1 ... 5 6 [7] 8 9 ... 20
 *
 * @param currentPage - 현재 페이지 번호
 * @param totalPages - 총 페이지 수
 * @param delta - 현재 페이지 좌우로 보여줄 페이지 개수 (기본값: 2)
 * @returns 페이지 번호 배열 (숫자 또는 '...')
 *
 * @example
 * getPageNumbers(7, 20) // [1, '...', 5, 6, 7, 8, 9, '...', 20]
 * getPageNumbers(1, 5) // [1, 2, 3, 4, 5]
 */
export function getPageNumbers(
  currentPage: number,
  totalPages: number,
  delta: number = DEFAULT_PAGE_DELTA,
): (number | string)[] {
  if (totalPages <= FULL_PAGINATION_THRESHOLD) {
    // 7페이지 이하면 모두 표시
    return Array.from({ length: totalPages }, (_, i) => i + 1)
  }

  const range: number[] = []
  const withEllipsis: (number | string)[] = []

  // 현재 페이지 주변 범위 계산
  const start = Math.max(2, currentPage - delta)
  const end = Math.min(totalPages - 1, currentPage + delta)

  // 첫 페이지는 항상 포함
  range.push(1)

  // 중간 페이지들
  for (let i = start; i <= end; i++) {
    range.push(i)
  }

  // 마지막 페이지는 항상 포함
  if (totalPages > 1) {
    range.push(totalPages)
  }

  // 생략 표시(...) 추가
  let prev = 0
  range.forEach((page) => {
    if (page - prev > 1) {
      withEllipsis.push('...')
    }
    withEllipsis.push(page)
    prev = page
  })

  return withEllipsis
}
