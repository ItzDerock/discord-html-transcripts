import SimpleMarkdown from 'simple-markdown';
import { EmoticonRegex } from '../utils/regex';

export const emoticon: SimpleMarkdown.ParserRule = {
  order: SimpleMarkdown.defaultRules.text.order,
  match: (source) => EmoticonRegex.exec(source),
  parse: function (capture) {
    return {
      type: 'text',
      content: capture[1],
    };
  },
};
