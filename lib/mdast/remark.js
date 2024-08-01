/**
 * @typedef {import('mdast').Root} Root
 */

import { markHighlight } from '../micromark/syntax.js'
import { markFromMarkdown, markToMarkdown } from './lib.js'

/**
 * @this {import('unified').Processor}
 * @type {import('unified').Plugin<[], Root>}
 */
export function remarkMark() {
  const data = this.data()

  add('micromarkExtensions', markHighlight())
  add('fromMarkdownExtensions', markFromMarkdown)
  add('toMarkdownExtensions', markToMarkdown)

  /**
   * @param {string} field
   * @param {unknown} value
   */
  function add(field, value) {
    const list = /** @type {unknown[]} */ (
      // @ts-ignore
      data[field] ? data[field] : (data[field] = [])
    )

    list.push(value)
  }
}