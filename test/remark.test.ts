import { unified } from 'unified'
import { describe, it, expect } from 'vitest'
import { remarkMark } from '../lib/mdast/remark'
import remarkParse from 'remark-parse'
import remarkRehype from 'remark-rehype'
import rehypeStringify from 'rehype-stringify'
import { removePosition } from 'unist-util-remove-position'


const md1 = 'a ==*b*=='

describe('remark', () => {
  it('should generate ast', () => {
    expect(
      removePosition(
        unified()
          .use(remarkParse)
          .use(remarkMark as any)
          .parse(md1),
        true))
      .toMatchInlineSnapshot(`
        {
          "children": [
            {
              "children": [
                {
                  "type": "text",
                  "value": "a ",
                },
                {
                  "children": [
                    {
                      "children": [
                        {
                          "type": "text",
                          "value": "b",
                        },
                      ],
                      "type": "emphasis",
                    },
                  ],
                  "data": {
                    "hName": "mark",
                  },
                  "type": "mark",
                },
              ],
              "type": "paragraph",
            },
          ],
          "type": "root",
        }
      `)
  })
  it('should parse markdown', () => {
    const toHtml = unified()
      .use(remarkParse)
      .use(remarkMark as any)
      .use(remarkRehype)
      .use(rehypeStringify)

    expect(toHtml.processSync(md1).toString()).toMatchInlineSnapshot('"<p>a <mark><em>b</em></mark></p>"')
  })
})
