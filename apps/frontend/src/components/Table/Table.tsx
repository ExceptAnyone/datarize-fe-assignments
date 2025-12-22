import { ReactNode, HTMLAttributes } from 'react'
import {
  TableWrapper,
  StyledTable,
  TableHead as StyledTableHead,
  TableBody as StyledTableBody,
  TableRow as StyledTableRow,
  TableHeaderCell,
  TableCell as StyledTableCell,
} from './Table.styled'

interface TableProps extends HTMLAttributes<HTMLTableElement> {
  /** 테이블 내용 */
  children: ReactNode
}

interface TableHeaderProps extends HTMLAttributes<HTMLTableSectionElement> {
  /** 테이블 헤더 내용 */
  children: ReactNode
}

interface TableBodyProps extends HTMLAttributes<HTMLTableSectionElement> {
  /** 테이블 바디 내용 */
  children: ReactNode
}

interface TableRowProps extends HTMLAttributes<HTMLTableRowElement> {
  /** 테이블 행 내용 */
  children: ReactNode
}

interface TableCellProps extends HTMLAttributes<HTMLTableCellElement> {
  /** 셀 내용 */
  children: ReactNode
  /** 텍스트 정렬 */
  align?: 'left' | 'center' | 'right'
}

interface TableHeaderCellProps extends HTMLAttributes<HTMLTableHeaderCellElement> {
  /** 헤더 셀 내용 */
  children: ReactNode
  /** 텍스트 정렬 */
  align?: 'left' | 'center' | 'right'
}

function TableRoot({ children, ...props }: TableProps) {
  return (
    <TableWrapper>
      <StyledTable {...props}>{children}</StyledTable>
    </TableWrapper>
  )
}

function TableHeader({ children, ...props }: TableHeaderProps) {
  return <StyledTableHead {...props}>{children}</StyledTableHead>
}

function TableBody({ children, ...props }: TableBodyProps) {
  return <StyledTableBody {...props}>{children}</StyledTableBody>
}

function TableRow({ children, ...props }: TableRowProps) {
  return <StyledTableRow {...props}>{children}</StyledTableRow>
}

function TableHeaderCellComponent({ children, align = 'left', ...props }: TableHeaderCellProps) {
  return (
    <TableHeaderCell align={align} {...props}>
      {children}
    </TableHeaderCell>
  )
}

function TableCellComponent({ children, align = 'left', ...props }: TableCellProps) {
  return (
    <StyledTableCell align={align} {...props}>
      {children}
    </StyledTableCell>
  )
}

export const Table = Object.assign(TableRoot, {
  Header: TableHeader,
  Body: TableBody,
  Row: TableRow,
  HeaderCell: TableHeaderCellComponent,
  Cell: TableCellComponent,
})
