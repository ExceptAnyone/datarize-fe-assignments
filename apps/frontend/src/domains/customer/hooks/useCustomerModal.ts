import { useCallback, useEffect } from 'react'
import { useUrlStateNumber } from '../../../lib/url-state/useUrlState'

/**
 * 고객 상세 모달 상태 관리 훅
 * URL을 통해 선택된 고객 ID를 유지하여 새로고침 시에도 모달이 열린 상태를 보존합니다.
 *
 * @returns 모달 상태 및 제어 함수
 */
export function useCustomerModal() {
  // URL에서 고객 ID 관리 (0이면 닫힌 상태)
  const [urlCustomerId, setUrlCustomerId] = useUrlStateNumber('customerId', 0)

  const selectedCustomerId = urlCustomerId > 0 ? urlCustomerId : null

  const openModal = useCallback(
    (customerId: number) => {
      setUrlCustomerId(customerId)
    },
    [setUrlCustomerId],
  )

  const closeModal = useCallback(() => {
    setUrlCustomerId(0)
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
