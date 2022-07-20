import axios from 'axios';
import {
    CreateTranscriptOptions,
    GenerateFromMessagesOpts,
    ValidTextChannels,
} from './types';

export async function downloadImageToDataURL(
    url: string
): Promise<string | null> {
    const response = await axios
        .get(url, {
            responseType: 'arraybuffer',
            validateStatus: (status) => status >= 200 && status < 300,
        })
        .then((res) => {
            const data = Buffer.from(res.data, 'binary').toString('base64');
            const mime = res.headers['content-type'];

            return `data:${mime};base64,${data}`;
        })
        .catch((err) => {
            if (!process.env.HIDE_TRANSCRIPT_ERRORS) {
                console.error(`Failed to download image for transcript: `, err);
            }

            return null;
        });

    return response;
}

// https://stackoverflow.com/questions/6639770/how-do-i-get-the-unicode-hex-representation-of-a-symbol-out-of-the-html-using-ja
export const charCodeUTF32 = (char: string): number => {
    return (
        (char.charCodeAt(0) - 0xd800) * 0x400 +
        (char.charCodeAt(1) - 0xdc00) +
        0x10000
    );
};

// i think this is cleaner than writing "variable as unknown as type"
// used when i cant skip using "as unknown"
export function castToType<T>(type: any) {
    return type as unknown as T;
}

export function optsSetup(
    opts: CreateTranscriptOptions | GenerateFromMessagesOpts | undefined,
    channel: ValidTextChannels
) {
    var options = opts || {};

    if (!('fileName' in options))
        options.fileName = `transcript-${channel.id}.html`;
    if (!('returnType' in options)) options.returnType = 'attachment';

    return options;
}
