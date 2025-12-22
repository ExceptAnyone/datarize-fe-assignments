import type { PurchaseFrequencyData, PurchaseFrequencyParams } from './purchaseFrequency';
import { groupByPriceRange } from '../utils/priceRangeUtils';

/**
 * 개별 구매 데이터 타입
 */
interface Purchase {
  id: number;
  customerId: number;
  productId: number;
  price: number;
  date: string; // ISO 8601 형식
}

/**
 * 7월 한 달간의 목 구매 데이터 (150건)
 * 다양한 가격대와 날짜 분포
 */
const MOCK_PURCHASES: Purchase[] = [
  // 7월 1일
  { id: 1, customerId: 1, productId: 101, price: 15000, date: '2024-07-01' },
  { id: 2, customerId: 2, productId: 102, price: 45000, date: '2024-07-01' },
  { id: 3, customerId: 3, productId: 103, price: 89000, date: '2024-07-01' },
  { id: 4, customerId: 4, productId: 104, price: 120000, date: '2024-07-01' },
  { id: 5, customerId: 5, productId: 105, price: 25000, date: '2024-07-01' },

  // 7월 2일
  { id: 6, customerId: 6, productId: 106, price: 18000, date: '2024-07-02' },
  { id: 7, customerId: 7, productId: 107, price: 52000, date: '2024-07-02' },
  { id: 8, customerId: 8, productId: 108, price: 75000, date: '2024-07-02' },
  { id: 9, customerId: 1, productId: 109, price: 33000, date: '2024-07-02' },
  { id: 10, customerId: 2, productId: 110, price: 95000, date: '2024-07-02' },

  // 7월 3일
  { id: 11, customerId: 9, productId: 111, price: 12000, date: '2024-07-03' },
  { id: 12, customerId: 10, productId: 112, price: 68000, date: '2024-07-03' },
  { id: 13, customerId: 3, productId: 113, price: 42000, date: '2024-07-03' },
  { id: 14, customerId: 11, productId: 114, price: 110000, date: '2024-07-03' },
  { id: 15, customerId: 12, productId: 115, price: 28000, date: '2024-07-03' },

  // 7월 4일-5일
  { id: 16, customerId: 4, productId: 116, price: 55000, date: '2024-07-04' },
  { id: 17, customerId: 13, productId: 117, price: 38000, date: '2024-07-04' },
  { id: 18, customerId: 5, productId: 118, price: 92000, date: '2024-07-04' },
  { id: 19, customerId: 14, productId: 119, price: 17000, date: '2024-07-05' },
  { id: 20, customerId: 6, productId: 120, price: 64000, date: '2024-07-05' },

  // 7월 6일-7일
  { id: 21, customerId: 15, productId: 121, price: 23000, date: '2024-07-06' },
  { id: 22, customerId: 7, productId: 122, price: 47000, date: '2024-07-06' },
  { id: 23, customerId: 16, productId: 123, price: 81000, date: '2024-07-06' },
  { id: 24, customerId: 8, productId: 124, price: 135000, date: '2024-07-07' },
  { id: 25, customerId: 17, productId: 125, price: 29000, date: '2024-07-07' },

  // 7월 8일-10일
  { id: 26, customerId: 9, productId: 126, price: 56000, date: '2024-07-08' },
  { id: 27, customerId: 18, productId: 127, price: 19000, date: '2024-07-08' },
  { id: 28, customerId: 10, productId: 128, price: 72000, date: '2024-07-09' },
  { id: 29, customerId: 19, productId: 129, price: 41000, date: '2024-07-09' },
  { id: 30, customerId: 11, productId: 130, price: 98000, date: '2024-07-10' },

  // 7월 11일-13일
  { id: 31, customerId: 20, productId: 131, price: 14000, date: '2024-07-11' },
  { id: 32, customerId: 12, productId: 132, price: 63000, date: '2024-07-11' },
  { id: 33, customerId: 13, productId: 133, price: 87000, date: '2024-07-12' },
  { id: 34, customerId: 21, productId: 134, price: 31000, date: '2024-07-12' },
  { id: 35, customerId: 14, productId: 135, price: 115000, date: '2024-07-13' },

  // 7월 14일-16일
  { id: 36, customerId: 15, productId: 136, price: 26000, date: '2024-07-14' },
  { id: 37, customerId: 22, productId: 137, price: 49000, date: '2024-07-14' },
  { id: 38, customerId: 16, productId: 138, price: 76000, date: '2024-07-15' },
  { id: 39, customerId: 23, productId: 139, price: 22000, date: '2024-07-15' },
  { id: 40, customerId: 17, productId: 140, price: 91000, date: '2024-07-16' },

  // 7월 17일-19일
  { id: 41, customerId: 18, productId: 141, price: 13000, date: '2024-07-17' },
  { id: 42, customerId: 24, productId: 142, price: 58000, date: '2024-07-17' },
  { id: 43, customerId: 19, productId: 143, price: 44000, date: '2024-07-18' },
  { id: 44, customerId: 25, productId: 144, price: 105000, date: '2024-07-18' },
  { id: 45, customerId: 20, productId: 145, price: 27000, date: '2024-07-19' },

  // 7월 20일-22일
  { id: 46, customerId: 21, productId: 146, price: 69000, date: '2024-07-20' },
  { id: 47, customerId: 26, productId: 147, price: 36000, date: '2024-07-20' },
  { id: 48, customerId: 22, productId: 148, price: 83000, date: '2024-07-21' },
  { id: 49, customerId: 27, productId: 149, price: 16000, date: '2024-07-21' },
  { id: 50, customerId: 23, productId: 150, price: 125000, date: '2024-07-22' },

  // 7월 23일-25일
  { id: 51, customerId: 24, productId: 151, price: 21000, date: '2024-07-23' },
  { id: 52, customerId: 28, productId: 152, price: 54000, date: '2024-07-23' },
  { id: 53, customerId: 25, productId: 153, price: 78000, date: '2024-07-24' },
  { id: 54, customerId: 29, productId: 154, price: 39000, date: '2024-07-24' },
  { id: 55, customerId: 26, productId: 155, price: 96000, date: '2024-07-25' },

  // 7월 26일-28일
  { id: 56, customerId: 27, productId: 156, price: 11000, date: '2024-07-26' },
  { id: 57, customerId: 30, productId: 157, price: 67000, date: '2024-07-26' },
  { id: 58, customerId: 28, productId: 158, price: 43000, date: '2024-07-27' },
  { id: 59, customerId: 1, productId: 159, price: 108000, date: '2024-07-27' },
  { id: 60, customerId: 29, productId: 160, price: 32000, date: '2024-07-28' },

  // 7월 29일-31일
  { id: 61, customerId: 30, productId: 161, price: 59000, date: '2024-07-29' },
  { id: 62, customerId: 2, productId: 162, price: 24000, date: '2024-07-29' },
  { id: 63, customerId: 3, productId: 163, price: 85000, date: '2024-07-30' },
  { id: 64, customerId: 4, productId: 164, price: 18000, date: '2024-07-30' },
  { id: 65, customerId: 5, productId: 165, price: 130000, date: '2024-07-31' },

  // 추가 데이터 (7월 전반기)
  { id: 66, customerId: 6, productId: 166, price: 35000, date: '2024-07-01' },
  { id: 67, customerId: 7, productId: 167, price: 71000, date: '2024-07-02' },
  { id: 68, customerId: 8, productId: 168, price: 46000, date: '2024-07-03' },
  { id: 69, customerId: 9, productId: 169, price: 99000, date: '2024-07-04' },
  { id: 70, customerId: 10, productId: 170, price: 20000, date: '2024-07-05' },

  { id: 71, customerId: 11, productId: 171, price: 62000, date: '2024-07-06' },
  { id: 72, customerId: 12, productId: 172, price: 37000, date: '2024-07-07' },
  { id: 73, customerId: 13, productId: 173, price: 88000, date: '2024-07-08' },
  { id: 74, customerId: 14, productId: 174, price: 15000, date: '2024-07-09' },
  { id: 75, customerId: 15, productId: 175, price: 112000, date: '2024-07-10' },

  // 추가 데이터 (7월 중반기)
  { id: 76, customerId: 16, productId: 176, price: 30000, date: '2024-07-11' },
  { id: 77, customerId: 17, productId: 177, price: 53000, date: '2024-07-12' },
  { id: 78, customerId: 18, productId: 178, price: 79000, date: '2024-07-13' },
  { id: 79, customerId: 19, productId: 179, price: 40000, date: '2024-07-14' },
  { id: 80, customerId: 20, productId: 180, price: 94000, date: '2024-07-15' },

  { id: 81, customerId: 21, productId: 181, price: 19000, date: '2024-07-16' },
  { id: 82, customerId: 22, productId: 182, price: 65000, date: '2024-07-17' },
  { id: 83, customerId: 23, productId: 183, price: 48000, date: '2024-07-18' },
  { id: 84, customerId: 24, productId: 184, price: 103000, date: '2024-07-19' },
  { id: 85, customerId: 25, productId: 185, price: 34000, date: '2024-07-20' },

  // 추가 데이터 (7월 후반기)
  { id: 86, customerId: 26, productId: 186, price: 57000, date: '2024-07-21' },
  { id: 87, customerId: 27, productId: 187, price: 25000, date: '2024-07-22' },
  { id: 88, customerId: 28, productId: 188, price: 82000, date: '2024-07-23' },
  { id: 89, customerId: 29, productId: 189, price: 41000, date: '2024-07-24' },
  { id: 90, customerId: 30, productId: 190, price: 118000, date: '2024-07-25' },

  { id: 91, customerId: 1, productId: 191, price: 16000, date: '2024-07-26' },
  { id: 92, customerId: 2, productId: 192, price: 70000, date: '2024-07-27' },
  { id: 93, customerId: 3, productId: 193, price: 45000, date: '2024-07-28' },
  { id: 94, customerId: 4, productId: 194, price: 97000, date: '2024-07-29' },
  { id: 95, customerId: 5, productId: 195, price: 28000, date: '2024-07-30' },

  // 마지막 추가 데이터
  { id: 96, customerId: 6, productId: 196, price: 61000, date: '2024-07-31' },
  { id: 97, customerId: 7, productId: 197, price: 36000, date: '2024-07-01' },
  { id: 98, customerId: 8, productId: 198, price: 86000, date: '2024-07-02' },
  { id: 99, customerId: 9, productId: 199, price: 22000, date: '2024-07-03' },
  { id: 100, customerId: 10, productId: 200, price: 122000, date: '2024-07-04' },

  { id: 101, customerId: 11, productId: 201, price: 14000, date: '2024-07-05' },
  { id: 102, customerId: 12, productId: 202, price: 73000, date: '2024-07-06' },
  { id: 103, customerId: 13, productId: 203, price: 50000, date: '2024-07-07' },
  { id: 104, customerId: 14, productId: 204, price: 101000, date: '2024-07-08' },
  { id: 105, customerId: 15, productId: 205, price: 29000, date: '2024-07-09' },

  { id: 106, customerId: 16, productId: 206, price: 66000, date: '2024-07-10' },
  { id: 107, customerId: 17, productId: 207, price: 38000, date: '2024-07-11' },
  { id: 108, customerId: 18, productId: 208, price: 93000, date: '2024-07-12' },
  { id: 109, customerId: 19, productId: 209, price: 17000, date: '2024-07-13' },
  { id: 110, customerId: 20, productId: 210, price: 127000, date: '2024-07-14' },

  { id: 111, customerId: 21, productId: 211, price: 21000, date: '2024-07-15' },
  { id: 112, customerId: 22, productId: 212, price: 58000, date: '2024-07-16' },
  { id: 113, customerId: 23, productId: 213, price: 43000, date: '2024-07-17' },
  { id: 114, customerId: 24, productId: 214, price: 106000, date: '2024-07-18' },
  { id: 115, customerId: 25, productId: 215, price: 33000, date: '2024-07-19' },

  { id: 116, customerId: 26, productId: 216, price: 74000, date: '2024-07-20' },
  { id: 117, customerId: 27, productId: 217, price: 26000, date: '2024-07-21' },
  { id: 118, customerId: 28, productId: 218, price: 89000, date: '2024-07-22' },
  { id: 119, customerId: 29, productId: 219, price: 42000, date: '2024-07-23' },
  { id: 120, customerId: 30, productId: 220, price: 115000, date: '2024-07-24' },

  { id: 121, customerId: 1, productId: 221, price: 19000, date: '2024-07-25' },
  { id: 122, customerId: 2, productId: 222, price: 68000, date: '2024-07-26' },
  { id: 123, customerId: 3, productId: 223, price: 47000, date: '2024-07-27' },
  { id: 124, customerId: 4, productId: 224, price: 100000, date: '2024-07-28' },
  { id: 125, customerId: 5, productId: 225, price: 31000, date: '2024-07-29' },

  { id: 126, customerId: 6, productId: 226, price: 60000, date: '2024-07-30' },
  { id: 127, customerId: 7, productId: 227, price: 35000, date: '2024-07-31' },
  { id: 128, customerId: 8, productId: 228, price: 84000, date: '2024-07-01' },
  { id: 129, customerId: 9, productId: 229, price: 23000, date: '2024-07-02' },
  { id: 130, customerId: 10, productId: 230, price: 119000, date: '2024-07-03' },

  { id: 131, customerId: 11, productId: 231, price: 15000, date: '2024-07-04' },
  { id: 132, customerId: 12, productId: 232, price: 72000, date: '2024-07-05' },
  { id: 133, customerId: 13, productId: 233, price: 51000, date: '2024-07-06' },
  { id: 134, customerId: 14, productId: 234, price: 104000, date: '2024-07-07' },
  { id: 135, customerId: 15, productId: 235, price: 27000, date: '2024-07-08' },

  { id: 136, customerId: 16, productId: 236, price: 65000, date: '2024-07-09' },
  { id: 137, customerId: 17, productId: 237, price: 39000, date: '2024-07-10' },
  { id: 138, customerId: 18, productId: 238, price: 95000, date: '2024-07-11' },
  { id: 139, customerId: 19, productId: 239, price: 18000, date: '2024-07-12' },
  { id: 140, customerId: 20, productId: 240, price: 128000, date: '2024-07-13' },

  { id: 141, customerId: 21, productId: 241, price: 24000, date: '2024-07-14' },
  { id: 142, customerId: 22, productId: 242, price: 56000, date: '2024-07-15' },
  { id: 143, customerId: 23, productId: 243, price: 44000, date: '2024-07-16' },
  { id: 144, customerId: 24, productId: 244, price: 109000, date: '2024-07-17' },
  { id: 145, customerId: 25, productId: 245, price: 32000, date: '2024-07-18' },

  { id: 146, customerId: 26, productId: 246, price: 77000, date: '2024-07-19' },
  { id: 147, customerId: 27, productId: 247, price: 20000, date: '2024-07-20' },
  { id: 148, customerId: 28, productId: 248, price: 90000, date: '2024-07-21' },
  { id: 149, customerId: 29, productId: 249, price: 37000, date: '2024-07-22' },
  { id: 150, customerId: 30, productId: 250, price: 121000, date: '2024-07-23' },
];

