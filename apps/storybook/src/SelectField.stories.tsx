import type { Meta, StoryObj } from '@storybook/react'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { SelectField } from '@stackform/ui'
import type { LabelSlotProps, SelectOption } from '@stackform/ui'
import { RHFFormProvider } from '@stackform/rhf'
import { useZodField } from '@stackform/zod'

const options: SelectOption[] = [
  { label: 'Apple', value: 'apple' },
  { label: 'Banana', value: 'banana' },
]

const meta: Meta<typeof SelectField> = {
  title: 'Fields/SelectField',
  component: SelectField,
  argTypes: {
    name: { control: 'text' },
    label: { control: 'text' },
    placeholder: { control: 'text' },
    hint: { control: 'text' },
    disabled: { control: 'boolean' },
    loading: { control: 'boolean' },
    required: { control: 'boolean' },
    searchable: { control: 'boolean' },
  },
}

export default meta
type Story = StoryObj<typeof SelectField>

export const Default: Story = {
  name: 'Default',
  args: {
    name: 'fruit',
    label: 'Fruit',
    placeholder: 'Select a fruit',
    options,
  },
}

function WithErrorWrapper() {
  const form = useForm({ defaultValues: { fruit: '' } })
  const { setError } = form
  useEffect(() => {
    setError('fruit', {
      type: 'manual',
      message: 'This field is required',
    })
  }, [setError])
  return (
    <RHFFormProvider form={form}>
      <SelectField
        name="fruit"
        label="Fruit"
        placeholder="Select a fruit"
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
    name: 'fruit',
    label: 'Fruit',
    placeholder: 'Select a fruit',
    hint: 'Shown below the input',
    options,
  },
}

export const Loading: Story = {
  name: 'Loading',
  args: {
    name: 'fruit',
    label: 'Fruit',
    placeholder: 'Select a fruit',
    loading: true,
    options,
  },
}

export const Disabled: Story = {
  name: 'Disabled',
  args: {
    name: 'fruit',
    label: 'Fruit',
    placeholder: 'Select a fruit',
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
    <SelectField
      name="fruit"
      label="Fruit"
      placeholder="Select a fruit"
      options={options}
      slots={{ Label: CustomLabel }}
    />
  ),
}

const fruitSchema = z.string().min(1, 'Please select a fruit')

function WithSchemaValidationWrapper() {
  const { fieldProps } = useZodField<string>('fruit', fruitSchema)
  return (
    <SelectField
      name="fruit"
      label="Fruit"
      placeholder="Select then blur to validate"
      options={options}
      {...fieldProps}
    />
  )
}

export const WithSchemaValidation: Story = {
  name: 'WithSchemaValidation',
  render: () => <WithSchemaValidationWrapper />,
}

async function fetchOptions(search: string): Promise<SelectOption[]> {
  await new Promise((resolve) => setTimeout(resolve, 500))
  const allOptions: SelectOption[] = [
    { label: 'Apple', value: 'apple' },
    { label: 'Banana', value: 'banana' },
    { label: 'Cherry', value: 'cherry' },
    { label: 'Date', value: 'date' },
    { label: 'Elderberry', value: 'elderberry' },
  ]
  if (!search) return allOptions
  return allOptions.filter((o) =>
    o.label.toLowerCase().includes(search.toLowerCase())
  )
}

export const WithAsyncOptions: Story = {
  name: 'WithAsyncOptions',
  render: () => (
    <SelectField
      name="fruit"
      label="Fruit"
      placeholder="Loading options…"
      loadOptions={fetchOptions}
    />
  ),
}

async function fetchEmptyOptions(): Promise<SelectOption[]> {
  await new Promise((resolve) => setTimeout(resolve, 500))
  return []
}

export const EmptyState: Story = {
  name: 'EmptyState',
  render: () => (
    <SelectField
      name="fruit"
      label="Fruit"
      placeholder="No options available"
      loadOptions={fetchEmptyOptions}
    />
  ),
}
