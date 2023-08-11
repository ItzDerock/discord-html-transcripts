import SimpleMarkdown from 'simple-markdown';
import { extend } from '../utils/extend';
import { TextRegex } from '../utils/regex';

export const text = extend(
  {
    match: (source) => TextRegex.exec(source),
  },
  SimpleMarkdown.defaultRules.text
);
