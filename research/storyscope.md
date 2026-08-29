# StoryScope — 物語層の根拠（英語コーパス）

出典: Russell, Rajendhran, Pham, Iyyer, Wieting (2026). *StoryScope: Investigating idiosyncrasies in AI fiction*. arXiv:2604.03136。UMD + Google DeepMind。taxonomy: https://github.com/jenna-russell/storyscope

## 一句

表面スタイル（語彙、ダッシュ、"delve"）を洗っても、**物語構造の選択**で AI 小説は検出される。narrative features のみ 93.2% macro-F1。LAMP 流のスタイル改写後も 93.9%。脱 AI は構造が先、表層が後。順序は逆にできない。

数値は英語短編 61,608 篇（人間 + 5 LLM、平均約 4,753 語）。日本語小説の実測ではない。jp-sepia は方向を事前の目安として使い、絶対値の一点差で切らない（`references/rubric.md`）。

## 方法の信頼

- 10,272 の writing prompt（Books3 の人間短編から逆設計）、人間 + Claude Sonnet 4.6 / GPT-5.4 / Gemini 3 Flash / DeepSeek V3.2 / Kimi K2.5。
- 物語 → NarraBench 構造テンプレ → 304 の解釈可能な物語特徴（10 次元）→ XGBoost + SHAP。
- 注釈信頼: Krippendorff's α=0.90、human–model Cohen's κ=0.84（human–human 0.74 より高い）。
- 長さ・主題・記憶汚染の ablation でも結論は動かない。
- 人間の話は物語特徴空間でより稀で、より散る。rarity percentile 0.71 vs 0.49（Cohen's d=0.83）。human–AI 重心距離は AI–AI の 1.6 倍。

## スキルに入った結論

| 層 | AI の既定 | 人間の帯 |
|---|---|---|
| テーマ | 語り手が教訓を言う。対話が哲学討論。統一度が 5 に近い | 含意。対話は欲求。統一は 4.4 付近 |
| 筋 | 副線なし、因果が一本、再生成で同じ転換 | 斜めの副線、不発の伏線、個別事情が要る転換 |
| 結び | 主人公が選び、受容し、成長する | 外部駆動、部分、開いたまま、破局、両義 |
| 時間 | 直線、開示が前倒し | 中程度の錯時、後ろ倒しの開示 |
| 感情 | 身体感覚が 81%。嗅覚と環境の鏡 | 行動と平明な命名。身体はピーク |
| 関係 | 密で全正。敵は孤立 | 疎、感情合計は中立、敵対に構造 |
| 外側 | 無名の曖昧な言及。読者を認めない | 実在の固有名。時々の傍白 |

較正の原則（sepia から継承）: 人間値は中庸である。すべての規則を最大まで当てると、humanizer 指紋になる。3–5 手と稀少手 1 つ。

関連: NarraBench (arXiv:2510.09869)、Beguš 2024 (arXiv:2310.12902)、Xu et al. PNAS 2025 (arXiv:2501.00273)、QUDsim COLM 2025 (arXiv:2504.09373)、Nonaka & Perry 2025 (arXiv:2510.18932)、Tripto et al. EMNLP 2025 (arXiv:2501.19301)。
