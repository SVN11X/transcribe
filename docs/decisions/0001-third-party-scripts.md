# 0001. Third-party scripts and services

- Status: proposed
- Date: 2026-11-07
- Proposed by: Claude Code
- Accepted by: owner

## Context

The page has no build step, so it loads its libraries from public CDNs and its models from public hosts. The web profile asks for a written reason for each third-party script.

## Decision

Keep these, each at a fixed version:

| What | From | Why |
|------|------|-----|
| JSZip 3.10.1 | cdnjs.cloudflare.com | Builds the ZIP with the screenshots. |
| Transformers.js 3.8.1 | cdn.jsdelivr.net | Runs Whisper in the browser. |
| tesseract.js 5.1.1 and core | cdn.jsdelivr.net | OCR of the screen text. |
| IBM Plex Sans 5.3.0 | cdn.jsdelivr.net | Page font. One family only. |
| Whisper models | huggingface.co | Downloaded on demand and cached by the library. |
| OCR language data | tessdata.projectnaptha.com | Downloaded on demand by tesseract.js. |
| Worker "transcribir" | workers.dev | Optional server transcription, no model download. |

The service worker caches the CDN libraries so the page opens offline.

## Alternatives considered

Vendoring the libraries into `src/` removes the CDN dependency but adds their size to git. Not needed yet.

## Consequences

If a CDN is down, a first visit cannot load that feature. Undo by vendoring the file and changing its URL.
