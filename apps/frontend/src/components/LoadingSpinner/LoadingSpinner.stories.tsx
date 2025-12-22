import type { Meta, StoryObj } from '@storybook/react';
import { LoadingSpinner } from './LoadingSpinner';

const meta = {
  title: 'components/LoadingSpinner',
  component: LoadingSpinner,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: 'LoadingSpinner component displays a rotating spinner to indicate loading state.',
      },
    },
  },
} satisfies Meta<typeof LoadingSpinner>;

export default meta;
type Story = StoryObj<typeof LoadingSpinner>;

export const Basic: Story = {
  args: {
    size: 'md',
  },
  render: (args) => <LoadingSpinner {...args} />,
};

export const Small: Story = {
  args: {
    size: 'sm',
  },
  render: (args) => <LoadingSpinner {...args} />,
};

export const Medium: Story = {
  args: {
    size: 'md',
  },
  render: (args) => <LoadingSpinner {...args} />,
};

export const Large: Story = {
  args: {
    size: 'lg',
  },
  render: (args) => <LoadingSpinner {...args} />,
};

export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '40px', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ textAlign: 'center' }}>
        <LoadingSpinner size="sm" />
        <p style={{ marginTop: '8px', fontSize: '12px' }}>Small</p>
      </div>
      <div style={{ textAlign: 'center' }}>
        <LoadingSpinner size="md" />
        <p style={{ marginTop: '8px', fontSize: '12px' }}>Medium</p>
      </div>
      <div style={{ textAlign: 'center' }}>
        <LoadingSpinner size="lg" />
        <p style={{ marginTop: '8px', fontSize: '12px' }}>Large</p>
      </div>
    </div>
  ),
};

export const CustomColor: Story = {
  args: {
    size: 'md',
    color: '#10b981',
  },
  render: (args) => <LoadingSpinner {...args} />,
};
