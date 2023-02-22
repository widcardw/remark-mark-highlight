import { remark } from 'remark'
import { describe, it, expect } from 'vitest'
import { remarkMark } from '../lib/mdast/index'

const md1 = 'a ==b=='

describe('remark', () => {
  it('should parse markdown', async () => {
    const proc = remark().use(remarkMark).freeze()
    const tree = proc.parse(md1)
    expect(tree).toMatchSnapshot()
    const vf = await proc.process(md1)
    expect(String(vf)).toMatchInlineSnapshot(`
      "a ==b==
      "
    `)
  })
})
