# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

常に日本語で回答してください。

## プロジェクト概要

コイントス予想ゲーム — React 19 + Vite + TypeScript の静的SPA。バックエンドなし、LocalStorageのみでデータ永続化。GitHub Pagesにデプロイ。

## 開発コマンド

```bash
pnpm dev               # 開発サーバー起動
pnpm build             # プロダクションビルド
pnpm preview           # ビルド結果プレビュー

pnpm test              # テスト(watchモード)
pnpm test:unit         # テスト(単発実行)
pnpm test:coverage     # カバレッジ付きテスト
pnpm test:e2e          # Playwright E2Eテスト
pnpm test:e2e:ui       # E2E(UIモード)

pnpm lint              # ESLintチェック
pnpm lint:fix          # ESLint自動修正
pnpm format:check      # Prettierチェック
pnpm format            # Prettier自動整形
pnpm type-check        # TypeScript型チェック
pnpm check             # 全チェック一括実行(format + lint + type + tests)
```

## アーキテクチャ

### 定数とスキーマ

- **`consts/`** — アプリ全体の定数（`as const` オブジェクトマップ + `typeof` 派生型）
- Zodスキーマは `consts/` の定数から派生させる。型取得は `z.output` を使用（`z.infer` ではなく）
- 定数オブジェクトのexportは `as const satisfies Type` で不変性と型チェックを両立

### コンポーネント設計（3層分離）

- **`components/`** — Pure Components: propsのみ受け取る純粋なUI部品。hooks禁止
- **`features/`** — Feature Components: ドメイン固有のロジックをcustom hooksで持つ
- **`pages/`** — Page Components: ルーティングとページレベルの状態管理

データフロー: `Page (useState) → Custom Hooks (ロジック) → Feature → Pure UI`

### ルーティング（React Router v7）

- `/` — ホーム（モード選択）
- `/game/:mode` — ゲーム画面（tenRounds | survival）
- `/result` — 結果画面（SNSシェア）
- basename: `/coin-toss`（GitHub Pages用）
- 画面間のデータ受け渡しは location state 経由

### データ永続化

- LocalStorage + Zod スキーマによるランタイムバリデーション
- 不正データ/破損データ時はデフォルト値にフォールバック

### 外部連携

- LINE LIFF SDK: LINE内ブラウザ時のみ遅延読み込み
- SNSシェア: LINE / X / Threads（Web Intent URL + Web Share API フォールバック）
- Google AdSense: 結果画面に表示

## コーディング規約

### TypeScript

- `any` 禁止、`enum` 禁止（`as const` オブジェクトマップを使う）
- 型推論を活かす（自明な型注釈は書かない）
- 型のインポートは `import type` を使用
- 未使用変数は `_` プレフィックス
- 配列のインデックスアクセスは `Array.at()` を使用（`arr[0]` ではなく `arr.at(0)`）
- 1行で return する関数はブラケットなしのアロー関数にする
- import は `@/` 絶対パスを使用（`../../` 相対パスではなく）

### React

- `useEffect` は極力使わない（イベントハンドラやuseMemoで代替）
- custom hooks でビジネスロジックを分離
- コンポーネントは `function` 宣言（アロー関数ではなく）
- オブジェクトや関数をインラインでpropsに渡さない（毎レンダリングで新参照が生成される）
  - 状態に依存しないものはモジュールレベルの定数に抽出
  - propsを持たないコンポーネントは `React.memo` で囲む
- インラインスタイル禁止（Tailwindクラスのみ使用）

### スタイリング

- Tailwind CSS（`prettier-plugin-tailwindcss` でクラス自動ソート）
- ダークモードデフォルト（カジノ風テーマ: ゴールド #d4af37 / ダークグリーン #1b5e20）

### Git

- Conventional Commits 形式（`feat:`, `fix:`, `docs:` 等）
- Husky + lint-staged でコミット時に自動チェック

## 仕様書

詳細な仕様は `docs/specs/` 配下の8ファイルを参照:
- `01_requirements.md` — 要件定義
- `02_architecture.md` — アーキテクチャ設計（Zodスキーマ定義、アニメーション仕様含む）
- `03_database.md` — LocalStorageデータ設計
- `04_api.md` — 外部API連携（SNS/AdSense/LIFF）
- `05_sitemap.md` — 画面設計・ワイヤーフレーム
- `06_testing.md` — テスト戦略・CI/CD
- `07_deployment.md` — デプロイ設定（GitHub Pages + pnpm）
- `08_coding_standards.md` — コーディング規約詳細
