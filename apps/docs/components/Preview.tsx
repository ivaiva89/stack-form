'use client'

import type { ReactNode } from 'react'
import { useForm } from 'react-hook-form'
import { StackFormProvider } from '@stackform/ui'
import { RHFFormProvider } from '@stackform/rhf'

interface PreviewProps {
  children: ReactNode
}

function PreviewShell({ children }: PreviewProps) {
  const form = useForm()
  return (
    <StackFormProvider>
      <RHFFormProvider form={form}>{children}</RHFFormProvider>
    </StackFormProvider>
  )
}

export function Preview({ children }: PreviewProps) {
  return (
    <div className="my-4 rounded-lg border p-4">
      <PreviewShell>{children}</PreviewShell>
    </div>
  )
}
