# Futuremen — OpenClaw Workspace Template

**Futuremen** is a self-contained, sovereign AI agent workspace designed for [OpenClaw](https://openclaw.ai). It turns a plain folder into a small autonomous headquarters: a core simulation engine, a web dashboard, a set of operating protocols, and a memory system — all in plain files you own.

This public edition is meant for **other OpenClaw users** who want to build their own version. It contains **no secrets, no private history, no internal IPs** — only the reusable skeleton.

---

## What's inside

| File | Purpose |
|------|---------|
| `futuremen.html` | The dashboard (single-file web UI, works offline) |
| `futuremen-core.js` | Core engine: lore, team registry, protocols, progress log (Node.js + browser) |
| `AGENTS.md` | Instructions your OpenClaw agent follows in this workspace |
| `SOUL.md` | Personality & tone for your agent |
| `IDENTITY.md` | Identity template (name, avatar, vibe) |
| `IDEAS.md` | Idea backlog |
| `venardi/` | **Blank Venardi framework** — calendar + barometer skeleton to build your own coordination/simulation layer |
| `MEMORY.md` | Long-term memory template (fill it as you go) |

## Quick start

1. Copy the whole folder into your OpenClaw workspace (or merge the files into your existing one).
2. Edit `IDENTITY.md` — pick a name, an emoji, an avatar.
3. Read `AGENTS.md` and adjust the rules to your own style.
4. Open `futuremen.html` in a browser to see the dashboard.
5. Build your own coordination layer from the blank `venardi/` framework (calendar + barometer).

### Core engine (optional)

```bash
node futuremen-core.js          # interactive console
node futuremen-core.js --list   # list the team
```

The engine exposes `FUTUREMEN` (team registry), `Futuremen.recordProgress(...)`, `Futuremen.showProgress()`, and the 7 anti-paradox protocols.

## License

**GNU GPL v2** — see [LICENSE](./LICENSE).

You are free to use, modify and redistribute this workspace under the terms of the GPL v2. If you build something on top of it, share it back under the same license.

## Notes

- This is a **template**: the original project keeps its private history, memory and infrastructure elsewhere. What you see here is the public face.
- No API keys, tokens, passwords, or local network addresses are included — and none should ever be committed.
- Keep `secrets/`, `memory/`, `.env` and similar private files **out** of any public repository.
