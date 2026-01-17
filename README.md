
[![        message: APIMessage
      ) => Awaitable<string | null | undefined>
    },
    poweredBy: true, // Whether to include the "Powered by discord-html-transcripts" footer
    hydrate: true, // Whether to hydrate the html server-side
    filter: (message) => true // Filter messages, e.g. (me
const attachment = await discordTranscripts.generateFromMessages(messages, channel, {
  // Same as createTranscript, ![1000000343](https://github.com/user-attachments/assets/4e5db1a9-86f2-4c98-b5c2-f850b9eab955)
except no limit or filter
});
```

### Compressing images

If `saveImages` is set to `true`, all images will be downloaded and stored in the file _as-is_. You can optionally enable compression by installing the `sharp` module and setting the following options:

```js
callbacks: {
  resolveImageSrc: new TranscriptImageDownloader()
    .withMaxSize(5120) // 5MB in KB
    .withCompression(40, true) // 40% quality, convert to webp
    .build(),
},
```

Note that, in a more advanced setup, you could store a copy of the files and return an entirely new URL pointing to your own image hosting site by implementing a custom `resolveImageSrc` function.

## 🤝 Enjoy the package?

Give it a star ⭐ and/or support me on [ko-fi](https://ko-fi.com/derock)
