import styled from '@emotion/styled'
import { DatePicker } from '../../../components/DatePicker/DatePicker'
import { Button } from '../../../components/Button/Button'

interface DateRangeFilterProps {
  /** 시작 날짜 */
  from?: string
  /** 종료 날짜 */
  to?: string
  /** 시작 날짜 변경 핸들러 */
  onFromChange: (date: string) => void
  /** 종료 날짜 변경 핸들러 */
  onToChange: (date: string) => void
  /** 초기화 핸들러 */
  onReset: () => void
  /** 유효성 검사 에러 여부 */
  isValid?: boolean
}

/**
 * 날짜 범위 필터 컴포넌트
 * 시작/종료 날짜를 선택할 수 있는 DatePicker 2개와 초기화 버튼 제공
 */
export function DateRangeFilter({ from, to, onFromChange, onToChange, onReset, isValid = true }: DateRangeFilterProps) {
  // 초기화 핸들러 - 날짜 입력값도 함께 초기화
  const handleReset = () => {
    onFromChange('')
    onToChange('')
    onReset()
  }

  return (
    <FilterContainer>
      <DateInputsWrapper>
        <DatePicker
          label="시작 날짜"
          value={from || ''}
          onChange={(e) => onFromChange(e.target.value)}
          max={to} // 종료 날짜 이전까지만 선택 가능
        />

        <Separator>~</Separator>

        <DatePicker
          label="종료 날짜"
          value={to || ''}
          onChange={(e) => onToChange(e.target.value)}
          min={from} // 시작 날짜 이후만 선택 가능
        />
      </DateInputsWrapper>

      {!isValid && <ErrorText>시작 날짜는 종료 날짜보다 이전이어야 합니다.</ErrorText>}

      <ButtonGroup>
        <Button variant="secondary" size="sm" onClick={handleReset}>
          초기화
        </Button>
      </ButtonGroup>
    </FilterContainer>
  )
}

const FilterContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
  padding: ${({ theme }) => theme.spacing.lg};
  background-color: ${({ theme }) => theme.colors.background.secondary};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  border: 1px solid ${({ theme }) => theme.colors.border.default};
`

const DateInputsWrapper = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.md};
  align-items: center;
  flex-wrap: wrap;
`

const Separator = styled.span`
  color: ${({ theme }) => theme.colors.text.secondary};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
`

const ButtonGroup = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.sm};
`

const ErrorText = styled.p`
  color: ${({ theme }) => theme.colors.danger};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  margin: 0;
`
