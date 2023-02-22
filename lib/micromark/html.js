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
    markhighlight() {
      this.tag('<mark>')
    },
  },
  exit: {
    markhighlight() {
      this.tag('</mark>')
    },
  },
}
