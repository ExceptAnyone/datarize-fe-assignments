import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { fetchPurchaseFrequency } from '../purchaseFrequency'
import type { PurchaseFrequencyData } from '../purchaseFrequency'

describe('fetchPurchaseFrequency', () => {
  let originalFetch: typeof global.fetch

  beforeEach(() => {
    originalFetch = global.fetch
  })

  afterEach(() => {
    global.fetch = originalFetch
  })

  describe('정상 응답 케이스', () => {
    it('파라미터 없이 호출 시 전체 데이터 반환', async () => {
      const mockData: PurchaseFrequencyData[] = [
        { range: '0 - 20000', count: 10 },
        { range: '20001 - 30000', count: 5 },
      ]

      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => mockData,
      })

      const result = await fetchPurchaseFrequency()

      expect(result).toEqual(mockData)
      expect(global.fetch).toHaveBeenCalledWith('/api/purchase-frequency')
    })

    it('빈 배열 응답도 정상 처리', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => [],
      })

      const result = await fetchPurchaseFrequency()

      expect(result).toEqual([])
    })
  })

  describe('ISO 8601 날짜 변환 (CRITICAL)', () => {
    it('from 날짜를 ISO 8601로 변환 (00:00:00)', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => [],
      })

      await fetchPurchaseFrequency({ from: '2024-07-01' })

      const callUrl = vi.mocked(global.fetch).mock.calls[0][0] as string
      expect(callUrl).toContain('/api/purchase-frequency?')
      expect(callUrl).toContain('from=')

      // URL에서 from 파라미터 추출
      const url = new URL(callUrl, 'http://localhost')
      const fromParam = url.searchParams.get('from')

      expect(fromParam).toBeTruthy()
      const fromDate = new Date(fromParam!)

      // 시간이 00:00:00으로 설정되었는지 확인
      expect(fromDate.getHours()).toBe(0)
      expect(fromDate.getMinutes()).toBe(0)
      expect(fromDate.getSeconds()).toBe(0)
      expect(fromDate.getMilliseconds()).toBe(0)
    })

    it('to 날짜를 ISO 8601로 변환 (23:59:59.999)', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => [],
      })

      await fetchPurchaseFrequency({ to: '2024-07-31' })

      const callUrl = vi.mocked(global.fetch).mock.calls[0][0] as string
      const url = new URL(callUrl, 'http://localhost')
      const toParam = url.searchParams.get('to')

      expect(toParam).toBeTruthy()
      const toDate = new Date(toParam!)

      // 시간이 23:59:59.999로 설정되었는지 확인
      expect(toDate.getHours()).toBe(23)
      expect(toDate.getMinutes()).toBe(59)
      expect(toDate.getSeconds()).toBe(59)
      expect(toDate.getMilliseconds()).toBe(999)
    })

    it('from과 to를 모두 ISO 8601로 변환', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => [],
      })

      await fetchPurchaseFrequency({
        from: '2024-07-01',
        to: '2024-07-31',
      })

      const callUrl = vi.mocked(global.fetch).mock.calls[0][0] as string
      const url = new URL(callUrl, 'http://localhost')

      const fromParam = url.searchParams.get('from')
      const toParam = url.searchParams.get('to')

      expect(fromParam).toBeTruthy()
      expect(toParam).toBeTruthy()

      const fromDate = new Date(fromParam!)
      const toDate = new Date(toParam!)

      // from: 00:00:00.000
      expect(fromDate.getHours()).toBe(0)
      expect(fromDate.getMinutes()).toBe(0)
      expect(fromDate.getSeconds()).toBe(0)
      expect(fromDate.getMilliseconds()).toBe(0)

      // to: 23:59:59.999
      expect(toDate.getHours()).toBe(23)
      expect(toDate.getMinutes()).toBe(59)
      expect(toDate.getSeconds()).toBe(59)
      expect(toDate.getMilliseconds()).toBe(999)
    })

    it('YYYY-MM-DD 형식이 정확히 파싱됨', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => [],
      })

      await fetchPurchaseFrequency({ from: '2024-12-25' })

      const callUrl = vi.mocked(global.fetch).mock.calls[0][0] as string
      const url = new URL(callUrl, 'http://localhost')
      const fromParam = url.searchParams.get('from')

      const fromDate = new Date(fromParam!)

      expect(fromDate.getFullYear()).toBe(2024)
      expect(fromDate.getMonth()).toBe(11) // 12월 = 11 (0-based)
      expect(fromDate.getDate()).toBe(25)
    })
  })

  describe('날짜 경계값 케이스', () => {
    it('월의 첫날 (1일)', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => [],
      })

      await fetchPurchaseFrequency({ from: '2024-07-01' })

      const callUrl = vi.mocked(global.fetch).mock.calls[0][0] as string
      const url = new URL(callUrl, 'http://localhost')
      const fromParam = url.searchParams.get('from')

      const fromDate = new Date(fromParam!)
      expect(fromDate.getDate()).toBe(1)
    })

    it('월의 마지막날 (31일)', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => [],
      })

      await fetchPurchaseFrequency({ to: '2024-07-31' })

      const callUrl = vi.mocked(global.fetch).mock.calls[0][0] as string
      const url = new URL(callUrl, 'http://localhost')
      const toParam = url.searchParams.get('to')

      const toDate = new Date(toParam!)
      expect(toDate.getDate()).toBe(31)
    })

    it('2월 마지막날 - 윤년 (29일)', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => [],
      })

      await fetchPurchaseFrequency({ to: '2024-02-29' })

      const callUrl = vi.mocked(global.fetch).mock.calls[0][0] as string
      const url = new URL(callUrl, 'http://localhost')
      const toParam = url.searchParams.get('to')

      const toDate = new Date(toParam!)
      expect(toDate.getDate()).toBe(29)
      expect(toDate.getMonth()).toBe(1) // 2월
    })

    it('2월 마지막날 - 평년 (28일)', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => [],
      })

      await fetchPurchaseFrequency({ to: '2025-02-28' })

      const callUrl = vi.mocked(global.fetch).mock.calls[0][0] as string
      const url = new URL(callUrl, 'http://localhost')
      const toParam = url.searchParams.get('to')

      const toDate = new Date(toParam!)
      expect(toDate.getDate()).toBe(28)
      expect(toDate.getMonth()).toBe(1) // 2월
    })

    it('연초 (1월 1일)', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => [],
      })

      await fetchPurchaseFrequency({ from: '2024-01-01' })

      const callUrl = vi.mocked(global.fetch).mock.calls[0][0] as string
      const url = new URL(callUrl, 'http://localhost')
      const fromParam = url.searchParams.get('from')

      const fromDate = new Date(fromParam!)
      expect(fromDate.getMonth()).toBe(0) // 1월
      expect(fromDate.getDate()).toBe(1)
    })

    it('연말 (12월 31일)', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => [],
      })

      await fetchPurchaseFrequency({ to: '2024-12-31' })

      const callUrl = vi.mocked(global.fetch).mock.calls[0][0] as string
      const url = new URL(callUrl, 'http://localhost')
      const toParam = url.searchParams.get('to')

      const toDate = new Date(toParam!)
      expect(toDate.getMonth()).toBe(11) // 12월
      expect(toDate.getDate()).toBe(31)
    })
  })

  describe('시간 설정 정확성', () => {
    it('from의 시간은 정확히 자정 (00:00:00.000)', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => [],
      })

      await fetchPurchaseFrequency({ from: '2024-07-15' })

      const callUrl = vi.mocked(global.fetch).mock.calls[0][0] as string
      const url = new URL(callUrl, 'http://localhost')
      const fromParam = url.searchParams.get('from')

      const isoString = fromParam!
      const fromDate = new Date(isoString)

      // 로컬 시간 기준 00:00:00.000인지 확인
      expect(fromDate.getUTCHours()).toBe(15) // KST는 UTC+9이므로 00:00 KST = 15:00 UTC
      expect(fromDate.getUTCMinutes()).toBe(0)
      expect(fromDate.getUTCSeconds()).toBe(0)
      expect(fromDate.getUTCMilliseconds()).toBe(0)
    })

    it('to의 시간은 정확히 하루 끝 (23:59:59.999)', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => [],
      })

      await fetchPurchaseFrequency({ to: '2024-07-15' })

      const callUrl = vi.mocked(global.fetch).mock.calls[0][0] as string
      const url = new URL(callUrl, 'http://localhost')
      const toParam = url.searchParams.get('to')

      const isoString = toParam!
      const toDate = new Date(isoString)

      // 로컬 시간 기준 23:59:59.999인지 확인
      expect(toDate.getUTCHours()).toBe(14) // KST 23:59 = UTC 14:59
      expect(toDate.getUTCMinutes()).toBe(59)
      expect(toDate.getUTCSeconds()).toBe(59)
      expect(toDate.getUTCMilliseconds()).toBe(999)
    })
  })

  describe('에러 처리', () => {
    it('400 에러 시 에러 throw', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: false,
        status: 400,
        statusText: 'Bad Request',
      })

      await expect(fetchPurchaseFrequency()).rejects.toThrow('구매 빈도 데이터를 불러오는데 실패했습니다: Bad Request')
    })

    it('404 에러 시 에러 throw', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: false,
        status: 404,
        statusText: 'Not Found',
      })

      await expect(fetchPurchaseFrequency()).rejects.toThrow('구매 빈도 데이터를 불러오는데 실패했습니다: Not Found')
    })

    it('500 에러 시 에러 throw', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error',
      })

      await expect(fetchPurchaseFrequency()).rejects.toThrow(
        '구매 빈도 데이터를 불러오는데 실패했습니다: Internal Server Error',
      )
    })

    it('네트워크 에러 처리', async () => {
      global.fetch = vi.fn().mockRejectedValue(new Error('Network error'))

      await expect(fetchPurchaseFrequency()).rejects.toThrow('Network error')
    })
  })

  describe('응답 데이터 타입 검증', () => {
    it('올바른 PurchaseFrequencyData 타입 배열 반환', async () => {
      const mockData: PurchaseFrequencyData[] = [
        { range: '0 - 20000', count: 10 },
        { range: '20001 - 30000', count: 5 },
      ]

      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => mockData,
      })

      const result = await fetchPurchaseFrequency()

      expect(result).toBeInstanceOf(Array)
      expect(result[0]).toHaveProperty('range')
      expect(result[0]).toHaveProperty('count')
      expect(typeof result[0].range).toBe('string')
      expect(typeof result[0].count).toBe('number')
    })

    it('여러 가격대 데이터 정확히 반환', async () => {
      const mockData: PurchaseFrequencyData[] = [
        { range: '0 - 20000', count: 10 },
        { range: '20001 - 30000', count: 15 },
        { range: '30001 - 40000', count: 8 },
        { range: '40001 - 50000', count: 12 },
      ]

      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => mockData,
      })

      const result = await fetchPurchaseFrequency()

      expect(result).toHaveLength(4)
      expect(result).toEqual(mockData)
    })
  })

  describe('실제 사용 시나리오', () => {
    it('분기별 조회 (3개월)', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => [],
      })

      await fetchPurchaseFrequency({
        from: '2024-07-01',
        to: '2024-09-30',
      })

      const callUrl = vi.mocked(global.fetch).mock.calls[0][0] as string
      expect(callUrl).toContain('/api/purchase-frequency?')
      expect(callUrl).toContain('from=')
      expect(callUrl).toContain('to=')
    })

    it('월별 조회 (1개월)', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => [],
      })

      await fetchPurchaseFrequency({
        from: '2024-07-01',
        to: '2024-07-31',
      })

      expect(global.fetch).toHaveBeenCalled()
    })

    it('연간 조회 (1년)', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => [],
      })

      await fetchPurchaseFrequency({
        from: '2024-01-01',
        to: '2024-12-31',
      })

      expect(global.fetch).toHaveBeenCalled()
    })
  })

  describe('URL 파라미터 생성', () => {
    it('파라미터가 없으면 쿼리스트링 없음', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => [],
      })

      await fetchPurchaseFrequency()

      expect(global.fetch).toHaveBeenCalledWith('/api/purchase-frequency')
    })

    it('from만 있으면 from 파라미터만 포함', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => [],
      })

      await fetchPurchaseFrequency({ from: '2024-07-01' })

      const callUrl = vi.mocked(global.fetch).mock.calls[0][0] as string
      const url = new URL(callUrl, 'http://localhost')

      expect(url.searchParams.has('from')).toBe(true)
      expect(url.searchParams.has('to')).toBe(false)
    })

    it('to만 있으면 to 파라미터만 포함', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => [],
      })

      await fetchPurchaseFrequency({ to: '2024-07-31' })

      const callUrl = vi.mocked(global.fetch).mock.calls[0][0] as string
      const url = new URL(callUrl, 'http://localhost')

      expect(url.searchParams.has('from')).toBe(false)
      expect(url.searchParams.has('to')).toBe(true)
    })

    it('from과 to가 모두 있으면 둘 다 포함', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => [],
      })

      await fetchPurchaseFrequency({
        from: '2024-07-01',
        to: '2024-07-31',
      })

      const callUrl = vi.mocked(global.fetch).mock.calls[0][0] as string
      const url = new URL(callUrl, 'http://localhost')

      expect(url.searchParams.has('from')).toBe(true)
      expect(url.searchParams.has('to')).toBe(true)
    })
  })
})
