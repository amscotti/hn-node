import { afterEach, describe, expect, mock, test } from 'bun:test'
import { fetchStories, fetchStory, fetchTopStories } from '../src/fetch.js'

const originalFetch = globalThis.fetch

afterEach(() => {
  globalThis.fetch = originalFetch
})

describe('fetchTopStories', () => {
  test('fetches the top stories and slices them to the requested count', async () => {
    const fetchMock = mock(async () => Response.json([1, 2, 3, 4]))
    globalThis.fetch = fetchMock

    await expect(fetchTopStories(2)).resolves.toEqual([1, 2])
    expect(fetchMock).toHaveBeenCalledTimes(1)
    expect(fetchMock.mock.calls[0][0]).toBe('https://hacker-news.firebaseio.com/v0/topstories.json')
  })

  test('throws a useful error for a non-successful response', async () => {
    globalThis.fetch = mock(async () => {
      return new Response('unavailable', {
        status: 503,
        statusText: 'Service Unavailable'
      })
    })

    await expect(fetchTopStories(5)).rejects.toThrow(
      'Fetching top stories failed with status 503 Service Unavailable'
    )
  })
})

describe('fetchStory', () => {
  test('fetches a single story by id', async () => {
    const fetchMock = mock(async () => Response.json({ id: 123, title: 'Example' }))
    globalThis.fetch = fetchMock

    await expect(fetchStory(123)).resolves.toEqual({ id: 123, title: 'Example' })
    expect(fetchMock.mock.calls[0][0]).toBe('https://hacker-news.firebaseio.com/v0/item/123.json')
  })

  test('throws a useful error for a non-successful response', async () => {
    globalThis.fetch = mock(async () => {
      return new Response('missing', { status: 404, statusText: 'Not Found' })
    })

    await expect(fetchStory(999)).rejects.toThrow(
      'Fetching story 999 failed with status 404 Not Found'
    )
  })
})

describe('fetchStories', () => {
  test('fetches every story concurrently and drops missing items', async () => {
    let inFlight = 0
    let maxInFlight = 0

    globalThis.fetch = mock(async (url) => {
      inFlight += 1
      maxInFlight = Math.max(maxInFlight, inFlight)

      await new Promise((resolve) => setTimeout(resolve, 5))

      inFlight -= 1
      const id = Number(new URL(url).pathname.split('/').pop().replace('.json', ''))
      return Response.json(id === 2 ? null : { id })
    })

    await expect(fetchStories([1, 2, 3])).resolves.toEqual([{ id: 1 }, { id: 3 }])
    expect(maxInFlight).toBe(3)
  })

  test('returns an empty array when there are no ids', async () => {
    const fetchMock = mock(async () => Response.json({}))
    globalThis.fetch = fetchMock

    await expect(fetchStories([])).resolves.toEqual([])
    expect(fetchMock).not.toHaveBeenCalled()
  })
})
