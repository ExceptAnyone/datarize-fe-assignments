/**
 * 고객 기본 정보 타입
 */
export interface Customer {
  /** 고객 ID */
  id: string
  /** 고객 이름 */
  name: string
  /** 총 구매 횟수 */
  totalPurchases: number
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
 * 고객 구매 내역 타입
 */
export interface CustomerPurchase {
  /** 구매 ID */
  id: string
  /** 고객 ID */
  customerId: string
  /** 구매한 제품 목록 */
  products: Product[]
  /** 구매 날짜  */
  date: string
}
