import type { Meta, StoryObj } from '@storybook/react'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { NumberField } from '@stackform/ui'
import type { LabelSlotProps } from '@stackform/ui'
import { RHFFormProvider } from '@stackform/rhf'
import { useZodField } from '@stackform/zod'

const meta: Meta<typeof NumberField> = {
  title: 'Fields/NumberField',
  component: NumberField,
  argTypes: {
    name: { control: 'text' },
    label: { control: 'text' },
    placeholder: { control: 'text' },
    hint: { control: 'text' },
    disabled: { control: 'boolean' },
    loading: { control: 'boolean' },
    required: { control: 'boolean' },
    min: { control: 'number' },
    max: { control: 'number' },
    step: { control: 'number' },
    showStepper: { control: 'boolean' },
  },
}

export default meta
type Story = StoryObj<typeof NumberField>

export const Default: Story = {
  name: 'Default',
  args: {
    name: 'quantity',
    label: 'Quantity',
  },
}

function WithErrorWrapper() {
  const form = useForm({ defaultValues: { quantity: 0 } })
  const { setError } = form
  useEffect(() => {
    setError('quantity', {
      type: 'manual',
      message: 'This field is required',
    })
  }, [setError])
  return (
    <RHFFormProvider form={form}>
      <NumberField name="quantity" label="Quantity" />
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
    name: 'quantity',
    label: 'Quantity',
    hint: 'Shown below the input',
  },
}

export const Loading: Story = {
  name: 'Loading',
  args: {
    name: 'quantity',
    label: 'Quantity',
    loading: true,
  },
}

export const Disabled: Story = {
  name: 'Disabled',
  args: {
    name: 'quantity',
    label: 'Quantity',
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
    <NumberField
      name="quantity"
      label="Quantity"
      slots={{ Label: CustomLabel }}
    />
  ),
}

const quantitySchema = z
  .number()
  .min(1, 'Must be at least 1')
  .max(99, 'Must be at most 99')

function WithSchemaValidationWrapper() {
  const { fieldProps } = useZodField<number>('quantity', quantitySchema)
  return (
    <NumberField
      name="quantity"
      label="Quantity"
      placeholder="Enter 1–99, then blur"
      {...fieldProps}
    />
  )
}

export const WithSchemaValidation: Story = {
  name: 'WithSchemaValidation',
  render: () => <WithSchemaValidationWrapper />,
}

export const WithMinMax: Story = {
  name: 'WithMinMax',
  args: {
    name: 'quantity',
    label: 'Quantity',
    min: 0,
    max: 100,
    step: 5,
    showStepper: true,
  },
}
