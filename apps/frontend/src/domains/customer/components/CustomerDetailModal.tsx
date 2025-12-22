import styled from '@emotion/styled'
import { Modal } from '../../../components/Modal/Modal'
import { Card } from '../../../components/Card/Card'
import { LoadingSpinner } from '../../../components/LoadingSpinner/LoadingSpinner'
import { ErrorMessage } from '../../../components/ErrorMessage/ErrorMessage'
import { useCustomerPurchases } from '../hooks/useCustomerPurchases'
import { CustomerPurchase } from '../types'

interface CustomerDetailModalProps {
  /** 모달 열림 상태 */
  isOpen: boolean
  /** 모달 닫기 핸들러 */
  onClose: () => void
  /** 고객 ID */
  customerId: number | null
  /** 고객 이름 (타이틀 표시용) */
  customerName?: string
}

/**
 * 고객 상세 구매 내역 모달 컴포넌트
 * 특정 고객의 구매 내역을 모달로 표시합니다.
 */
export function CustomerDetailModal({ isOpen, onClose, customerId, customerName }: CustomerDetailModalProps) {
  // 고객 구매 내역 가져오기 - isOpen이고 customerId가 있을 때만 실행
  const {
    data: purchases,
    isLoading,
    error,
  } = useCustomerPurchases(
    customerId?.toString() || '',
    isOpen && !!customerId, // 모달이 열려있고 customerId가 있을 때만 쿼리 실행
  )

  /**
   * 구매 내역 렌더링
   */
  const renderPurchaseContent = () => {
    // 로딩 상태
    if (isLoading) {
      return (
        <LoadingContainer>
          <LoadingSpinner size="lg" />
        </LoadingContainer>
      )
    }

    // 에러 상태
    if (error) {
      return <ErrorMessage message={error.message} variant="error" />
    }

    // 빈 상태
    if (!purchases || purchases.length === 0) {
      return <EmptyState>구매 내역이 없습니다.</EmptyState>
    }

    // 구매 내역 표시
    return (
      <PurchaseList>
        {purchases.map((purchase: CustomerPurchase, index: number) => (
          <PurchaseCard key={`${purchase.date}-${index}`} padding="md">
            <PurchaseDate>구매일: {new Date(purchase.date).toLocaleDateString('ko-KR')}</PurchaseDate>
            <ProductList>
              <ProductItem>
                <ProductImage src={purchase.imgSrc} alt={purchase.product} loading="lazy" />
                <ProductInfo>
                  <ProductName>{purchase.product}</ProductName>
                  <span style={{ fontSize: '0.875rem', color: '#64748b' }}>수량: {purchase.quantity}개</span>
                </ProductInfo>
                <ProductPrice>{purchase.price.toLocaleString()}원</ProductPrice>
              </ProductItem>
            </ProductList>
          </PurchaseCard>
        ))}
      </PurchaseList>
    )
  }

  // isOpen이 false이면 렌더링하지 않음
  if (!isOpen) return null

  return (
    <Modal defaultOpen={true} size="lg">
      <Modal.Portal>
        <Modal.Overlay>
          <Modal.Content>
            <Modal.Header>
              <Modal.Title>{customerName ? `${customerName} 님의 구매 내역` : '고객 구매 내역'}</Modal.Title>
              <Modal.CloseButton onClick={onClose} />
            </Modal.Header>
            <Modal.Body>{renderPurchaseContent()}</Modal.Body>
          </Modal.Content>
        </Modal.Overlay>
      </Modal.Portal>
    </Modal>
  )
}

const PurchaseList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
`

const PurchaseCard = styled(Card)`
  border: 1px solid ${({ theme }) => theme.colors.border.default};
`

const PurchaseDate = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.text.secondary};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`

const ProductList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
`

const ProductItem = styled.div`
  display: grid;
  grid-template-columns: 60px 1fr auto;
  gap: ${({ theme }) => theme.spacing.md};
  align-items: center;
  padding: ${({ theme }) => theme.spacing.sm};
  background-color: ${({ theme }) => theme.colors.background.secondary};
  border-radius: ${({ theme }) => theme.borderRadius.md};
`

const ProductImage = styled.img`
  width: 60px;
  height: 60px;
  object-fit: cover;
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  background-color: ${({ theme }) => theme.colors.background.disabled};
`

const ProductInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};
`

const ProductName = styled.span`
  font-size: ${({ theme }) => theme.typography.fontSize.base};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  color: ${({ theme }) => theme.colors.text.primary};
`

const ProductPrice = styled.span`
  font-size: ${({ theme }) => theme.typography.fontSize.lg};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  color: ${({ theme }) => theme.colors.primary};
`

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  padding: ${({ theme }) => theme.spacing.xl};
`

const EmptyState = styled.div`
  padding: ${({ theme }) => theme.spacing.xl};
  text-align: center;
  color: ${({ theme }) => theme.colors.text.secondary};
`
