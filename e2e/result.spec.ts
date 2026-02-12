import { test, expect } from '@playwright/test';

test.describe('結果画面', () => {
  test('ギブアップ経由で結果画面が正しく表示される', async ({ page }) => {
    await page.goto('/coin-toss-game/game/survival');
    await page.getByRole('button', { name: 'ギブアップ' }).click();
    await page.getByRole('button', { name: '終了する' }).click();

    await expect(page.getByText('ゲーム終了')).toBeVisible({ timeout: 5000 });
    await expect(page.getByText('Your Best 3')).toBeVisible();
    await expect(page.getByText('同じモードで再挑戦')).toBeVisible();
    await expect(page.getByText('ホームに戻る')).toBeVisible();
  });

  test('シェアセクションが表示される', async ({ page }) => {
    await page.goto('/coin-toss-game/game/survival');
    await page.getByRole('button', { name: 'ギブアップ' }).click();
    await page.getByRole('button', { name: '終了する' }).click();

    await expect(page.getByText('ゲーム終了')).toBeVisible({ timeout: 5000 });
    await expect(page.getByText('結果をシェアして')).toBeVisible();
    await expect(page.getByRole('button', { name: 'LINE' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'X' })).toBeVisible();
  });

  test('ホームに戻るボタンでホーム画面に遷移する', async ({ page }) => {
    await page.goto('/coin-toss-game/game/survival');
    await page.getByRole('button', { name: 'ギブアップ' }).click();
    await page.getByRole('button', { name: '終了する' }).click();

    await expect(page.getByText('ゲーム終了')).toBeVisible({ timeout: 5000 });
    await page.getByRole('button', { name: /ホームに戻る/ }).click();

    await expect(page).toHaveURL(/\/coin-toss-game\/$/);
  });

  test('再挑戦ボタンでゲーム画面に遷移する', async ({ page }) => {
    await page.goto('/coin-toss-game/game/survival');
    await page.getByRole('button', { name: 'ギブアップ' }).click();
    await page.getByRole('button', { name: '終了する' }).click();

    await expect(page.getByText('ゲーム終了')).toBeVisible({ timeout: 5000 });
    await page.getByRole('button', { name: /同じモードで再挑戦/ }).click();

    await expect(page).toHaveURL(/\/game\/survival/);
  });
});

test.describe('不正URL', () => {
  test('結果画面に直接アクセスするとホームにリダイレクトする', async ({
    page,
  }) => {
    await page.goto('/coin-toss-game/result');

    await expect(page).toHaveURL(/\/coin-toss-game\/$/);
  });

  test('不正なモードでアクセスするとホームにリダイレクトする', async ({
    page,
  }) => {
    await page.goto('/coin-toss-game/game/invalid');

    await expect(page).toHaveURL(/\/coin-toss-game\/$/);
  });

  test('存在しないパスでホームにリダイレクトする', async ({ page }) => {
    await page.goto('/coin-toss-game/nonexistent');

    await expect(page).toHaveURL(/\/coin-toss-game\/$/);
  });
});
