/**
 * @typedef {import('mdast').Delete} Delete
 *
 * @typedef {import('mdast-util-from-markdown').CompileContext} CompileContext
 * @typedef {import('mdast-util-from-markdown').Extension} FromMarkdownExtension
 * @typedef {import('mdast-util-from-markdown').Handle} FromMarkdownHandle
 * @typedef {import('mdast-util-from-markdown/lib').Emphasis} Emphasis
 *
 * @typedef {import('mdast-util-to-markdown').ConstructName} ConstructName
 * @typedef {import('mdast-util-to-markdown').Options} ToMarkdownExtension
 * @typedef {import('mdast-util-to-markdown').Handle} ToMarkdownHandle
 */

import { containerPhrasing } from 'mdast-util-to-markdown/lib/util/container-phrasing.js'
import { track } from 'mdast-util-to-markdown/lib/util/track.js'

// To do: next major: expose functions.
// To do: next major: use `state`, state utilities.

/**
 * List of constructs that occur in phrasing (paragraphs, headings), but cannot
 * contain strikethrough.
 * So they sort of cancel each other out.
 * Note: could use a better name.
 *
 * Note: keep in sync with: <https://github.com/syntax-tree/mdast-util-to-markdown/blob/8ce8dbf/lib/unsafe.js#L14>
 *
 * @type {Array<ConstructName>}
 */
const constructsWithoutMark = [
  'autolink',
  'destinationLiteral',
  'destinationRaw',
  'reference',
  'titleQuote',
  'titleApostrophe',
]

handleMark.peek = peekMark

/**
 * Extension for `mdast-util-from-markdown` to enable GFM strikethrough.
 *
 * @type {FromMarkdownExtension}
 */
export const markFromMarkdown = {
  canContainEols: ['emphasis'],
  enter: { markhighlight: enterMarkhighlight },
  exit: { markhighlight: exitMarkhighlight },
}

/**
 * Extension for `mdast-util-to-markdown` to enable GFM strikethrough.
 *
 * @type {ToMarkdownExtension}
 */
export const markToMarkdown = {
  unsafe: [
    {
      character: '=',
      inConstruct: 'phrasing',
      notInConstruct: constructsWithoutMark,
    },
  ],
  handlers: { emphasis: handleMark },
}

/**
 * @this {CompileContext}
 * @type {FromMarkdownHandle}
 */
function enterMarkhighlight(token) {
  this.enter(
    {
      type: 'emphasis',
      children: [],
      data: {
        hName: 'span',
        hProperties: { className: ['mark'] },
        hChildren: [{ type: 'text', value: '' }]
      },
      hName: ''
    },
    token
  )
  this.buffer()
}

/**
 * @this {CompileContext}
 * @type {FromMarkdownHandle}
 */
function exitMarkhighlight(token) {
  const data = this.resume()
    const node = /** @type {Emphasis} */ (this.exit(token))
    // @ts-expect-error: we defined it.
    node.data.hChildren[0].value = data
}

/**
 * @type {ToMarkdownHandle}
 * @param {Delete} node
 */
function handleMark(node, _, context, safeOptions) {
  // console.log(node)
  const tracker = track(safeOptions)
  const exit = context.enter('emphasis')
  let value = tracker.move('==')
  value += containerPhrasing(node, context, {
    ...tracker.current(),
    before: value,
    after: '=',
  })
  value += tracker.move('==')
  exit()
  return value
}

/** @type {ToMarkdownHandle} */
function peekMark() {
  return '='
}
