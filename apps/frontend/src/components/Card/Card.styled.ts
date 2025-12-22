import styled from '@emotion/styled';

interface StyledCardProps {
  padding: 'sm' | 'md' | 'lg';
  elevation: 'sm' | 'md' | 'lg';
}

const CARD_PADDING = {
  sm: '0.75rem',
  md: '1rem',
  lg: '1.5rem',
} as const;

export const StyledCard = styled.div<StyledCardProps>`
  background-color: ${({ theme }) => theme.colors.background.primary};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  padding: ${({ padding }) => CARD_PADDING[padding]};
  box-shadow: ${({ theme, elevation }) => theme.shadows[elevation]};
  border: 1px solid ${({ theme }) => theme.colors.border.default};
`;

export const CardHeader = styled.div`
  padding-bottom: ${({ theme }) => theme.spacing.md};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border.default};
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

export const CardBody = styled.div`
  /* 기본 스타일 */
`;

export const CardFooter = styled.div`
  padding-top: ${({ theme }) => theme.spacing.md};
  border-top: 1px solid ${({ theme }) => theme.colors.border.default};
  margin-top: ${({ theme }) => theme.spacing.md};
`;
