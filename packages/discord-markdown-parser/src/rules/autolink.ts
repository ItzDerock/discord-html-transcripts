import SimpleMarkdown from 'simple-markdown';
import { extend } from '../utils/extend';

export const autolink = extend(
  {
    parse: (capture) => {
      return {
        content: [
          {
            type: 'text',
            content: capture[1],
          },
        ],
        target: capture[1],
      };
    },
  },
  SimpleMarkdown.defaultRules.autolink
);
