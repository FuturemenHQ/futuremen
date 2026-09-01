# Contributing to Futuremen

Thanks for wanting to help! Futuremen is a small, sovereign OpenClaw workspace template — every contribution that respects the spirit (simple, portable, no secrets) is welcome.

## Ways to contribute

- **Report a bug** — open an [Issue](https://github.com/FuturemenHQ/futuremen/issues) with steps to reproduce.
- **Suggest a feature** — open an Issue describing the idea and why it matters.
- **Fix something / add something** — fork, branch, commit, pull request (see below).

## Ground rules

1. **No secrets, ever.** No API keys, tokens, passwords, `.env` files, private IPs or personal data in any commit. If your change needs configuration, use a placeholder (e.g. `sk-…`, `YOUR_KEY`) and document it.
2. **No private history.** This repo is the public face of the project — never copy `memory/`, personal notes, or internal infrastructure details into it.
3. **English only** in code, docs and comments (the dashboard is meant to be international).
4. **Keep it generic.** The dashboard and framework are templates — prefer reusable, configurable features over hardcoded specifics.
5. **Small, focused changes** are easier to review than big rewrites.

## Workflow (fork + pull request)

1. **Fork** the repo on GitHub.
2. **Clone** your fork:
   ```bash
   git clone https://github.com/<your-username>/futuremen.git
   cd futuremen
   ```
3. **Create a branch**:
   ```bash
   git checkout -b my-change
   ```
4. **Make your changes** — code, docs, or both.
5. **Test locally**:
   - Open `index.html` in a browser and check your change.
   - If you touched the JavaScript, validate it: `node --check` on the extracted script.
   - Run the privacy scan before committing:
     ```bash
     grep -rnE "(sk-[A-Za-z0-9]{20,}|hf_[A-Za-z0-9]{20,}|ghp_[A-Za-z0-9]{20,}|192\.168\.|10\.[0-9]+\.[0-9]+\.[0-9]+)" . --exclude-dir=.git
     ```
     It should return nothing.
6. **Commit** with a clear message:
   ```bash
   git add -A
   git commit -m "Describe the change concisely"
   ```
7. **Push** and open a **Pull Request**:
   ```bash
   git push origin my-change
   ```
   Then click *Compare & pull request* on GitHub, describe what you did and why.

## Review process

- A maintainer will review your PR, maybe ask for tweaks.
- Keep the conversation focused; force-push updates to your branch as needed.
- Once approved, your change gets merged.

## Code of conduct

Be respectful, assume good faith, and remember this is a template others will build on. No harassment, no drama — just good contributions.

---

*Questions? Open an Issue — we're happy to help.*
