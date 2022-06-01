import axios from "axios";

export async function downloadImageToDataURL(url: string): Promise<string | null> {
    const response = await axios.get(url, {
        responseType: 'arraybuffer',
        validateStatus: status => status >= 200 && status < 300
    }).then(res => {
        const data = Buffer.from(res.data, 'binary').toString('base64');
        const mime = res.headers['content-type'];

        return `data:${mime};base64,${data}`;
    }).catch(err => {
        if(!process.env.HIDE_TRANSCRIPT_ERRORS) {
            console.error(`Failed to download image for transcript: `, err);
        }

        return null;
    });

    return response;
}