import styled from '@emotion/styled'
import { Customer } from '../types'
import { Table } from '../../../components/Table/Table'
import { CustomerTableRow } from './CustomerTableRow'
import { ErrorMessage } from '../../../components/ErrorMessage/ErrorMessage'

interface CustomerTableProps {
  /** 고객 목록 데이터 */
  customers: Customer[]
  /** 에러 객체 */
  error?: Error | null
  /** 고객 클릭 핸들러 */
  onCustomerClick: (customerId: number) => void
}

/**
 * 고객 목록 테이블 컴포넌트
 * 고객 ID, 이름, 구매횟수, 총금액을 표시합니다.
 */
export function CustomerTable({ customers, error, onCustomerClick }: CustomerTableProps) {
  // 에러 상태
  if (error) {
    return <ErrorMessage message={error.message} variant="error" />
  }

  // 빈 상태
  if (customers.length === 0) {
    return (
      <EmptyState>
        <EmptyIcon>🔍</EmptyIcon>
        <EmptyText>검색 결과가 없습니다</EmptyText>
      </EmptyState>
    )
  }

  // 데이터 표시
  return (
    <TableContainer>
      <Table>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>ID</Table.HeaderCell>
            <Table.HeaderCell>이름</Table.HeaderCell>
            <Table.HeaderCell>구매횟수</Table.HeaderCell>
            <Table.HeaderCell>총금액</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {customers.map((customer) => (
            <CustomerTableRow key={customer.id} customer={customer} onClick={onCustomerClick} />
          ))}
        </Table.Body>
      </Table>
    </TableContainer>
  )
}

const TableContainer = styled.div`
  width: 100%;
  overflow-x: auto;
`

const EmptyState = styled.div`
  padding: ${({ theme }) => theme.spacing.xl};
  text-align: center;
  color: ${({ theme }) => theme.colors.text.secondary};
`

const EmptyIcon = styled.div`
  font-size: 3rem;
  margin-bottom: ${({ theme }) => theme.spacing.md};
`

const EmptyText = styled.p`
  font-size: ${({ theme }) => theme.typography.fontSize.base};
  margin: 0;
`
