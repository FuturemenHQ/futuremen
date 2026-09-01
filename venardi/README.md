# Venardi Framework — Blank Template

**Venardi** is the simulation/coordination layer of a Futuremen workspace: a calendar with two clocks (real time + simulated time), a barometer (egregore purity / tension), and a mission log. This folder is a **blank skeleton** — build your own framework on top of it.

## Files

| File | Purpose |
|------|---------|
| `venardi-calendar.json` | Blank calendar — tasks with `mode: real` (wall-clock due dates) or `mode: simulation` (simulated dates, 1 tick = 1 simulated day) |
| `raven-state.json` | Blank barometer — egregore purity, tension, timeline, followed topics |
| `README.md` | This guide |

## How it works (concepts)

### 1. The calendar (`venardi-calendar.json`)

Two clocks coexist:

- **`mode: "real"`** — task due dates are wall-clock. Used for reminders and daily coordination (heartbeat checks "what is due today?").
- **`mode: "simulation"`** — task due dates are **simulated dates** anchored at `calendarAnchorISO`. One **tick = one simulated day** (24 narrative hours), advanced by you or by a heartbeat — not by the system clock.

```json
{
  "calendar": [
    {
      "id": 1,
      "dateISO": "2026-09-01",
      "title": "Example real task — due on this wall-clock date",
      "mode": "real",
      "status": "pending",
      "note": "Anything useful"
    },
    {
      "id": 2,
      "dateISO": "2026-10-05",
      "title": "Example simulated task — due on this simulated date",
      "mode": "simulation",
      "status": "pending",
      "note": "1 tick = 1 simulated day since the anchor"
    }
  ],
  "nextId": 3,
  "calendarAnchorISO": "2026-09-01",
  "note": "1 tick = 1 day since calendarAnchorISO."
}
```

### 2. The barometer (`raven-state.json`)

A snapshot of your world's state: purity, tension, active timeline, followed topics. Refresh it periodically (web sync or manual).

```json
{
  "timestamp": "2026-09-01T00:00:00.000Z",
  "egregorePurity": 0.5,
  "egregorePercent": 50,
  "mandelaTension": "Modérée",
  "divergence": "0%",
  "timeline": "YOUR_TIMELINE",
  "dateSimulee": "2026-09-01",
  "ancre": "2026-09-01",
  "barometer": {
    "dateDebut": "1 septembre 2026",
    "dateFin": "1 septembre 2026",
    "ticks": 0,
    "purity": 0.5,
    "timelineActive": "Votre timeline",
    "lieu": "Votre QG",
    "personnesSuivies": "—",
    "statut": "—",
    "note": "—"
  },
  "sources": [],
  "_meta": { "source": "votre-core.js", "syncedAt": "2026-09-01T00:00:00.000Z" }
}
```

### 3. The loop (suggested)

1. **Heartbeat** (every 30 min or so): read the calendar, list due tasks (`real` + `simulation`), check the barometer freshness.
2. **ReAct point** (daily): a lead agent (or two) decides the day's program from due tasks.
3. **Record**: log missions, decisions and progress — in `memory/YYYY-MM-DD.md` and your long-term `MEMORY.md`.
4. **Ticks**: advance simulated ticks when the narrative moves (1 tick = 1 simulated day).

## Make it yours

- Change the anchor date, the timeline name, the barometer fields.
- Add your own agents, your own units, your own protocols.
- The calendar and barometer are plain JSON — wire them into your own scripts, cron jobs, or dashboards.

_This is a skeleton, not a doctrine. The point is to give you a starting menu — the framework is yours to build._
