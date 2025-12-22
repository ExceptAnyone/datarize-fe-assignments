import styled from '@emotion/styled'
import { Card } from '../../../components/Card/Card'
import { DateRangeFilter } from './DateRangeFilter'
import { PurchaseFrequencyChart } from './PurchaseFrequencyChart'
import { usePurchaseFrequency } from '../hooks/usePurchaseFrequency'
import { useDateRangeFilter } from '../hooks/useDateRangeFilter'

/**
 * 날짜 범위를 사용자 친화적인 텍스트로 변환
 * @param from - 시작 날짜 (YYYY-MM-DD)
 * @param to - 종료 날짜 (YYYY-MM-DD)
 * @returns 날짜 범위 텍스트 (예: "2024년 7월 분석", "2025년 7월 ~ 9월 분석")
 */
function formatDateRangeText(from?: string, to?: string): string {
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

/**
 * 가격대별 구매 빈도 섹션 컴포넌트
 * 차트와 날짜 필터를 통합하여 표시
 */
export function PurchaseFrequencySection() {
  // 날짜 범위 상태 관리
  const { dateRange, setFromDate, setToDate, resetDateRange, isValid } = useDateRangeFilter()

  // 구매 빈도 데이터 가져오기
  const { data, isLoading, error } = usePurchaseFrequency(dateRange)

  // 날짜 범위 텍스트 생성
  const dateRangeText = formatDateRangeText(dateRange.from, dateRange.to)

  return (
    <SectionContainer>
      <Card elevation="md" padding="lg">
        <Card.Header>
          <HeaderContent>
            <h2 style={{ margin: 0 }}>가격대별 구매 빈도</h2>
            <DateRangeText>{dateRangeText}</DateRangeText>
          </HeaderContent>
        </Card.Header>

        <Card.Body>
          <ContentWrapper>
            {/* 차트 영역 */}
            <ChartWrapper>
              <PurchaseFrequencyChart data={data} isLoading={isLoading} error={error} height={450} />
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

const HeaderContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};
`

const DateRangeText = styled.p`
  margin: 0;
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.text.secondary};
  font-weight: ${({ theme }) => theme.typography.fontWeight.normal};
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
