# 出典

スキル本文はここを要約して使う。一次文献へ戻るときはこのリストから。

## 物語構造（sepia から継承。英語コーパス）

- Russell et al., 2026. *StoryScope*. arXiv:2604.03136
- Hamilton, Wilkens & Piper, 2025. *NarraBench*. arXiv:2510.09869
- Beguš, 2024. *Experimental Narratives*. arXiv:2310.12902
- Xu et al., 2025. *Echoes in AI*. PNAS / arXiv:2501.00273
- Namuduri et al., 2025. *QUDsim*. COLM / arXiv:2504.09373
- Tripto et al., 2025. *Beyond Checkmate*. EMNLP / arXiv:2501.19301
- Nonaka & Perry, 2025. arXiv:2510.18932
- Chakrabarty, Ginsburg & Dhillon, 2026. arXiv:2510.13939

## 英語の表層・編集（操作比率とスロップ次元）

- Chakrabarty, Laban, Wu, 2025. *LAMP*. CHI / arXiv:2409.14509 — 置換 74 / 削除 18 / 挿入 8
- Shaib et al., 2025. *Measuring AI Slop*. arXiv:2509.19163
- Reinhart et al., 2025. PNAS / arXiv:2410.16107 — ジャンル不一致が表層 AI っぽさの半分
- Russell et al., 2025. ACL / arXiv:2501.15654
- Wikipedia: *Signs of AI writing*（WikiProject AI Cleanup）

## 日本語の計量と表層

- Zaitsu & Jin, 2023. 日本語論文のスタイロメトリ。機能語比率・品詞バイグラム
- Zaitsu et al., 2026. *Detecting LLM fingerprint for Japanese texts*. Frontiers in Artificial Intelligence
- 林美佐・相澤彰子, 2026. 「LLM による日本語生成におけるモデル固有表現パターンの分析」言語処理学会年次大会
- ANLP 2026 P9-11. 詩・歌詞・短編の人間 vs LLM。文長のばらつきが共通
- yourbright-jp/humanizer-jp, 2026. 人間 1,105 × Claude 1,105。文長均一が 99%
- kenimo49, 2026. 6 モデル 180 本。語彙実測と英語 35 パターンの日本語仕分け
  - https://zenn.dev/kenimo49/articles/ai-slop-skill-35-patterns-japanese-port
  - https://kenimoto.dev/ja/blog/ukibori-zero-in-180-ai-vocabulary-measured/
- Rapls, 2026. 日本語 31 パターンの三層。https://zenn.dev/rapls/articles/f7081e0808728a

## 設計の親

- Nanako Tsai, *sepia*. https://github.com/Nanako0129/sepia — 三パス、四操作、人間分布への較正、領域ルーティング
