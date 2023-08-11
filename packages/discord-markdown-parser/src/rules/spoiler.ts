import SimpleMarkdown from 'simple-markdown';
import { SpoilerRegex } from '../utils/regex';

export const spoiler: SimpleMarkdown.ParserRule = {
  order: 0,
  match: (source) => SpoilerRegex.exec(source),
  parse: function (capture, parse, state) {
    return {
      content: parse(capture[1], state),
    };
  },
};