/**
 * 날짜 필터링 함수
 * @param purchases 전체 구매 데이터
 * @param params 날짜 범위 파라미터
 * @returns 필터링된 구매 데이터
 */
function filterPurchasesByDate(
  purchases: Purchase[],
  params?: PurchaseFrequencyParams
): Purchase[] {
  if (!params?.from && !params?.to) {
    return purchases;
  }

  const fromDate = params.from ? new Date(params.from) : null;
  const toDate = params.to ? new Date(params.to) : null;

  return purchases.filter((purchase) => {
    const purchaseDate = new Date(purchase.date);

    // from 날짜 필터
    if (fromDate && purchaseDate < fromDate) {
      return false;
    }

    // to 날짜 필터 (포함)
    if (toDate) {
      const endOfDay = new Date(toDate);
      endOfDay.setHours(23, 59, 59, 999);
      if (purchaseDate > endOfDay) {
        return false;
      }
    }

    return true;
  });
}

/**
 * 목 데이터를 반환하는 함수
 * @param params 날짜 범위 파라미터 (선택사항)
 * @returns 가격대별 구매 빈도 데이터
 */
export function getMockPurchaseFrequency(
  params?: PurchaseFrequencyParams
): PurchaseFrequencyData[] {
  // 날짜 필터링
  const filteredPurchases = filterPurchasesByDate(MOCK_PURCHASES, params);

  // 가격대별로 그룹화
  return groupByPriceRange(filteredPurchases);
}

/**
 * 목 데이터를 비동기로 반환하는 함수 (API 호출 시뮬레이션)
 * @param params 날짜 범위 파라미터
 * @returns Promise로 감싼 가격대별 구매 빈도 데이터
 */
export async function fetchMockPurchaseFrequency(
  params?: PurchaseFrequencyParams
): Promise<PurchaseFrequencyData[]> {
  // API 호출 시뮬레이션 (500ms 지연)
  await new Promise((resolve) => setTimeout(resolve, 500));

  return getMockPurchaseFrequency(params);
}
