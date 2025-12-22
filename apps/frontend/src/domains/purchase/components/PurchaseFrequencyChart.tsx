import styled from '@emotion/styled'
import { BarChart } from '../../../components/Chart/BarChart'
import { ErrorMessage } from '../../../components/ErrorMessage/ErrorMessage'
import type { PurchaseFrequencyData } from '../api/purchaseFrequency'

/**
 * 가격 범위를 사용자 친화적인 레이블로 변환
 * @param range - 백엔드에서 받은 가격 범위 (예: "0 - 20000", "20001 - 30000")
 * @returns 사용자 친화적인 레이블 (예: "2만원 이하", "2만원대")
 */
function formatPriceRange(range: string): string {
  // "0 - 20000" 형태를 파싱
  const [minStr, maxStr] = range.split(' - ').map((s) => s.trim())
  const min = parseInt(minStr, 10)
  const max = parseInt(maxStr, 10)

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

interface PurchaseFrequencyChartProps {
  /** 차트 데이터 */
  data: PurchaseFrequencyData[]
  /** 에러 객체 */
  error?: Error | null
  /** 차트 높이 (px) */
  height?: number
}

/**
 * 가격대별 구매 빈도 차트 컴포넌트
 * BarChart를 래핑하여 에러 상태를 처리
 */
export function PurchaseFrequencyChart({ data, error, height = 400 }: PurchaseFrequencyChartProps) {
  // 에러 상태
  if (error) {
    return (
      <ChartContainer>
        <ErrorMessage message={`데이터를 불러오는데 실패했습니다: ${error.message}`} variant="error" />
      </ChartContainer>
    )
  }

  // 데이터가 없는 경우
  if (data.length === 0) {
    return (
      <ChartContainer>
        <EmptyState>
          <p>선택한 기간에 구매 데이터가 없습니다.</p>
        </EmptyState>
      </ChartContainer>
    )
  }

  // 모든 count가 0인 경우
  const hasData = data.some((item) => item.count > 0)
  if (!hasData) {
    return (
      <ChartContainer>
        <EmptyState>
          <p>선택한 기간에 구매 데이터가 없습니다.</p>
        </EmptyState>
      </ChartContainer>
    )
  }

  // 데이터 레이블 변환 (사용자 친화적인 형식으로)
  const formattedData = data.map((item) => ({
    ...item,
    range: formatPriceRange(item.range),
  }))

  // 차트 렌더링
  return (
    <ChartContainer>
      <BarChart data={formattedData} xKey="range" yKey="count" height={height} xLabel="가격대" yLabel="구매 횟수" />
    </ChartContainer>
  )
}

const ChartContainer = styled.div`
  width: 100%;
  min-height: 400px;
  display: flex;
  justify-content: center;
  align-items: center;
`

const EmptyState = styled.div`
  text-align: center;
  color: ${({ theme }) => theme.colors.text.secondary};
  padding: ${({ theme }) => theme.spacing['3xl']};
`
