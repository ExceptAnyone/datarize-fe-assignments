import type { Meta, StoryObj } from '@storybook/react';
import { Table } from './Table';

const meta = {
  title: 'Components/Table',
  component: Table,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Table>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * 기본 Table
 */
export const Basic: Story = {
  render: () => (
    <Table>
      <Table.Header>
        <Table.Row>
          <Table.HeaderCell>이름</Table.HeaderCell>
          <Table.HeaderCell>이메일</Table.HeaderCell>
          <Table.HeaderCell>역할</Table.HeaderCell>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        <Table.Row>
          <Table.Cell>김철수</Table.Cell>
          <Table.Cell>kim@example.com</Table.Cell>
          <Table.Cell>개발자</Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.Cell>이영희</Table.Cell>
          <Table.Cell>lee@example.com</Table.Cell>
          <Table.Cell>디자이너</Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.Cell>박민수</Table.Cell>
          <Table.Cell>park@example.com</Table.Cell>
          <Table.Cell>매니저</Table.Cell>
        </Table.Row>
      </Table.Body>
    </Table>
  ),
};

/**
 * 정렬이 있는 Table
 */
export const WithAlignment: Story = {
  render: () => (
    <Table>
      <Table.Header>
        <Table.Row>
          <Table.HeaderCell align="left">제품명</Table.HeaderCell>
          <Table.HeaderCell align="center">재고</Table.HeaderCell>
          <Table.HeaderCell align="right">가격</Table.HeaderCell>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        <Table.Row>
          <Table.Cell align="left">무선 이어폰</Table.Cell>
          <Table.Cell align="center">45</Table.Cell>
          <Table.Cell align="right">89,000원</Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.Cell align="left">스마트워치</Table.Cell>
          <Table.Cell align="center">23</Table.Cell>
          <Table.Cell align="right">245,000원</Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.Cell align="left">블루투스 스피커</Table.Cell>
          <Table.Cell align="center">67</Table.Cell>
          <Table.Cell align="right">125,000원</Table.Cell>
        </Table.Row>
      </Table.Body>
    </Table>
  ),
};

/**
 * 고객 데이터 Table 예시
 */
export const CustomerData: Story = {
  render: () => (
    <Table>
      <Table.Header>
        <Table.Row>
          <Table.HeaderCell>ID</Table.HeaderCell>
          <Table.HeaderCell>이름</Table.HeaderCell>
          <Table.HeaderCell align="center">구매 횟수</Table.HeaderCell>
          <Table.HeaderCell align="right">총 구매 금액</Table.HeaderCell>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        <Table.Row style={{ cursor: 'pointer' }}>
          <Table.Cell>1</Table.Cell>
          <Table.Cell>김철수</Table.Cell>
          <Table.Cell align="center">8</Table.Cell>
          <Table.Cell align="right">456,000원</Table.Cell>
        </Table.Row>
        <Table.Row style={{ cursor: 'pointer' }}>
          <Table.Cell>2</Table.Cell>
          <Table.Cell>이영희</Table.Cell>
          <Table.Cell align="center">6</Table.Cell>
          <Table.Cell align="right">378,000원</Table.Cell>
        </Table.Row>
        <Table.Row style={{ cursor: 'pointer' }}>
          <Table.Cell>3</Table.Cell>
          <Table.Cell>박민수</Table.Cell>
          <Table.Cell align="center">7</Table.Cell>
          <Table.Cell align="right">521,000원</Table.Cell>
        </Table.Row>
        <Table.Row style={{ cursor: 'pointer' }}>
          <Table.Cell>4</Table.Cell>
          <Table.Cell>정수진</Table.Cell>
          <Table.Cell align="center">9</Table.Cell>
          <Table.Cell align="right">642,000원</Table.Cell>
        </Table.Row>
        <Table.Row style={{ cursor: 'pointer' }}>
          <Table.Cell>5</Table.Cell>
          <Table.Cell>최동욱</Table.Cell>
          <Table.Cell align="center">5</Table.Cell>
          <Table.Cell align="right">289,000원</Table.Cell>
        </Table.Row>
      </Table.Body>
    </Table>
  ),
};

/**
 * 긴 데이터 Table (스크롤)
 */
export const LongData: Story = {
  render: () => (
    <div style={{ maxHeight: '400px', overflow: 'auto' }}>
      <Table>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>번호</Table.HeaderCell>
            <Table.HeaderCell>제목</Table.HeaderCell>
            <Table.HeaderCell>작성자</Table.HeaderCell>
            <Table.HeaderCell align="right">조회수</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {Array.from({ length: 20 }, (_, i) => (
            <Table.Row key={i}>
              <Table.Cell>{i + 1}</Table.Cell>
              <Table.Cell>게시글 제목 {i + 1}</Table.Cell>
              <Table.Cell>작성자 {i + 1}</Table.Cell>
              <Table.Cell align="right">{Math.floor(Math.random() * 1000)}</Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    </div>
  ),
};

/**
 * 빈 상태 Table
 */
export const Empty: Story = {
  render: () => (
    <Table>
      <Table.Header>
        <Table.Row>
          <Table.HeaderCell>이름</Table.HeaderCell>
          <Table.HeaderCell>이메일</Table.HeaderCell>
          <Table.HeaderCell>역할</Table.HeaderCell>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        <Table.Row>
          <Table.Cell colSpan={3} align="center" style={{ padding: '3rem' }}>
            <div style={{ color: '#94a3b8' }}>데이터가 없습니다.</div>
          </Table.Cell>
        </Table.Row>
      </Table.Body>
    </Table>
  ),
};
