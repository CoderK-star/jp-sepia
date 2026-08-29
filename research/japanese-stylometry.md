# 日本語の計量文体 — 検出できる層

英語の物語特徴と別に、日本語は形態素・助詞・句読点・文長で人間と LLM を分けられる。jp-sepia の discourse-pass §4 と style-pass の句読点規則はここから来ている。

## Zaitsu & Jin 2023

Wataru Zaitsu, Mingzhe Jin. *Distinguishing ChatGPT(-3.5, -4)-generated and human-written papers through Japanese stylometric analysis*.

機能語比率、品詞バイグラム、助詞バイグラム、読点の位置で、GPT 生成の日本語論文と人間論文を高精度に分けた（機能語比率だけで 98.1% という報告）。最も効いたのは機能語比率、次が品詞バイグラム。

実務への翻訳: 「どの内容語を使うか」より先に、「助詞と接続と句読点の置き方」が指紋になる。接続詞で段落を接着する、読点を毎文入れる、主語を毎回復元する、はここにつながる。

## Zaitsu et al. 2026（Frontiers）

六 LLM（GPT-5、Claude 3.5、Gemini、Copilot、Llama 3.1、Perplexity）が生成した日本語パブリックコメント 300 本。機能語 unigram、品詞バイグラム、句パターン。Random Forest の macro F1 は複数 LLM で 0.95–1.00。SHAP がモデル固有の機能語・品詞パターンを示す。

物語側の StoryScope 6 者帰属と同型の結論: モデルは共有の AI 領域に寄りつつ、個別の指紋を持つ。jp-sepia の `model-fingerprints.md` 日本語欄は、この系統と林・相澤を実務文へ落としたもの。

## 林・相澤 NLP2026

同一日本語プロンプトに対する複数 LLM。商用 3 クラス分類 98.2%、オープン 6 クラス 93.0%。観察:

| 系統 | 導入の癖 |
|---|---|
| ChatGPT | 丁寧な依頼を含む導入 |
| Gemini | 結論提示と番号付き構造 |
| LLM-jp | 「ステップバイステップで説明します」 |

## 文学テキスト（ANLP 2026, P9-11）

詩・歌詞・短編で人間 vs LLM。**文長のばらつき** が全形式に共通して効く。LLM は同じ長さの文を出す。詩・歌詞では感情スコアの分散も LLM が低い。短編では隣接文類似度と修飾の意味距離が効く。

discourse-pass のリズム節は、H のブログ測定とこの文学測定が同じ方向を指している、という理由で物語にも実務にも当てる。
