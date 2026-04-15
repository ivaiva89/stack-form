import type { Meta, StoryObj } from '@storybook/react'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { CheckboxField } from '@stackform/ui'
import type { LabelSlotProps } from '@stackform/ui'
import { RHFFormProvider } from '@stackform/rhf'
import { useZodField } from '@stackform/zod'

const meta: Meta<typeof CheckboxField> = {
  title: 'Fields/CheckboxField',
  component: CheckboxField,
  argTypes: {
    name: { control: 'text' },
    label: { control: 'text' },
    hint: { control: 'text' },
    disabled: { control: 'boolean' },
    loading: { control: 'boolean' },
    required: { control: 'boolean' },
    indeterminate: { control: 'boolean' },
    labelPosition: { control: 'select', options: ['left', 'right'] },
  },
}

export default meta
type Story = StoryObj<typeof CheckboxField>

export const Default: Story = {
  name: 'Default',
  args: {
    name: 'agreed',
    label: 'I agree to the terms',
  },
}

function WithErrorWrapper() {
  const form = useForm({ defaultValues: { agreed: false } })
  const { setError } = form
  useEffect(() => {
    setError('agreed', {
      type: 'manual',
      message: 'This field is required',
    })
  }, [setError])
  return (
    <RHFFormProvider form={form}>
      <CheckboxField name="agreed" label="I agree to the terms" />
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
    name: 'agreed',
    label: 'I agree to the terms',
    hint: 'Shown below the input',
  },
}

export const Loading: Story = {
  name: 'Loading',
  args: {
    name: 'agreed',
    label: 'I agree to the terms',
    loading: true,
  },
}

export const Disabled: Story = {
  name: 'Disabled',
  args: {
    name: 'agreed',
    label: 'I agree to the terms',
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
    <CheckboxField
      name="agreed"
      label="I agree to the terms"
      slots={{ Label: CustomLabel }}
    />
  ),
}

const agreedSchema = z
  .boolean()
  .refine((v) => v, { message: 'You must accept the terms' })

function WithSchemaValidationWrapper() {
  const { fieldProps } = useZodField<boolean>('agreed', agreedSchema)
  return (
    <CheckboxField
      name="agreed"
      label="I agree to the terms"
      hint="Check the box then blur to validate"
      {...fieldProps}
    />
  )
}

export const WithSchemaValidation: Story = {
  name: 'WithSchemaValidation',
  render: () => <WithSchemaValidationWrapper />,
}

export const Indeterminate: Story = {
  name: 'Indeterminate',
  args: {
    name: 'agreed',
    label: 'I agree to the terms',
    indeterminate: true,
  },
}
