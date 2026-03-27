import { test, expect } from '@playwright/test';

test('should load the quiz and display first question', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByText('Mis on Eesti pealinn?')).toBeVisible();
  await expect(page.getByRole('button', { name: 'a) Tallinn' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'b) Tartu' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'c) Narva' })).toBeVisible();
});

test('should handle correct answer on first question', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'a) Tallinn' }).click();
  await page.getByRole('button', { name: 'Esita vastus' }).click();
  await expect(page.getByText('Õige!')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Järgmine küsimus' })).toBeVisible();
});

test('should handle incorrect answer on second question', async ({ page }) => {
  await page.goto('/');
  // Answer first question correctly
  await page.getByRole('button', { name: 'a) Tallinn' }).click();
  await page.getByRole('button', { name: 'Esita vastus' }).click();
  await page.getByRole('button', { name: 'Järgmine küsimus' }).click();
  // Now second question
  await expect(page.getByText('Kui palju maakondi on Eestis?')).toBeVisible();
  await page.getByRole('button', { name: 'a) 12' }).click();
  await page.getByRole('button', { name: 'Esita vastus' }).click();
  await expect(page.getByText('Vale!')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Järgmine küsimus' })).toBeVisible();
});

test('should handle correct answer on third question', async ({ page }) => {
  await page.goto('/');
  // Answer first correctly
  await page.getByRole('button', { name: 'a) Tallinn' }).click();
  await page.getByRole('button', { name: 'Esita vastus' }).click();
  await page.getByRole('button', { name: 'Järgmine küsimus' }).click();
  // Answer second incorrectly
  await page.getByRole('button', { name: 'a) 12' }).click();
  await page.getByRole('button', { name: 'Esita vastus' }).click();
  await page.getByRole('button', { name: 'Järgmine küsimus' }).click();
  // Now third question
  await expect(page.getByText('Mis on Eesti rahvustoit?')).toBeVisible();
  await page.getByRole('button', { name: 'a) Kama' }).click();
  await page.getByRole('button', { name: 'Esita vastus' }).click();
  await expect(page.getByText('Õige!')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Vaata tulemusi' })).toBeVisible();
});

test('should display results correctly', async ({ page }) => {
  await page.goto('/');
  // Complete the quiz
  await page.getByRole('button', { name: 'a) Tallinn' }).click();
  await page.getByRole('button', { name: 'Esita vastus' }).click();
  await page.getByRole('button', { name: 'Järgmine küsimus' }).click();
  await page.getByRole('button', { name: 'a) 12' }).click();
  await page.getByRole('button', { name: 'Esita vastus' }).click();
  await page.getByRole('button', { name: 'Järgmine küsimus' }).click();
  await page.getByRole('button', { name: 'a) Kama' }).click();
  await page.getByRole('button', { name: 'Esita vastus' }).click();
  await page.getByRole('button', { name: 'Vaata tulemusi' }).click();
  // Check results
  await expect(page.getByText('Skoor: 2 / 3')).toBeVisible();
  const rows = page.locator('table tbody tr');
  await expect(rows).toHaveCount(3);
  await expect(rows.nth(0).getByText('Tallinn')).toBeVisible();
  await expect(rows.nth(0).getByText('Õige')).toBeVisible();
  await expect(rows.nth(1).getByText('12')).toBeVisible();
  await expect(rows.nth(1).getByText('Vale')).toBeVisible();
  await expect(rows.nth(2).getByText('Kama')).toBeVisible();
  await expect(rows.nth(2).getByText('Õige')).toBeVisible();
});
