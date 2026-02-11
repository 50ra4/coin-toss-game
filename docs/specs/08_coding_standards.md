# 08_coding_standards.md - コーディング規約

## 概要

**対象**: TypeScript + React 19 + Tailwind CSS  
**方針**: 個人開発向け、保守性重視、公式ベストプラクティス準拠  
**更新日**: 2025年

---

## 基本原則

### 1. シンプルさ優先

- 過度な抽象化を避ける
- 読みやすさ > 短いコード
- 明示的 > 暗黙的

### 2. 型安全性の確保

- `any` 型の使用禁止
- 可能な限り型推論を活用
- Zod でランタイムバリデーション

### 3. 保守性の確保

- 単一責任の原則
- Pure Component の徹底
- 副作用の分離

---

## TypeScript コーディング規約

### 命名規則

#### ファイル名

```typescript
// ✅ 良い例
components / Button / Button.tsx;
components / Button / Button.test.tsx;
features / game / CoinFlip3D / CoinFlip3D.tsx;

// ❌ 悪い例
components / Button / index.tsx; // 検索性が低い
components / button.tsx; // パスカルケースを使う
```

#### 変数・関数名

```typescript
// ✅ 良い例: キャメルケース
const gameMode = "tenRounds";
const currentScore = 10;
const calculateScore = () => {};

// ❌ 悪い例
const game_mode = "tenRounds"; // スネークケース不可
const GameMode = "tenRounds"; // 変数は小文字始まり
```

#### 型・インターフェース名

```typescript
// ✅ 良い例: パスカルケース
type GameMode = "tenRounds" | "survival";
interface GameState {
  score: number;
}

// ❌ 悪い例
type gameMode = "tenRounds" | "survival"; // 小文字始まり不可
interface IGameState {} // Iプレフィックス不要
```

#### 定数名

```typescript
// ✅ 良い例: UPPER_SNAKE_CASE（グローバル定数）
const MAX_SCORE = 100;
const STORAGE_KEY = "coinTossGame";

// ✅ 良い例: キャメルケース（ローカル定数）
const defaultStorageData = {
  /* ... */
};

// ✅ 良い例: as const でリテラル型
const MODE_NAMES = {
  tenRounds: "10回モード",
  survival: "サバイバルモード",
} as const;
```

#### コンポーネント名

```typescript
// ✅ 良い例: パスカルケース、function宣言
export function Button() {}
export function CoinFlip3D() {}

// ❌ 悪い例
export const button = () => {}; // 小文字始まり不可
export const Button = () => {}; // コンポーネントはfunctionを使用
export default function Button() {} // named export を優先
```

---

### 関数定義

#### 通常の関数（アロー関数）

```typescript
// ✅ 良い例: const + アロー関数
export const calculateScore = (mode: GameMode, correct: number): number => {
  return mode === "tenRounds" ? correct : correct;
};

export const generateCoinFlip = (): CoinSide => {
  return Math.random() < 0.5 ? "heads" : "tails";
};

// ❌ 悪い例: function宣言
export function calculateScore(mode: GameMode, correct: number): number {
  return mode === "tenRounds" ? correct : correct;
}
```

#### React コンポーネント（function宣言）

```typescript
// ✅ 良い例: function宣言
export function Button({ label, onClick }: ButtonProps) {
  return <button onClick={onClick}>{label}</button>;
}

export function GamePage() {
  const { gameState } = useGameLogic();
  return <div>{/* ... */}</div>;
}

// ❌ 悪い例: アロー関数
export const Button = ({ label, onClick }: ButtonProps) => {
  return <button onClick={onClick}>{label}</button>;
};
```

#### 例外: オーバーライドが必要な場合

```typescript
// ✅ 良い例: Array.prototype の拡張など
declare global {
  interface Array<T> {
    customMethod(): T[];
  }
}

Array.prototype.customMethod = function <T>(this: T[]): T[] {
  return this; // thisのバインドが必要
};
```

