/**
 * 고객 기본 정보 타입
 */
export interface Customer {
  /** 고객 ID */
  id: number
  /** 고객 이름 */
  name: string
  /** 총 구매 횟수 */
  count: number
  /** 총 구매 금액 */
  totalAmount: number
}

/**
 * 제품 정보 타입
 */
export interface Product {
  /** 제품 ID */
  id: string
  /** 제품명 */
  name: string
  /** 제품 가격 */
  price: number
  /** 제품 썸네일 URL */
  imgSrc: string
}

/**
 * 고객 구매 내역 타입 (백엔드 응답 구조에 맞춤)
 */
export interface CustomerPurchase {
  /** 구매 날짜 */
  date: string
  /** 구매 수량 */
  quantity: number
  /** 제품명 */
  product: string
  /** 총 가격 */
  price: number
  /** 제품 썸네일 URL */
  imgSrc: string
}
