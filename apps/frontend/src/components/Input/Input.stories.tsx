import type { Meta, StoryObj } from '@storybook/react';
import { Input } from './Input';

const meta = {
  title: 'components/Input',
  component: Input,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: 'Input component is a styled input field that supports labels and error messages.',
      },
    },
  },
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof Input>;

const Flex = ({ children, gap = '20px' }: { children: React.ReactNode; gap?: string }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap }}>{children}</div>
);

export const Basic: Story = {
  args: {
    placeholder: 'Enter text...',
    fullWidth: false,
  },
  argTypes: {
    onChange: { control: false },
  },
  render: (args) => <Input {...args} />,
};

export const WithLabel: Story = {
  args: {
    label: 'Label',
    placeholder: 'Enter text...',
  },
  render: (args) => <Input {...args} />,
};

export const WithError: Story = {
  args: {
    label: 'Email',
    placeholder: 'Enter your email',
    error: 'Invalid email address',
  },
  render: (args) => <Input {...args} />,
};

export const FullWidth: Story = {
  args: {
    label: 'Full Width Input',
    placeholder: 'This is a full width input',
    fullWidth: true,
  },
  render: (args) => <Input {...args} />,
};

export const Disabled: Story = {
  args: {
    label: 'Disabled Input',
    placeholder: 'Cannot edit',
    disabled: true,
  },
  render: (args) => <Input {...args} />,
};

export const Variants: Story = {
  render: () => (
    <Flex>
      <Input label="Normal" placeholder="Normal input" />
      <Input label="With Value" value="Some text" readOnly />
      <Input label="With Error" error="This field is required" placeholder="Error state" />
      <Input label="Disabled" disabled placeholder="Disabled state" />
    </Flex>
  ),
};