---

### 型定義

#### Literal Union 型の活用

```typescript
// ✅ 良い例: Literal Union 型
type GameMode = "tenRounds" | "survival";
type CoinSide = "heads" | "tails";

// ❌ 悪い例: string 型
type GameMode = string; // 型安全性が低い
```

#### enum の禁止、オブジェクトマップを使用

```typescript
// ❌ 禁止: enum
enum GameMode {
  TenRounds = "tenRounds",
  Survival = "survival",
}

// ✅ 良い例: オブジェクトマップ + as const
const GAME_MODES = {
  tenRounds: "tenRounds",
  survival: "survival",
} as const;

type GameMode = (typeof GAME_MODES)[keyof typeof GAME_MODES];

// ✅ 良い例: より実用的なパターン
const MODE_NAMES = {
  tenRounds: "10回モード",
  survival: "サバイバルモード",
} as const;

type GameMode = keyof typeof MODE_NAMES;

// 使用例
const modeName = MODE_NAMES[mode];
```

#### 定数の定義場所

- アプリ全体で共有する定数は `src/consts/` 配下にファイルを作成して配置する
- `as const` で不変にし、型は `typeof` から派生させる

#### Zod スキーマとの連携

```typescript
// ✅ 良い例: 定数（src/consts/）から Zod スキーマを派生させる
import { GAME_MODES } from "../../consts/game";

const gameModeValues = Object.values(GAME_MODES) as [string, ...string[]];
export const GameModeSchema = z.enum(gameModeValues);

// 型は z.output で取得（z.infer ではなく z.output を使用）
export type GameState = z.output<typeof GameStateSchema>;
```

#### 定数オブジェクトの不変性

```typescript
// ✅ 良い例: as const satisfies で型チェック + 不変性を両立
export const defaultStorageData = {
  topScores: { tenRounds: [], survival: [] },
  preferences: { darkMode: false, soundEnabled: true },
} as const satisfies StorageData;
```

#### オプショナル型の表現

```typescript
// ✅ 良い例: ? 演算子
type Props = {
  title: string;
  subtitle?: string; // undefined を許容
};

// ✅ 良い例: null 許容（明示的な「値なし」）
type GameState = {
  coinResult: CoinSide | null;
};

// ❌ 悪い例: undefined と null の混在
type GameState = {
  coinResult: CoinSide | null | undefined; // 混乱を招く
};
```

#### 関数の型定義

```typescript
// ✅ 良い例: アロー関数型
type OnClick = (event: React.MouseEvent) => void;

// ✅ 良い例: 戻り値の型を明示
export const calculateScore = (mode: GameMode, correct: number): number => {
  return mode === "tenRounds" ? correct : correct;
};

// ❌ 悪い例: 戻り値の型省略（複雑な関数）
export const complexCalculation = (a: number, b: number) => {
  // 戻り値の型を明示
  return a + b * 2;
};
```

---

### イミュータブル操作

#### 配列操作

```typescript
// ✅ 良い例: イミュータブルメソッド
const sorted = scores.toSorted((a, b) => b - a);
const reversed = items.toReversed();
const sliced = items.toSpliced(0, 1, newItem);

// ❌ 悪い例: ミューテーション
scores.sort((a, b) => b - a); // 元の配列を変更
items.reverse();
```

#### オブジェクト操作

```typescript
// ✅ 良い例: スプレッド構文
const updated = { ...state, score: state.score + 1 };

// ✅ 良い例: Object.assign（新しいオブジェクト）
const updated = Object.assign({}, state, { score: state.score + 1 });

// ❌ 悪い例: 直接変更
state.score += 1; // 元のオブジェクトを変更
```

#### ネストしたオブジェクトの更新

```typescript
// ✅ 良い例
const updated = {
  ...data,
  topScores: {
    ...data.topScores,
    tenRounds: [...data.topScores.tenRounds, newScore],
  },
};

// ❌ 悪い例
data.topScores.tenRounds.push(newScore); // ミューテーション
```

