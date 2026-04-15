import type { Meta, StoryObj } from '@storybook/react'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { TextField } from '@stackform/ui'
import type { LabelSlotProps } from '@stackform/ui'
import { RHFFormProvider } from '@stackform/rhf'
import { useZodField } from '@stackform/zod'

const meta: Meta<typeof TextField> = {
  title: 'Fields/TextField',
  component: TextField,
  argTypes: {
    name: { control: 'text' },
    label: { control: 'text' },
    placeholder: { control: 'text' },
    hint: { control: 'text' },
    disabled: { control: 'boolean' },
    loading: { control: 'boolean' },
    required: { control: 'boolean' },
    showCount: { control: 'boolean' },
    maxLength: { control: 'number' },
    type: {
      control: 'select',
      options: ['text', 'email', 'password', 'search', 'tel', 'url'],
    },
  },
}

export default meta
type Story = StoryObj<typeof TextField>

export const Default: Story = {
  name: 'Default',
  args: {
    name: 'username',
    label: 'Username',
  },
}

function WithErrorWrapper() {
  const form = useForm({ defaultValues: { username: '' } })
  const { setError } = form
  useEffect(() => {
    setError('username', {
      type: 'manual',
      message: 'This field is required',
    })
  }, [setError])
  return (
    <RHFFormProvider form={form}>
      <TextField name="username" label="Username" />
    </RHFFormProvider>
  )
}

export const WithError: Story = {
  name: 'WithError',
  render: () => <WithErrorWrapper />,
}

export const WithHint: Story = {
  name: 'WithHint',
  args: {
    name: 'username',
    label: 'Username',
    hint: 'Shown below the input',
  },
}

export const Loading: Story = {
  name: 'Loading',
  args: {
    name: 'username',
    label: 'Username',
    loading: true,
  },
}

export const Disabled: Story = {
  name: 'Disabled',
  args: {
    name: 'username',
    label: 'Username',
    disabled: true,
  },
}

function CustomLabel({
  htmlFor,
  required,
  children,
  className,
}: LabelSlotProps) {
  return (
    <label
      htmlFor={htmlFor}
      className={`font-bold text-purple-600 ${className ?? ''}`}
    >
      {children}
      {required && <span aria-hidden="true"> *</span>}
    </label>
  )
}

export const WithSlotOverride: Story = {
  name: 'WithSlotOverride',
  render: () => (
    <TextField
      name="username"
      label="Username"
      slots={{ Label: CustomLabel }}
    />
  ),
}

const usernameSchema = z.string().min(3, 'Must be at least 3 characters')

function WithSchemaValidationWrapper() {
  const { fieldProps } = useZodField<string>('username', usernameSchema)
  return (
    <TextField
      name="username"
      label="Username"
      placeholder="Type then blur to validate"
      {...fieldProps}
    />
  )
}

export const WithSchemaValidation: Story = {
  name: 'WithSchemaValidation',
  render: () => <WithSchemaValidationWrapper />,
}
