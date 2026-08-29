---
name: jp-sepia
description: >
  日本語の文章から AI っぽさを落とす。小説は物語構造から直し、実務文書は媒体ごとのルールに通す。
  Make Japanese writing read as human-written: narrative-architecture repair for fiction
  (StoryScope, arXiv:2604.03136) plus Japanese-measured surface and rhythm rules
  (Zaitsu & Jin; humanizer-jp; 180-article slop measurement). Four operations —
  write, review (diagnose only), refactor (minimal edits), recreate (full rewrite).
  Use when asked to humanize, de-AI, unslop, 人間らしく, AIっぽさ, 脱AI, AI臭,
  リライト, or strip machine flavor from Japanese text; when writing or revising
  小説, リリースノート, PR/Issue 返信, 障害報告, チケット, 技術記事; or whenever
  Japanese output must not read as machine-written. English text is out of scope —
  use the original sepia skill.
license: MIT
metadata:
  version: "0.1.0"
  derived-from: "Nanako0129/sepia"
---

# jp-sepia — 日本語の脱 AI 執筆

英語版 humanizer を訳しても、日本語では空振りと誤検知が出る。主語省略は日本語の標準であり、`-ing` 句も Title Case も存在しない。測って残った差は別の層にある。小説は **物語構造** が先（StoryScope: 構造特徴だけで 93.2% macro-F1、表面を直しても 93.9%）。実務の日本語は **語彙密度と文のリズム** が先（180 本測定で語彙 AUC 0.998、文長均一は AI 記事の 99%）。先に経路を決め、指定ファイルだけ読む。

## 経路

| 種別 | 読む順 |
|---|---|
| 小説・物語・叙事エッセイ | `references/narrative-pass.md` → `references/discourse-pass.md` → `references/style-pass.md`。診断は `references/rubric.md` |
| リリースノート・変更履歴・告知 | `references/professional-pass.md` + `references/domains/release-notes.md` |
| PR / Issue 返信・レビューコメント | `references/professional-pass.md` + `references/domains/dev-replies.md` |
| 障害報告・ポストモーテム・RCA | `references/professional-pass.md` + `references/domains/postmortems.md` |
| チケット・作業指示・バグ報告（自分が出す側） | `references/professional-pass.md` + `references/domains/tickets.md` |
| 技術記事・ブログ・チュートリアル | `references/professional-pass.md` + `references/domains/tech-articles.md` + `references/discourse-pass.md` §1–3 |
| それ以外の散文 | `references/professional-pass.md` + `references/style-pass.md` |

非フィクションは最後に必ず `references/style-pass.md` §2–4 の語彙・構文スキャンを通す。長い実務文は style-pass 全体（フィクション用スロップ表は飛ばす）。生成元モデルが分かっていれば `references/model-fingerprints.md` を前提として足す。

経路を決めた直後に **文体を固定する**。敬体（ですます）か常体（だ・である）か、会場の直近成果物に合わせ、同一文書で混ぜない。丁寧語そのものは指紋ではない。混在が指紋である。

## 操作

依頼は次の四つに落ちる。

| 操作 | 契約 |
|---|---|
| **write** | 新規。領域ファイルを起草前に読む。構造と文体は後から安く直せない。小説は Workflow A。 |
| **review** | 診断のみ。欠陥リストを出して止まる（小説はルーブリック報告、実務はチェックリスト＋引用証拠）。直すな。 |
| **refactor** | 構造・声・意図を保つ最小改訂。欠陥リストを先に出し、深い層から一件ずつ。置換 74 / 削除 18 / 挿入 8。 |
| **recreate** | 全文書き直し。事実・主張・意図を裸のリストに抜き、捏造がないことを確認してから領域ルールで新規執筆。欠陥が構造にあり、手術より建て直しが安いときに使う。 |

refactor / recreate で欠陥リストを飛ばして言い換えると、指紋は薄まらず濃くなる（専門家検出器で測定済み）。

## 小説の手順

**A — 新規:** (1) 前提・ジャンル・分量。ジャンルが較正の目標を決める。(2) `narrative-pass.md` の設計表を埋める。(3) 人間側の手を 3–5 と、稀少手を 1 つ選ぶ。(4) アウトライン。`discourse-pass.md` の QUD と `narrative-pass.md` §2 のエコー試験。(5) 下書き。(6) `rubric.md` をグループ単位で自己診断。(7) 最後に style-pass。

**B — 既存の改訂:** (1) ルーブリック → 談話 → 文体の順で診断し、まだ直さない。(2) 構造欠陥はシーン単位の手術になる。切る前に深さを伝える。(3) 深い層から直す。(4) 変えたグループを再診断し、要所を音読し、足した転換はエコー試験する。

## 較正 — 全ルールの上に乗るルール

| 原則 | 意味 |
|---|---|
| 帯を狙え。反対極を狙うな | 人間値は中庸（時間の不連続は 2.4/5 であって 5 ではない）。AI の癖を全部反転させると、別の指紋になる。実務では会場のレジスタに合わせる。無理に崩した口語は訓練された読者を欺かない。 |
| 積まず、選べ | 人間の書き物は多様。小説は 3–5 手、前提に合わせて選び、作品ごとに変える。実務はチェックリストが実際に旗を立てた箇所だけ直す。 |
| 隙間を残せ | 普通の文、未整理の思考、地味な段落。全面を研がない。 |

## 硬い制約

- **具体を捏造しない。** 小説の固有名・ブランド・地名は実在し、正確であること。実務の版番号・数値・時刻・ベンチ・引用は実データから取る。無い情報は聞くか、明示 TODO にする。自信ありげな誤りは最上段の指紋である。
- **削除が挿入に勝つ**（置換 74 / 削除 18 / 挿入 8）。増やしてよい唯一の修正は、実在する具体である。
- **筆者と会場を先に読む。** ユーザーの過去文か、会場の直近成果物から癖を抜き、そのプロファイルへ寄せる。本人が使っている口癖は消さない。
- **台詞と引用は荷重を持つ。** 正規化するな。
- **ホワイトリストを先に見る**（`style-pass.md` 末節、`professional-pass.md` 末節）。きれいな文法、正式な場の敬語、媒体のテンプレは AI の証拠ではない。
- **英語版の検出項目を持ち込まない。** 主語欠落・コピュラ回避・`-ing` 句・Title Case・カーリー引用符・ハイフン複合語は日本語で成立しないか、符号が逆になる。詳細は `research/do-not-port.md`。
