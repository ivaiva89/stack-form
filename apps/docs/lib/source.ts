import { loader } from 'fumadocs-core/source'
import { docs } from '../.source'

// fumadocs-mdx v11 declares `files` as VirtualFile[] but ships the runtime
// with `files` as a lazy function; cast and invoke to satisfy fumadocs-core
// v15 which calls files.map() directly, while keeping the generic type so
// page.data.body / page.data.toc are typed correctly.
const mdxSource = docs.toFumadocsSource()

export const source = loader({
  baseUrl: '/docs',
  source: {
    files: (mdxSource.files as unknown as () => typeof mdxSource.files)(),
  } as typeof mdxSource,
})
