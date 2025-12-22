import styled from '@emotion/styled';

export const TableWrapper = styled.div`
  width: 100%;
  overflow-x: auto;
  border: 1px solid ${({ theme }) => theme.colors.border.default};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
`;

export const StyledTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: ${({ theme }) => theme.typography.fontSize.sm};

  /* tbody의 tr에만 호버 효과 적용 */
  tbody tr:hover {
    background-color: ${({ theme }) => theme.colors.background.secondary};
  }
`;

export const TableHead = styled.thead`
  background-color: ${({ theme }) => theme.colors.background.secondary};
  position: sticky;
  top: 0;
  z-index: 1;
`;

export const TableBody = styled.tbody``;

export const TableRow = styled.tr`
  border-bottom: 1px solid ${({ theme }) => theme.colors.border.default};
  transition: background-color 0.2s ease-in-out;

  &:last-child {
    border-bottom: none;
  }
`;

interface TableCellProps {
  align?: 'left' | 'center' | 'right';
}

export const TableHeaderCell = styled.th<TableCellProps>`
  padding: ${({ theme }) => theme.spacing.md};
  text-align: ${({ align = 'left' }) => align};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  color: ${({ theme }) => theme.colors.text.primary};
  white-space: nowrap;
`;

export const TableCell = styled.td<TableCellProps>`
  padding: ${({ theme }) => theme.spacing.md};
  text-align: ${({ align = 'left' }) => align};
  color: ${({ theme }) => theme.colors.text.primary};
`;
