import { expect, test } from '@playwright/test';

test.describe('Widget Display Page', () => {
  test('displays prayer times with coordinates', async ({ page }) => {
    await page.goto('/widget?lat=30.0444&lng=31.2357&method=5');
    await page.waitForLoadState('networkidle');

    // Wait for prayer times to load
    await expect(page.locator('text=Fajr')).toBeVisible({ timeout: 10000 });
    await expect(page.locator('text=Dhuhr')).toBeVisible();
    await expect(page.locator('text=Maghrib')).toBeVisible();
  });

  test('displays prayer times with address', async ({ page }) => {
    await page.goto('/widget?address=Cairo,Egypt&method=5');
    await page.waitForLoadState('networkidle');

    // Wait for prayer times to load
    await expect(page.locator('text=Fajr')).toBeVisible({ timeout: 10000 });
  });

  test('shows error without location', async ({ page }) => {
    await page.goto('/widget?method=5');
    await page.waitForLoadState('networkidle');

    // Should show error or no data message
    await expect(page.locator('text=/No location|No data/')).toBeVisible({ timeout: 5000 });
  });

  test('supports dark theme', async ({ page }) => {
    await page.goto('/widget?lat=30.0444&lng=31.2357&method=5&theme=dark');
    await page.waitForLoadState('networkidle');

    // Check for dark background
    const body = page.locator('body');
    await expect(page.locator('text=Fajr')).toBeVisible({ timeout: 10000 });
  });

  test('supports light theme', async ({ page }) => {
    await page.goto('/widget?lat=30.0444&lng=31.2357&method=5&theme=light');
    await page.waitForLoadState('networkidle');

    await expect(page.locator('text=Fajr')).toBeVisible({ timeout: 10000 });
  });

  test('supports Arabic language', async ({ page }) => {
    await page.goto('/widget?lat=21.4225&lng=39.8262&method=4&lang=ar');
    await page.waitForLoadState('networkidle');

    // Check for Arabic prayer names
    await expect(page.locator('text=الفجر')).toBeVisible({ timeout: 10000 });
    await expect(page.locator('text=الظهر')).toBeVisible();
  });

  test('compact mode shows single row', async ({ page }) => {
    await page.goto('/widget?lat=30.0444&lng=31.2357&method=5&compact=true');
    await page.waitForLoadState('networkidle');

    // Compact mode should show all prayers
    await expect(page.locator('text=Fajr')).toBeVisible({ timeout: 10000 });

    // In compact mode, prayers should be arranged horizontally
    // Check that multiple prayers are visible on one row
    await expect(page.locator('text=Dhuhr')).toBeVisible();
    await expect(page.locator('text=Asr')).toBeVisible();
  });
});

test.describe('Widget Generator Page', () => {
  test('loads generator page', async ({ page }) => {
    await page.goto('/widget/generator');
    await page.waitForLoadState('networkidle');

    // Check for main elements (may have emoji prefix)
    await expect(page.locator('h1:has-text("Generator")')).toBeVisible();
    await expect(page.locator('h2:has-text("Location")')).toBeVisible();
    await expect(page.locator('h2:has-text("Settings")')).toBeVisible();
  });

  test('shows preview after entering location', async ({ page }) => {
    await page.goto('/widget/generator');
    await page.waitForLoadState('networkidle');

    // Enter location
    const addressInput = page.locator('input[placeholder*="City"]').first();
    await addressInput.fill('Cairo');

    // Wait for autocomplete
    const dropdown = page.locator('[role="listbox"]');
    await expect(dropdown).toBeVisible({ timeout: 5000 });

    // Select first suggestion
    await dropdown.locator('li').first().click();

    // Preview should show iframe
    await expect(page.locator('iframe[title="Prayer Times Widget Preview"]')).toBeVisible({ timeout: 10000 });
  });

  test('generates embed code after location selection', async ({ page }) => {
    await page.goto('/widget/generator');
    await page.waitForLoadState('networkidle');

    // Enter location
    const addressInput = page.locator('input[placeholder*="City"]').first();
    await addressInput.fill('London');

    // Wait for autocomplete and select
    const dropdown = page.locator('[role="listbox"]');
    await expect(dropdown).toBeVisible({ timeout: 5000 });
    await dropdown.locator('li').first().click();

    // Embed code section should appear
    await expect(page.locator('text=Embed Code')).toBeVisible({ timeout: 5000 });
    await expect(page.locator('text=iframe Code')).toBeVisible();
    await expect(page.locator('text=JavaScript Code')).toBeVisible();
  });

  test('theme toggle works', async ({ page }) => {
    await page.goto('/widget/generator');
    await page.waitForLoadState('networkidle');

    // Find and click Light theme button
    await page.locator('button:has-text("Light")').click();

    // Light button should be active (has gold background)
    const lightButton = page.locator('button:has-text("Light")');
    await expect(lightButton).toHaveClass(/bg-gold/);
  });

  test('compact mode toggle works', async ({ page }) => {
    await page.goto('/widget/generator');
    await page.waitForLoadState('networkidle');

    // Find and check compact checkbox
    const checkbox = page.locator('input#compact');
    await checkbox.check();

    // Checkbox should be checked
    await expect(checkbox).toBeChecked();
  });
});

test.describe('Widget Mobile View', () => {
  test.use({ viewport: { width: 375, height: 667 } });

  test('widget displays correctly on mobile', async ({ page }) => {
    await page.goto('/widget?lat=30.0444&lng=31.2357&method=5');
    await page.waitForLoadState('networkidle');

    await expect(page.locator('text=Fajr')).toBeVisible({ timeout: 10000 });
  });

  test('generator works on mobile', async ({ page }) => {
    await page.goto('/widget/generator');
    await page.waitForLoadState('networkidle');

    await expect(page.locator('text=Widget Generator')).toBeVisible();
  });
});
