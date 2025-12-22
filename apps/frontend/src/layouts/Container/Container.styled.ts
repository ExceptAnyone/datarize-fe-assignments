import styled from '@emotion/styled';

interface StyledContainerProps {
  maxWidth: 'sm' | 'md' | 'lg' | 'xl' | 'full';
}

const MAX_WIDTH = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  full: '100%',
} as const;

export const StyledContainer = styled.div<StyledContainerProps>`
  width: 100%;
  max-width: ${({ maxWidth }) => MAX_WIDTH[maxWidth]};
  margin: 0 auto;
  padding: 0 ${({ theme }) => theme.spacing.md};
`;
