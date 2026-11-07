# worker

Cloudflare Worker "transcribir". The web page in `../src/` sends it audio chunks of less than 30 seconds and receives the text with timings. It does not store the audio.

Live URL: https://transcribir.valde-transfer.workers.dev
Binding: Workers AI as `AI` (declared in `wrangler.toml`).

## Status

`src/index.js` is the deployed code, copied from the Cloudflare dashboard. It uses Workers AI first and Groq when the Workers AI quota runs out.

## Run and deploy

Run these in this folder (`worker/`):

```
npm install
npm run check
npx wrangler login
npm run deploy
```

`npm run check` builds the Worker without deploying it.

## Configuration

- `AI`: Workers AI binding, declared in `wrangler.toml`.
- `GROQ_API_KEY`: optional secret. Set it with `npx wrangler secret put GROQ_API_KEY`.
- `PAGINAS_PERMITIDAS`: constant in `src/index.js` with the page origins allowed to call the Worker.
- `CLAVE`: constant in `src/index.js`, empty by default. If you set one, the page must send it in the `X-Clave` header. Do not commit a real value.

Never write secret values in the repository.
