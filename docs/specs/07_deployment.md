# 07_deployment.md - デプロイ設計（pnpm版）

## 概要

**デプロイ先**: GitHub Pages  
**デプロイ方式**: 静的サイト（SPA）  
**パッケージマネージャー**: pnpm  
**自動化**: GitHub Actions  
**コスト**: 無料  
**ドメイン**: `https://username.github.io/coin-toss`（将来的にカスタムドメイン対応）

---

## ビルド設定

### ビルド最適化

#### 分析ツール

```bash
# バンドルサイズ分析
pnpm build --mode analyze
```

#### ファイル: `package.json`

```json
{
  "scripts": {
    "build": "vite build",
    "build:analyze": "vite build && pnpm exec vite-bundle-visualizer"
  },
  "devDependencies": {
    "vite-bundle-visualizer": "^1.0.0"
  }
}
```

---

## 環境変数管理

### .npmrc設定（pnpm用）

#### ファイル: `.npmrc`

```
# pnpm設定
shamefully-hoist=true
strict-peer-dependencies=false
```

---

## GitHub Actions設定

### デプロイワークフロー

#### ファイル: `.github/workflows/deploy.yml`

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]
  workflow_dispatch: # 手動実行を許可

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: "pages"
  cancel-in-progress: true

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup pnpm
        uses: pnpm/action-setup@v3
        with:
          version: 9

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: "pnpm"

      - name: Install dependencies
        run: pnpm install --frozen-lockfile

      - name: Type check
        run: pnpm type-check

      - name: Lint
        run: pnpm lint

      - name: Run tests
        run: pnpm test:unit

      - name: Build
        run: pnpm build
        env:
          VITE_BASE_URL: ${{ secrets.VITE_BASE_URL }}
          VITE_ADSENSE_CLIENT_ID: ${{ secrets.VITE_ADSENSE_CLIENT_ID }}
          VITE_ADSENSE_SLOT_ID: ${{ secrets.VITE_ADSENSE_SLOT_ID }}
          VITE_LIFF_ID: ${{ secrets.VITE_LIFF_ID }}

      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: ./dist

  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    needs: build
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

---

### プレビュー環境（Pull Request）

#### ファイル: `.github/workflows/preview.yml`

```yaml
name: Preview Deploy

on:
  pull_request:
    branches: [main]

jobs:
  preview:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup pnpm
        uses: pnpm/action-setup@v3
        with:
          version: 9

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: "pnpm"

      - name: Install dependencies
        run: pnpm install --frozen-lockfile

      - name: Run tests
        run: pnpm test:unit

      - name: Build
        run: pnpm build
        env:
          VITE_BASE_URL: http://localhost:5173
          VITE_ADSENSE_CLIENT_ID: ""
          VITE_ADSENSE_SLOT_ID: ""
          VITE_LIFF_ID: ""

      - name: Comment PR
        uses: actions/github-script@v7
        with:
          script: |
            github.rest.issues.createComment({
              issue_number: context.issue.number,
              owner: context.repo.owner,
              repo: context.repo.repo,
              body: '✅ ビルド成功！ローカルでプレビューを確認してください。'
            })
```

---

## デプロイ手順

### 初回デプロイ

```bash
# 1. pnpm をインストール（未インストールの場合）
npm install -g pnpm

# 2. リポジトリ作成（GitHub上）

# 3. ローカルリポジトリとリンク
git remote add origin https://github.com/username/coin-toss.git

# 4. 依存関係インストール
pnpm install

# 5. ローカルで動作確認
pnpm dev

# 6. ビルド確認
pnpm build
pnpm preview

# 7. 環境変数設定（GitHub Secrets）
# Settings > Secrets and variables > Actions

# 8. main ブランチにプッシュ
git add .
git commit -m "feat: 初回デプロイ"
git push origin main

# 9. GitHub Actions が自動実行
# Actions タブで進捗確認

# 10. デプロイ完了後、URLにアクセス
# https://username.github.io/coin-toss
```

### 更新デプロイ

```bash
# 1. 機能追加・修正
git add .
git commit -m "feat: 新機能追加"

# 2. Pull Request 作成（推奨）
git push origin feature/new-feature

# 3. PR マージ後、自動デプロイ
```

---

## ローカル開発フロー

```bash
# 開発サーバー起動
pnpm dev

# 型チェック（別ターミナル）
pnpm type-check:watch

# テスト実行（監視モード）
pnpm test

# コミット前チェック
pnpm check

# 自動修正
pnpm fix

# ビルド確認
pnpm build
pnpm preview
```

---

## トラブルシューティング

### pnpm が見つからない

```bash
# pnpm をグローバルインストール
npm install -g pnpm

# または Corepack を使用（Node.js 16.13+）
corepack enable
corepack prepare pnpm@latest --activate
```

### GitHub Actions でビルドが失敗

**原因**: lockfile の不一致

**解決策:**

```bash
# ローカルで pnpm-lock.yaml を更新
pnpm install
git add pnpm-lock.yaml
git commit -m "chore: update lockfile"
git push
```

### 依存関係の競合

```bash
# lockfile を削除して再インストール
rm pnpm-lock.yaml
pnpm install
```

### キャッシュのクリア

```bash
# pnpm のキャッシュをクリア
pnpm store prune
```

---

## pnpm の利点

### 1. ディスク容量の節約

