import { extend } from '../utils/extend';
import SimpleMarkdown from 'simple-markdown';

export const em = extend(
  {
    parse: function (capture, parse, state) {
      const parsed = SimpleMarkdown.defaultRules.em.parse(
        capture,
        parse,
        Object.assign({}, state, { inEmphasis: true })
      );

      return state.inEmphasis ? parsed.content : parsed;
    },
  },
  SimpleMarkdown.defaultRules.em
);
