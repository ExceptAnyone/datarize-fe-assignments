import styled from '@emotion/styled';

interface StyledErrorMessageProps {
  variant: 'error' | 'warning';
}

const ERROR_BACKGROUND_COLOR = '#fef2f2';
const WARNING_BACKGROUND_COLOR = '#fffbeb';

export const StyledErrorMessage = styled.div<StyledErrorMessageProps>`
  padding: ${({ theme }) => theme.spacing.md};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  background-color: ${({ variant }) =>
    variant === 'error' ? ERROR_BACKGROUND_COLOR : WARNING_BACKGROUND_COLOR};
  color: ${({ theme, variant }) =>
    variant === 'error' ? theme.colors.danger : theme.colors.warning};
  border: 1px solid
    ${({ theme, variant }) =>
      variant === 'error' ? theme.colors.danger : theme.colors.warning};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  line-height: 1.5;
`;
