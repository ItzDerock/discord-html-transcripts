import SimpleMarkdown from 'simple-markdown';
import { extend } from '../utils/extend';
import { CodeBlockRegex } from '../utils/regex';

export const codeBlock = extend(
  {
    match: SimpleMarkdown.inlineRegex(CodeBlockRegex),

    parse: function (capture, _parse, state) {
      return {
        lang: (capture[2] || '').trim(),
        content: capture[3] || '',
        inQuote: state.inQuote || false,
      };
    },
  },
  SimpleMarkdown.defaultRules.codeBlock
);
