/**
 * @typedef {import('./highlight.js').InlineMark} InlineMark
 *
 * @typedef {import('mdast-util-from-markdown').CompileContext} CompileContext
 * @typedef {import('mdast-util-from-markdown').Extension} FromMarkdownExtension
 * @typedef {import('mdast-util-from-markdown').Handle} FromMarkdownHandle
 *
 * @typedef {import('mdast-util-to-markdown').ConstructName} ConstructName
 * @typedef {import('mdast-util-to-markdown').Handle} ToMarkdownHandle
 * @typedef {import('mdast-util-to-markdown').Options} ToMarkdownExtension
 */

// To do: next major: expose functions.
// To do: next major: use `state`, state utilities.

/**
 * List of constructs that occur in phrasing (paragraphs, headings), but cannot
 * contain mark highlight.
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
 * Extension for `mdast-util-from-markdown` to enable mark highlight.
 *
 * @type {FromMarkdownExtension}
 */
export const markFromMarkdown = {
  canContainEols: ['mark'],
  enter: { highlight: enterMarkhighlight },
  exit: { highlight: exitMarkhighlight },
}

/**
 * Extension for `mdast-util-to-markdown` to enable mark highlight.
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
  handlers: { mark: handleMark },
}

/**
 * @this {CompileContext}
 * @type {FromMarkdownHandle}
 */
function enterMarkhighlight(token) {
  this.enter({ 
    type: 'mark',
    children: [],
    data: {
      hName: 'mark',
    }
  }, token)
}

/**
 * @this {CompileContext}
 * @type {FromMarkdownHandle}
 */
function exitMarkhighlight(token) {
  this.exit(token)
}

/**
 * @type {ToMarkdownHandle}
 * @param {InlineMark} node
 */
function handleMark(node, _, state, info) {
  const tracker = state.createTracker(info)
  const exit = state.enter('highlight')
  let value = tracker.move('==')
  value += state.containerPhrasing(node, {
    ...tracker.current(),
    before: value,
    after: '='
  })
  value += tracker.move('==')
  exit()
  return value
}

/** @type {ToMarkdownHandle} */
function peekMark() {
  return '='
}
