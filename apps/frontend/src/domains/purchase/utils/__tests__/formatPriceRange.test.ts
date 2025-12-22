import { describe, it, expect } from 'vitest'
import { formatPriceRange } from '../formatPriceRange'

describe('formatPriceRange', () => {
  describe('정상 케이스', () => {
    it('0 ~ 20000원 범위는 "2만원 이하"로 표시', () => {
      expect(formatPriceRange('0 - 20000')).toBe('2만원 이하')
    })

    it('0 ~ 10000원 범위도 "2만원 이하"로 표시', () => {
      expect(formatPriceRange('0 - 10000')).toBe('2만원 이하')
    })

    it('20001 ~ 30000원 범위는 "2만원대"로 표시', () => {
      expect(formatPriceRange('20001 - 30000')).toBe('2만원대')
    })

    it('30001 ~ 40000원 범위는 "3만원대"로 표시', () => {
      expect(formatPriceRange('30001 - 40000')).toBe('3만원대')
    })

    it('40001 ~ 50000원 범위는 "4만원대"로 표시', () => {
      expect(formatPriceRange('40001 - 50000')).toBe('4만원대')
    })

    it('50001 ~ 60000원 범위는 "5만원대"로 표시', () => {
      expect(formatPriceRange('50001 - 60000')).toBe('5만원대')
    })

    it('90001 ~ 100000원 범위는 "9만원대"로 표시', () => {
      expect(formatPriceRange('90001 - 100000')).toBe('9만원대')
    })

    it('100001원 이상은 "10만원 이상"으로 표시', () => {
      expect(formatPriceRange('100001 - 999999')).toBe('10만원 이상')
    })

    it('100001 ~ 200000원도 "10만원 이상"으로 표시', () => {
      expect(formatPriceRange('100001 - 200000')).toBe('10만원 이상')
    })
  })

  describe('경계값 케이스', () => {
    it('정확히 20000원일 때 "2만원 이하"로 표시', () => {
      expect(formatPriceRange('0 - 20000')).toBe('2만원 이하')
    })

    it('20001원은 "2만원대"로 표시 (경계값 + 1)', () => {
      expect(formatPriceRange('20001 - 25000')).toBe('2만원대')
    })

    it('정확히 100001원일 때 "10만원 이상"으로 표시', () => {
      expect(formatPriceRange('100001 - 150000')).toBe('10만원 이상')
    })

    it('100000원일 때는 "10만원 이상"이 아님 (9만원대)', () => {
      expect(formatPriceRange('90001 - 100000')).toBe('9만원대')
    })

    it('0원부터 시작하는 최소 범위', () => {
      expect(formatPriceRange('0 - 1')).toBe('2만원 이하')
    })
  })

  describe('엣지 케이스', () => {
    it('공백이 많은 경우에도 정상 처리', () => {
      expect(formatPriceRange('0   -   20000')).toBe('2만원 이하')
    })

    it('공백이 없는 경우에도 정상 처리', () => {
      expect(formatPriceRange('0-20000')).toBe('2만원 이하')
    })

    it('탭 문자가 포함된 경우에도 정상 처리', () => {
      expect(formatPriceRange('0\t-\t20000')).toBe('2만원 이하')
    })

    it('매우 큰 숫자도 "10만원 이상"으로 표시', () => {
      expect(formatPriceRange('100001 - 99999999')).toBe('10만원 이상')
    })

    it('1만원대는 "1만원대"로 표시', () => {
      expect(formatPriceRange('10001 - 20000')).toBe('1만원대')
    })

    it('10만원 정확히는 "9만원대" (100000은 100001 미만)', () => {
      expect(formatPriceRange('100000 - 100000')).toBe('10만원대')
    })
  })

  describe('실제 사용 케이스', () => {
    it('백엔드에서 오는 전형적인 범위들', () => {
      const testCases = [
        { input: '0 - 20000', expected: '2만원 이하' },
        { input: '20001 - 30000', expected: '2만원대' },
        { input: '30001 - 40000', expected: '3만원대' },
        { input: '40001 - 50000', expected: '4만원대' },
        { input: '50001 - 60000', expected: '5만원대' },
        { input: '60001 - 70000', expected: '6만원대' },
        { input: '70001 - 80000', expected: '7만원대' },
        { input: '80001 - 90000', expected: '8만원대' },
        { input: '90001 - 100000', expected: '9만원대' },
        { input: '100001 - 200000', expected: '10만원 이상' },
      ]

      testCases.forEach(({ input, expected }) => {
        expect(formatPriceRange(input)).toBe(expected)
      })
    })
  })

  describe('숫자 파싱 정확성', () => {
    it('선행 0이 있는 숫자도 정확히 파싱', () => {
      expect(formatPriceRange('00000 - 20000')).toBe('2만원 이하')
    })

    it('일반적인 숫자 형식 정확히 파싱', () => {
      expect(formatPriceRange('25000 - 35000')).toBe('2만원대')
    })
  })

  describe('범위 계산 로직', () => {
    it('최소값 기준으로 만원대 계산 (20001 -> 2만원대)', () => {
      expect(formatPriceRange('20001 - 29999')).toBe('2만원대')
    })

    it('최소값 기준으로 만원대 계산 (35000 -> 3만원대)', () => {
      expect(formatPriceRange('35000 - 40000')).toBe('3만원대')
    })

    it('최소값이 만원 단위가 아닌 경우 floor 처리', () => {
      expect(formatPriceRange('25555 - 30000')).toBe('2만원대')
    })

    it('정확히 만원 단위 경계 (30000 -> 3만원대)', () => {
      expect(formatPriceRange('30000 - 40000')).toBe('3만원대')
    })
  })
})
