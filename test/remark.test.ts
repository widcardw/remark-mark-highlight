import { unified } from 'unified'
import { describe, it, expect } from 'vitest'
import { remarkMark } from '../lib/mdast/index'
import remarkParse from 'remark-parse'
import remarkRehype from 'remark-rehype'
import rehypeStringify from 'rehype-stringify'
import { removePosition } from 'unist-util-remove-position'


const md1 = 'a ==b=='

describe('remark', () => {
  it('should generate ast', () => {
    expect(
      removePosition(
        unified()
          .use(remarkParse)
          .use(remarkMark)
          .parse(md1),
        true))
      .toMatchSnapshot()
  })
  it('should parse markdown', () => {
    const toHtml = unified()
      .use(remarkParse)
      .use(remarkMark)
      .use(remarkRehype)
      .use(rehypeStringify)

    expect(toHtml.processSync(md1).toString()).toMatchInlineSnapshot('"<p>a <span class=\\"mark\\">b</span></p>"')
  })
})
