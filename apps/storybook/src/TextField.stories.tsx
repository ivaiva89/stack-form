import type { Meta, StoryObj } from '@storybook/react'
import { TextField } from '@stackform/ui'

const meta: Meta<typeof TextField> = {
  title: 'Fields/TextField',
  component: TextField,
}

export default meta
type Story = StoryObj<typeof TextField>

export const Default: Story = {
  args: {
    name: 'username',
    label: 'Username',
    placeholder: 'Enter your username',
  },
}
