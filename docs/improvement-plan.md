# Improvement plan

Status: pending, done, skipped. Light: green = apply, yellow = approved move, red = stop and ask.

| # | Light | Status | Improvement |
|---|-------|--------|-------------|
| 1 | yellow | done | Adopt the standard (web profile), move `index.html` and `sw.js` to `src/` |
| 2 | yellow | pending | Publish Pages with `.github/workflows/pages.yml` (owner switches the Pages source to GitHub Actions) |
| 3 | green | pending | `worker/` part (software profile) with `wrangler.toml` and the `AI` binding. Code pasted by the owner from the Cloudflare dashboard |
| 4 | red | pending | Scan the Worker code for secrets before committing it |
| 5 | green | pending | Fix the page text that names a file that never existed |
| 6 | green | pending | Pin `tesseract.js` and `tesseract.js-core` to exact versions |
| 7 | green | pending | README in English and UTF-8, goals draft, CHANGELOG, DESIGN draft |
| 8 | green | pending | Decision record for third-party scripts |
| 9 | green | pending | CI: standard check and gitleaks with minimal permissions |
| 10 | green | pending | Deep code review of `src/` and `worker/` |
| 11 | green | pending | Web audit: WCAG 2.2 AA, 320 px layout, loading and error states |
| 12 | owner | pending | GitHub About panel, wiki and projects off (`standard.py github . --apply`) |
