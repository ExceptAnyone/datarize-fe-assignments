import { useState, useMemo } from 'react'
import styled from '@emotion/styled'
import { Card } from '../../../components/Card/Card'
import { CustomerSearchBar } from './CustomerSearchBar'
import { CustomerSortControls } from './CustomerSortControls'
import { CustomerTable } from './CustomerTable'
import { CustomerDetailModal } from './CustomerDetailModal'
import { useCustomers } from '../hooks/useCustomers'
import { useCustomerSearch } from '../hooks/useCustomerSearch'
import { useCustomerSort } from '../hooks/useCustomerSort'

/**
 * 고객 목록 섹션 컴포넌트
 * 검색, 정렬, 테이블, 상세 모달을 통합하여 관리합니다.
 */
export function CustomerListSection() {
  // 검색 상태
  const { searchTerm, debouncedTerm, setSearchTerm } = useCustomerSearch()

  // 정렬 상태
  const { sortBy, sortOrder, toggleSort } = useCustomerSort()

  // 선택된 고객 ID (모달 표시용)
  const [selectedCustomerId, setSelectedCustomerId] = useState<number | null>(null)

  // API 파라미터 구성
  // API가 'asc'/'desc'를 구매 금액 기준 정렬로 사용하므로,
  // totalAmount 정렬일 때만 sortBy 파라미터 전달
  const apiParams = useMemo(() => {
    const params: { sortBy?: 'asc' | 'desc'; name?: string } = {}

    // 이름 검색
    if (debouncedTerm) {
      params.name = debouncedTerm
    }

    // 구매 금액 정렬만 API에 전달
    if (sortBy === 'totalAmount') {
      params.sortBy = sortOrder
    }

    return params
  }, [debouncedTerm, sortBy, sortOrder])

  // 고객 목록 가져오기
  const { data: customers, error } = useCustomers(apiParams)

  // 클라이언트 사이드 정렬
  // API가 totalAmount만 정렬하므로, id와 count는 클라이언트에서 정렬
  const sortedCustomers = useMemo(() => {
    if (!customers) return []

    // API가 이미 totalAmount로 정렬한 경우 그대로 반환
    if (sortBy === 'totalAmount') {
      return customers
    }

    // 클라이언트 사이드 정렬
    const sorted = [...customers].sort((a, b) => {
      let comparison = 0

      switch (sortBy) {
        case 'id':
          comparison = a.id - b.id
          break
        case 'count':
          comparison = a.count - b.count
          break
        default:
          return 0
      }

      return sortOrder === 'asc' ? comparison : -comparison
    })

    return sorted
  }, [customers, sortBy, sortOrder])

  // 모달 열기 핸들러
  const handleCustomerClick = (customerId: number) => {
    setSelectedCustomerId(customerId)
  }

  // 모달 닫기 핸들러
  const handleCloseModal = () => {
    setSelectedCustomerId(null)
  }

  // 선택된 고객 정보 찾기 (모달 타이틀용)
  const selectedCustomer = sortedCustomers.find((customer) => customer.id === selectedCustomerId)

  return (
    <SectionContainer>
      <Card elevation="md" padding="lg">
        <Card.Header>
          <h2 style={{ margin: 0 }}>고객 목록</h2>
        </Card.Header>

        <Card.Body>
          {/* 검색바 + 정렬 컨트롤 */}
          <ControlsBar>
            <CustomerSearchBar value={searchTerm} onChange={setSearchTerm} />
            <CustomerSortControls sortBy={sortBy} sortOrder={sortOrder} onToggleSort={toggleSort} />
          </ControlsBar>

          {/* 고객 테이블 */}
          <CustomerTable customers={sortedCustomers} error={error} onCustomerClick={handleCustomerClick} />
        </Card.Body>
      </Card>

      {/* 고객 상세 모달 */}
      <CustomerDetailModal
        isOpen={!!selectedCustomerId}
        onClose={handleCloseModal}
        customerId={selectedCustomerId}
        customerName={selectedCustomer?.name}
      />
    </SectionContainer>
  )
}

const SectionContainer = styled.div`
  width: 100%;
`

const ControlsBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  flex-wrap: wrap;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
  }
`
