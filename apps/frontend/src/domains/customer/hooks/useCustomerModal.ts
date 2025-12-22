import { useState } from 'react'

/**
 * 고객 상세 모달 상태 관리 훅
 *
 * @returns 모달 상태 및 제어 함수
 */
export function useCustomerModal() {
  const [selectedCustomerId, setSelectedCustomerId] = useState<number | null>(null)

  const openModal = (customerId: number) => {
    setSelectedCustomerId(customerId)
  }

  const closeModal = () => {
    setSelectedCustomerId(null)
  }

  return {
    selectedCustomerId,
    isOpen: !!selectedCustomerId,
    openModal,
    closeModal,
  }
}
