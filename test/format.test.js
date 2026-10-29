import { describe, expect, test } from 'bun:test'
import { stripVTControlCharacters } from 'node:util'
import { formatStory } from '../src/format.js'

const story = {
  id: 123,
  title: 'Example Story',
  score: 42,
  descendants: 7,
  by: 'alice',
  url: 'https://example.com/story'
}

const plain = (value) => stripVTControlCharacters(value)

describe('formatStory', () => {
  test('formats the title, metadata, and Hacker News link', () => {
    const output = plain(formatStory(story))

    expect(output).toContain('Example Story')
    expect(output).toContain('score: 42\tcomments: 7\tuser: alice')
    expect(output).toContain('url: https://news.ycombinator.com/item?id=123')
    expect(output).not.toContain('https://example.com/story')
  })

  test('includes the source URL when requested', () => {
    const output = plain(formatStory(story, true))

    expect(output).toContain('url: https://news.ycombinator.com/item?id=123')
    expect(output).toContain('https://example.com/story')
  })

  test('omits the source URL when the story does not have one', () => {
    const output = plain(formatStory({ ...story, url: undefined }, true))

    expect(output).not.toContain('undefined')
  })

  test('uses sensible defaults for missing metadata', () => {
    const output = plain(
      formatStory({
        id: 456,
        title: 'No metadata',
        score: null,
        descendants: undefined,
        by: null
      })
    )

    expect(output).toContain('score: 0\tcomments: 0\tuser: unknown')
  })
})
