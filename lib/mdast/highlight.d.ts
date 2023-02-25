import type {Parent} from 'mdast'

export {markFromMarkdown, markToMarkdown} from './lib.js'

/**
 * Math (text).
 */
// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
export interface InlineMark extends Parent {
  /**
   * Node type.
   */
  type: 'mark'
  children: PhrasingContent[];
}

// Add custom data tracked to turn a tree into markdown.
declare module 'mdast-util-to-markdown' {
  // eslint-disable-next-line @typescript-eslint/consistent-type-definitions
  interface ConstructNameMap {
    /**
     * Math (flow) meta flag.
     *
     * ```markdown
     * ==a==
     * ^^^^^
     * ```
     */
    markhighlight: 'markhighlight'
  }
}

// Add nodes to tree.
declare module 'mdast' {
  // eslint-disable-next-line @typescript-eslint/consistent-type-definitions
  interface StaticPhrasingContentMap {
    inlineMark: InlineMark
  }
}