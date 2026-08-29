# jp-sepia

[日本語](README.md) | **English**

> De-AI for Japanese does not mean translating an English word list. Fiction is repaired at narrative architecture; professional prose is run through Japanese-measured vocabulary and sentence rhythm.

A Japanese-first rebuild of [sepia](https://github.com/Nanako0129/sepia): a portable [Agent Skill](https://agentskills.io/specification) for Claude Code, Codex, Grok Build, and Antigravity. One canonical `SKILL.md`. Four operations: **write**, **review** (diagnose only), **refactor** (minimal edits), **recreate** (full rewrite). English text is out of scope — use original sepia.

## Why a separate skill

Popular humanizers edit word choice. sepia went one layer down: StoryScope (arXiv:2604.03136; 61,608 stories) showed that narrative-structure features alone detect AI fiction at 93.2% macro-F1, and washing the surface barely moves it (95.5% → 93.9%). That architecture protocol stays.

What does not stay is the English tell list. Six of the 35 Wikipedia/humanizer patterns fail or reverse in Japanese. Dropped subjects are the default, not a defect; flagging them punishes well-written paragraphs. There is no `-ing` clause, no Title Case, no curly-quote tell, no hyphenated-compound tell.

Japanese measurements land elsewhere:

| Layer | What actually moves the needle |
|---|---|
| Narrative (fiction) | Same as sepia, plus viewpoint, role language (役割語), and explanation-in-dialogue |
| Discourse | QUD reordering, mid-text sag — and **sentence-length variance** (humanizer-jp: 99% of AI articles are more uniform than the human mean) |
| Surface | Measured words, not translations. 適切な, 実現する, 本記事では. Mixing ですます and である. The eight surface forms of "not X but Y" |

In Japanese professional prose, vocabulary density out-discriminates rhythm (AUC 0.998 vs 0.897 on 180 samples). Fiction still fixes structure first. The load order changes by genre; the governing rule does not: **calibrate to the human distribution, don't invert the AI one.** Polite ですます is not a tell. Mixing registers is.

## Install

User scope everywhere. The commands below use this repository; forks should replace `CoderK-star` with their own owner.

See [README.md](README.md) for Claude Code, Codex, Grok Build, Antigravity, `install.sh`, and `install.ps1` (Windows junctions).

If you already have a checkout, update that checkout and rerun its installer:

```bash
cd /path/to/jp-sepia
git pull --ff-only
bash ./install.sh
```

`~/.jp-sepia` is only the path used when the installer created a clone there; it is not the path of every checkout.

## What changed from sepia

- Canonical skill is Japanese, with Japanese examples.
- Six English patterns that fail in Japanese are cut; missing-subject detection is inverted.
- Vocabulary list replaced by a 180-article measurement. 浮き彫りにする is not on it (zero hits).
- Sentence-length uniformity is promoted into the discourse pass.
- ですます / である is locked at routing time.
- Fiction gets an eighth group: viewpoint, 役割語, 間.
- StoryScope numbers are labeled as an English-corpus prior in the rubric.

## Evaluation

The pre-release protocol, 28 operation cases, negative invocation cases, and factual-anchor checks live in [`evals/README.md`](evals/README.md). The release bar is factual preservation, operation-contract fidelity, venue fit, and blinded editorial review—not detector-evasion scores.

## Sources

Digests in [`research/`](research/). Narrative layer: StoryScope and the sepia evidence base. Japanese layer: Zaitsu & Jin 2023, Zaitsu et al. 2026, Hayashi & Aizawa 2026, humanizer-jp, kenimo49's 180-article study. Design parent: [Nanako0129/sepia](https://github.com/Nanako0129/sepia) (MIT).

## License

MIT. Based on sepia, Copyright (c) 2026 Nanako Tsai.
