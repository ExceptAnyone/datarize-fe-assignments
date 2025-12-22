/**
 * Emotion 테마 정의
 * 애플리케이션 전체에서 사용할 디자인 토큰을 정의합니다.
 */
export const theme = {
  colors: {
    primary: '#2563eb', // 블루
    secondary: '#64748b', // 슬레이트
    success: '#10b981', // 그린
    danger: '#ef4444', // 레드
    warning: '#f59e0b', // 앰버
    info: '#06b6d4', // 시안

    text: {
      primary: '#0f172a',
      secondary: '#475569',
      disabled: '#94a3b8',
    },

    background: {
      primary: '#ffffff',
      secondary: '#f8fafc',
      disabled: '#e2e8f0',
    },

    border: {
      default: '#e2e8f0',
      focus: '#3b82f6',
    },
  },

  typography: {
    fontFamily:
      '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    fontSize: {
      xs: '0.75rem', // 12px
      sm: '0.875rem', // 14px
      base: '1rem', // 16px
      lg: '1.125rem', // 18px
      xl: '1.25rem', // 20px
      '2xl': '1.5rem', // 24px
      '3xl': '1.875rem', // 30px
      '4xl': '2.25rem', // 36px
    },
    fontWeight: {
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
    },
  },

  spacing: {
    xs: '0.25rem', // 4px
    sm: '0.5rem', // 8px
    md: '1rem', // 16px
    lg: '1.5rem', // 24px
    xl: '2rem', // 32px
    '2xl': '3rem', // 48px
    '3xl': '4rem', // 64px
  },

  borderRadius: {
    sm: '0.25rem', // 4px
    md: '0.5rem', // 8px
    lg: '0.75rem', // 12px
    xl: '1rem', // 16px
    full: '9999px',
  },

  shadows: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
  },
} as const;

export type Theme = typeof theme;