---

### 制御構文

#### 早期リターン（else 句を避ける）

```typescript
// ✅ 良い例: 1行で完結する場合はブラケットなしアロー関数
export const getBestScore = (data: StorageData, mode: GameMode): number =>
  Math.max(0, ...data.topScores[mode].map((item) => item.score));

// ✅ 良い例: 早期リターンで else を避ける
export const getLabel = (score: number): string => {
  if (score === 0) return "未プレイ";
  return `${String(score)}点`;
};

// ❌ 悪い例: else 句
export const getLabel = (score: number): string => {
  if (score === 0) {
    return "未プレイ";
  } else {
    return `${String(score)}点`;
  }
};
```

#### 配列のインデックスアクセス

```typescript
// ✅ 良い例: Array.at() を使用
const first = scores.at(0);
const last = scores.at(-1);

// ❌ 悪い例: ブラケットによるインデックスアクセス
const first = scores[0];
const last = scores[scores.length - 1];
```

#### Literal Union 型の分岐

```typescript
// ✅ 良い例: オブジェクトマップ
const MODE_NAMES = {
  tenRounds: "10回モード",
  survival: "サバイバルモード",
} as const;

const modeName = MODE_NAMES[mode];

// ❌ 悪い例: if-else チェーン
let modeName: string;
if (mode === "tenRounds") {
  modeName = "10回モード";
} else if (mode === "survival") {
  modeName = "サバイバルモード";
}
```

#### 三項演算子の使用

```typescript
// ✅ 良い例: シンプルな条件
const label = isCorrect ? "正解" : "不正解";

// ✅ 良い例: JSX での条件レンダリング
{isNewRecord && <NewRecordAnimation />}

// ❌ 悪い例: ネストした三項演算子
const label = isCorrect
  ? score > 10
    ? "素晴らしい"
    : "良い"
  : "残念";  // 読みにくい
```

---

### エラーハンドリング

#### 基本パターン

```typescript
// ✅ 良い例: try-catch
export const loadStorageData = (): StorageData => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultStorageData;

    const parsed = JSON.parse(raw);
    const validated = StorageDataSchema.parse(parsed);
    return validated;
  } catch (error) {
    console.error("LocalStorage データ読み込みエラー:", error);
    return defaultStorageData;
  }
};
```

#### エラーログの出力

```typescript
// ✅ 良い例: 構造化ログ
console.error("データ保存エラー:", {
  key: STORAGE_KEY,
  error: error instanceof Error ? error.message : String(error),
});

// ❌ 悪い例: 情報不足
console.error("エラー"); // 何のエラーか不明
```

#### エラーの再スロー

```typescript
// ✅ 良い例: 必要な場合のみ再スロー
export const saveStorageData = (data: StorageData): void => {
  try {
    const validated = StorageDataSchema.parse(data);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(validated));
  } catch (error) {
    console.error("保存データが不正です:", error);
    throw error; // 呼び出し側でハンドリング
  }
};
```

---

### Async/Await

```typescript
// ✅ 良い例: async/await
export const shareToLine = async (text: string): Promise<void> => {
  if (!liff.isInClient()) {
    await shareViaWebShareAPI(text);
    return;
  }

  try {
    await liff.shareTargetPicker([{ type: "text", text }]);
  } catch (error) {
    console.error("LINEシェアエラー:", error);
    throw error;
  }
};

// ❌ 悪い例: Promise チェーン
export const shareToLine = (text: string): Promise<void> => {
  return liff.shareTargetPicker([{ type: "text", text }]).catch((error) => {
    console.error("LINEシェアエラー:", error);
    throw error;
  });
};
```

---

## React コーディング規約

### コンポーネント設計

#### Pure Component（`components/`）

