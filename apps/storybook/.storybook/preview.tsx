import type { Preview, Decorator } from '@storybook/react'
import type { ComponentType } from 'react'
import { useForm } from 'react-hook-form'
import { StackFormProvider } from '@stackform/ui'
import { RHFFormProvider } from '@stackform/rhf'
import '../src/globals.css'

function FormProviderWrapper({ Story }: { Story: ComponentType }) {
  const form = useForm({ defaultValues: {} })
  return (
    <StackFormProvider>
      <RHFFormProvider form={form}>
        <Story />
      </RHFFormProvider>
    </StackFormProvider>
  )
}

const withFormProviders: Decorator = (Story) => (
  <FormProviderWrapper Story={Story as unknown as ComponentType} />
)

const preview: Preview = {
  decorators: [withFormProviders],
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
}

export default preview
