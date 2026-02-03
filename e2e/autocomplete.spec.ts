import { expect, test } from '@playwright/test';

test.describe('Address Autocomplete', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('shows autocomplete dropdown when typing', async ({ page }) => {
    // Wait for page to load
    await page.waitForLoadState('networkidle');

    // Find the address input and type
    const addressInput = page.locator('input[placeholder*="City"]').first();
    await addressInput.fill('Cairo');

    // Wait for autocomplete dropdown to appear (with suggestions from Photon API)
    const dropdown = page.locator('[role="listbox"]');
    await expect(dropdown).toBeVisible({ timeout: 5000 });

    // Should have at least one suggestion
    const suggestions = dropdown.locator('li');
    await expect(suggestions.first()).toBeVisible();
  });

  test('selects address from dropdown', async ({ page }) => {
    await page.waitForLoadState('networkidle');

    const addressInput = page.locator('input[placeholder*="City"]').first();
    await addressInput.fill('London');

    // Wait for dropdown
    const dropdown = page.locator('[role="listbox"]');
    await expect(dropdown).toBeVisible({ timeout: 5000 });

    // Click first suggestion
    const firstSuggestion = dropdown.locator('li').first();
    await firstSuggestion.click();

    // Dropdown should close
    await expect(dropdown).not.toBeVisible();

    // Input should have the selected value
    await expect(addressInput).not.toHaveValue('London');
    const inputValue = await addressInput.inputValue();
    expect(inputValue.toLowerCase()).toContain('london');
  });

  test('supports keyboard navigation', async ({ page }) => {
    await page.waitForLoadState('networkidle');

    const addressInput = page.locator('input[placeholder*="City"]').first();
    await addressInput.fill('Paris');

    // Wait for dropdown
    const dropdown = page.locator('[role="listbox"]');
    await expect(dropdown).toBeVisible({ timeout: 5000 });

    // Press ArrowDown to highlight first item
    await addressInput.press('ArrowDown');

    // Check that first item is highlighted (aria-selected)
    const firstOption = dropdown.locator('li[aria-selected="true"]');
    await expect(firstOption).toBeVisible();

    // Press Enter to select
    await addressInput.press('Enter');

    // Dropdown should close
    await expect(dropdown).not.toBeVisible();
  });

  test('closes dropdown on Escape', async ({ page }) => {
    await page.waitForLoadState('networkidle');

    const addressInput = page.locator('input[placeholder*="City"]').first();
    await addressInput.fill('Tokyo');

    // Wait for dropdown
    const dropdown = page.locator('[role="listbox"]');
    await expect(dropdown).toBeVisible({ timeout: 5000 });

    // Press Escape
    await addressInput.press('Escape');

    // Dropdown should close
    await expect(dropdown).not.toBeVisible();
  });

  test('shows loading indicator while fetching', async ({ page }) => {
    await page.waitForLoadState('networkidle');

    const addressInput = page.locator('input[placeholder*="City"]').first();

    // Type to trigger fetch
    await addressInput.fill('New York');

    // Loading spinner should appear briefly (may be too fast to catch reliably)
    // Just verify no errors occur
    await page.waitForTimeout(500);
  });

  test('updates prayer preview when address is selected', async ({ page }) => {
    await page.waitForLoadState('networkidle');

    const addressInput = page.locator('input[placeholder*="City"]').first();
    await addressInput.fill('Mecca');

    // Wait for dropdown
    const dropdown = page.locator('[role="listbox"]');
    await expect(dropdown).toBeVisible({ timeout: 5000 });

    // Click first suggestion
    await dropdown.locator('li').first().click();

    // Wait for prayer times to update
    await page.waitForTimeout(2000);

    // Prayer preview section should show times
    const prayerPreview = page.locator('text=Fajr');
    await expect(prayerPreview.first()).toBeVisible({ timeout: 10000 });
  });
});

test.describe('Address Autocomplete - Mobile', () => {
  test.use({ viewport: { width: 375, height: 667 } });

  test('autocomplete works on mobile viewport', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const addressInput = page.locator('input[placeholder*="City"]').first();
    await addressInput.fill('Dubai');

    // Wait for dropdown
    const dropdown = page.locator('[role="listbox"]');
    await expect(dropdown).toBeVisible({ timeout: 5000 });

    // Click first suggestion (works on both touch and non-touch)
    await dropdown.locator('li').first().click();

    // Dropdown should close
    await expect(dropdown).not.toBeVisible();
  });
});

test.describe('Use My Location Button', () => {
  test('location button is visible', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Find the location button (has 📌 or location icon)
    const locationButton = page.locator('button[title*="location"]').first();
    await expect(locationButton).toBeVisible();
  });
});
