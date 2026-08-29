# jp-sepia

**日本語** | [English](README.en.md)

> 日本語の脱 AI は、英語の語彙リストを訳す仕事ではない。小説は物語の骨格から直し、実務文は日本語で測った語彙と文のリズムに通す。

[sepia](https://github.com/Nanako0129/sepia) の思想を、日本語に差し替えたポータブル [Agent Skill](https://agentskills.io/specification)。Claude Code、Codex、Grok Build、Antigravity で同じ `SKILL.md` を使う。操作は四つ: **write**、**review**（診断のみ）、**refactor**（最小改訂）、**recreate**（全文書き直し）。

## なぜ「日本語版」が別物なのか

英語圏の humanizer は単語と構文を直す。sepia は、StoryScope（arXiv:2604.03136。61,608 篇）が示した層へ降りた。物語構造の特徴だけで AI 小説は 93.2% で検出され、表面スタイルを洗っても 93.9% にしか落ちない。テーマを語り手が説明する、因果が一本、感情が身体感覚だけ、現実の固有名が無い、直線の時間、成長と受容の結び。

その骨格は残す。ただし英語 35 パターンのうち 6 は日本語で空振りするか、符号が逆になる。主語の省略は日本語の標準であり、「主語が無い」検出は正しく書けている段落ほど弾く。`-ing` 句も Title Case もカーリー引用符も、ハイフン複合語も、ここに無い。

日本語で測って残った差は別の場所にある。

| 層 | 日本語で効くもの |
|---|---|
| 物語の骨格（小説） | sepia と同じ。テーマを説明しない、単線を緩める、結びの三重既定を外す。視点と役割語は日本語の追加層 |
| 談話 | 問いの列を入れ替える。中ほどに予測されない出来事。**文長をバラす**（humanizer-jp: AI 記事の 99% が人間より均一） |
| 表層 | 訳語ではなく実測語。「適切な」「実現する」「本記事では」。ですます／であるの混在。「X ではなく Y」の八形 |

実務文では語彙密度の判別がリズムより強い（180 本測定で語彙 AUC 0.998、リズム 0.897）。小説では構造が先、という sepia の順序は維持する。ジャンルで荷重が変わるだけである。

支配する原則も sepia と同じ。**人間の分布に合わせ、AI の分布を反転させない。** 人間は中庸にいる。規則を全部当てた話は、新しい指紋になる。小説は 3–5 手。隙間を残す。丁寧語を崩して人間らしく見せない。丁寧語そのものは指紋ではない。

## インストール

既定はユーザー範囲。一度入れれば、どのプロジェクトでも使える。リポジトリ URL はフォーク先に読み替える。

### Claude Code

```bash
claude plugin marketplace add CoderK-star/jp-sepia
claude plugin install jp-sepia@jp-sepia --scope user
```

### Codex

```bash
codex plugin marketplace add CoderK-star/jp-sepia
codex plugin add jp-sepia@jp-sepia
```

### Grok Build

```bash
grok plugin install CoderK-star/jp-sepia --trust
```

### Antigravity

```bash
git clone https://github.com/CoderK-star/jp-sepia.git ~/.jp-sepia
mkdir -p ~/.gemini/config/skills ~/.gemini/antigravity/global_workflows
cp -R ~/.jp-sepia/skills/jp-sepia ~/.gemini/config/skills/jp-sepia
cp ~/.jp-sepia/.agents/workflows/jp-sepia.md ~/.gemini/antigravity/global_workflows/jp-sepia.md
```

### まとめて（bash）

```bash
# Linux / macOS / Git Bash
./install.sh
```

`~/.jp-sepia` へクローン（`JP_SEPIA_HOME` で上書き）し、四プラットフォームへユーザー範囲で入れる。同じ行の再実行が更新。中を見てから入れたいときは、チェックアウトしてから `./install.sh`。

### 更新

すでにこのリポジトリをチェックアウトしている場合は、そのディレクトリを更新する。`~/.jp-sepia` は、インストーラがそこへクローンされた場合にだけ存在するパスである。

```bash
cd /path/to/jp-sepia
git pull --ff-only
bash ./install.sh
```

たとえばこのリポジトリが Git Bash の `/c/jp-sepia` にあるなら、`cd /c/jp-sepia` とする。`git -C ~/.jp-sepia ...` は、`~/.jp-sepia` を使う方式でインストールした場合だけ実行する。

Windows PowerShell では、チェックアウトのディレクトリで次を実行する。

```powershell
Set-Location C:\path\to\jp-sepia
git pull --ff-only
.\install.ps1
```

### Windows

```powershell
Set-ExecutionPolicy -Scope Process Bypass
.\install.ps1
```

Claude / Codex / Grok はジャンクション、Antigravity はコピー。

| プラットフォーム | 場所 | 仕組み |
|---|---|---|
| Claude Code | `~/.claude/skills/jp-sepia` | symlink / junction |
| Codex | `~/.agents/skills/jp-sepia` | 同上 |
| Grok Build | `~/.grok/skills/jp-sepia` | 同上 |
| Antigravity | `~/.gemini/config/skills/jp-sepia` + `/jp-sepia` | copy |

### プロジェクト範囲

そのリポジトリだけにピンするときは、`skills/jp-sepia/` を `.agents/skills/jp-sepia`（Codex + Antigravity）か `.claude/skills/jp-sepia`（Claude Code）としてコミットする。

## 構成

```text
jp-sepia/
├── skills/jp-sepia/              # 正本（Agent Skills 標準）
│   ├── SKILL.md                  # 経路、操作、較正、制約
│   └── references/
│       ├── narrative-pass.md     # 小説 pass 1: 骨格（視点・役割語を含む）
│       ├── discourse-pass.md     # pass 2: 問いの列、中弛み、文長
│       ├── style-pass.md         # pass 3: 日本語の表層（訳さない語彙）
│       ├── rubric.md             # 小説 30 特徴 + 日本語層
│       ├── model-fingerprints.md # モデル補正（物語 + 日本語実務）
│       ├── professional-pass.md  # 非フィクションの共有層
│       └── domains/              # リリース、返信、障害、チケット、技術記事
├── .claude-plugin/
├── .codex-plugin/
├── .agents/                      # Codex / Antigravity の発見 + ワークフロー
├── install.sh
├── install.ps1
└── research/                     # 根拠の要約と、英語から持ち込まない項目
```

## sepia から変えたこと

- 正本を日本語にした。例文も日本語。
- 英語で空振りする 6 パターンを切った。主語検出は逆向きにした。
- 語彙リストを 180 本の実測に差し替えた。「浮き彫りにする」は入れない。
- 文長の均一を談話パスへ上げた。表層の飾りより先に直す。
- ですます／であるの混在を、レジスタ問題として経路直後に固定した。
- 小説に視点・役割語・説明会話・間の第八グループを足した。
- StoryScope の数値は英語コーパスである、とルーブリックに書いた。

## 評価

公開前の評価手順、28 の操作ケース、誤発火の負例、事実保持の機械検査は [`evals/README.md`](evals/README.md) にある。合格基準は検出器の回避率ではなく、事実保持、操作契約、媒体適合、ブラインド編集評価である。

## 出典

要約とリンクは [`research/`](research/)。物語層の一次は StoryScope。日本語の一次は Zaitsu & Jin 2023、Zaitsu et al. 2026、林・相澤 2026、humanizer-jp、kenimo49 の 180 本測定と英語パターン仕分け。設計の親は [Nanako0129/sepia](https://github.com/Nanako0129/sepia)（MIT）。

## ライセンス

MIT。sepia（Copyright (c) 2026 Nanako Tsai）に基づく。
