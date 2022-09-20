import { ReactNode } from "react";
import { ASTNode, ParserRule } from "simple-markdown";
import { State } from "./types";

type AdditionalRule = Partial<ParserRule> & {
    react: (
        node: ASTNode,
        output: (node: ASTNode, state?: any) => string,
        state: State
    ) => ReactNode
}

export const extend = (additionalRules: AdditionalRule, defaultRule: ParserRule): AdditionalRule => {
    return Object.assign({ }, defaultRule, additionalRules);
}