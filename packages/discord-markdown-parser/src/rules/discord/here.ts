import SimpleMarkdown from 'simple-markdown';
import { HereRegex } from '../../utils/regex';

export const here: SimpleMarkdown.ParserRule = {
  order: SimpleMarkdown.defaultRules.strong.order,
  match: (source) => HereRegex.exec(source),
  parse: function () {
    return {};
  },
};
