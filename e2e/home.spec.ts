import { test, expect } from '@playwright/test';

test.describe('ホーム画面', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/coin-toss-game/');
  });

  test('タイトルが表示される', async ({ page }) => {
    await expect(page.getByText('Coin Toss Game')).toBeVisible();
  });

  test('モード選択カードが表示される', async ({ page }) => {
    await expect(
      page.getByRole('heading', { name: '🎯 10回モード' }),
    ).toBeVisible();
    await expect(
      page.getByRole('heading', { name: '⚡ サバイバル' }),
    ).toBeVisible();
  });

  test('10回モードを選択するとゲーム画面に遷移する', async ({ page }) => {
    const tenRoundsCard = page
      .getByRole('heading', { name: '🎯 10回モード' })
      .locator('..');
    await tenRoundsCard.getByText('PLAY').click();
    await expect(page).toHaveURL(/\/game\/tenRounds/);
  });

  test('サバイバルモードを選択するとゲーム画面に遷移する', async ({ page }) => {
    const survivalCard = page
      .getByRole('heading', { name: '⚡ サバイバル' })
      .locator('..');
    await survivalCard.getByText('PLAY').click();
    await expect(page).toHaveURL(/\/game\/survival/);
  });

  test('リーダーボードが表示される', async ({ page }) => {
    await expect(page.getByText('Your Best Records')).toBeVisible();
  });
});
