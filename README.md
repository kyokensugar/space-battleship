# Space Battleship

宇宙を舞台にした古典ルールの Battleship ゲーム。プレイヤー vs AI。

**遊ぶ:** https://kyokensugar.github.io/space-battleship/

## 開発の進め方

要件定義 → 設計 → 実装 → テスト → デバッグ → デプロイ → 振り返り のライフサイクルに沿って、
機能ごとに Pull Request を作成し、CI(自動テスト)が通ったものを main に取り込みます。

## 構成

| 役割 | 使用技術 |
|---|---|
| 言語 | TypeScript |
| 画面 | React |
| 開発サーバー / ビルド | Vite |
| 自動テスト | Vitest + Testing Library |
| 文法チェック | oxlint |
| CI | GitHub Actions(`.github/workflows/ci.yml`) |

```
src/
  game/   ゲームロジック(画面を知らない純粋な計算)
  ui/     画面(React コンポーネント)
  test/   テスト共通設定
```

## コマンド

| コマンド | 内容 |
|---|---|
| `npm install` | 依存ライブラリを取得 |
| `npm run dev` | 開発サーバーを起動(ブラウザで即時反映) |
| `npm test` | 自動テストを実行 |
| `npm run typecheck` | 型チェック |
| `npm run lint` | 文法チェック |
| `npm run build` | 公開用ファイルを `dist/` に生成 |

## 公開(デプロイ)

`main` に取り込まれると GitHub Actions(`.github/workflows/deploy.yml`)がビルドし、`gh-pages` ブランチ経由で GitHub Pages に自動公開します。

### PR のお試し URL(プレビュー)

PR を開くと `.github/workflows/preview.yml` が `https://kyokensugar.github.io/space-battleship/pr-<番号>/` に
その PR の内容を公開し、URL を PR にコメントします。PR の更新ごとに差し替わり、クローズ/マージで削除されます。

## ドキュメント

- `docs/requirements.md` — 要件定義書
- `docs/design.md` — 設計書

## 画像・音楽・効果音

- オープニング画像(`public/images/opening.webp`)と艦長・エイリアン司令の顔アイコン各3種(`public/images/captain-*.png`, `alien-*.png`)は Takahide Sato 提供のオリジナル。

- BGM(`public/music/`)は Takahide Sato によるオリジナル楽曲です。
  - `opening.mp3`: "Beyond the Event Horizon"(オープニング/配置/結果画面)
  - `battle.mp3`: "Battle Ostinato"(戦闘画面)
- 効果音はファイルを使わず、Web Audio API でコード合成しています(`src/audio/sounds.ts`)。
- 右上の 🔊 ボタンで BGM・効果音をまとめてミュートできます(設定は保存されます)。
