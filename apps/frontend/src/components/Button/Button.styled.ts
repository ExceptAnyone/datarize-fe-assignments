import styled from '@emotion/styled'

interface StyledButtonProps {
  variant: 'primary' | 'secondary' | 'danger'
  size: 'sm' | 'md' | 'lg'
  fullWidth: boolean
}

const BUTTON_PADDING = {
  sm: '0.375rem 0.75rem',
  md: '0.5rem 1rem',
  lg: '0.75rem 1.5rem',
} as const

const BUTTON_FONT_SIZE = {
  sm: '0.875rem',
  md: '1rem',
  lg: '1.125rem',
} as const

export const StyledButton = styled.button<StyledButtonProps>`
  padding: ${({ size }) => BUTTON_PADDING[size]};
  font-size: ${({ size }) => BUTTON_FONT_SIZE[size]};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  border: none;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  width: ${({ fullWidth }) => (fullWidth ? '100%' : 'auto')};

  background-color: ${({ theme, variant }) => {
    switch (variant) {
      case 'primary':
        return theme.colors.primary
      case 'secondary':
        return theme.colors.secondary
      case 'danger':
        return theme.colors.danger
    }
  }};

  color: #ffffff;

  &:hover:not(:disabled) {
    opacity: 0.9;
    transform: translateY(-1px);
  }

  &:active:not(:disabled) {
    transform: translateY(0);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.border.focus};
    outline-offset: 2px;
  }
`
