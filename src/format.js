import chalk from 'chalk'

const HACKERNEWS_URL = 'https://news.ycombinator.com/item?id='

const TITLE_COLOR = '#FAB005'
const META_COLOR = '#B8B8B8'
const LINK_COLOR = '#69C9D0'
const SOURCE_URL_COLOR = '#D6749C'

const TITLE_STYLE = chalk.hex(TITLE_COLOR).bold
const META_STYLE = chalk.hex(META_COLOR)
const LINK_STYLE = chalk.hex(LINK_COLOR).underline
const SOURCE_URL_STYLE = chalk.hex(SOURCE_URL_COLOR)

export const formatStory = (story, showSourceUrl = false) => {
  let output = `${TITLE_STYLE(story.title)}\n`
  output += `${META_STYLE(`score: ${story.score}\tcomments: ${story.descendants}\tuser: ${story.by}`)}\n`
  output += `url: ${LINK_STYLE(`${HACKERNEWS_URL}${story.id}`)}\n`

  if (showSourceUrl && story.url) {
    output += `${SOURCE_URL_STYLE(story.url)}\n`
  }

  return output
}