```bash
# 従来の npm/yarn
node_modules/
├── packageA/
│   └── node_modules/
│       └── lodash/  # 重複
├── packageB/
│   └── node_modules/
│       └── lodash/  # 重複

# pnpm
node_modules/
├── .pnpm/
│   └── lodash@4.17.21/  # 1つだけ
├── packageA/ -> .pnpm/packageA/
└── packageB/ -> .pnpm/packageB/
```

**効果**: 最大で50-70%のディスク容量削減

### 2. インストール速度

| パッケージマネージャー | 初回 | キャッシュあり |
| ---------------------- | ---- | -------------- |
| npm                    | 51s  | 29s            |
| yarn                   | 39s  | 23s            |
| pnpm                   | 24s  | 11s            |

**効果**: 約2倍高速

### 3. 厳密な依存関係

```json
// package.json に記載されていない依存関係にはアクセス不可
{
  "dependencies": {
    "react": "^19.0.0"
  }
}
```

```typescript
// ❌ エラー: lodash は dependencies にない
import _ from "lodash";

// ✅ OK: react は dependencies にある
import React from "react";
```

**効果**: 隠れた依存関係によるバグを防止

---

## package.json（完全版）

```json
{
  "name": "coin-toss-game",
  "private": true,
  "version": "1.0.0",
  "type": "module",
  "packageManager": "pnpm@9.0.0",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "build:analyze": "vite build && pnpm exec vite-bundle-visualizer",

    "type-check": "tsc --noEmit",
    "type-check:watch": "tsc --noEmit --watch",

    "lint": "eslint .",
    "lint:fix": "eslint . --fix",

    "format": "prettier --write \"src/**/*.{ts,tsx,css}\"",
    "format:check": "prettier --check \"src/**/*.{ts,tsx,css}\"",

    "test": "vitest",
    "test:unit": "vitest run",
    "test:e2e": "playwright test",
    "test:e2e:ui": "playwright test --ui",
    "test:coverage": "vitest run --coverage",

    "check": "pnpm format:check && pnpm lint && pnpm type-check && pnpm test:unit",
    "fix": "pnpm format && pnpm lint:fix",

    "prepare": "husky"
  },
  "dependencies": {
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "react-router": "^7.0.0",
    "framer-motion": "^11.0.0",
    "zod": "^3.22.0",
    "@line/liff": "^2.24.0"
  },
  "devDependencies": {
    "@types/react": "^19.0.0",
    "@types/react-dom": "^19.0.0",
    "@vitejs/plugin-react": "^4.3.0",
    "vite": "^5.0.0",
    "vite-plugin-html": "^3.2.0",
    "vite-bundle-visualizer": "^1.0.0",

    "typescript": "^5.3.0",
    "@eslint/js": "^9.0.0",
    "eslint": "^9.0.0",
    "eslint-plugin-react-hooks": "^5.0.0",
    "eslint-plugin-react-refresh": "^0.4.0",
    "eslint-config-prettier": "^9.1.0",
    "typescript-eslint": "^8.0.0",
    "globals": "^15.0.0",

    "prettier": "^3.2.0",
    "prettier-plugin-tailwindcss": "^0.5.0",

    "husky": "^9.0.0",
    "lint-staged": "^15.0.0",

    "vitest": "^1.2.0",
    "@vitest/coverage-v8": "^1.2.0",
    "@testing-library/react": "^14.0.0",
    "@testing-library/user-event": "^14.5.0",
    "@playwright/test": "^1.41.0",

    "tailwindcss": "^3.4.0",
    "autoprefixer": "^10.4.0",
    "postcss": "^8.4.0"
  }
}
```

---

## .gitignore（更新）

```
# 依存関係
node_modules
.pnpm-store

# ビルド成果物
dist
dist-ssr
*.local

# テストカバレッジ
coverage
.nyc_output

# E2E テスト
playwright-report
test-results

# エディタ設定
.vscode/*
!.vscode/settings.json
!.vscode/extensions.json
.idea

# OS
.DS_Store
Thumbs.db

# 環境変数
.env
.env.local
.env.*.local

# ログ
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*
pnpm-debug.log*

# Temporary files
*.tmp
*.temp
```

---

## pnpm workspace（将来の拡張）

将来的にモノレポ構成にする場合：

### ファイル: `pnpm-workspace.yaml`

```yaml
packages:
  - "packages/*"
  - "apps/*"
```

### ディレクトリ構成例

```
coin-toss-game/
├── packages/
│   ├── ui/           # 共通UIコンポーネント
│   └── utils/        # 共通ユーティリティ
├── apps/
│   ├── web/          # Webアプリ
│   └── mobile/       # モバイルアプリ（Capacitor）
├── pnpm-workspace.yaml
└── package.json
```

**注**: Phase 1 では不要

---

## 関連ファイル

| ファイル                        | 役割                       |
| ------------------------------- | -------------------------- |
| `package.json`                  | 依存関係・スクリプト定義   |
| `pnpm-lock.yaml`                | lockfile（バージョン固定） |
| `.npmrc`                        | pnpm設定                   |
| `.github/workflows/deploy.yml`  | デプロイワークフロー       |
| `.github/workflows/preview.yml` | プレビューワークフロー     |

---

**作成日**: 2025年  
**バージョン**: 1.1（pnpm対応）