```typescript
// ✅ 良い例: 状態なし、副作用なし、function宣言
type Props = {
  label: string;
  onClick: () => void;
  disabled?: boolean;
};

export function Button({ label, onClick, disabled = false }: Props) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="coin-btn"
    >
      {label}
    </button>
  );
}

// ❌ 悪い例: useState を使用
export function Button({ label, onClick }: Props) {
  const [clicked, setClicked] = useState(false);  // Pure Component で状態を持たない
  // ...
}

// ❌ 悪い例: アロー関数
export const Button = ({ label, onClick }: Props) => {
  return <button onClick={onClick}>{label}</button>;
};
```

#### Feature Component（`features/`）

```typescript
// ✅ 良い例: カスタムフックでロジックを分離、function宣言
export function CoinFlip3D() {
  const { coinResult, isFlipping } = useCoinFlip();
  const { playSound } = useSound();

  // useEffectは最終手段（このケースは必要）
  useEffect(() => {
    if (coinResult) {
      playSound("coinFlip");
    }
  }, [coinResult, playSound]);

  return (
    <motion.div animate={{ rotateY: isFlipping ? 1800 : 0 }}>
      {/* コインビジュアル */}
    </motion.div>
  );
}
```

#### Page Component（`pages/`）

```typescript
// ✅ 良い例: 状態管理と子コンポーネントへの props 配布
export function GamePage() {
  const { mode } = useParams<{ mode: GameMode }>();
  const { gameState, predict, reset } = useGameLogic(mode);
  const navigate = useNavigate();

  const handleGameEnd = (result: GameResult) => {
    navigate("/result", { state: result });
  };

  return (
    <div className="game-container">
      <ScoreDisplay score={gameState.score} />
      <CoinFlip3D result={gameState.coinResult} />
      <PredictionButton onPredict={predict} disabled={!gameState.isPlaying} />
    </div>
  );
}
```

---

### Hooks の使用

#### useState

```typescript
// ✅ 良い例: 初期値の型推論
const [score, setScore] = useState(0); // number 型
const [mode, setMode] = useState<GameMode>("tenRounds"); // 明示的な型

// ✅ 良い例: 関数型更新
setScore((prev) => prev + 1);

// ❌ 悪い例: 直接更新（prevが必要な場合）
setScore(score + 1); // クロージャの罠
```

#### useEffect - 原則禁止、最終手段

```typescript
// ⚠️ 使用は最終手段: 副作用の同期が必須の場合のみ許可
// 例: 外部APIとの同期、DOM操作、サブスクリプション

// ✅ 許容される例: 外部ライブラリとの統合
useEffect(() => {
  if (gameState.coinResult) {
    playSound("coinFlip"); // Web Audio API の呼び出し
  }
}, [gameState.coinResult, playSound]);

// ✅ 許容される例: クリーンアップが必要
useEffect(() => {
  const timer = setTimeout(() => {
    navigate("/result");
  }, 2000);

  return () => clearTimeout(timer);
}, [navigate]);

// ❌ 避けるべき: 状態の派生計算
useEffect(() => {
  setTotalScore(score + bonus); // 代わりに useMemo を使用
}, [score, bonus]);

// ✅ 改善: useMemo で置き換え
const totalScore = useMemo(() => score + bonus, [score, bonus]);

// ❌ 避けるべき: イベントハンドラで十分な場合
useEffect(() => {
  if (isGameEnd) {
    navigate("/result");
  }
}, [isGameEnd, navigate]);

// ✅ 改善: イベントハンドラで処理
const handleGameEnd = () => {
  navigate("/result");
};
```

#### useEffect を避けるパターン

