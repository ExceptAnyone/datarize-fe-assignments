/**
 * 날짜 범위를 사용자 친화적인 텍스트로 변환
 * @param from - 시작 날짜 (YYYY-MM-DD)
 * @param to - 종료 날짜 (YYYY-MM-DD)
 * @returns 날짜 범위 텍스트 (예: "2024년 7월 분석", "2025년 7월 ~ 9월 분석")
 */
export function formatDateRangeText(from?: string, to?: string): string {
  // 날짜가 선택되지 않은 경우 기본값
  if (!from || !to) {
    return '2024년 7월 분석'
  }

  const fromDate = new Date(from)
  const toDate = new Date(to)

  const fromYear = fromDate.getFullYear()
  const fromMonth = fromDate.getMonth() + 1
  const toYear = toDate.getFullYear()
  const toMonth = toDate.getMonth() + 1

  // 같은 연도, 같은 월
  if (fromYear === toYear && fromMonth === toMonth) {
    return `${fromYear}년 ${fromMonth}월 분석`
  }

  // 같은 연도, 다른 월
  if (fromYear === toYear) {
    return `${fromYear}년 ${fromMonth}월 ~ ${toMonth}월 분석`
  }

  // 다른 연도
  return `${fromYear}년 ${fromMonth}월 ~ ${toYear}년 ${toMonth}월 분석`
}
