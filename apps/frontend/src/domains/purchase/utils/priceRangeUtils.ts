/**
 * 가격대별 구매 빈도 분석을 위한 유틸리티 함수
 */

/**
 * 가격 범위 정의
 * 2만원 이하부터 10만원 이상까지 만원 단위로 구분
 */
export const PRICE_RANGES = [
  { min: 0, max: 20000, label: '2만원 이하' },
  { min: 20000, max: 30000, label: '2만원대' },
  { min: 30000, max: 40000, label: '3만원대' },
  { min: 40000, max: 50000, label: '4만원대' },
  { min: 50000, max: 60000, label: '5만원대' },
  { min: 60000, max: 70000, label: '6만원대' },
  { min: 70000, max: 80000, label: '7만원대' },
  { min: 80000, max: 90000, label: '8만원대' },
  { min: 90000, max: 100000, label: '9만원대' },
  { min: 100000, max: Infinity, label: '10만원 이상' },
] as const;

/**
 * 가격을 해당하는 가격대 범위로 분류
 * @param price 상품 가격
 * @returns 가격대 라벨 (예: '2만원대', '10만원 이상')
 */
export function categorizePriceRange(price: number): string {
  const range = PRICE_RANGES.find((r) => price >= r.min && price < r.max);
  return range?.label ?? 'Unknown';
}

/**
 * 구매 데이터를 가격대별로 그룹화하여 빈도수 계산
 * @param purchases 구매 데이터 배열 (각 항목은 price 속성을 가져야 함)
 * @returns 가격대별 구매 빈도 데이터
 */
export function groupByPriceRange(
  purchases: Array<{ price: number }>
): Array<{ range: string; count: number }> {
  // 가격대별 구매 횟수를 저장할 Map
  const grouped = new Map<string, number>();

  // 각 구매 데이터를 가격대별로 분류하고 카운트
  purchases.forEach((purchase) => {
    const rangeLabel = categorizePriceRange(purchase.price);
    grouped.set(rangeLabel, (grouped.get(rangeLabel) ?? 0) + 1);
  });

  // PRICE_RANGES 순서대로 결과 반환 (빈도가 0인 범위도 포함)
  return PRICE_RANGES.map((range) => ({
    range: range.label,
    count: grouped.get(range.label) ?? 0,
  }));
}
