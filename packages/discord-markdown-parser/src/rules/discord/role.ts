import SimpleMarkdown from 'simple-markdown';
import { RoleMentionRegex } from '../../utils/regex';

export const role: SimpleMarkdown.ParserRule = {
  order: SimpleMarkdown.defaultRules.strong.order,
  match: (source) => RoleMentionRegex.exec(source),
  parse: function (capture) {
    return {
      id: capture[1],
    };
  },
};
