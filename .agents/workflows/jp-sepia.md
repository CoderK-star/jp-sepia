# /jp-sepia — 日本語の脱 AI 執筆

現在の執筆タスクに jp-sepia スキルを適用する。

1. スキルの `SKILL.md` を探す。先にこのワークスペースの `.agents/skills/jp-sepia/SKILL.md`。無ければ `~/.gemini/config/skills/jp-sepia/SKILL.md`。
2. 読んでそのまま従う。種別（小説 / リリースノート / PR・Issue 返信 / 障害報告 / チケット / 技術記事 / その他）で経路を決め、ユーザーが求めた操作（write / review / refactor / recreate）を選び、経路表が指名した参照ファイルだけ読む。
3. 引数に本文かファイルパスがあればそれを対象にする。無ければ、何を・どの操作で処理するかを聞く。
