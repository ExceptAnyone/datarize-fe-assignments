import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { fetchCustomers } from '../customers'
import type { Customer } from '../../types'

describe('fetchCustomers', () => {
  // 전역 fetch 모킹을 위한 변수
  let originalFetch: typeof global.fetch

  beforeEach(() => {
    // 원본 fetch 저장
    originalFetch = global.fetch
  })

  afterEach(() => {
    // 원본 fetch 복원
    global.fetch = originalFetch
  })

  describe('정상 응답 케이스', () => {
    it('파라미터 없이 호출 시 모든 고객 반환', async () => {
      const mockCustomers: Customer[] = [
        {
          id: 1,
          name: '홍길동',
          count: 5,
          totalAmount: 150000,
        },
        {
          id: 2,
          name: '김철수',
          count: 3,
          totalAmount: 80000,
        },
      ]

      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => mockCustomers,
      })

      const result = await fetchCustomers()

      expect(result).toEqual(mockCustomers)
      expect(global.fetch).toHaveBeenCalledWith('/api/customers')
    })

    it('sortBy 파라미터와 함께 호출', async () => {
      const mockCustomers: Customer[] = [
        {
          id: 2,
          name: '김철수',
          count: 3,
          totalAmount: 200000,
        },
        {
          id: 1,
          name: '홍길동',
          count: 5,
          totalAmount: 150000,
        },
      ]

      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => mockCustomers,
      })

      const result = await fetchCustomers({ sortBy: 'desc' })

      expect(result).toEqual(mockCustomers)
      expect(global.fetch).toHaveBeenCalledWith('/api/customers?sortBy=desc')
    })

    it('name 파라미터와 함께 호출', async () => {
      const mockCustomers: Customer[] = [
        {
          id: 1,
          name: '홍길동',
          count: 5,
          totalAmount: 150000,
        },
      ]

      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => mockCustomers,
      })

      const result = await fetchCustomers({ name: '홍길동' })

      expect(result).toEqual(mockCustomers)
      expect(global.fetch).toHaveBeenCalledWith('/api/customers?name=%ED%99%8D%EA%B8%B8%EB%8F%99')
    })

    it('sortBy와 name을 모두 포함하여 호출', async () => {
      const mockCustomers: Customer[] = [
        {
          id: 1,
          name: '김철수',
          count: 2,
          totalAmount: 50000,
        },
      ]

      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => mockCustomers,
      })

      const result = await fetchCustomers({ sortBy: 'asc', name: '김철수' })

      expect(result).toEqual(mockCustomers)
      expect(global.fetch).toHaveBeenCalledWith('/api/customers?sortBy=asc&name=%EA%B9%80%EC%B2%A0%EC%88%98')
    })

    it('빈 배열 응답도 정상 처리', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => [],
      })

      const result = await fetchCustomers({ name: '존재하지않는이름' })

      expect(result).toEqual([])
    })
  })

  describe('404 에러 처리 (앱 크래시 방지)', () => {
    it('404 응답 시 빈 배열 반환 (에러 throw 안 함)', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: false,
        status: 404,
        statusText: 'Not Found',
        json: async () => ({ message: 'No customers found' }),
      })

      const result = await fetchCustomers({ name: '존재하지않는고객' })

      expect(result).toEqual([])
      expect(result).toHaveLength(0)
    })

    it('404 응답 시 에러를 throw하지 않음', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: false,
        status: 404,
        statusText: 'Not Found',
      })

      // 에러가 throw되지 않아야 함
      await expect(fetchCustomers()).resolves.toEqual([])
    })

    it('검색 결과 없을 때 404 응답 처리', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: false,
        status: 404,
        statusText: 'Not Found',
      })

      const result = await fetchCustomers({ name: 'ㅁㄴㅇㄹ' })

      expect(result).toEqual([])
    })
  })

  describe('다른 에러 응답 처리', () => {
    it('400 에러 시 에러 throw', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: false,
        status: 400,
        statusText: 'Bad Request',
      })

      await expect(fetchCustomers()).rejects.toThrow('고객 목록을 불러오는데 실패했습니다: Bad Request')
    })

    it('500 에러 시 에러 throw', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error',
      })

      await expect(fetchCustomers()).rejects.toThrow('고객 목록을 불러오는데 실패했습니다: Internal Server Error')
    })

    it('401 에러 시 에러 throw', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: false,
        status: 401,
        statusText: 'Unauthorized',
      })

      await expect(fetchCustomers()).rejects.toThrow('고객 목록을 불러오는데 실패했습니다: Unauthorized')
    })

    it('403 에러 시 에러 throw', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: false,
        status: 403,
        statusText: 'Forbidden',
      })

      await expect(fetchCustomers()).rejects.toThrow('고객 목록을 불러오는데 실패했습니다: Forbidden')
    })
  })

  describe('네트워크 에러 처리', () => {
    it('네트워크 연결 실패 시 에러 throw', async () => {
      global.fetch = vi.fn().mockRejectedValue(new Error('Network request failed'))

      await expect(fetchCustomers()).rejects.toThrow('Network request failed')
    })

    it('타임아웃 에러 처리', async () => {
      global.fetch = vi.fn().mockRejectedValue(new Error('Request timeout'))

      await expect(fetchCustomers()).rejects.toThrow('Request timeout')
    })
  })

  describe('URL 파라미터 인코딩', () => {
    it('한글 이름이 URL 인코딩됨', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => [],
      })

      await fetchCustomers({ name: '홍길동' })

      expect(global.fetch).toHaveBeenCalledWith('/api/customers?name=%ED%99%8D%EA%B8%B8%EB%8F%99')
    })

    it('특수문자가 포함된 이름 인코딩', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => [],
      })

      await fetchCustomers({ name: '홍길동&김철수' })

      expect(global.fetch).toHaveBeenCalledWith(
        '/api/customers?name=%ED%99%8D%EA%B8%B8%EB%8F%99%26%EA%B9%80%EC%B2%A0%EC%88%98',
      )
    })

    it('공백이 포함된 이름 인코딩', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => [],
      })

      await fetchCustomers({ name: '홍 길 동' })

      expect(global.fetch).toHaveBeenCalledWith('/api/customers?name=%ED%99%8D+%EA%B8%B8+%EB%8F%99')
    })
  })

  describe('응답 데이터 타입 검증', () => {
    it('올바른 Customer 타입 배열 반환', async () => {
      const mockCustomers: Customer[] = [
        {
          id: 1,
          name: '홍길동',
          count: 5,
          totalAmount: 150000,
        },
      ]

      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => mockCustomers,
      })

      const result = await fetchCustomers()

      expect(result).toBeInstanceOf(Array)
      expect(result[0]).toHaveProperty('id')
      expect(result[0]).toHaveProperty('name')
      expect(result[0]).toHaveProperty('count')
      expect(result[0]).toHaveProperty('totalAmount')
    })

    it('여러 고객 데이터 정확히 반환', async () => {
      const mockCustomers: Customer[] = [
        { id: 1, name: '고객1', count: 1, totalAmount: 10000 },
        { id: 2, name: '고객2', count: 2, totalAmount: 20000 },
        { id: 3, name: '고객3', count: 3, totalAmount: 30000 },
      ]

      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => mockCustomers,
      })

      const result = await fetchCustomers()

      expect(result).toHaveLength(3)
      expect(result).toEqual(mockCustomers)
    })
  })

  describe('엣지 케이스', () => {
    it('빈 문자열 name으로 검색', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => [],
      })

      await fetchCustomers({ name: '' })

      expect(global.fetch).toHaveBeenCalledWith('/api/customers?name=')
    })

    it('매우 긴 이름으로 검색', async () => {
      const longName = '가'.repeat(100)

      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => [],
      })

      await fetchCustomers({ name: longName })

      expect(global.fetch).toHaveBeenCalled()
    })

    it('sortBy가 asc일 때', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => [],
      })

      await fetchCustomers({ sortBy: 'asc' })

      expect(global.fetch).toHaveBeenCalledWith('/api/customers?sortBy=asc')
    })

    it('sortBy가 desc일 때', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => [],
      })

      await fetchCustomers({ sortBy: 'desc' })

      expect(global.fetch).toHaveBeenCalledWith('/api/customers?sortBy=desc')
    })
  })
})
