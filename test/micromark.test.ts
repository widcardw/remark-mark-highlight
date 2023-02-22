import { describe, it, expect } from 'vitest'
import { micromark } from 'micromark'
import { microMark as syntax } from '../lib/micromark/syntax'
import { markHtml } from '../lib/micromark/html'

describe('micromark', () => {
  const defaults = syntax()

  it('should ignore single equal sign', () => {
    expect(micromark('a =b=', {
      extensions: [defaults],
      htmlExtensions: [markHtml]
    }))
      .toMatchInlineSnapshot('"<p>a =b=</p>"')
  })

  it('should parse markdown to micromark', () => {
    expect(micromark('a ==b==', {
      extensions: [defaults],
      htmlExtensions: [markHtml]
    }))
      .toMatchInlineSnapshot('"<p>a <mark>b</mark></p>"')
  })

  it('should support equal inside', () => {
    expect(micromark('a ==b = c==', {
      extensions: [defaults],
      htmlExtensions: [markHtml]
    }))
      .toMatchInlineSnapshot('"<p>a <mark>b = c</mark></p>"')
  })

  it('should support several adjacent marks', () => {
    expect(micromark('a ==b== ==c== ~~d~~', {
      extensions: [defaults],
      htmlExtensions: [markHtml]
    }))
      .toMatchInlineSnapshot('"<p>a <mark>b</mark> <mark>c</mark> ~~d~~</p>"')
  })
})