```typescript
// パターン1: 派生状態 → useMemo
// ❌
const [filteredItems, setFilteredItems] = useState([]);
useEffect(() => {
  setFilteredItems(items.filter((item) => item.active));
}, [items]);

// ✅
const filteredItems = useMemo(
  () => items.filter((item) => item.active),
  [items],
);

// パターン2: イベント駆動 → イベントハンドラ
// ❌
useEffect(() => {
  if (shouldSubmit) {
    submitForm();
  }
}, [shouldSubmit]);

// ✅
const handleSubmit = () => {
  submitForm();
};

// パターン3: 初期化 → 直接実行
// ❌
useEffect(() => {
  setData(loadInitialData());
}, []);

// ✅
const [data] = useState(() => loadInitialData());
```

#### useCallback / useMemo

```typescript
// ✅ 良い例: 子コンポーネントに渡す関数
const handlePredict = useCallback((side: CoinSide) => {
  setPrediction(side);
}, []);

// ✅ 良い例: 重い計算のメモ化
const sortedScores = useMemo(() => {
  return scores.toSorted((a, b) => b - a);
}, [scores]);

// ❌ 悪い例: 不要なメモ化
const label = useMemo(() => "ボタン", []); // 単純な文字列は不要
```

#### カスタムフック

```typescript
// ✅ 良い例: use プレフィックス、単一責任
export const useGameStorage = () => {
  const [data, setData] = useState<StorageData>(loadStorageData);

  const updateTopScores = useCallback((mode: GameMode, score: number) => {
    setData((prev) => {
      const result = updateTopScoresLogic(prev, mode, score);
      saveStorageData(result.data);
      return result.data;
    });
  }, []);

  return { data, updateTopScores };
};

// ❌ 悪い例: 複数の責任
export const useGame = () => {
  // ゲームロジック、ストレージ、サウンドが混在
};
```

---

### Props の型定義

```typescript
// ✅ 良い例: type エイリアス
type ButtonProps = {
  label: string;
  onClick: () => void;
  variant?: "primary" | "secondary";
  disabled?: boolean;
};

export function Button({
  label,
  onClick,
  variant = "primary",
  disabled = false,
}: ButtonProps) {
  // ...
}

// ✅ 良い例: children の型
type CardProps = {
  title: string;
  children: React.ReactNode;
};

// ❌ 悪い例: インターフェース（type を優先）
interface ButtonProps {
  // type を使う
  label: string;
}
```

---

### イベントハンドラ

```typescript
// ✅ 良い例: 適切な型定義、アロー関数
const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
  event.preventDefault();
  onClick();
};

// ✅ 良い例: 引数なしの場合
const handleReset = () => {
  setScore(0);
};

// ❌ 悪い例: any 型
const handleClick = (event: any) => {
  // 型を明示
  // ...
};
```

---

### 条件付きレンダリング

```typescript
// ✅ 良い例: && 演算子（true の場合のみ）
{isNewRecord && <NewRecordAnimation rank={rank} />}

// ✅ 良い例: 三項演算子（true/false 両方）
{isCorrect ? <CorrectIcon /> : <IncorrectIcon />}

// ✅ 良い例: 早期リターン
if (!result) {
  return <Navigate to="/" replace />;
}

return <ResultDisplay result={result} />;

// ❌ 悪い例: 三項演算子の null
{isNewRecord ? <NewRecordAnimation /> : null}  // && を使う
```

---

### リストのレンダリング

```typescript
// ✅ 良い例: 安定した key
{topScores.map((item, index) => (
  <ScoreItem key={`${item.score}-${index}`} score={item.score} rank={index + 1} />
))}

// ✅ 良い例: 一意なIDがある場合
{items.map((item) => (
  <Item key={item.id} {...item} />
))}

// ❌ 悪い例: index のみを key に使用（並び替えがある場合）
{items.map((item, index) => (
  <Item key={index} {...item} />  // 並び替え時に問題
))}
```

---

## Tailwind CSS コーディング規約

### 基本方針

```typescript
// ✅ 良い例: Tailwind のユーティリティクラス優先
<button className="px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg">
  クリック
</button>

// ❌ 悪い例: カスタムCSSを多用
<button className="custom-button">  // Tailwind で表現できる
  クリック
</button>
```

---

### クラス名の順序

