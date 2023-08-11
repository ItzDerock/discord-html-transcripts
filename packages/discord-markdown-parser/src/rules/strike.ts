import SimpleMarkdown from 'simple-markdown';
import { extend } from '../utils/extend';
import { StrikeThroughRegex } from '../utils/regex';

export const strikethrough = extend(
  {
    match: SimpleMarkdown.inlineRegex(StrikeThroughRegex),
  },
  SimpleMarkdown.defaultRules.del
);
