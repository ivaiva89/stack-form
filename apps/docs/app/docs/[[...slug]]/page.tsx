import { source } from '@/lib/source'
import { notFound, redirect } from 'next/navigation'
import {
  DocsPage,
  DocsBody,
  DocsTitle,
  DocsDescription,
} from 'fumadocs-ui/page'
import defaultMdxComponents from 'fumadocs-ui/mdx'
import { Preview } from '@/components/Preview'

export default async function Page({
  params,
}: {
  params: Promise<{ slug?: string[] }>
}) {
  const { slug } = await params

  if (!slug) redirect('/docs/getting-started')

  const page = source.getPage(slug)

  if (!page) notFound()

  const Mdx = page.data.body

  return (
    <DocsPage toc={page.data.toc}>
      <DocsTitle>{page.data.title}</DocsTitle>
      <DocsDescription>{page.data.description}</DocsDescription>
      <DocsBody>
        <Mdx components={{ ...defaultMdxComponents, Preview }} />
      </DocsBody>
    </DocsPage>
  )
}

export function generateStaticParams(): { slug: string[] }[] {
  return source.generateParams()
}
