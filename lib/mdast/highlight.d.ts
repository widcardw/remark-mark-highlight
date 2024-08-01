import type {Literal, Parent, PhrasingContent} from 'mdast'

export {markFromMarkdown, markToMarkdown} from './lib.js'

export interface InlineMark extends Parent {
  /**
   * Node type.
   */
  type: 'mark'
  children: PhrasingContent[];
}

// Add custom data tracked to turn a tree into markdown.
declare module 'mdast-util-to-markdown' {
  interface ConstructNameMap {
    /**
     * ```markdown
     * ==a==
     * ^^^^^
     * ```
     */
    highlight: 'highlight'
  }
}

// Add nodes to tree.
declare module 'mdast' {
  interface PhrasingContentMap {
    inlineMark: InlineMark
  }
}