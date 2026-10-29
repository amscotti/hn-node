import { afterEach, describe, expect, mock, test } from 'bun:test'
import { stripVTControlCharacters } from 'node:util'
import { getCommandLineArgs, main, run } from '../src/cli.js'

const originalFetch = globalThis.fetch

afterEach(() => {
  globalThis.fetch = originalFetch
})

describe('getCommandLineArgs', () => {
  test('uses the documented defaults', () => {
    const args = getCommandLineArgs([])

    expect(args.number).toBe(5)
    expect(args.sourceUrls).toBe(false)
  })

  test('parses short options', () => {
    const args = getCommandLineArgs(['-n', '10', '-u'])

    expect(args.number).toBe(10)
    expect(args.sourceUrls).toBe(true)
  })

  test('parses long options', () => {
    const args = getCommandLineArgs(['--number', '3', '--sourceUrls'])

    expect(args.number).toBe(3)
    expect(args.sourceUrls).toBe(true)
  })
})

describe('run', () => {
  test('fetches and prints the requested stories', async () => {
    globalThis.fetch = mock(async (url) => {
      if (url.endsWith('topstories.json')) {
        return Response.json([1, 2])
      }

      const id = Number(url.match(/(\d+)\.json$/)[1])
      return Response.json({
        id,
        title: `Story ${id}`,
        score: 10,
        descendants: 2,
        by: 'tester'
      })
    })

    const lines = []
    await run({ number: 2, sourceUrls: false, log: (line) => lines.push(line) })

    expect(lines).toHaveLength(2)
    expect(stripVTControlCharacters(lines[0])).toContain('Story 1')
    expect(stripVTControlCharacters(lines[1])).toContain('Story 2')
  })

  test('rejects a non-positive story count before fetching', async () => {
    await expect(run({ number: 0, sourceUrls: false })).rejects.toThrow(
      'The number of stories must be a positive integer'
    )
  })

  test('rejects a non-integer story count before fetching', async () => {
    await expect(run({ number: 1.5, sourceUrls: false })).rejects.toThrow(
      'The number of stories must be a positive integer'
    )
  })
})

describe('main', () => {
  test('reports errors and sets a non-zero exit code', async () => {
    const errorMock = mock(() => {})
    const originalError = console.error
    const originalExitCode = process.exitCode

    console.error = errorMock
    process.exitCode = 0

    try {
      await main(['-n', '0'])

      expect(errorMock).toHaveBeenCalledWith(
        'Error: The number of stories must be a positive integer'
      )
      expect(process.exitCode).toBe(1)
    } finally {
      console.error = originalError
      process.exitCode = originalExitCode ?? 0
    }
  })
})