```typescript
// ✅ 良い例: 機能別にグループ化
<div className="
  // レイアウト
  flex items-center justify-between
  // スペーシング
  p-4 gap-2
  // サイズ
  w-full h-12
  // 背景・ボーダー
  bg-white dark:bg-gray-800 border border-gray-200 rounded-lg
  // テキスト
  text-lg font-bold text-gray-900 dark:text-white
  // エフェクト
  shadow-md hover:shadow-lg
  // トランジション
  transition-all duration-300
">
  コンテンツ
</div>

// ❌ 悪い例: ランダムな順序
<div className="text-lg bg-white p-4 hover:shadow-lg w-full transition-all">
  コンテンツ
</div>
```

---

### レスポンシブ対応

```typescript
// ✅ 良い例: モバイルファースト
<div className="
  grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3
  gap-4 md:gap-6 lg:gap-8
  p-4 md:p-6 lg:p-8
">
  {/* コンテンツ */}
</div>

// ❌ 悪い例: デスクトップファースト
<div className="lg:grid-cols-3 md:grid-cols-2 grid-cols-1">
  {/* 読みにくい */}
</div>
```

---

### ダークモード対応

```typescript
// ✅ 良い例: dark: プレフィックス
<div className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white">
  コンテンツ
</div>

// ✅ 良い例: カスタムクラスでの対応（複雑な場合）
// globals.css
.coin-card {
  @apply bg-gray-100 dark:bg-gray-800;
  @apply border border-gray-200 dark:border-gray-700;
  transition: all 0.3s ease;
}
```

---

### カスタムクラスの定義

```css
/* globals.css */

/* ✅ 良い例: Tailwind で表現できないもののみ */
@keyframes coin-flip {
  0% {
    transform: rotateY(0deg);
  }
  100% {
    transform: rotateY(1800deg);
  }
}

.coin-flip-animation {
  animation: coin-flip 2s ease-in-out;
  transform-style: preserve-3d;
}

.coin-glow-gold {
  box-shadow:
    0 0 20px rgba(212, 175, 55, 0.3),
    0 0 40px rgba(212, 175, 55, 0.2);
}

/* ❌ 悪い例: Tailwind で表現できるもの */
.my-button {
  padding: 1rem;
  background-color: blue;
  border-radius: 0.5rem;
}
/* → className="px-4 py-2 bg-blue-500 rounded-lg" で十分 */
```

---

### カスタムクラスの命名規則

```css
/* ✅ 良い例: coin- プレフィックス + ケバブケース */
.coin-flip-animation
.coin-glow-gold
.coin-card-hover
.coin-casino-gradient

/* ❌ 悪い例 */
.flipAnimation        /* キャメルケース不可 */
.glow                 /* プレフィックスなし */
.coin_flip_animation  /* スネークケース不可 */
```

---

### @apply の使用

```css
/* ✅ 良い例: 繰り返しの多いパターン */
.coin-btn {
  @apply px-6 py-3 rounded-lg font-bold;
  @apply bg-gradient-to-r from-yellow-400 to-yellow-600;
  @apply hover:from-yellow-500 hover:to-yellow-700;
  @apply transition-all duration-300;
  @apply shadow-md hover:shadow-lg;
}

/* ❌ 悪い例: 1箇所でしか使わないスタイル */
.one-time-use {
  @apply p-4 bg-white; /* 直接 className に書く */
}
```

---

## テストコーディング規約

### テストファイルの配置

```
components/Button/
├── Button.tsx
└── Button.test.tsx

features/game/useGameLogic/
├── useGameLogic.ts
└── useGameLogic.test.ts
```

---

### テストの構造

