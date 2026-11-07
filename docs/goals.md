# Goals

<!-- Written by the owner. AI tools may format or translate this file, never invent its content. Replace every TODO(owner) line. -->

## Vision

Turn a video, especially a meeting recording, into one clean document that an AI can understand, without storing the video or the audio anywhere.

## Users

The owner and close contacts. They have a recording of a meeting or a class and want an AI to read it.

## Objectives

1. Smart captures for meetings. Detect that the video is a meeting and which platform it came from (Teams, Meet, Zoom and others). Tell apart the people, the content being shown and the meeting timer. Produce clean crops of the shown content and avoid repeated material. Today a person moving in the video triggers a new capture.
2. Honest privacy. The page text says only what is verified about what is sent and what is kept, after reading the policies of Cloudflare and Groq.
3. Tidier code. `src/index.html` is split into smaller parts.
4. Good use of the space on the page.
5. Free tools only.

## Non-goals

- Store video or audio.
- Ask for accounts or payments.
- Edit the video.

## Success criteria

- Fewer repeated captures in a meeting video.
- The ZIP is enough for an AI to understand the video.
- The free quota is enough for normal use.

## Priorities

Chosen by the owner, without a stated order: captures for meetings, honest privacy, tidier code, free tools, good use of the space on the page.

## Constraints

- Everything runs on free services.
- The user installs nothing. They only open the page in a browser.

## Open questions

- How to detect people and the platform: simple rules (typical positions and colors) or an AI model in the browser. A model adds a dependency and a third-party script, so it needs a decision record in `docs/decisions/`.
- Resolved by the AI at the owner's request: `build` stays `none`. `index.html` can be split into CSS and JS files with native ES modules, without a bundler.
