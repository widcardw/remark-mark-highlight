/**
 * @typedef {import('micromark-util-types').HtmlExtension} HtmlExtension
 */

/**
 * HTML extension for micromark (passed in `htmlExtensions`).
 *
 * @type {HtmlExtension}
 */
export const markHtml = {
  enter: {
    highlight() {
      this.tag('<mark>')
    },
  },
  exit: {
    highlight() {
      this.tag('</mark>')
    },
  },
}
