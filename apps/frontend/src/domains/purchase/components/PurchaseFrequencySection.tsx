import styled from '@emotion/styled'
import { Card } from '../../../components/Card/Card'
import { DateRangeFilter } from './DateRangeFilter'
import { PurchaseFrequencyChart } from './PurchaseFrequencyChart'
import { usePurchaseFrequency } from '../hooks/usePurchaseFrequency'
import { useDateRangeFilter } from '../hooks/useDateRangeFilter'

/**
 * 가격대별 구매 빈도 섹션 컴포넌트
 * 차트와 날짜 필터를 통합하여 표시
 */
export function PurchaseFrequencySection() {
  // 날짜 범위 상태 관리
  const { dateRange, setFromDate, setToDate, resetDateRange, isValid } = useDateRangeFilter()

  // 구매 빈도 데이터 가져오기
  const { data, error } = usePurchaseFrequency(dateRange)

  return (
    <SectionContainer>
      <Card elevation="md" padding="lg">
        <Card.Header>
          <h2 style={{ margin: 0 }}>가격대별 구매 빈도</h2>
        </Card.Header>

        <Card.Body>
          <ContentWrapper>
            {/* 차트 영역 */}
            <ChartWrapper>
              <PurchaseFrequencyChart data={data} error={error} height={450} />
            </ChartWrapper>

            {/* 날짜 필터 영역 */}
            <DateRangeFilter
              from={dateRange.from}
              to={dateRange.to}
              onFromChange={setFromDate}
              onToChange={setToDate}
              onReset={resetDateRange}
              isValid={isValid()}
            />
          </ContentWrapper>
        </Card.Body>
      </Card>
    </SectionContainer>
  )
}

const SectionContainer = styled.div`
  width: 100%;
`

const ContentWrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr 320px;
  gap: ${({ theme }) => theme.spacing.lg};
  align-items: start;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
`

const ChartWrapper = styled.div`
  min-width: 0; // 그리드 오버플로우 방지
`
