import type { Meta, StoryObj } from '@storybook/react'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { RadioGroupField } from '@stackform/ui'
import type { LabelSlotProps } from '@stackform/ui'
import { RHFFormProvider } from '@stackform/rhf'
import { useZodField } from '@stackform/zod'

const options = [
  { label: 'Option A', value: 'a' },
  { label: 'Option B', value: 'b' },
  { label: 'Option C', value: 'c' },
]

const meta: Meta<typeof RadioGroupField> = {
  title: 'Fields/RadioGroupField',
  component: RadioGroupField,
  argTypes: {
    name: { control: 'text' },
    label: { control: 'text' },
    hint: { control: 'text' },
    disabled: { control: 'boolean' },
    loading: { control: 'boolean' },
    required: { control: 'boolean' },
    orientation: { control: 'select', options: ['vertical', 'horizontal'] },
  },
}

export default meta
type Story = StoryObj<typeof RadioGroupField>

export const Default: Story = {
  name: 'Default',
  args: {
    name: 'choice',
    label: 'Choose an option',
    options,
  },
}

function WithErrorWrapper() {
  const form = useForm({ defaultValues: { choice: '' } })
  const { setError } = form
  useEffect(() => {
    setError('choice', {
      type: 'manual',
      message: 'This field is required',
    })
  }, [setError])
  return (
    <RHFFormProvider form={form}>
      <RadioGroupField
        name="choice"
        label="Choose an option"
        options={options}
      />
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
    name: 'choice',
    label: 'Choose an option',
    hint: 'Shown below the input',
    options,
  },
}

export const Loading: Story = {
  name: 'Loading',
  args: {
    name: 'choice',
    label: 'Choose an option',
    loading: true,
    options,
  },
}

export const Disabled: Story = {
  name: 'Disabled',
  args: {
    name: 'choice',
    label: 'Choose an option',
    disabled: true,
    options,
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
    <RadioGroupField
      name="choice"
      label="Choose an option"
      options={options}
      slots={{ Label: CustomLabel }}
    />
  ),
}

const choiceSchema = z.string().min(1, 'Please select an option')

function WithSchemaValidationWrapper() {
  const { fieldProps } = useZodField<string>('choice', choiceSchema)
  return (
    <RadioGroupField
      name="choice"
      label="Choose an option"
      hint="Select an option then blur to validate"
      options={options}
      {...fieldProps}
    />
  )
}

export const WithSchemaValidation: Story = {
  name: 'WithSchemaValidation',
  render: () => <WithSchemaValidationWrapper />,
}

export const Horizontal: Story = {
  name: 'Horizontal',
  args: {
    name: 'choice',
    label: 'Choose an option',
    options,
    orientation: 'horizontal',
  },
}