```typescript
// ✅ 良い例: describe / it / expect
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Button } from "./Button";

describe("Button", () => {
  it("ラベルが正しく表示される", () => {
    render(<Button label="クリック" onClick={() => {}} />);
    expect(screen.getByText("クリック")).toBeInTheDocument();
  });

  it("disabled 時はクリックできない", () => {
    const handleClick = vi.fn();
    render(<Button label="クリック" onClick={handleClick} disabled />);

    const button = screen.getByRole("button");
    button.click();

    expect(handleClick).not.toHaveBeenCalled();
  });
});
```

---

### テストの命名

```typescript
// ✅ 良い例: 日本語で具体的に
describe("useGameLogic", () => {
  it("正解時にスコアが1増える", () => {});
  it("10回モードで10回終了後にゲームが終了する", () => {});
  it("サバイバルモードで不正解時にゲームが終了する", () => {});
});

// ❌ 悪い例: 抽象的
describe("useGameLogic", () => {
  it("works correctly", () => {}); // 何をテストしているか不明
});
```

---

## Git コミットメッセージ規約

### フォーマット

```
<type>: <subject>

<body>

<footer>
```

### Type 一覧

```
feat:     新機能
fix:      バグ修正
docs:     ドキュメント
style:    フォーマット（コード動作に影響なし）
refactor: リファクタリング
test:     テスト追加・修正
chore:    ビルド・補助ツール関連
```

### 例

```bash
# ✅ 良い例
feat: コイントス3Dアニメーションを実装

Framer Motionを使用して3D回転を実装。
2秒間で5回転し、結果に応じて表/裏で停止する。

Closes #12

# ✅ 良い例
fix: LocalStorageのバリデーションエラーを修正

Zodスキーマでデフォルト値が正しく適用されない問題を修正。

# ❌ 悪い例
update code  # type なし、抽象的
```

---

## ESLint / Prettier 設定

### ESLint ルール（推奨）

```javascript
// eslint.config.js
import js from "@eslint/js";
import typescript from "@typescript-eslint/eslint-plugin";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";

export default [
  js.configs.recommended,
  {
    files: ["**/*.{ts,tsx}"],
    plugins: {
      "@typescript-eslint": typescript,
      react,
      "react-hooks": reactHooks,
    },
    rules: {
      // TypeScript
      "@typescript-eslint/no-explicit-any": "error",
      "@typescript-eslint/no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_" },
      ],

      // React
      "react/prop-types": "off", // TypeScript で型チェック
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn",

      // 一般
      "no-console": ["warn", { allow: ["warn", "error"] }],
      "prefer-const": "error",
      "no-var": "error",
    },
  },
];
```

---

### Prettier 設定

```json
{
  "semi": true,
  "singleQuote": false,
  "trailingComma": "all",
  "printWidth": 100,
  "tabWidth": 2,
  "useTabs": false,
  "arrowParens": "always",
  "endOfLine": "lf"
}
```

---

## 禁止事項

### 1. `any` 型の使用

```typescript
// ❌ 絶対に禁止
const data: any = {};

// ✅ unknown を使用
const data: unknown = {};
if (typeof data === "object") {
  // 型ガードで安全に扱う
}
```

### 2. `var` の使用

```typescript
// ❌ 禁止
var score = 0;

// ✅ const / let を使用
const score = 0;
let score = 0;
```

### 3. `enum` の使用

```typescript
// ❌ 禁止
enum GameMode {
  TenRounds = "tenRounds",
  Survival = "survival",
}

// ✅ オブジェクトマップを使用
const GAME_MODES = {
  tenRounds: "tenRounds",
  survival: "survival",
} as const;

type GameMode = (typeof GAME_MODES)[keyof typeof GAME_MODES];
```

### 4. 配列・オブジェクトのミューテーション

```typescript
// ❌ 禁止
array.sort();
object.prop = value;

// ✅ イミュータブル操作
const sorted = array.toSorted();
const updated = { ...object, prop: value };
```

### 5. デフォルトエクスポート（コンポーネント以外）

```typescript
// ❌ 禁止（utilsなど）
export default function calculateScore() {}

// ✅ Named Export
export const calculateScore = () => {};

// ✅ 許容（Reactコンポーネントは可）
export default function App() {} // ルートコンポーネントのみ
```

