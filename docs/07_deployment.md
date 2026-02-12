# 07_deployment.md - デプロイ設計

## 概要

**デプロイ先**: GitHub Pages
**デプロイ方式**: 静的サイト（SPA）
**パッケージマネージャー**: pnpm
**自動化**: GitHub Actions
**コスト**: 無料
**ドメイン**: `https://username.github.io/coin-toss-game`（将来的にカスタムドメイン対応）

> 依存関係・スクリプト定義は `package.json` を参照。

---

## ビルド設定

```bash
pnpm build      # プロダクションビルド
pnpm preview    # ビルド結果の確認
```

> Vite ビルド設定は `vite.config.ts` を参照。

---

## 環境変数管理

### .npmrc設定（pnpm用）

> 設定は `.npmrc` を参照。

---

## GitHub Actions設定

### デプロイワークフロー（本番）

main ブランチへの push 時に自動デプロイを実行する。

1. pnpm + Node.js セットアップ（`.nvmrc` からバージョン取得）
2. `pnpm install --frozen-lockfile`
3. `pnpm build`
4. `actions/upload-pages-artifact` でビルド成果物アップロード
5. `actions/deploy-pages` でデプロイ

> ワークフロー設定は `.github/workflows/deploy.yml` を参照。

### CIワークフロー（Pull Request）

PR時にフォーマットチェック・lint・型チェック・単体テストを自動実行する。

> ワークフロー設定は `.github/workflows/ci.yml` を参照。詳細は `06_testing.md` も参照。

---

## デプロイ手順

### 初回デプロイ

1. GitHubにリポジトリを作成
2. `pnpm install` で依存関係をインストール
3. `pnpm dev` でローカル動作確認
4. `pnpm build && pnpm preview` でビルド確認
5. GitHub Secrets に環境変数を設定（Settings > Secrets and variables > Actions）
6. main ブランチにプッシュ → GitHub Actions が自動実行
7. デプロイ完了後 `https://username.github.io/coin-toss-game` にアクセス

### 更新デプロイ

1. feature ブランチで変更・コミット
2. Pull Request 作成 → CI が自動実行
3. PR マージ後、自動デプロイ

---

## ローカル開発フロー

```bash
pnpm dev                # 開発サーバー起動
pnpm type-check:watch   # 型チェック（別ターミナル）
pnpm test               # テスト実行（監視モード）
pnpm check              # コミット前チェック
pnpm fix                # 自動修正
pnpm build && pnpm preview  # ビルド確認
```

---

## トラブルシューティング

### pnpm が見つからない

```bash
npm install -g pnpm
# または Corepack を使用（Node.js 16.13+）
corepack enable
```

### GitHub Actions でビルドが失敗

**原因**: lockfile の不一致

```bash
pnpm install
git add pnpm-lock.yaml
git commit -m "chore: update lockfile"
git push
```

### 依存関係の競合

```bash
rm pnpm-lock.yaml
pnpm install
```

### キャッシュのクリア

```bash
pnpm store prune
```

---

## pnpm の利点

1. **ディスク容量の節約**: Content-addressable store で重複排除（最大50-70%削減）
2. **インストール速度**: npm比で約2倍高速
3. **厳密な依存関係**: `package.json` に未記載の依存関係にはアクセス不可（隠れた依存関係によるバグを防止）

---

## 将来の拡張

### pnpm workspace（モノレポ）

Phase 3 でネイティブアプリを追加する場合、`pnpm-workspace.yaml` でモノレポ構成が可能。

```
coin-toss-game/
├── packages/
│   ├── ui/           # 共通UIコンポーネント
│   └── utils/        # 共通ユーティリティ
├── apps/
│   ├── web/          # Webアプリ
│   └── mobile/       # モバイルアプリ（Capacitor）
└── pnpm-workspace.yaml
```

**注**: Phase 1 では不要。

---

## 関連ファイル

| ファイル                       | 役割                       |
| ------------------------------ | -------------------------- |
| `package.json`                 | 依存関係・スクリプト定義   |
| `pnpm-lock.yaml`               | lockfile（バージョン固定） |
| `.npmrc`                       | pnpm設定                   |
| `.nvmrc`                       | Node.jsバージョン指定      |
| `.gitignore`                   | Git除外設定                |
| `vite.config.ts`               | ビルド設定                 |
| `.github/workflows/deploy.yml` | デプロイワークフロー       |
| `.github/workflows/ci.yml`     | CIワークフロー（PR時）     |

---

**作成日**: 2025年
**バージョン**: 2.0
