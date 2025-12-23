import { useMemo } from 'react'
import styled from '@emotion/styled'
import { Card } from '../../../components/Card/Card'
import { CustomerSearchBar } from './CustomerSearchBar'
import { CustomerSortControls } from './CustomerSortControls'
import { CustomerTable } from './CustomerTable'
import { CustomerDetailModal } from './CustomerDetailModal'
import { CustomerPagination } from './CustomerPagination'
import { useCustomers } from '../hooks/useCustomers'
import { useCustomerSearch } from '../hooks/useCustomerSearch'
import { useCustomerSort } from '../hooks/useCustomerSort'
import { useCustomerPagination } from '../hooks/useCustomerPagination'
import { useSortedCustomers } from '../hooks/useSortedCustomers'
import { usePaginatedCustomers } from '../hooks/usePaginatedCustomers'
import { useCustomerModal } from '../hooks/useCustomerModal'
import { usePaginationReset } from '../hooks/usePaginationReset'

/** 고객 목록 페이지당 표시 개수 */
const CUSTOMERS_PER_PAGE = 10

/**
 * 고객 목록 섹션 컴포넌트
 * 검색, 정렬, 테이블, 상세 모달을 통합하여 관리합니다.
 */
export function CustomerListSection() {
  // 검색 상태
  const { searchTerm, debouncedTerm, setSearchTerm } = useCustomerSearch()

  // 정렬 상태
  const { sortBy, sortOrder, toggleSort } = useCustomerSort()

  // 모달 상태
  const { selectedCustomerId, isOpen, openModal, closeModal } = useCustomerModal()

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
  const sortedCustomers = useSortedCustomers({ customers, sortBy, sortOrder })

  // 페이지네이션 (정렬된 결과 기준)
  const pagination = useCustomerPagination({
    totalItems: sortedCustomers.length,
    itemsPerPage: CUSTOMERS_PER_PAGE,
  })

  // 검색 또는 정렬 변경 시 1페이지로 리셋
  usePaginationReset({
    resetPage: pagination.resetPage,
    dependencies: [debouncedTerm, sortBy, sortOrder],
  })

  // 현재 페이지에 표시할 고객 목록
  const paginatedCustomers = usePaginatedCustomers({
    customers: sortedCustomers,
    startIndex: pagination.startIndex,
    endIndex: pagination.endIndex,
  })

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
          <CustomerTable customers={paginatedCustomers} error={error} onCustomerClick={openModal} />

          {/* 페이지네이션 */}
          {sortedCustomers.length > 0 && (
            <CustomerPagination
              currentPage={pagination.currentPage}
              totalPages={pagination.totalPages}
              onPageChange={pagination.goToPage}
              canGoNext={pagination.canGoNext}
              canGoPrev={pagination.canGoPrev}
              totalItems={sortedCustomers.length}
              startIndex={pagination.startIndex}
              endIndex={pagination.endIndex}
            />
          )}
        </Card.Body>
      </Card>

      {/* 고객 상세 모달 */}
      <CustomerDetailModal
        isOpen={isOpen}
        onClose={closeModal}
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
