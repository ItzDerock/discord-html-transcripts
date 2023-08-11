import SimpleMarkdown from 'simple-markdown';
import { extend } from '../utils/extend';

export const inlineCode = extend(
  {
    match: (source) => SimpleMarkdown.defaultRules.inlineCode.match.regex!.exec(source),
  },
  SimpleMarkdown.defaultRules.inlineCode
);
