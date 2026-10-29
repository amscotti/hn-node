const STORIES_URL = 'https://hacker-news.firebaseio.com/v0/topstories.json'
const ITEM_URL_BASE = 'https://hacker-news.firebaseio.com/v0/item'
const REQUEST_TIMEOUT_MS = 10_000

const fetchJson = async (url, description) => {
  const response = await fetch(url, {
    signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS)
  })

  if (!response.ok) {
    throw new Error(`${description} failed with status ${response.status} ${response.statusText}`)
  }

  return await response.json()
}

export const fetchTopStories = async (count) => {
  const storyIds = await fetchJson(STORIES_URL, 'Fetching top stories')
  return storyIds.slice(0, count)
}

export const fetchStory = async (id) => {
  return await fetchJson(`${ITEM_URL_BASE}/${id}.json`, `Fetching story ${id}`)
}

export const fetchStories = async (ids) => {
  const stories = await Promise.all(ids.map(fetchStory))
  return stories.filter((story) => story != null)
}
