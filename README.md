# Space Battleship

宇宙を舞台にした古典ルールの Battleship ゲーム。プレイヤー vs AI。

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

## ドキュメント

- `docs/requirements.md` — 要件定義書
- `docs/design.md` — 設計書
