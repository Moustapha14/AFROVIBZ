import { test, expect } from '@playwright/test';

test.describe('Performance Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Enable performance monitoring
    await page.addInitScript(() => {
      window.performance.mark = jest.fn();
      window.performance.measure = jest.fn();
    });
  });

  test('should load homepage within performance budget', async ({ page }) => {
    const startTime = Date.now();

    await page.goto('/');

    // Wait for page to be fully loaded
    await page.waitForLoadState('networkidle');

    const loadTime = Date.now() - startTime;

    // Performance budget: homepage should load in under 3 seconds
    expect(loadTime).toBeLessThan(3000);

    // Check for Core Web Vitals
    const metrics = await page.evaluate(() => {
      return {
        fcp: performance.getEntriesByName('first-contentful-paint')[0]?.startTime || 0,
        lcp: performance.getEntriesByName('largest-contentful-paint')[0]?.startTime || 0,
        fid: performance.getEntriesByName('first-input-delay')[0]?.processingStart || 0,
      };
    });

    // FCP should be under 1.8s
    expect(metrics.fcp).toBeLessThan(1800);

    // LCP should be under 2.5s
    expect(metrics.lcp).toBeLessThan(2500);
  });

  test('should have optimized images with proper loading', async ({ page }) => {
    await page.goto('/');

    // Check that images use Next.js Image component
    const images = await page.locator('img').all();

    for (const img of images) {
      const src = await img.getAttribute('src');
      const loading = await img.getAttribute('loading');

      // Images should have loading="lazy" for optimization
      if (loading !== 'eager') {
        expect(loading).toBe('lazy');
      }

      // Images should have proper src attributes
      expect(src).toBeTruthy();
    }
  });

  test('should have Service Worker registered', async ({ page }) => {
    await page.goto('/');

    // Check if Service Worker is registered
    const swRegistered = await page.evaluate(() => {
      return 'serviceWorker' in navigator && navigator.serviceWorker.controller !== null;
    });

    expect(swRegistered).toBe(true);
  });

  test('should work offline', async ({ page }) => {
    await page.goto('/');

    // Wait for Service Worker to be ready
    await page.waitForFunction(() => {
      return 'serviceWorker' in navigator && navigator.serviceWorker.controller !== null;
    });

    // Go offline
    await page.context().setOffline(true);

    // Try to navigate to a cached page
    await page.goto('/offline');

    // Should show offline page
    await expect(page.locator('text=Mode Hors Ligne')).toBeVisible();
  });

  test('should have proper caching headers', async ({ page }) => {
    const response = await page.goto('/');

    // Check for caching headers
    const cacheControl = response?.headers()['cache-control'];
    expect(cacheControl).toBeTruthy();

    // Static assets should have long cache times
    const staticResponse = await page.goto('/_next/static/css/app.css');
    if (staticResponse) {
      const staticCacheControl = staticResponse.headers()['cache-control'];
      expect(staticCacheControl).toContain('max-age');
    }
  });

  test('should have optimized bundle size', async ({ page }) => {
    await page.goto('/');

    // Get all script and CSS resources
    const resources = await page.evaluate(() => {
      const scripts = Array.from(document.querySelectorAll('script[src]'));
      const links = Array.from(document.querySelectorAll('link[rel="stylesheet"]'));

      return {
        scripts: scripts.map(s => s.getAttribute('src')),
        stylesheets: links.map(l => l.getAttribute('href')),
      };
    });

    // Check that we're not loading too many resources
    expect(resources.scripts.length).toBeLessThan(10);
    expect(resources.stylesheets.length).toBeLessThan(5);
  });

  test('should have proper accessibility', async ({ page }) => {
    await page.goto('/');

    // Check for proper heading structure
    const headings = await page.locator('h1, h2, h3, h4, h5, h6').all();
    expect(headings.length).toBeGreaterThan(0);

    // Check for proper alt text on images
    const images = await page.locator('img').all();
    for (const img of images) {
      const alt = await img.getAttribute('alt');
      expect(alt).toBeTruthy();
    }

    // Check for proper ARIA labels
    const buttons = await page.locator('button').all();
    for (const button of buttons) {
      const ariaLabel = await button.getAttribute('aria-label');
      const textContent = await button.textContent();

      // Either aria-label or text content should be present
      expect(ariaLabel || textContent?.trim()).toBeTruthy();
    }
  });

  test('should handle errors gracefully', async ({ page }) => {
    // Try to access a non-existent page
    const response = await page.goto('/non-existent-page');

    // Should return 404
    expect(response?.status()).toBe(404);

    // Should show proper error page
    await expect(page.locator('text=404')).toBeVisible();
  });

  test('should have responsive design', async ({ page }) => {
    await page.goto('/');

    // Test mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await expect(page.locator('body')).toBeVisible();

    // Test tablet viewport
    await page.setViewportSize({ width: 768, height: 1024 });
    await expect(page.locator('body')).toBeVisible();

    // Test desktop viewport
    await page.setViewportSize({ width: 1920, height: 1080 });
    await expect(page.locator('body')).toBeVisible();
  });

  test('should have proper SEO meta tags', async ({ page }) => {
    await page.goto('/');

    // Check for essential meta tags
    const title = await page.title();
    expect(title).toBeTruthy();
    expect(title).toContain('AFROVIBZ');

    const description = await page.locator('meta[name="description"]').getAttribute('content');
    expect(description).toBeTruthy();

    const viewport = await page.locator('meta[name="viewport"]').getAttribute('content');
    expect(viewport).toBeTruthy();
  });

  test('should have proper performance monitoring', async ({ page }) => {
    await page.goto('/');

    // Check if performance monitoring is active
    const monitoringActive = await page.evaluate(() => {
      return window.performance && typeof window.performance.mark === 'function';
    });

    expect(monitoringActive).toBe(true);
  });
});