### 6. インラインスタイル（Tailwind で表現可能な場合）

```typescript
// ❌ 禁止
<div style={{ padding: "1rem", backgroundColor: "white" }}>

// ✅ Tailwind を使用
<div className="p-4 bg-white">
```

### 7. 通常の関数での function 宣言

```typescript
// ❌ 禁止（コンポーネント以外）
export function calculateScore(mode: GameMode): number {
  return 0;
}

// ✅ アロー関数を使用
export const calculateScore = (mode: GameMode): number => {
  return 0;
};

// ✅ 許容（Reactコンポーネント）
export function GamePage() {
  return <div>Game</div>;
}
```

### 8. useEffect の安易な使用

```typescript
// ❌ 避ける: 派生状態の計算
useEffect(() => {
  setTotal(a + b);
}, [a, b]);

// ✅ useMemo を使用
const total = useMemo(() => a + b, [a, b]);

// ⚠️ 許容: 外部システムとの同期（最終手段）
useEffect(() => {
  const subscription = externalAPI.subscribe();
  return () => subscription.unsubscribe();
}, []);
```

---

## パフォーマンス最適化

### 1. 動的インポート

```typescript
// ✅ 良い例: ページごとに分割
const GamePage = lazy(() => import("./pages/GamePage"));
const ResultPage = lazy(() => import("./pages/ResultPage"));
```

### 2. 画像の最適化

```typescript
// ✅ 良い例: WebP + フォールバック
<picture>
  <source srcSet="/og-image.webp" type="image/webp" />
  <img src="/og-image.png" alt="OGP" />
</picture>
```

### 3. 不要な再レンダリングの防止

```typescript
// ✅ 良い例: React.memo（Pure Component）
export const ScoreDisplay = React.memo(({ score }: { score: number }) => {
  return <div>{score}</div>;
});
```

---

## セキュリティ

### 1. XSS 対策

```typescript
// ✅ 良い例: React のデフォルトエスケープ
<div>{userInput}</div>  // 自動エスケープ

// ❌ 禁止: dangerouslySetInnerHTML（特別な理由がない限り）
<div dangerouslySetInnerHTML={{ __html: userInput }} />
```

### 2. 外部リンク

```typescript
// ✅ 良い例: rel 属性
<a href={url} target="_blank" rel="noopener noreferrer">
  リンク
</a>
```

---

## ドキュメントコメント

### 基本方針

- **型で自明な場合は省略**
- **複雑なロジックのみコメント**
- **why を説明（what は書かない）**

### 例

```typescript
// ✅ 良い例: 型で自明
export const generateCoinFlip = (): CoinSide => {
  return Math.random() < 0.5 ? "heads" : "tails";
}; // コメント不要

// ❌ 悪い例: what を説明
// スコアに1を加える
setScore(score + 1); // コード自体が説明になっている
```

---

## チェックリスト

### コミット前

- [ ] `pnpm format:check` が通る
- [ ] `pnpm lint` が通る
- [ ] `pnpm type-check` が通る
- [ ] コンソールエラーがない

### プルリクエスト前

- [ ] 上記チェックリスト
- [ ] `pnpm build` が成功
- [ ] `pnpm preview` で動作確認
- [ ] 新機能にテストを追加
- [ ] ドキュメント更新（必要な場合）

---

## 参考リンク

- [React 公式ドキュメント](https://react.dev/)
- [TypeScript 公式ドキュメント](https://www.typescriptlang.org/)
- [Tailwind CSS 公式ドキュメント](https://tailwindcss.com/)
- [Zod 公式ドキュメント](https://zod.dev/)
- [React Router v7 ドキュメント](https://reactrouter.com/)
- [Vitest 公式ドキュメント](https://vitest.dev/)

---

**作成日**: 2025年  
**バージョン**: 1.1
