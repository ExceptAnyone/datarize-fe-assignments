import { describe, it, expect } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useCustomerPagination } from '../useCustomerPagination'

describe('useCustomerPagination', () => {
  describe('초기 상태', () => {
    it('초기 페이지는 1', () => {
      const { result } = renderHook(() =>
        useCustomerPagination({
          totalItems: 100,
        }),
      )

      expect(result.current.currentPage).toBe(1)
    })

    it('커스텀 초기 페이지 설정 가능', () => {
      const { result } = renderHook(() =>
        useCustomerPagination({
          totalItems: 100,
          initialPage: 3,
        }),
      )

      expect(result.current.currentPage).toBe(3)
    })

    it('기본 페이지당 아이템 수는 10', () => {
      const { result } = renderHook(() =>
        useCustomerPagination({
          totalItems: 100,
        }),
      )

      expect(result.current.itemsPerPage).toBe(10)
    })

    it('커스텀 페이지당 아이템 수 설정 가능', () => {
      const { result } = renderHook(() =>
        useCustomerPagination({
          totalItems: 100,
          itemsPerPage: 20,
        }),
      )

      expect(result.current.itemsPerPage).toBe(20)
    })
  })

  describe('총 페이지 수 계산', () => {
    it('100명 / 10 = 10페이지', () => {
      const { result } = renderHook(() =>
        useCustomerPagination({
          totalItems: 100,
        }),
      )

      expect(result.current.totalPages).toBe(10)
    })

    it('95명 / 10 = 10페이지 (올림)', () => {
      const { result } = renderHook(() =>
        useCustomerPagination({
          totalItems: 95,
        }),
      )

      expect(result.current.totalPages).toBe(10)
    })

    it('5명 / 10 = 1페이지', () => {
      const { result } = renderHook(() =>
        useCustomerPagination({
          totalItems: 5,
        }),
      )

      expect(result.current.totalPages).toBe(1)
    })

    it('0명일 때도 최소 1페이지', () => {
      const { result } = renderHook(() =>
        useCustomerPagination({
          totalItems: 0,
        }),
      )

      expect(result.current.totalPages).toBe(1)
    })
  })

  describe('인덱스 계산', () => {
    it('1페이지: startIndex=0, endIndex=10', () => {
      const { result } = renderHook(() =>
        useCustomerPagination({
          totalItems: 100,
        }),
      )

      expect(result.current.startIndex).toBe(0)
      expect(result.current.endIndex).toBe(10)
    })

    it('2페이지: startIndex=10, endIndex=20', () => {
      const { result } = renderHook(() =>
        useCustomerPagination({
          totalItems: 100,
          initialPage: 2,
        }),
      )

      expect(result.current.startIndex).toBe(10)
      expect(result.current.endIndex).toBe(20)
    })

    it('마지막 페이지가 완전하지 않을 때 (95명, 10페이지)', () => {
      const { result } = renderHook(() =>
        useCustomerPagination({
          totalItems: 95,
          initialPage: 10,
        }),
      )

      expect(result.current.startIndex).toBe(90)
      expect(result.current.endIndex).toBe(95) // totalItems로 제한
    })
  })

  describe('페이지 이동', () => {
    it('다음 페이지로 이동', () => {
      const { result } = renderHook(() =>
        useCustomerPagination({
          totalItems: 100,
        }),
      )

      act(() => {
        result.current.nextPage()
      })

      expect(result.current.currentPage).toBe(2)
    })

    it('이전 페이지로 이동', () => {
      const { result } = renderHook(() =>
        useCustomerPagination({
          totalItems: 100,
          initialPage: 2,
        }),
      )

      act(() => {
        result.current.prevPage()
      })

      expect(result.current.currentPage).toBe(1)
    })

    it('특정 페이지로 이동', () => {
      const { result } = renderHook(() =>
        useCustomerPagination({
          totalItems: 100,
        }),
      )

      act(() => {
        result.current.goToPage(5)
      })

      expect(result.current.currentPage).toBe(5)
    })

    it('첫 페이지로 리셋', () => {
      const { result } = renderHook(() =>
        useCustomerPagination({
          totalItems: 100,
          initialPage: 7,
        }),
      )

      act(() => {
        result.current.resetPage()
      })

      expect(result.current.currentPage).toBe(1)
    })
  })

  describe('경계값 검증', () => {
    it('첫 페이지에서 이전 버튼 비활성화', () => {
      const { result } = renderHook(() =>
        useCustomerPagination({
          totalItems: 100,
        }),
      )

      expect(result.current.canGoPrev).toBe(false)

      act(() => {
        result.current.prevPage()
      })

      expect(result.current.currentPage).toBe(1) // 변경 없음
    })

    it('마지막 페이지에서 다음 버튼 비활성화', () => {
      const { result } = renderHook(() =>
        useCustomerPagination({
          totalItems: 100,
        }),
      )

      act(() => {
        result.current.goToPage(10)
      })

      expect(result.current.canGoNext).toBe(false)

      act(() => {
        result.current.nextPage()
      })

      expect(result.current.currentPage).toBe(10) // 변경 없음
    })

    it('범위를 벗어나는 페이지 번호는 자동 보정 (너무 큼)', () => {
      const { result } = renderHook(() =>
        useCustomerPagination({
          totalItems: 100,
        }),
      )

      act(() => {
        result.current.goToPage(999)
      })

      expect(result.current.currentPage).toBe(10) // 최대 페이지로 보정
    })

    it('범위를 벗어나는 페이지 번호는 자동 보정 (0 이하)', () => {
      const { result } = renderHook(() =>
        useCustomerPagination({
          totalItems: 100,
        }),
      )

      act(() => {
        result.current.goToPage(0)
      })

      expect(result.current.currentPage).toBe(1) // 최소 페이지로 보정

      act(() => {
        result.current.goToPage(-5)
      })

      expect(result.current.currentPage).toBe(1)
    })
  })

  describe('동적 totalItems 변경', () => {
    it('검색 결과가 줄어들어 현재 페이지가 범위를 벗어나면 자동 보정', () => {
      const { result, rerender } = renderHook(
        ({ totalItems }) =>
          useCustomerPagination({
            totalItems,
          }),
        {
          initialProps: { totalItems: 100 },
        },
      )

      // 5페이지로 이동
      act(() => {
        result.current.goToPage(5)
      })
      expect(result.current.currentPage).toBe(5)

      // totalItems가 20으로 줄어듦 (2페이지만 존재)
      rerender({ totalItems: 20 })

      // 자동으로 마지막 페이지(2)로 보정
      expect(result.current.currentPage).toBe(2)
      expect(result.current.totalPages).toBe(2)
    })

    it('검색 결과가 늘어나면 현재 페이지 유지', () => {
      const { result, rerender } = renderHook(
        ({ totalItems }) =>
          useCustomerPagination({
            totalItems,
          }),
        {
          initialProps: { totalItems: 20 },
        },
      )

      // 2페이지로 이동
      act(() => {
        result.current.goToPage(2)
      })
      expect(result.current.currentPage).toBe(2)

      // totalItems가 100으로 늘어남
      rerender({ totalItems: 100 })

      // 현재 페이지 유지
      expect(result.current.currentPage).toBe(2)
      expect(result.current.totalPages).toBe(10)
    })
  })

  describe('엣지 케이스', () => {
    it('데이터가 정확히 10개일 때 1페이지만 존재', () => {
      const { result } = renderHook(() =>
        useCustomerPagination({
          totalItems: 10,
        }),
      )

      expect(result.current.totalPages).toBe(1)
      expect(result.current.canGoNext).toBe(false)
    })

    it('데이터가 11개일 때 2페이지 존재', () => {
      const { result } = renderHook(() =>
        useCustomerPagination({
          totalItems: 11,
        }),
      )

      expect(result.current.totalPages).toBe(2)
      expect(result.current.canGoNext).toBe(true)
    })

    it('단일 페이지에서 이전/다음 모두 비활성화', () => {
      const { result } = renderHook(() =>
        useCustomerPagination({
          totalItems: 5,
        }),
      )

      expect(result.current.canGoPrev).toBe(false)
      expect(result.current.canGoNext).toBe(false)
    })
  })
})
