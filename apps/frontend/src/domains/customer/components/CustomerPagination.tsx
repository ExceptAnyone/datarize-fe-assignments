import styled from '@emotion/styled'
import { getPageNumbers } from '../utils/pagination'

interface CustomerPaginationProps {
  /** 현재 페이지 번호 */
  currentPage: number
  /** 총 페이지 수 */
  totalPages: number
  /** 페이지 변경 핸들러 */
  onPageChange: (page: number) => void
  /** 다음 페이지 이동 가능 여부 */
  canGoNext: boolean
  /** 이전 페이지 이동 가능 여부 */
  canGoPrev: boolean
  /** 전체 아이템 수 */
  totalItems: number
  /** 현재 페이지 시작 인덱스 */
  startIndex: number
  /** 현재 페이지 끝 인덱스 */
  endIndex: number
}

/**
 * 고객 목록 페이지네이션 컴포넌트
 * 페이지 번호, 이전/다음 버튼, 현재 표시 범위 정보 제공
 */
export function CustomerPagination({
  currentPage,
  totalPages,
  onPageChange,
  canGoNext,
  canGoPrev,
  totalItems,
  startIndex,
  endIndex,
}: CustomerPaginationProps) {
  const pageNumbers = getPageNumbers(currentPage, totalPages)

  // 아이템이 없으면 페이지네이션 숨김
  if (totalItems === 0) {
    return null
  }

  return (
    <PaginationWrapper>
      <ResultInfo>
        총 <strong>{totalItems}</strong>명 중 <strong>{startIndex + 1}</strong>-<strong>{endIndex}</strong>명 표시
      </ResultInfo>

      <PaginationContainer>
        <NavButton onClick={() => onPageChange(currentPage - 1)} disabled={!canGoPrev} aria-label="이전 페이지">
          이전
        </NavButton>

        {pageNumbers.map((page, index) =>
          page === '...' ? (
            <Ellipsis key={`ellipsis-${index}`}>...</Ellipsis>
          ) : (
            <PageButton
              key={page}
              onClick={() => onPageChange(page as number)}
              isActive={page === currentPage}
              aria-label={`${page}페이지로 이동`}
              aria-current={page === currentPage ? 'page' : undefined}
            >
              {page}
            </PageButton>
          ),
        )}

        <NavButton onClick={() => onPageChange(currentPage + 1)} disabled={!canGoNext} aria-label="다음 페이지">
          다음
        </NavButton>

        <PageInfo>
          {currentPage} / {totalPages} 페이지
        </PageInfo>
      </PaginationContainer>
    </PaginationWrapper>
  )
}

const PaginationWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
  margin-top: ${({ theme }) => theme.spacing.xl};
  padding-top: ${({ theme }) => theme.spacing.lg};
  border-top: 1px solid ${({ theme }) => theme.colors.border};
`

const ResultInfo = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};

  strong {
    color: ${({ theme }) => theme.colors.text.primary};
    font-weight: 600;
  }
`

const PaginationContainer = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
`

const NavButton = styled.button<{ disabled?: boolean }>`
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  border: 1px solid ${({ theme }) => theme.colors.border.default};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  background: ${({ theme }) => theme.colors.background.primary};
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-weight: 500;
  cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'pointer')};
  opacity: ${({ disabled }) => (disabled ? 0.4 : 1)};
  transition: all 0.2s;

  &:hover:not(:disabled) {
    background: ${({ theme }) => theme.colors.background.secondary};
    border-color: ${({ theme }) => theme.colors.secondary};
  }

  &:active:not(:disabled) {
    transform: translateY(1px);
  }
`

const PageButton = styled.button<{ isActive: boolean }>`
  min-width: 40px;
  height: 40px;
  padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.sm};
  border: 1px solid ${({ theme, isActive }) => (isActive ? theme.colors.primary : theme.colors.border.default)};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  background: ${({ theme, isActive }) => (isActive ? theme.colors.primary : theme.colors.background.primary)};
  color: ${({ theme, isActive }) => (isActive ? '#ffffff' : theme.colors.text.primary)};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-weight: ${({ isActive }) => (isActive ? '600' : '500')};
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: ${({ theme, isActive }) => (isActive ? theme.colors.primary : theme.colors.background.secondary)};
    border-color: ${({ theme, isActive }) => (isActive ? theme.colors.primary : theme.colors.secondary)};
  }

  &:active {
    transform: translateY(1px);
  }
`

const Ellipsis = styled.span`
  padding: 0 ${({ theme }) => theme.spacing.xs};
  color: ${({ theme }) => theme.colors.text.disabled};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  user-select: none;
`

const PageInfo = styled.span`
  margin-left: ${({ theme }) => theme.spacing.md};
  padding-left: ${({ theme }) => theme.spacing.md};
  border-left: 1px solid ${({ theme }) => theme.colors.border.default};
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  white-space: nowrap;
`
