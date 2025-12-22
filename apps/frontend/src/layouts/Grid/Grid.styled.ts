import styled from '@emotion/styled';

interface StyledGridProps {
  columns: 1 | 2 | 3 | 4;
  gap: 'sm' | 'md' | 'lg';
}

const GRID_GAP = {
  sm: '0.5rem',
  md: '1rem',
  lg: '1.5rem',
} as const;

const MOBILE_BREAKPOINT = '768px';

export const StyledGrid = styled.div<StyledGridProps>`
  display: grid;
  grid-template-columns: repeat(${({ columns }) => columns}, 1fr);
  gap: ${({ gap }) => GRID_GAP[gap]};

  @media (max-width: ${MOBILE_BREAKPOINT}) {
    grid-template-columns: 1fr;
  }
`;
