# transcribe

A web page that prepares a video so an AI can understand it. You pick a video and the page produces one document with the transcript of the audio, screenshots of the video and, optionally, the text read from the screen (OCR). The page is in Spanish.

Live page: https://svn11x.github.io/transcribe/

## What it does

- Transcribes the audio with Whisper, either inside the browser (the model downloads once and stays cached) or through a Cloudflare Worker, so nothing heavy runs on the device.
- Takes screenshots of the video and can read the text on screen with Tesseract OCR.
- Packs everything in a document and a ZIP.
- Works offline after the first visit, thanks to a service worker.

## Status

TODO(owner): state the project status. Audience and goals are still to be written in `docs/goals.md`.

## Layout

```
src/      the page (index.html) and its service worker (sw.js)
worker/   Cloudflare Worker "transcribir" that transcribes audio chunks
docs/     goals, decisions and the improvement plan
```

## Run locally

Run this in the `src/` folder, then open http://localhost:8000:

```
python -m http.server 8000
```

The Worker is documented in `worker/README.md`.

## License

MIT, see `LICENSE`.
