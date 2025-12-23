import { useCallback, useEffect } from 'react'
import { useUrlStateNumber } from '../../../lib/url-state/useUrlState'

/** 모달이 닫혔을 때의 고객 ID 값 (0은 선택된 고객이 없음을 의미) */
const MODAL_CLOSED_CUSTOMER_ID = 0

export interface UseCustomerModalReturn {
  /** 선택된 고객 ID (null이면 모달 닫힘) */
  selectedCustomerId: number | null
  /** 모달 열림 상태 */
  isOpen: boolean
  /** 모달 열기 함수 */
  openModal: (customerId: number) => void
  /** 모달 닫기 함수 */
  closeModal: () => void
}

/**
 * 고객 상세 모달 상태 관리 훅
 * URL을 통해 선택된 고객 ID를 유지하여 새로고침 시에도 모달이 열린 상태를 보존합니다.
 *
 * @returns 모달 상태 및 제어 함수
 */
export function useCustomerModal(): UseCustomerModalReturn {
  // URL에서 고객 ID 관리 (MODAL_CLOSED_CUSTOMER_ID이면 닫힌 상태)
  const [urlCustomerId, setUrlCustomerId] = useUrlStateNumber('customerId', MODAL_CLOSED_CUSTOMER_ID)

  const selectedCustomerId = urlCustomerId > MODAL_CLOSED_CUSTOMER_ID ? urlCustomerId : null

  const openModal = useCallback(
    (customerId: number) => {
      setUrlCustomerId(customerId)
    },
    [setUrlCustomerId],
  )

  const closeModal = useCallback(() => {
    setUrlCustomerId(MODAL_CLOSED_CUSTOMER_ID)
  }, [setUrlCustomerId])

  // ESC 키로 모달 닫기
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && selectedCustomerId) {
        closeModal()
      }
    }

    window.addEventListener('keydown', handleEscape)
    return () => window.removeEventListener('keydown', handleEscape)
  }, [selectedCustomerId, closeModal])

  return {
    selectedCustomerId,
    isOpen: !!selectedCustomerId,
    openModal,
    closeModal,
  }
}
