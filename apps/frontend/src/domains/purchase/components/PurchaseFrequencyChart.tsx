import styled from '@emotion/styled'
import { BarChart } from '../../../components/Chart/BarChart'
import { LoadingSpinner } from '../../../components/LoadingSpinner/LoadingSpinner'
import { ErrorMessage } from '../../../components/ErrorMessage/ErrorMessage'
import type { PurchaseFrequencyData } from '../api/purchaseFrequency'
import { formatPriceRange } from '../utils/formatPriceRange'

interface PurchaseFrequencyChartProps {
  /** 차트 데이터 */
  data?: PurchaseFrequencyData[]
  /** 로딩 상태 */
  isLoading?: boolean
  /** 에러 객체 */
  error?: Error | null
  /** 차트 높이 (px) */
  height?: number
}

/**
 * 가격대별 구매 빈도 차트 컴포넌트
 * BarChart를 래핑하여 로딩/에러 상태를 처리
 */
export function PurchaseFrequencyChart({ data, isLoading, error, height = 400 }: PurchaseFrequencyChartProps) {
  // 로딩 상태
  if (isLoading) {
    return (
      <ChartContainer>
        <LoadingSpinner size="lg" />
      </ChartContainer>
    )
  }

  // 에러 상태
  if (error) {
    return (
      <ChartContainer>
        <ErrorMessage message={`데이터를 불러오는데 실패했습니다: ${error.message}`} variant="error" />
      </ChartContainer>
    )
  }

  // 데이터가 없는 경우
  if (!data || data.length === 0) {
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
