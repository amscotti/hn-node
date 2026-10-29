import yargs from 'yargs'
import { hideBin } from 'yargs/helpers'
import pkg from '../package.json'
import { fetchStories, fetchTopStories } from './fetch.js'
import { formatStory } from './format.js'

const DEFAULT_COUNT = 5

export const getCommandLineArgs = (argv = hideBin(process.argv)) => {
  return yargs(argv)
    .scriptName('hn')
    .option('n', {
      alias: 'number',
      default: DEFAULT_COUNT,
      describe: 'Number of top stories to show',
      type: 'number'
    })
    .option('u', {
      alias: 'sourceUrls',
      default: false,
      describe: 'Show source URLs',
      type: 'boolean'
    })
    .help()
    .alias('help', 'h')
    .version(pkg.version)
    .alias('version', 'v')
    .parse()
}

export const run = async ({ number, sourceUrls, log = console.log }) => {
  if (!Number.isInteger(number) || number < 1) {
    throw new Error('The number of stories must be a positive integer')
  }

  const storyIds = await fetchTopStories(number)
  const stories = await fetchStories(storyIds)

  stories.forEach((story) => log(formatStory(story, sourceUrls)))
}

export const main = async (argv = hideBin(process.argv)) => {
  try {
    const { number, sourceUrls } = getCommandLineArgs(argv)
    await run({ number, sourceUrls })
  } catch (error) {
    console.error(`Error: ${error.message}`)
    process.exitCode = 1
  }
}
