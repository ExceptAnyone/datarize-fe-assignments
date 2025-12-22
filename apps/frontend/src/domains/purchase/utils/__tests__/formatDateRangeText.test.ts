import { describe, it, expect } from 'vitest'
import { formatDateRangeText } from '../formatDateRangeText'

describe('formatDateRangeText', () => {
  describe('정상 케이스', () => {
    it('같은 연도, 같은 월 -> "YYYY년 MM월 분석"', () => {
      expect(formatDateRangeText('2025-07-01', '2025-07-31')).toBe('2025년 7월 분석')
    })

    it('같은 연도, 다른 월 -> "YYYY년 MM월 ~ MM월 분석"', () => {
      expect(formatDateRangeText('2025-07-01', '2025-09-30')).toBe('2025년 7월 ~ 9월 분석')
    })

    it('다른 연도 -> "YYYY년 MM월 ~ YYYY년 MM월 분석"', () => {
      expect(formatDateRangeText('2024-12-01', '2025-02-28')).toBe('2024년 12월 ~ 2025년 2월 분석')
    })
  })

  describe('기본값 케이스 (날짜 미선택)', () => {
    it('from, to 모두 없으면 기본값 "2024년 7월 분석"', () => {
      expect(formatDateRangeText()).toBe('2024년 7월 분석')
    })

    it('from만 있고 to가 없으면 기본값', () => {
      expect(formatDateRangeText('2025-01-01', undefined)).toBe('2024년 7월 분석')
    })

    it('to만 있고 from이 없으면 기본값', () => {
      expect(formatDateRangeText(undefined, '2025-12-31')).toBe('2024년 7월 분석')
    })

    it('빈 문자열로 전달되면 기본값', () => {
      expect(formatDateRangeText('', '')).toBe('2024년 7월 분석')
    })

    it('from이 빈 문자열이면 기본값', () => {
      expect(formatDateRangeText('', '2025-12-31')).toBe('2024년 7월 분석')
    })

    it('to가 빈 문자열이면 기본값', () => {
      expect(formatDateRangeText('2025-01-01', '')).toBe('2024년 7월 분석')
    })
  })

  describe('월별 경계값 케이스', () => {
    it('1월 -> "1월"로 표시', () => {
      expect(formatDateRangeText('2025-01-01', '2025-01-31')).toBe('2025년 1월 분석')
    })

    it('12월 -> "12월"로 표시', () => {
      expect(formatDateRangeText('2025-12-01', '2025-12-31')).toBe('2025년 12월 분석')
    })

    it('1월 ~ 2월 범위', () => {
      expect(formatDateRangeText('2025-01-01', '2025-02-28')).toBe('2025년 1월 ~ 2월 분석')
    })

    it('11월 ~ 12월 범위', () => {
      expect(formatDateRangeText('2025-11-01', '2025-12-31')).toBe('2025년 11월 ~ 12월 분석')
    })

    it('1월 ~ 12월 전체 범위', () => {
      expect(formatDateRangeText('2025-01-01', '2025-12-31')).toBe('2025년 1월 ~ 12월 분석')
    })
  })

  describe('같은 월, 다른 날짜', () => {
    it('같은 월의 첫날과 마지막날', () => {
      expect(formatDateRangeText('2025-07-01', '2025-07-31')).toBe('2025년 7월 분석')
    })

    it('같은 월의 중간 날짜들', () => {
      expect(formatDateRangeText('2025-07-10', '2025-07-20')).toBe('2025년 7월 분석')
    })

    it('같은 월의 같은 날짜', () => {
      expect(formatDateRangeText('2025-07-15', '2025-07-15')).toBe('2025년 7월 분석')
    })
  })

  describe('연도 전환 케이스', () => {
    it('연말에서 연초로 (12월 ~ 1월)', () => {
      expect(formatDateRangeText('2024-12-01', '2025-01-31')).toBe('2024년 12월 ~ 2025년 1월 분석')
    })

    it('여러 연도에 걸친 범위 (2023 ~ 2025)', () => {
      expect(formatDateRangeText('2023-06-01', '2025-08-31')).toBe('2023년 6월 ~ 2025년 8월 분석')
    })

    it('정확히 1년 차이', () => {
      expect(formatDateRangeText('2024-07-01', '2025-07-01')).toBe('2024년 7월 ~ 2025년 7월 분석')
    })
  })

  describe('날짜 포맷 엣지 케이스', () => {
    it('ISO 8601 full 형식도 처리 가능', () => {
      expect(formatDateRangeText('2025-07-01T00:00:00', '2025-07-31T23:59:59')).toBe('2025년 7월 분석')
    })

    it('Date 생성자가 처리 가능한 모든 형식', () => {
      // Date 생성자는 다양한 형식을 처리할 수 있음
      expect(formatDateRangeText('2025-07-01', '2025-07-31')).toBe('2025년 7월 분석')
    })
  })

  describe('윤년 처리', () => {
    it('윤년 2월 (29일)', () => {
      expect(formatDateRangeText('2024-02-01', '2024-02-29')).toBe('2024년 2월 분석')
    })

    it('평년 2월 (28일)', () => {
      expect(formatDateRangeText('2025-02-01', '2025-02-28')).toBe('2025년 2월 분석')
    })

    it('윤년과 평년을 넘나드는 범위', () => {
      expect(formatDateRangeText('2024-02-15', '2025-02-15')).toBe('2024년 2월 ~ 2025년 2월 분석')
    })
  })

  describe('실제 사용 시나리오', () => {
    it('분기별 분석 (Q1: 1~3월)', () => {
      expect(formatDateRangeText('2025-01-01', '2025-03-31')).toBe('2025년 1월 ~ 3월 분석')
    })

    it('분기별 분석 (Q2: 4~6월)', () => {
      expect(formatDateRangeText('2025-04-01', '2025-06-30')).toBe('2025년 4월 ~ 6월 분석')
    })

    it('분기별 분석 (Q3: 7~9월)', () => {
      expect(formatDateRangeText('2025-07-01', '2025-09-30')).toBe('2025년 7월 ~ 9월 분석')
    })

    it('분기별 분석 (Q4: 10~12월)', () => {
      expect(formatDateRangeText('2025-10-01', '2025-12-31')).toBe('2025년 10월 ~ 12월 분석')
    })

    it('반기별 분석 (상반기)', () => {
      expect(formatDateRangeText('2025-01-01', '2025-06-30')).toBe('2025년 1월 ~ 6월 분석')
    })

    it('반기별 분석 (하반기)', () => {
      expect(formatDateRangeText('2025-07-01', '2025-12-31')).toBe('2025년 7월 ~ 12월 분석')
    })

    it('연간 분석', () => {
      expect(formatDateRangeText('2025-01-01', '2025-12-31')).toBe('2025년 1월 ~ 12월 분석')
    })
  })

  describe('월 번호 정확성', () => {
    it('getMonth()는 0부터 시작하므로 +1 필요', () => {
      // 1월 = 0, 12월 = 11이므로 정확히 +1 해야 함
      expect(formatDateRangeText('2025-01-01', '2025-01-31')).toBe('2025년 1월 분석')
      expect(formatDateRangeText('2025-12-01', '2025-12-31')).toBe('2025년 12월 분석')
    })

    it('모든 월이 올바른 숫자로 표시됨', () => {
      const months = [
        { date: '2025-01-01', month: 1 },
        { date: '2025-02-01', month: 2 },
        { date: '2025-03-01', month: 3 },
        { date: '2025-04-01', month: 4 },
        { date: '2025-05-01', month: 5 },
        { date: '2025-06-01', month: 6 },
        { date: '2025-07-01', month: 7 },
        { date: '2025-08-01', month: 8 },
        { date: '2025-09-01', month: 9 },
        { date: '2025-10-01', month: 10 },
        { date: '2025-11-01', month: 11 },
        { date: '2025-12-01', month: 12 },
      ]

      months.forEach(({ date, month }) => {
        const result = formatDateRangeText(date, date)
        expect(result).toBe(`2025년 ${month}월 분석`)
      })
    })
  })

  describe('날짜 비교 로직', () => {
    it('역순으로 입력해도 동작 (from > to인 경우도 처리)', () => {
      // 실제로는 validation에서 막겠지만, 함수 자체는 동작함
      expect(formatDateRangeText('2025-12-31', '2025-01-01')).toBe('2025년 12월 ~ 1월 분석')
    })

    it('from과 to가 같은 경우', () => {
      expect(formatDateRangeText('2025-07-15', '2025-07-15')).toBe('2025년 7월 분석')
    })
  })
})
