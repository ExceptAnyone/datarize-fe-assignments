import styled from '@emotion/styled';

interface StyledSectionProps {
  spacing: 'sm' | 'md' | 'lg';
}

const SECTION_SPACING = {
  sm: '1rem',
  md: '2rem',
  lg: '3rem',
} as const;

export const StyledSection = styled.section<StyledSectionProps>`
  padding: ${({ spacing }) => SECTION_SPACING[spacing]} 0;
`;
