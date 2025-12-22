/**
 * 가격 범위를 사용자 친화적으로 변환
 * @param range - 백엔드에서 받은 가격 범위 (예: "0 - 20000", "20001 - 30000")
 * @returns 사용자 친화적 (예: "2만원 이하", "2만원대")
 */
export function formatPriceRange(range: string): string {
  // "0 - 20000" 형태를 파싱 (공백 여부와 관계없이)
  const parts = range.split('-').map((s) => s.trim())
  const min = parseInt(parts[0], 10)
  const max = parseInt(parts[1], 10)

  if (min === 0 && max <= 20000) {
    return '2만원 이하'
  } else if (max >= 100001) {
    return '10만원 이상'
  } else {
    // 2만원대, 3만원대 등
    const rangeInManWon = Math.floor(min / 10000)
    return `${rangeInManWon}만원대`
  }
}
