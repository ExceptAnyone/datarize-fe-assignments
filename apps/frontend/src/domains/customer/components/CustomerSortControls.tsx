import styled from '@emotion/styled'
import { Button } from '../../../components/Button/Button'
import { SortField, SortOrder } from '../hooks/useCustomerSort'

interface CustomerSortControlsProps {
  /** 현재 정렬 필드 */
  sortBy: SortField
  /** 현재 정렬 순서 */
  sortOrder: SortOrder
  /** 정렬 토글 핸들러 */
  onToggleSort: (field: SortField) => void
}

/** 필드별 라벨 매핑 */
const FIELD_LABELS: Record<SortField, string> = {
  id: 'ID',
  count: '구매횟수',
  totalAmount: '총금액',
}

/**
 * 고객 정렬 컨트롤 컴포넌트
 * ID, 구매횟수, 총금액 기준으로 정렬할 수 있는 버튼을 제공합니다.
 */
export function CustomerSortControls({ sortBy, sortOrder, onToggleSort }: CustomerSortControlsProps) {
  /** 정렬 아이콘 반환 (▲/▼) */
  const getSortIcon = (field: SortField) => {
    if (sortBy !== field) return null
    return sortOrder === 'asc' ? '▲' : '▼'
  }

  return (
    <ControlsContainer>
      <Label>정렬:</Label>
      {Object.entries(FIELD_LABELS).map(([field, label]) => {
        const typedField = field as SortField
        const isActive = sortBy === typedField
        const icon = getSortIcon(typedField)

        return (
          <SortButton
            key={field}
            variant={isActive ? 'primary' : 'secondary'}
            size="sm"
            isActive={isActive}
            onClick={() => onToggleSort(typedField)}
            aria-label={`${label}로 정렬`}
            aria-pressed={isActive}
          >
            {label}
            {icon && <SortIcon>{icon}</SortIcon>}
          </SortButton>
        )
      })}
    </ControlsContainer>
  )
}

const ControlsContainer = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.sm};
  align-items: center;
`

const Label = styled.span`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.text.secondary};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
`

const SortButton = styled(Button)<{ isActive: boolean }>`
  position: relative;
  padding: ${({ theme }) => `${theme.spacing.sm} ${theme.spacing.md}`};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};

  ${({ isActive, theme }) =>
    isActive &&
    `
    background-color: ${theme.colors.primary};
    color: white;
    
    &:hover {
      background-color: ${theme.colors.primary};
      opacity: 0.9;
    }
  `}
`

const SortIcon = styled.span`
  margin-left: ${({ theme }) => theme.spacing.xs};
  font-size: 0.75rem;
`
