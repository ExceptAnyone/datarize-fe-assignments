import type { Meta, StoryObj } from '@storybook/react';
import { BarChart } from './BarChart';

const meta = {
  title: 'Components/BarChart',
  component: BarChart,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof BarChart>;

export default meta;
type Story = StoryObj<typeof meta>;

// 샘플 데이터
const salesData = [
  { month: '1월', sales: 4000 },
  { month: '2월', sales: 3000 },
  { month: '3월', sales: 5000 },
  { month: '4월', sales: 4500 },
  { month: '5월', sales: 6000 },
  { month: '6월', sales: 5500 },
];

const priceRangeData = [
  { range: '2만원 이하', count: 12 },
  { range: '2만원대', count: 18 },
  { range: '3만원대', count: 15 },
  { range: '4만원대', count: 22 },
  { range: '5만원대', count: 19 },
  { range: '6만원대', count: 14 },
  { range: '7만원대', count: 16 },
  { range: '8만원대', count: 11 },
  { range: '9만원대', count: 13 },
  { range: '10만원 이상', count: 10 },
];

/**
 * 기본 BarChart
 */
export const Basic: Story = {
  args: {
    data: salesData,
    xKey: 'month',
    yKey: 'sales',
    height: 400,
  },
};

/**
 * 라벨이 있는 BarChart
 */
export const WithLabels: Story = {
  args: {
    data: salesData,
    xKey: 'month',
    yKey: 'sales',
    height: 400,
    xLabel: '월',
    yLabel: '판매량',
  },
};

/**
 * 커스텀 색상
 */
export const CustomColor: Story = {
  args: {
    data: salesData,
    xKey: 'month',
    yKey: 'sales',
    barColor: '#10b981',
    height: 400,
  },
};

/**
 * 다양한 색상 (그라디언트 효과)
 */
export const MultipleColors: Story = {
  args: {
    data: salesData,
    xKey: 'month',
    yKey: 'sales',
    barColor: ['#3b82f6', '#8b5cf6', '#ec4899', '#10b981', '#f59e0b', '#06b6d4'],
    height: 400,
  },
};

/**
 * 가격대별 구매 빈도 차트 예시
 */
export const PriceRangeFrequency: Story = {
  args: {
    data: priceRangeData,
    xKey: 'range',
    yKey: 'count',
    barColor: '#2563eb',
    height: 450,
    xLabel: '가격대',
    yLabel: '구매 횟수',
  },
};

/**
 * 높이가 다른 차트
 */
export const TallChart: Story = {
  args: {
    data: salesData,
    xKey: 'month',
    yKey: 'sales',
    height: 600,
  },
};

/**
 * 작은 차트
 */
export const SmallChart: Story = {
  args: {
    data: salesData,
    xKey: 'month',
    yKey: 'sales',
    height: 250,
  },
};

/**
 * 많은 데이터 포인트
 */
export const ManyDataPoints: Story = {
  args: {
    data: [
      { day: '1일', visitors: 120 },
      { day: '2일', visitors: 150 },
      { day: '3일', visitors: 180 },
      { day: '4일', visitors: 140 },
      { day: '5일', visitors: 200 },
      { day: '6일', visitors: 220 },
      { day: '7일', visitors: 190 },
      { day: '8일', visitors: 170 },
      { day: '9일', visitors: 160 },
      { day: '10일', visitors: 210 },
      { day: '11일', visitors: 230 },
      { day: '12일', visitors: 195 },
      { day: '13일', visitors: 185 },
      { day: '14일', visitors: 175 },
      { day: '15일', visitors: 240 },
    ],
    xKey: 'day',
    yKey: 'visitors',
    barColor: '#f59e0b',
    height: 400,
  },
};

/**
 * 빈 데이터
 */
export const EmptyData: Story = {
  args: {
    data: [],
    xKey: 'category',
    yKey: 'value',
    height: 400,
  },
};
