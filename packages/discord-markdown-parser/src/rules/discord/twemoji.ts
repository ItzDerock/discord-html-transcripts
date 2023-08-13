import SimpleMarkdown from 'simple-markdown';
import { TwemojiRegex } from '../../utils/twemojiRegex';

export const twemoji: SimpleMarkdown.ParserRule = {
  order: SimpleMarkdown.defaultRules.strong.order,
  match: (source) => TwemojiRegex.exec(source),
  parse: function (capture) {
    return {
      name: capture[0],
    };
  },
};
