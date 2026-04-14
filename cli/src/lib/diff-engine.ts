import { diffLines } from 'diff'
import type { Change } from 'diff'

export interface DiffHunk {
  content: string
  lineStart: number
  lineCount: number
}

export interface ConflictHunk {
  base: string
  theirs: string
  yours: string
  lineStart: number
  lineCount: number
}

export interface ThreeWayDiffResult {
  safeChanges: DiffHunk[]
  conflicts: ConflictHunk[]
}

interface InternalHunk {
  baseLine: number
  baseCount: number
  baseContent: string
  newContent: string
}

function parseHunks(changes: Change[]): InternalHunk[] {
  const hunks: InternalHunk[] = []
  let baseLine = 0
  let i = 0

  while (i < changes.length) {
    const c = changes[i]
    const count = c.count ?? 0

    if (!c.added && !c.removed) {
      baseLine += count
      i++
    } else if (c.removed) {
      const baseContent = c.value
      const baseCount = count
      let newContent = ''
      i++
      while (i < changes.length && changes[i].added) {
        newContent += changes[i].value
        i++
      }
      hunks.push({ baseLine, baseCount, baseContent, newContent })
      baseLine += baseCount
    } else {
      // Pure addition (no preceding removal)
      hunks.push({
        baseLine,
        baseCount: 0,
        baseContent: '',
        newContent: c.value,
      })
      i++
    }
  }

  return hunks
}

function rangesOverlap(
  thStart: number,
  thEnd: number,
  yrStart: number,
  yrEnd: number
): boolean {
  if (thEnd === thStart && yrEnd === yrStart) return thStart === yrStart
  if (thEnd === thStart) return yrStart <= thStart && thStart < yrEnd
  if (yrEnd === yrStart) return thStart <= yrStart && yrStart < thEnd
  return thStart < yrEnd && yrStart < thEnd
}

export function computeThreeWayDiff(
  base: string,
  theirs: string,
  yours: string
): ThreeWayDiffResult {
  if (base === theirs) return { safeChanges: [], conflicts: [] }

  const theirHunks = parseHunks(diffLines(base, theirs))

  if (base === yours) {
    return {
      safeChanges: theirHunks.map((h) => ({
        content: h.newContent,
        lineStart: h.baseLine,
        lineCount: h.baseCount,
      })),
      conflicts: [],
    }
  }

  if (yours === theirs) return { safeChanges: [], conflicts: [] }

  const yourHunks = parseHunks(diffLines(base, yours))

  interface YourRange {
    start: number
    end: number
    newContent: string
  }
  const yourRanges: YourRange[] = yourHunks.map((h) => ({
    start: h.baseLine,
    end: h.baseLine + h.baseCount,
    newContent: h.newContent,
  }))

  const safeChanges: DiffHunk[] = []
  const conflicts: ConflictHunk[] = []

  for (const th of theirHunks) {
    const thStart = th.baseLine
    const thEnd = th.baseLine + th.baseCount

    const overlapping = yourRanges.filter((yr) =>
      rangesOverlap(thStart, thEnd, yr.start, yr.end)
    )

    if (overlapping.length > 0) {
      const yoursContent =
        overlapping.map((yr) => yr.newContent).join('') || th.baseContent
      conflicts.push({
        base: th.baseContent,
        theirs: th.newContent,
        yours: yoursContent,
        lineStart: th.baseLine,
        lineCount: th.baseCount,
      })
    } else {
      safeChanges.push({
        content: th.newContent,
        lineStart: th.baseLine,
        lineCount: th.baseCount,
      })
    }
  }

  return { safeChanges, conflicts }
}

export function applyThreeWayMerge(
  base: string,
  theirs: string,
  yours: string
): { output: string; hasConflicts: boolean } {
  const { safeChanges, conflicts } = computeThreeWayDiff(base, theirs, yours)

  if (safeChanges.length === 0 && conflicts.length === 0) {
    return { output: yours, hasConflicts: false }
  }

  const yourHunks = parseHunks(diffLines(base, yours))

  const theirCoveredLines = new Set<number>()
  for (const sc of safeChanges) {
    for (let i = sc.lineStart; i < sc.lineStart + sc.lineCount; i++) {
      theirCoveredLines.add(i)
    }
  }
  for (const c of conflicts) {
    for (let i = c.lineStart; i < c.lineStart + c.lineCount; i++) {
      theirCoveredLines.add(i)
    }
  }

  const yoursOnlyHunks = yourHunks.filter((h) => {
    if (h.baseCount === 0) return true
    for (let i = h.baseLine; i < h.baseLine + h.baseCount; i++) {
      if (theirCoveredLines.has(i)) return false
    }
    return true
  })

  interface MergeEvent {
    lineStart: number
    lineCount: number
    apply: () => string
    isConflict: boolean
  }

  const events: MergeEvent[] = [
    ...safeChanges.map((sc) => ({
      lineStart: sc.lineStart,
      lineCount: sc.lineCount,
      apply: () => sc.content,
      isConflict: false,
    })),
    ...conflicts.map((c) => ({
      lineStart: c.lineStart,
      lineCount: c.lineCount,
      apply: () =>
        `<<<<<<< theirs (registry)\n${c.theirs}=======\n${c.yours}>>>>>>> yours (local)\n`,
      isConflict: true,
    })),
    ...yoursOnlyHunks.map((h) => ({
      lineStart: h.baseLine,
      lineCount: h.baseCount,
      apply: () => h.newContent,
      isConflict: false,
    })),
  ].sort((a, b) => a.lineStart - b.lineStart || a.lineCount - b.lineCount)

  const hasConflicts = events.some((e) => e.isConflict)

  const baseLines = base.split('\n')
  if (baseLines[baseLines.length - 1] === '') baseLines.pop()

  let output = ''
  let baseLine = 0
  let eventIdx = 0

  while (baseLine <= baseLines.length) {
    // Handle pure insertions at this position
    while (
      eventIdx < events.length &&
      events[eventIdx].lineStart === baseLine &&
      events[eventIdx].lineCount === 0
    ) {
      output += events[eventIdx].apply()
      eventIdx++
    }

    if (baseLine >= baseLines.length) break

    if (
      eventIdx < events.length &&
      events[eventIdx].lineStart === baseLine &&
      events[eventIdx].lineCount > 0
    ) {
      const event = events[eventIdx]
      output += event.apply()
      baseLine += event.lineCount
      eventIdx++
    } else {
      output += baseLines[baseLine] + '\n'
      baseLine++
    }
  }

  return { output, hasConflicts }
}
