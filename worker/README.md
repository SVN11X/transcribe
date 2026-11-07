# worker

Cloudflare Worker "transcribir". The web page in `../src/` sends it audio chunks of less than 30 seconds and receives the text with timings. It does not store the audio.

Live URL: https://transcribir.valde-transfer.workers.dev
Binding: Workers AI as `AI` (declared in `wrangler.toml`).

## Status

The code in `src/index.js` is a placeholder. The deployed Worker was edited in the Cloudflare dashboard, so the owner has to paste its code here.

TODO(owner): copy the code from the dashboard (Workers & Pages, transcribir, Edit code) into `src/index.js`. Remove any secret you find in it.

## Run and deploy

Run these in this folder (`worker/`):

```
npm install
npm run check
npx wrangler login
npm run deploy
```

`npm run check` builds the Worker without deploying it.

## Secrets

The page text mentions an optional Groq key and an optional access key sent in the `X-Clave` header. TODO(owner): confirm the secret names the code reads from `env` and list them here. Set them with `npx wrangler secret put <NAME>`. Never write their values in the repository.
