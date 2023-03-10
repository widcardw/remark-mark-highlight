/**
 * @typedef {import('micromark-util-types').Extension} Extension
 * @typedef {import('micromark-util-types').Resolver} Resolver
 * @typedef {import('micromark-util-types').Tokenizer} Tokenizer
 * @typedef {import('micromark-util-types').State} State
 *
 * @typedef Options
 *   Configuration (optional).
 * @property {boolean} [singleEqualSign=true]
 *   Whether to support mark with a single equal sign (`boolean`, default:
 *   `true`).
 */

import { ok as assert } from 'uvu/assert'
import { splice } from 'micromark-util-chunked'
import { classifyCharacter } from 'micromark-util-classify-character'
import { resolveAll } from 'micromark-util-resolve-all'
import { codes } from 'micromark-util-symbol/codes.js'
import { constants } from 'micromark-util-symbol/constants.js'
import { types } from 'micromark-util-symbol/types.js'

/**
 * Function that can be called to get a syntax extension for micromark (passed
 * in `extensions`).
 *
 * @param {Options} [options]
 *   Configuration (optional).
 * @returns {Extension}
 *   Syntax extension for micromark (passed in `extensions`).
 */
export function microMark(options = {}) {
  let single = options.singleEqualSign
  const tokenizer = {
    tokenize: tokenizeMark,
    resolveAll: resolveAllMark
  }

  if (single === null || single === undefined) {
    single = false
  }

  return {
    text: { [codes.equalsTo]: tokenizer },
    insideSpan: { null: [tokenizer] },
    attentionMarkers: { null: [codes.equalsTo] }
  }

  /**
   * Take events and resolve strikethrough.
   *
   * @type {Resolver}
   */
  function resolveAllMark(events, context) {
    let index = -1

    // Walk through all events.
    while (++index < events.length) {
      // Find a token that can close.
      if (
        events[index][0] === 'enter' &&
        events[index][1].type === 'markhighlightSequenceTemporarily' &&
        events[index][1]._close
      ) {
        let open = index

        // Now walk back to find an opener.
        while (open--) {
          // Find a token that can open the closer.
          if (
            events[open][0] === 'exit' &&
            events[open][1].type === 'markhighlightSequenceTemporarily' &&
            events[open][1]._open &&
            // If the sizes are the same:
            events[index][1].end.offset - events[index][1].start.offset ===
            events[open][1].end.offset - events[open][1].start.offset
          ) {
            events[index][1].type = 'markhighlightSequence'
            events[open][1].type = 'markhighlightSequence'

            const markhighlight = {
              type: 'markhighlight',
              start: Object.assign({}, events[open][1].start),
              end: Object.assign({}, events[index][1].end)
            }

            const text = {
              type: 'markhighlightText',
              start: Object.assign({}, events[open][1].end),
              end: Object.assign({}, events[index][1].start)
            }

            // Opening.
            const nextEvents = [
              ['enter', markhighlight, context],
              ['enter', events[open][1], context],
              ['exit', events[open][1], context],
              ['enter', text, context]
            ]

            // Between.
            splice(
              nextEvents,
              nextEvents.length,
              0,
              resolveAll(
                context.parser.constructs.insideSpan.null,
                events.slice(open + 1, index),
                context
              )
            )

            // Closing.
            splice(nextEvents, nextEvents.length, 0, [
              ['exit', text, context],
              ['enter', events[index][1], context],
              ['exit', events[index][1], context],
              ['exit', markhighlight, context]
            ])

            splice(events, open - 1, index - open + 3, nextEvents)

            index = open + nextEvents.length - 2
            break
          }
        }
      }
    }

    index = -1

    while (++index < events.length) {
      if (events[index][1].type === 'markhighlightSequenceTemporarily') {
        events[index][1].type = types.data
      }
    }

    return events
  }

  /** 
   * @this {any}
   * @type {Tokenizer}
   */
  function tokenizeMark(effects, ok, nok) {
    const previous = this.previous
    const events = this.events
    let size = 0

    return start

    /** @type {State} */
    function start(code) {
      assert(code === codes.equalsTo, 'expected `=`')

      if (
        previous === codes.equalsTo &&
        events[events.length - 1][1].type !== types.characterEscape
      ) {
        return nok(code)
      }

      effects.enter('markhighlightSequenceTemporarily')
      return more(code)
    }

    /** @type {State} */
    function more(code) {
      const before = classifyCharacter(previous)

      if (code === codes.equalsTo) {
        // If this is the third marker, exit.
        if (size > 1) return nok(code)
        effects.consume(code)
        size++
        return more
      }

      if (size < 2 && !single) return nok(code)
      const token = effects.exit('markhighlightSequenceTemporarily')
      const after = classifyCharacter(code)
      token._open =
        !after || (after === constants.attentionSideAfter && Boolean(before))
      token._close =
        !before || (before === constants.attentionSideAfter && Boolean(after))
      return ok(code)
    }
  }
}