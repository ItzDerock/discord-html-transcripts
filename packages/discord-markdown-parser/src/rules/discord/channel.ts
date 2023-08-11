import SimpleMarkdown from 'simple-markdown';
import { ChannelMentionRegex } from '../../utils/regex';

export const channel: SimpleMarkdown.ParserRule = {
  order: SimpleMarkdown.defaultRules.strong.order,
  match: (source) => ChannelMentionRegex.exec(source),
  parse: function (capture) {
    return {
      id: capture[1],
    };
  },
};
