# ARC Raiders Companion V5

## Overview
A comprehensive React-based companion app for **ARC Raiders** (Embark Studios' tactical extraction shooter). Built with Claude Code as a learning/fun project.

## What It Does
- **Weapon database** with 21 weapons, tier ratings (S–D), PvP/PvE scores, crafting requirements
- **Workshop progression tracker** — 7 crafting stations with multi-level upgrade paths
- **Raid planner** — Pre-built raid routes with key room locations, estimated coin payouts
- **Loadout builder** — Primary/secondary/shield/augment selection with preset templates
- **Achievement system** — 16 badges (First Blood, Veteran, Legend, Locksmith, etc.)
- **Raid logger** — Track extractions, deaths, times, death map analysis
- **Live API integration** — Fetches real game data from ardb.app & arcdata.mahcks.com
- **AI tactical advisor** — Claude API integration for personalized raid strategy suggestions
- **Challenge mode** — Random loadouts + wildcards (pistols-only, pacifist mode, speed run, etc.)
- **Konami code easter egg** — Secret unlock

## Tech Stack
- **React** — UI + state management (useState, useCallback, useRef)
- **Local Storage** — Persist player progress
- **Claude API** — Tactical advisor (claude-sonnet-4-20250514)
- **Fetch API** — Live game data from public endpoints

## Key Features
- **Dark glassmorphic UI** — Cyan, gold, purple accent colors (gaming aesthetic)
- **10 main tabs** — HOME, PLAN, KEYS, KIT, SHOP, GUNS, SKILLS, QUESTS, INTEL, AI
- **Real-time raid mode** — Step-by-step raid execution with timer, loot notes
- **Stat analytics** — Extract rate %, average raid time, best streak, death map heatmap
- **Smart recommendations** — Suggests best runs based on owned keys & workshop level
- **Skill tree tracker** — Three branches (Mobility, Survival, Conditioning) with point allocation
- **Quest tracking** — 15 quests organized by phase (early/mid/late)
- **Data export/import** — Full JSON backup/restore

## File Structure
```
projects/
└── arc-raiders-companion/
    ├── ARC_Raiders_Companion_V5.jsx  (79KB, ~2800 lines)
    └── PROJECT.md (this file)
```

## Notes
- Designed as a **standalone web app** — can be deployed to Vercel/Netlify/Cloudflare Pages
- PWA-ready (mentioned in deployment section)
- **Not official** — fan-made tracker, independent from Embark Studios
- API fallback chain: arcdata.mahcks.com → ardb.app (gracefully handles offline mode)
- AI advisor has deep knowledge of weapon meta, workshop progression, and survival tactics

## Future Enhancements
- Real-time raid overlay for in-game use
- Cloud sync across devices
- Social features (raid squad tracking, leaderboards)
- Stat prediction model (run profitability forecasting)
- Integration with ARCTracker.io for account sync

## How to Deploy
1. Create a Vite + React project
2. Copy this .jsx component into `src/`
3. Add PWA manifest (optional)
4. Deploy to Vercel/Netlify/Cloudflare Pages
5. Share the URL

---

**Created:** Blake's Claude Code learning project  
**Status:** Feature-complete V5 (stable)
