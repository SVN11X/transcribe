# Improvement plan

Status: pending, done, skipped. Light: green = apply, yellow = approved move, red = stop and ask.

| # | Light | Status | Improvement |
|---|-------|--------|-------------|
| 1 | yellow | done | Adopt the standard (web profile), move `index.html` and `sw.js` to `src/` |
| 2 | yellow | pending | Publish Pages with `.github/workflows/pages.yml` (owner switches the Pages source to GitHub Actions) |
| 3 | green | done | `worker/` part (software profile) with `wrangler.toml` and the `AI` binding. Code pasted by the owner from the Cloudflare dashboard |
| 4 | red | done (no secrets found in worker code) | Scan the Worker code for secrets before committing it |
| 5 | green | done | Fix the page text that names a file that never existed |
| 6 | green | done | Pin `tesseract.js` and `tesseract.js-core` to exact versions |
| 7 | green | done (goals, DESIGN.md and README status written from the owner's answers) | README in English and UTF-8, goals draft, CHANGELOG, DESIGN draft |
| 8 | green | done | Decision record for third-party scripts |
| 9 | green | done (workflow standard.yml) | CI: standard check and gitleaks with minimal permissions |
| 10 | green | partly done | Deep review done. Applied: contrast of empty shot text, `:active` state, AudioContext close, blob URL release, dead code removed. Pending, need owner OK: SRI plus opaque cache (SW), https-only server URL and key storage, unverified claims about data retention and quotas, footer publish instructions, theme toggle, models render race, seek timeout, English identifiers, split of index.html |
| 11 | green | pending | Web audit: WCAG 2.2 AA, 320 px layout, loading and error states |
| 12 | owner | pending | GitHub About panel, wiki and projects off (`standard.py github . --apply`) |
| 13 | green | pending | Layout: on windows 1100 px and wider, show two panes. Steps 1 to 3 on the left, step 4 with progress and result on the right. Today one 760 px column puts the Generate button after three stacked sections (M3 window size classes, NN/g scrolling and attention) |
| 14 | green | pending | Layout: the gallery shows about 3 columns inside the 760 px column. A long meeting gives hundreds of captures in one long list. Use the extra width of the result pane (M3 window size classes) |
| 15 | green | pending | Layout: `.lead` and `.hint` have no `max-width`. At 14 px a full line in the 672 px body is about 87 characters by estimate. Cap at `70ch` (Baymard 50 to 75, WCAG 1.4.8 up to 80) |
| 16 | green | pending | Layout: measure the real page at 360, 768, 1280 and 1920 px with a browser (screens to reach the Generate button, first screen content, characters per line). The values above are estimates from the CSS |
| 17 | yellow | pending | Smart captures for meetings (goal 1). Needs a decision record: simple rules or an AI model in the browser |
| 18 | yellow | pending | Rewrite the privacy text after reading the Cloudflare and Groq policies (goal 2) |
| 19 | yellow | pending | Split `src/index.html` into CSS and JS files with native ES modules, no bundler (goal 3) |
| 20 | yellow | done in code, owner must set the secret and deploy | Worker access key: `CLAVE_ACCESO` secret, constant-time compare, fails closed, tests in `worker/tests/` |
| 21 | green | done | `standard.yml` aligned with the standards v1.8.2 template (pull request event types) |
