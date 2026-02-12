import { test, expect } from '@playwright/test';

test.describe('ゲーム画面（10回モード）', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/coin-toss-game/game/tenRounds');
  });

  test('スコア表示とモード名が見える', async ({ page }) => {
    await expect(page.getByText('10回モード')).toBeVisible();
    await expect(page.getByText('Round 1 / 10')).toBeVisible();
  });

  test('予想ボタンが表示される', async ({ page }) => {
    await expect(page.getByText('予想してください')).toBeVisible();
    await expect(page.getByRole('button', { name: /表/ })).toBeVisible();
    await expect(page.getByRole('button', { name: /裏/ })).toBeVisible();
  });

  test('予想ボタンをクリックするとゲームが進行する', async ({ page }) => {
    await page.getByRole('button', { name: /表/ }).click();

    // フリップ中は予想ボタンが非表示
    await expect(page.getByText('予想してください')).not.toBeVisible();

    // 2秒後に結果が表示される
    await expect(page.getByText(/正解|不正解/).first()).toBeVisible({
      timeout: 5000,
    });
  });

  test('10ラウンドプレイすると結果画面に遷移する', async ({ page }) => {
    for (let i = 0; i < 9; i++) {
      await page.getByRole('button', { name: /表/ }).click();

      // 結果を待つ
      await expect(page.getByText(/正解|不正解/).first()).toBeVisible({
        timeout: 5000,
      });

      // 次のラウンドへ
      await page.getByRole('button', { name: '次のラウンドへ' }).click();
    }

    // 最終ラウンド（10ラウンド目）
    await page.getByRole('button', { name: /表/ }).click();

    // 結果画面に遷移
    await expect(page.getByText('ゲーム終了')).toBeVisible({ timeout: 10000 });
  });
});

test.describe('ゲーム画面（サバイバルモード）', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/coin-toss-game/game/survival');
  });

  test('サバイバルモードが表示される', async ({ page }) => {
    await expect(page.getByText('サバイバルモード')).toBeVisible();
  });

  test('ギブアップボタンが表示される', async ({ page }) => {
    await expect(
      page.getByRole('button', { name: 'ギブアップ' }),
    ).toBeVisible();
  });

  test('ギブアップで確認モーダルが表示される', async ({ page }) => {
    await page.getByRole('button', { name: 'ギブアップ' }).click();

    await expect(page.getByText('ギブアップしますか？')).toBeVisible();
    await expect(page.getByRole('button', { name: '続ける' })).toBeVisible();
    await expect(page.getByRole('button', { name: '終了する' })).toBeVisible();
  });

  test('ギブアップを確定すると結果画面に遷移する', async ({ page }) => {
    await page.getByRole('button', { name: 'ギブアップ' }).click();
    await page.getByRole('button', { name: '終了する' }).click();

    await expect(page.getByText('ゲーム終了')).toBeVisible({ timeout: 5000 });
  });

  test('ギブアップをキャンセルするとゲームに戻る', async ({ page }) => {
    await page.getByRole('button', { name: 'ギブアップ' }).click();
    await page.getByRole('button', { name: '続ける' }).click();

    await expect(page.getByText('ギブアップしますか？')).not.toBeVisible();
    await expect(page.getByText('予想してください')).toBeVisible();
  });
});
