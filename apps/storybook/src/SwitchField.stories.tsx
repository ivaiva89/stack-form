import type { Meta, StoryObj } from '@storybook/react'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { SwitchField } from '@stackform/ui'
import type { LabelSlotProps } from '@stackform/ui'
import { RHFFormProvider } from '@stackform/rhf'
import { useZodField } from '@stackform/zod'

const meta: Meta<typeof SwitchField> = {
  title: 'Fields/SwitchField',
  component: SwitchField,
  argTypes: {
    name: { control: 'text' },
    label: { control: 'text' },
    hint: { control: 'text' },
    disabled: { control: 'boolean' },
    loading: { control: 'boolean' },
    required: { control: 'boolean' },
    onLabel: { control: 'text' },
    offLabel: { control: 'text' },
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
    labelPosition: { control: 'select', options: ['left', 'right'] },
  },
}

export default meta
type Story = StoryObj<typeof SwitchField>

export const Default: Story = {
  name: 'Default',
  args: {
    name: 'notifications',
    label: 'Enable notifications',
  },
}

function WithErrorWrapper() {
  const form = useForm({ defaultValues: { notifications: false } })
  useEffect(() => {
    form.setError('notifications', {
      type: 'manual',
      message: 'This field is required',
    })
  }, [form.setError])
  return (
    <RHFFormProvider form={form}>
      <SwitchField name="notifications" label="Enable notifications" />
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
    name: 'notifications',
    label: 'Enable notifications',
    hint: 'Shown below the input',
  },
}

export const Loading: Story = {
  name: 'Loading',
  args: {
    name: 'notifications',
    label: 'Enable notifications',
    loading: true,
  },
}

export const Disabled: Story = {
  name: 'Disabled',
  args: {
    name: 'notifications',
    label: 'Enable notifications',
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
    <SwitchField
      name="notifications"
      label="Enable notifications"
      slots={{ Label: CustomLabel }}
    />
  ),
}

const notificationsSchema = z
  .boolean()
  .refine((v) => v, { message: 'You must enable notifications to continue' })

function WithSchemaValidationWrapper() {
  const { fieldProps } = useZodField<boolean>(
    'notifications',
    notificationsSchema
  )
  return (
    <SwitchField
      name="notifications"
      label="Enable notifications"
      hint="Toggle then blur to validate"
      {...fieldProps}
    />
  )
}

export const WithSchemaValidation: Story = {
  name: 'WithSchemaValidation',
  render: () => <WithSchemaValidationWrapper />,
}
