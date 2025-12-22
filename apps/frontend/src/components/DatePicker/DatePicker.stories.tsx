import type { Meta, StoryObj } from '@storybook/react';
import { DatePicker } from './DatePicker';

const meta = {
  title: 'Components/DatePicker',
  component: DatePicker,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof DatePicker>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * 기본 DatePicker
 */
export const Basic: Story = {
  args: {},
};

/**
 * 라벨이 있는 DatePicker
 */
export const WithLabel: Story = {
  args: {
    label: '날짜 선택',
  },
};

/**
 * 기본값이 있는 DatePicker
 */
export const WithDefaultValue: Story = {
  args: {
    label: '시작 날짜',
    defaultValue: '2024-07-01',
  },
};

/**
 * 날짜 범위 제한
 */
export const WithMinMax: Story = {
  args: {
    label: '기간 선택',
    min: '2024-07-01',
    max: '2024-07-31',
    defaultValue: '2024-07-15',
  },
};

/**
 * 전체 너비
 */
export const FullWidth: Story = {
  args: {
    label: '날짜',
    fullWidth: true,
  },
  decorators: [
    (Story) => (
      <div style={{ width: '400px' }}>
        <Story />
      </div>
    ),
  ],
};

/**
 * 비활성화
 */
export const Disabled: Story = {
  args: {
    label: '날짜',
    disabled: true,
    defaultValue: '2024-07-15',
  },
};

/**
 * 날짜 범위 선택기 예시 (From - To)
 */
export const DateRangeExample: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-end' }}>
      <DatePicker label="시작 날짜" defaultValue="2024-07-01" />
      <span style={{ paddingBottom: '0.5rem' }}>~</span>
      <DatePicker label="종료 날짜" defaultValue="2024-07-31" />
    </div>
  ),
};
