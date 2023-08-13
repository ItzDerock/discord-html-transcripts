import { green, yellow } from 'colorette';
import { rm, writeFile } from 'node:fs/promises';
import { URL } from 'node:url';

async function importFileFromWeb({ url, temporaryFileName }) {
  const body = await fetch(url).then((response) => response.text());

  const temporaryOutputFile = new URL(temporaryFileName, import.meta.url);

  await writeFile(temporaryOutputFile, body);
  const loadedModule = await import(temporaryOutputFile);

  await rm(temporaryOutputFile);

  return loadedModule;
}

const filePrefix = [
  '/**',
  ' * Regex that can capture a Twemoji (Twitter Emoji)',
  ' * @raw {@linkplain https://github.com/twitter/twemoji-parser/blob/master/src/lib/regex.js See official source code}',
  ' */',
  'export const TwemojiRegex =',
  '\t',
].join('\n');
const fileSuffix = [';', ''].join('\n');

const shaTrackerFileUrl = new URL('sha-tracker.json', import.meta.url);
const twemojiRegexFileUrl = new URL('../src/utils/twemojiRegex.ts', import.meta.url);
const oneMonthAgo = Date.now() - 1000 * 60 * 60 * 24 * 30;
const timestamp = new Date(oneMonthAgo).toISOString();

const url = new URL('https://api.github.com/repos/twitter/twemoji-parser/commits');
url.searchParams.append('path', 'src/lib/regex.js');
url.searchParams.append('since', timestamp);

const [commits, { default: ciData }] = await Promise.all([
  fetch(url).then((res) => res.json()), //
  import(shaTrackerFileUrl, { assert: { type: 'json' } }), //
]);

const data = { sha: commits.length ? commits[0].sha : null, length: commits.length };

if (data.sha === null || data.sha === ciData.twemojiRegexLastSha) {
  console.info(yellow('Fetched data but no new commit was available'));

  process.exit(0);
}

const { default: regexFromWeb } = await importFileFromWeb({
  url: 'https://raw.githubusercontent.com/twitter/twemoji-parser/master/src/lib/regex.js',
  temporaryFileName: 'regex.mjs',
});

const nonGlobalRegex = new RegExp(`^(${regexFromWeb.source})`, '');

const writePromises = [
  //
  writeFile(twemojiRegexFileUrl, `${filePrefix}${nonGlobalRegex}${fileSuffix}`),
];

if (data.sha)
  writePromises.push(writeFile(shaTrackerFileUrl, JSON.stringify({ ...ciData, twemojiRegexLastSha: data.sha })));

await Promise.all(writePromises);

console.log(green(`Successfully wrote updated Twemoji Regex to file; Latest SHA ${data.sha}`));
