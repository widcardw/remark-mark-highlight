/**
 * @typedef {import('mdast').Root} Root
 */

import { microMark } from '../micromark/syntax'
import { markFromMarkdown, markToMarkdown } from './lib'

/**
 * @this {import('unified').Processor}
 * @type {import('unified').Plugin<Root>}
 */
export function remarkMark() {
  const data = this.data()

  add('micromarkExtensions', microMark())
  add('fromMarkdownExtensions', markFromMarkdown)
  add('toMarkdownExtensions', markToMarkdown)

  /**
   * @param {string} field
   * @param {unknown} value
   */
  function add(field, value) {
    const list = /** @type {unknown[]} */ (
      // Other extensions
      /* c8 ignore next 2 */
      data[field] ? data[field] : (data[field] = [])
    )

    list.push(value)
  }
}