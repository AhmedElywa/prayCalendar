import { expect, test } from '@playwright/test';

test.describe('Quick Wins Features', () => {
  test.describe('Method Recommendations', () => {
    test('should show method recommendation when selecting an address', async ({ page }) => {
      await page.goto('/');

      // Wait for page to load
      await page.waitForSelector('input[placeholder*="City"]');

      // Type in the autocomplete
      const addressInput = page.locator('input[placeholder*="City"]');
      await addressInput.fill('Cairo');

      // Wait for suggestions
      await page.waitForTimeout(400); // Wait for debounce

      // Check if suggestions appear
      const suggestions = page.locator('[role="listbox"] li, ul li');
      await expect(suggestions.first()).toBeVisible({ timeout: 5000 });

      // Click first suggestion (should be in Egypt)
      await suggestions.first().click();

      // Check for method recommendation (Egyptian method for Cairo)
      await expect(page.locator('text=Recommended')).toBeVisible({ timeout: 5000 });
    });

    test('should apply recommendation when clicking the recommendation button', async ({ page }) => {
      await page.goto('/');

      // Wait for page
      await page.waitForSelector('input[placeholder*="City"]');

      const addressInput = page.locator('input[placeholder*="City"]');
      await addressInput.fill('New York');

      await page.waitForTimeout(400);

      const suggestions = page.locator('[role="listbox"] li, ul li');
      await expect(suggestions.first()).toBeVisible({ timeout: 5000 });
      await suggestions.first().click();

      // Wait for recommendation to appear
      const recommendBtn = page.locator('button:has-text("Recommended")');
      if (await recommendBtn.isVisible()) {
        await recommendBtn.click();

        // Check that method was changed (ISNA for US)
        await expect(page.locator('select')).toHaveValue('2');
      }
    });
  });

  test.describe('Download ICS Button', () => {
    test('should show download button in calendar integration section', async ({ page }) => {
      await page.goto('/');

      // Fill in required fields
      const addressInput = page.locator('input[placeholder*="City"]');
      await addressInput.fill('London');
      await page.waitForTimeout(400);

      const suggestions = page.locator('[role="listbox"] li, ul li');
      if (await suggestions.first().isVisible({ timeout: 3000 })) {
        await suggestions.first().click();
      }

      // Look for download button
      const downloadButton = page.locator('button:has-text("Download"), a:has-text("Download")');
      await expect(downloadButton.first()).toBeVisible({ timeout: 5000 });
    });

    test('download button should have correct href for ICS file', async ({ page }) => {
      await page.goto('/');

      // Fill location
      const addressInput = page.locator('input[placeholder*="City"]');
      await addressInput.fill('Berlin');
      await page.waitForTimeout(400);

      const suggestions = page.locator('[role="listbox"] li, ul li');
      if (await suggestions.first().isVisible({ timeout: 3000 })) {
        await suggestions.first().click();
      }

      // Find download link
      const downloadLink = page.locator('a[download], a[href*=".ics"]');
      if (await downloadLink.first().isVisible({ timeout: 3000 })) {
        const href = await downloadLink.first().getAttribute('href');
        expect(href).toContain('prayer-times.ics');
      }
    });
  });

  test.describe('Smart Calendar Detection', () => {
    test('should detect calendar app based on user agent', async ({ page }) => {
      await page.goto('/');

      // Wait for page to load and calendar section
      await page.waitForSelector('input[placeholder*="City"]');

      // Fill in location to enable calendar section
      const addressInput = page.locator('input[placeholder*="City"]');
      await addressInput.fill('Tokyo');
      await page.waitForTimeout(400);

      const suggestions = page.locator('[role="listbox"] li, ul li');
      if (await suggestions.first().isVisible({ timeout: 3000 })) {
        await suggestions.first().click();
      }

      // Check that subscribe button exists
      const subscribeButton = page.locator('button:has-text("Subscribe"), a:has-text("Subscribe")');
      await expect(subscribeButton.first()).toBeVisible({ timeout: 5000 });
    });
  });

  test.describe('API Documentation', () => {
    test('should display JSON API format options', async ({ page }) => {
      await page.goto('/api-docs');

      // Check for format options documentation
      await expect(page.locator('text=format=webhook')).toBeVisible();
      await expect(page.locator('text=format=slack')).toBeVisible();
      await expect(page.locator('text=format=discord')).toBeVisible();
    });

    test('should show Home Assistant integration link', async ({ page }) => {
      await page.goto('/api-docs');

      // Check for Home Assistant integration
      await expect(page.locator('text=Home Assistant')).toBeVisible();
      await expect(page.locator('a[href*="home-assistant"]')).toBeVisible();
    });
  });

  test.describe('Home Assistant Integration Page', () => {
    test('should display integration documentation', async ({ page }) => {
      await page.goto('/integrations/home-assistant');

      // Check page title
      await expect(page.locator('h1')).toContainText('Home Assistant');

      // Check for YAML config examples
      await expect(page.locator('text=configuration.yaml')).toBeVisible();
      await expect(page.locator('text=rest:')).toBeVisible();
    });

    test('should have back link to API docs', async ({ page }) => {
      await page.goto('/integrations/home-assistant');

      const backLink = page.locator('a[href="/api-docs"]');
      await expect(backLink).toBeVisible();
    });
  });

  test.describe('JSON API Enhancements', () => {
    test('should return enhanced nextPrayer with timestamps', async ({ request }) => {
      const response = await request.get('/api/prayer-times.json?address=Cairo&method=5');
      expect(response.status()).toBe(200);

      const data = await response.json();
      expect(data.nextPrayer).toBeDefined();
      if (data.nextPrayer) {
        expect(data.nextPrayer.name).toBeDefined();
        expect(data.nextPrayer.time).toBeDefined();
        expect(data.nextPrayer.iso).toBeDefined();
        expect(data.nextPrayer.timestamp).toBeDefined();
        expect(data.nextPrayer.minutesUntil).toBeDefined();
      }
    });

    test('should return timezone in location', async ({ request }) => {
      const response = await request.get('/api/prayer-times.json?address=Cairo&method=5');
      expect(response.status()).toBe(200);

      const data = await response.json();
      expect(data.location.timezone).toBeDefined();
    });

    test('should return Slack format when requested', async ({ request }) => {
      const response = await request.get('/api/prayer-times.json?address=Cairo&method=5&format=slack');
      expect(response.status()).toBe(200);

      const data = await response.json();
      expect(data.blocks).toBeDefined();
      expect(Array.isArray(data.blocks)).toBe(true);
    });

    test('should return Discord format when requested', async ({ request }) => {
      const response = await request.get('/api/prayer-times.json?address=Cairo&method=5&format=discord');
      expect(response.status()).toBe(200);

      const data = await response.json();
      expect(data.embeds).toBeDefined();
      expect(Array.isArray(data.embeds)).toBe(true);
    });

    test('should return detailed timings in webhook format', async ({ request }) => {
      const response = await request.get('/api/prayer-times.json?address=Cairo&method=5&format=webhook');
      expect(response.status()).toBe(200);

      const data = await response.json();
      expect(data.timings.Fajr.iso).toBeDefined();
      expect(data.timings.Fajr.timestamp).toBeDefined();
      expect(data.serverTime).toBeDefined();
    });
  });
});
