import styled from '@emotion/styled'
import { Customer } from '../types'
import { Table } from '../../../components/Table/Table'

interface CustomerTableRowProps {
  /** 고객 데이터 */
  customer: Customer
  /** 클릭 핸들러 */
  onClick: (customerId: number) => void
}

/**
 * 고객 테이블 행 컴포넌트
 * 클릭 시 고객 상세 정보를 표시합니다.
 */
export function CustomerTableRow({ customer, onClick }: CustomerTableRowProps) {
  const handleClick = () => {
    onClick(customer.id)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      onClick(customer.id)
    }
  }

  return (
    <ClickableRow
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="button"
      aria-label={`${customer.name} 고객 상세 보기`}
    >
      <Table.Cell>{customer.id}</Table.Cell>
      <Table.Cell>{customer.name}</Table.Cell>
      <Table.Cell>{customer.count}회</Table.Cell>
      <AmountCell>{customer.totalAmount.toLocaleString()}원</AmountCell>
    </ClickableRow>
  )
}

const ClickableRow = styled(Table.Row)`
  cursor: pointer;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: ${({ theme }) => theme.colors.background.secondary};
  }

  &:active {
    background-color: ${({ theme }) => theme.colors.background.disabled};
  }
`

const AmountCell = styled(Table.Cell)`
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  color: ${({ theme }) => theme.colors.primary};
`
