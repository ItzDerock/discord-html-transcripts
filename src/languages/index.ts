import { en_US } from './en';
import type { Language as LanguageType } from './types';
import { format } from 'node:util';

/**
 * Object containing all supported languages. Key is the language code, value is the language object.
 */
const languages = {
  'en-US': en_US,
};

/**
 * All supported languages
 */
export type Languages = keyof typeof languages;

/**
 * Turns a type into a dot-notation string
 */
type DotNotation<T> = T extends Array<string>
  ? ''
  : T extends object
  ? {
      [K in keyof T]: T[K] extends object ? `${K & string}.${DotNotation<T[K]>}` : K & string;
    }[keyof T]
  : T & string;

/**
 * A class to handle language strings
 */
export class Language {
  private readonly language: LanguageType;

  constructor(public readonly languageName: Languages) {
    if (languageName in languages) {
      this.language = languages[languageName];
    }

    console.warn(`[discord-html-transcripts] Language "${languageName}" not found, defaulting to "en-US".`);
    this.language = languages['en-US'];
  }

  /**
   * Return a formatted string with the given language path (e.g. `reply.command`)
   * @param path The path to the string
   * @param args The arguments to pass to the string
   */
  public format(path: DotNotation<LanguageType>, ...args: unknown[]): string {
    let lang = this.language;
    const keys = path.split('.');

    // traverse the language object
    for (const key of keys) {
      if (key in lang) {
        // @ts-expect-error - key narrowing for ts not implemented (issue #43284)
        lang = lang[key];
      } else {
        if (this.languageName === 'en-US') {
          throw new Error(`[discord-html-transcripts] Language path "${path}" not found.`);
        }

        return new Language('en-US').format(path, ...args);
      }
    }

    // if array, choose a random element
    if (Array.isArray(lang)) {
      lang = lang[Math.floor(Math.random() * lang.length)];
    }

    return format(lang, ...args);
  }
}
