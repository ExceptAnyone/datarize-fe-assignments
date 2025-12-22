import styled from '@emotion/styled';

const SPINNER_SIZE = {
  sm: '1rem',
  md: '2rem',
  lg: '3rem',
} as const;

interface StyledSpinnerProps {
  size: 'sm' | 'md' | 'lg';
  color?: string;
}

export const SpinnerContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  min-height: 100px;
`;

export const StyledSpinner = styled.div<StyledSpinnerProps>`
  width: ${({ size }) => SPINNER_SIZE[size]};
  height: ${({ size }) => SPINNER_SIZE[size]};
  border: 2px solid ${({ theme, color }) => color || theme.colors.border.default};
  border-top-color: ${({ theme, color }) => color || theme.colors.primary};
  border-radius: ${({ theme }) => theme.borderRadius.full};
  animation: spin 0.8s linear infinite;

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;
