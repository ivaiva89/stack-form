import type { Meta, StoryObj } from '@storybook/react'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { TextareaField } from '@stackform/ui'
import type { LabelSlotProps } from '@stackform/ui'
import { RHFFormProvider } from '@stackform/rhf'
import { useZodField } from '@stackform/zod'

const meta: Meta<typeof TextareaField> = {
  title: 'Fields/TextareaField',
  component: TextareaField,
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
    rows: { control: 'number' },
    maxRows: { control: 'number' },
    autoResize: { control: 'boolean' },
    resize: {
      control: 'select',
      options: ['none', 'vertical', 'horizontal', 'both'],
    },
  },
}

export default meta
type Story = StoryObj<typeof TextareaField>

export const Default: Story = {
  name: 'Default',
  args: {
    name: 'bio',
    label: 'Bio',
  },
}

function WithErrorWrapper() {
  const form = useForm({ defaultValues: { bio: '' } })
  const { setError } = form
  useEffect(() => {
    setError('bio', { type: 'manual', message: 'This field is required' })
  }, [setError])
  return (
    <RHFFormProvider form={form}>
      <TextareaField name="bio" label="Bio" />
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
    name: 'bio',
    label: 'Bio',
    hint: 'Shown below the input',
  },
}

export const Loading: Story = {
  name: 'Loading',
  args: {
    name: 'bio',
    label: 'Bio',
    loading: true,
  },
}

export const Disabled: Story = {
  name: 'Disabled',
  args: {
    name: 'bio',
    label: 'Bio',
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
    <TextareaField name="bio" label="Bio" slots={{ Label: CustomLabel }} />
  ),
}

const bioSchema = z.string().min(10, 'Must be at least 10 characters')

function WithSchemaValidationWrapper() {
  const { fieldProps } = useZodField<string>('bio', bioSchema)
  return (
    <TextareaField
      name="bio"
      label="Bio"
      placeholder="Type then blur to validate"
      {...fieldProps}
    />
  )
}

export const WithSchemaValidation: Story = {
  name: 'WithSchemaValidation',
  render: () => <WithSchemaValidationWrapper />,
}

export const RowsDefault: Story = {
  name: 'Rows — default (3)',
  args: {
    name: 'bio',
    label: 'Bio',
    placeholder: 'Default 3 rows',
  },
}

export const RowsTwo: Story = {
  name: 'Rows — 2',
  args: {
    name: 'bio',
    label: 'Bio',
    rows: 2,
    placeholder: '2 rows',
  },
}

export const RowsFive: Story = {
  name: 'Rows — 5',
  args: {
    name: 'bio',
    label: 'Bio',
    rows: 5,
    placeholder: '5 rows',
  },
}

export const RowsTen: Story = {
  name: 'Rows — 10',
  args: {
    name: 'bio',
    label: 'Bio',
    rows: 10,
    placeholder: '10 rows',
  },
}
