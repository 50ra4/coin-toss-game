# 03_database.md - データベース設計

## 概要

**データストア**: ブラウザ LocalStorage
**バリデーション**: Zod
**キー**: `coinTossGame`
**容量制限**: 5-10MB（LocalStorage標準）
**同期**: なし（デバイスローカルのみ）

---

## データ構造

### 全体スキーマ

```json
{
  "coinTossGame": {
    "topScores": {
      "tenRounds": [{ "score": 10 }, { "score": 9 }, { "score": 8 }],
      "survival": [{ "score": 25 }, { "score": 20 }, { "score": 15 }]
    },
    "preferences": {
      "darkMode": false,
      "soundEnabled": true
    }
  }
}
```

### Zod スキーマ定義

> 実装は `src/features/storage/storage.schema.ts` を参照。

- `TopScoreItemSchema`: スコア（0以上の整数）
- `PreferencesSchema`: ダークモード・サウンド設定（デフォルト値付き）
- `StorageDataSchema`: 全体スキーマ（topScores + preferences）
- `defaultStorageData`: 初期値（`as const satisfies StorageData`）

---

## データ項目詳細

### 1. topScores（トップスコアランキング）

| フィールド | 型     | 必須 | 説明                  |
| ---------- | ------ | ---- | --------------------- |
| score      | number | Yes  | スコア（0以上の整数） |

**制約:**

- 各モードごとに最大3件まで保存
- スコア降順でソート
- 同点の場合は古いものを削除

### 2. preferences（ユーザー設定）

| フィールド   | 型      | 必須 | デフォルト | 説明                  |
| ------------ | ------- | ---- | ---------- | --------------------- |
| darkMode     | boolean | Yes  | false      | ダークモード有効/無効 |
| soundEnabled | boolean | Yes  | true       | 効果音の有効/無効     |

---

## データ操作ロジック

> 実装は `src/features/storage/storageOperations.ts` を参照。

### ベストスコア取得

指定モードの topScores から最大値を返す。データがない場合は 0。

### トップスコア更新

1. 現在のスコア配列に新スコアを追加
2. 降順ソート
3. 上位3件のみ保持
4. 新記録かどうかを判定（トップ3に入ったか）
5. 戻り値: `{ data, isNewRecord, rank }`

### データ検証・復元

- **読み込み**: `localStorage.getItem()` → `JSON.parse()` → `StorageDataSchema.parse()` → 使用
- **保存**: `StorageDataSchema.parse()` → `JSON.stringify()` → `localStorage.setItem()`
- **失敗時**: `defaultStorageData` にフォールバック

> フック実装は `src/features/storage/useGameStorage.ts` を参照。

---

## データ移行戦略

### Phase 1（初期リリース）

- **方針**: バージョン管理なし
- **理由**: シンプルさ優先、Zodのデフォルト値で吸収
- **破損時**: デフォルト値にフォールバック

### 将来の拡張時

- Zodの `default([])` により、既存ユーザーのデータも自動補完
- 手動マイグレーション不要

---

## エラーハンドリング

### 1. LocalStorage 容量超過

- **原因**: ストレージ容量不足
- **対策**: `QuotaExceededError` を catch。現状の設計では3件制限のため発生しにくい

### 2. データ破損

- **原因**: 不正なJSON、スキーマ不一致
- **対策**: Zodバリデーション失敗時は `defaultStorageData` を返す

### 3. プライベートブラウジング

- **原因**: 一部ブラウザでLocalStorageが制限される
- **対策**: `isLocalStorageAvailable()` で事前チェック。利用不可の場合はインメモリストアにフォールバック

---

## パフォーマンス考慮

### 読み込み頻度

- **初回ロード時**: 1回のみ
- **ゲーム中**: 読み込みなし（メモリ上で管理）
- **ゲーム終了時**: 1回のみ保存

### データサイズ

- **想定サイズ**: 約500バイト
- **容量制限**: 5MB（LocalStorage標準）
- **余裕**: 10,000倍以上

---

## セキュリティ

### 保存データ

- **センシティブ情報なし**: スコアと設定のみ
- **暗号化不要**: 公開されても問題ない情報
- **XSS対策**: React のデフォルト挙動（エスケープ処理）

### データ改ざん

- **対策なし**: ローカルストレージは改ざん可能
- **許容理由**:
  - グローバルランキングなし
  - 他ユーザーに影響なし
  - SNSシェア時もローカルデータのみ参照

---

## 関連ファイル

| ファイル                                    | 役割                                                |
| ------------------------------------------- | --------------------------------------------------- |
| `src/features/storage/storage.schema.ts`    | Zod スキーマ定義                                    |
| `src/features/storage/useGameStorage.ts`    | LocalStorage 操作カスタムフック                     |
| `src/features/storage/storageOperations.ts` | データ操作ロジック（getBestScore, updateTopScores） |
| `src/features/result/result.schema.ts`      | 結果データスキーマ（スコア更新時）                  |

---

## 補足

- **バックアップ機能**: Phase 1では不要（将来検討）
- **クラウド同期**: Phase 1では不要（将来検討）
- **GDPR対応**: 個人情報を保存しないため対象外

---

**作成日**: 2025年
**バージョン**: 2.0
