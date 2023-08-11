import { ParserRule } from 'simple-markdown';

export const extend = (additionalRules: Partial<ParserRule>, defaultRule: ParserRule): ParserRule => {
  return Object.assign({}, defaultRule, additionalRules);
};
