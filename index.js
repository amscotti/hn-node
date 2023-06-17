import { hideBin } from 'yargs/helpers'
import yargs from 'yargs'
import { fetchTopStories, fetchStory } from './src/fetch.js'
import { formatStory } from './src/format.js'

const getCommandLineArgs = () => {
  return yargs(hideBin(process.argv))
    .option('n', {
      alias: 'number',
      default: 5,
      describe: 'Number of top news to show',
      type: 'number'
    })
    .option('u', {
      alias: 'sourceUrls',
      default: false,
      describe: 'Show source urls',
      type: 'boolean'
    })
    .help()
    .alias('help', 'h')
    .version()
    .alias('version', 'v')
    .parse()
}

const main = async (number, sourceUrls) => {
  try {
    const topStoriesIds = await fetchTopStories(number)
    const stories = await Promise.all(topStoriesIds.map(fetchStory))
    stories.forEach(story => console.log(formatStory(story, sourceUrls)))
  } catch (error) {
    console.error(`Error: ${error.message}`)
  }
}

const { number, sourceUrls } = getCommandLineArgs()
main(number, sourceUrls)
