import type { Meta, StoryObj } from '@storybook/react';
import { Button } from './Button';

const meta = {
  title: 'components/Button',
  component: Button,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: 'Button component is a styled button that can be used to trigger actions.',
      },
    },
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof Button>;

const Flex = ({ children, gap = '10px' }: { children: React.ReactNode; gap?: string }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap }}>{children}</div>
);

export const Basic: Story = {
  args: {
    size: 'md',
    variant: 'primary',
    disabled: false,
    children: 'Button',
  },
  argTypes: {
    onClick: { control: false },
  },
  render: (args) => <Button {...args} />,
};

export const Primary: Story = {
  args: {
    variant: 'primary',
    children: 'Primary Button',
  },
  render: (args) => (
    <Flex gap="10px">
      <Button size="sm" {...args}>
        Primary Small
      </Button>
      <Button size="md" {...args}>
        Primary Medium
      </Button>
      <Button size="lg" {...args}>
        Primary Large
      </Button>
    </Flex>
  ),
};

export const Secondary: Story = {
  args: {
    variant: 'secondary',
    children: 'Secondary Button',
  },
  render: (args) => (
    <Flex gap="10px">
      <Button size="sm" {...args}>
        Secondary Small
      </Button>
      <Button size="md" {...args}>
        Secondary Medium
      </Button>
      <Button size="lg" {...args}>
        Secondary Large
      </Button>
    </Flex>
  ),
};

export const Danger: Story = {
  args: {
    variant: 'danger',
    children: 'Danger Button',
  },
  render: (args) => (
    <Flex gap="10px">
      <Button size="sm" {...args}>
        Danger Small
      </Button>
      <Button size="md" {...args}>
        Danger Medium
      </Button>
      <Button size="lg" {...args}>
        Danger Large
      </Button>
    </Flex>
  ),
};

export const Disabled: Story = {
  args: {
    disabled: true,
    children: 'Disabled Button',
  },
  render: (args) => <Button {...args} />,
};

export const FullWidth: Story = {
  args: {
    fullWidth: true,
    variant: 'primary',
    children: 'Full Width Button',
  },
  render: (args) => <Button {...args} />,
};
