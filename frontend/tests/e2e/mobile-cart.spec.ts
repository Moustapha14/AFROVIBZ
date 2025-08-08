import { test, expect, devices } from '@playwright/test';

// Test on iPhone 13 (small mobile)
test.describe('Mobile Cart Functionality - iPhone 13', () => {
  test.use({ ...devices['iPhone 13'] });

  test('should update cart counter and show toast when adding product on mobile', async ({ page }) => {
    // Navigate to products page
    await page.goto('/products');
    
    // Wait for products to load
    await page.waitForSelector('[data-testid="product-card"]', { timeout: 10000 });
    
    // Get initial cart count
    const cartCounterSelector = '[data-testid="cart-counter"]';
    let initialCartCount = 0;
    
    try {
      const initialCartCountElement = await page.locator(cartCounterSelector);
      if (await initialCartCountElement.isVisible()) {
        initialCartCount = parseInt(await initialCartCountElement.textContent() || '0');
      }
    } catch (error) {
      // Cart counter might not be visible if cart is empty
      initialCartCount = 0;
    }
    
    // Find and click the first product's add to cart button
    const firstProductCard = page.locator('[data-testid="product-card"]').first();
    await firstProductCard.hover();
    
    // Click add to cart button (might be in a modal or direct button)
    const addToCartButton = firstProductCard.locator('button').filter({ hasText: /ajouter/i }).first();
    await addToCartButton.click();
    
    // Wait for potential modal to appear and handle it
    const modal = page.locator('[role="dialog"]');
    if (await modal.isVisible({ timeout: 2000 })) {
      // If modal appears, select size and color, then add to cart
      const sizeButton = modal.locator('button').filter({ hasText: /M|L|S|Unique/i }).first();
      if (await sizeButton.isVisible()) {
        await sizeButton.click();
      }
      
      const colorButton = modal.locator('button[style*="background-color"]').first();
      if (await colorButton.isVisible()) {
        await colorButton.click();
      }
      
      const modalAddToCartButton = modal.locator('button').filter({ hasText: /ajouter au panier/i });
      await modalAddToCartButton.click();
    }
    
    // Wait for toast notification to appear
    await expect(page.locator('[data-testid="toast"]').or(page.locator('.toast-mobile'))).toBeVisible({ timeout: 5000 });
    
    // Verify toast content
    const toast = page.locator('[data-testid="toast"]').or(page.locator('.toast-mobile')).first();
    await expect(toast).toContainText(/produit ajouté|ajouté/i);
    
    // Verify cart counter is updated
    await expect(page.locator(cartCounterSelector)).toBeVisible({ timeout: 3000 });
    const newCartCount = parseInt(await page.locator(cartCounterSelector).textContent() || '0');
    expect(newCartCount).toBeGreaterThan(initialCartCount);
    
    // Verify cart counter has animation class
    await expect(page.locator(cartCounterSelector)).toHaveClass(/cart-counter-update/, { timeout: 1000 });
  });

  test('should show toast notification with correct styling on mobile', async ({ page }) => {
    await page.goto('/products');
    
    // Wait for products to load
    await page.waitForSelector('[data-testid="product-card"]', { timeout: 10000 });
    
    // Add product to cart to trigger toast
    const firstProductCard = page.locator('[data-testid="product-card"]').first();
    await firstProductCard.hover();
    
    const addToCartButton = firstProductCard.locator('button').filter({ hasText: /ajouter/i }).first();
    await addToCartButton.click();
    
    // Handle modal if present
    const modal = page.locator('[role="dialog"]');
    if (await modal.isVisible({ timeout: 2000 })) {
      const sizeButton = modal.locator('button').filter({ hasText: /M|L|S|Unique/i }).first();
      if (await sizeButton.isVisible()) await sizeButton.click();
      
      const colorButton = modal.locator('button[style*="background-color"]').first();
      if (await colorButton.isVisible()) await colorButton.click();
      
      await modal.locator('button').filter({ hasText: /ajouter au panier/i }).click();
    }
    
    // Wait for toast and verify mobile styling
    const toast = page.locator('[data-testid="toast"]').or(page.locator('.toast-mobile')).first();
    await expect(toast).toBeVisible({ timeout: 5000 });
    
    // Check toast is properly positioned for mobile
    const toastBox = await toast.boundingBox();
    const viewportSize = page.viewportSize();
    
    if (toastBox && viewportSize) {
      // Toast should be within viewport and properly positioned
      expect(toastBox.x).toBeGreaterThanOrEqual(0);
      expect(toastBox.x + toastBox.width).toBeLessThanOrEqual(viewportSize.width);
      expect(toastBox.y).toBeGreaterThanOrEqual(0);
    }
    
    // Toast should auto-dismiss after duration
    await expect(toast).not.toBeVisible({ timeout: 5000 });
  });
});

// Test on Samsung Galaxy S21 (medium mobile)
test.describe('Mobile Cart Functionality - Samsung Galaxy S21', () => {
  test.use({ ...devices['Galaxy S21'] });

  test('should work correctly on medium-sized mobile devices', async ({ page }) => {
    await page.goto('/products');
    
    // Wait for products to load
    await page.waitForSelector('[data-testid="product-card"]', { timeout: 10000 });
    
    // Test cart functionality
    const firstProductCard = page.locator('[data-testid="product-card"]').first();
    await firstProductCard.hover();
    
    const addToCartButton = firstProductCard.locator('button').filter({ hasText: /ajouter/i }).first();
    await addToCartButton.click();
    
    // Handle modal if present
    const modal = page.locator('[role="dialog"]');
    if (await modal.isVisible({ timeout: 2000 })) {
      const sizeButton = modal.locator('button').filter({ hasText: /M|L|S|Unique/i }).first();
      if (await sizeButton.isVisible()) await sizeButton.click();
      
      const colorButton = modal.locator('button[style*="background-color"]').first();
      if (await colorButton.isVisible()) await colorButton.click();
      
      await modal.locator('button').filter({ hasText: /ajouter au panier/i }).click();
    }
    
    // Verify toast appears
    await expect(page.locator('[data-testid="toast"]').or(page.locator('.toast-mobile'))).toBeVisible({ timeout: 5000 });
    
    // Verify cart counter updates
    await expect(page.locator('[data-testid="cart-counter"]')).toBeVisible({ timeout: 3000 });
  });
});

// Test desktop behavior remains unchanged
test.describe('Desktop Cart Functionality - Regression Test', () => {
  test.use({ ...devices['Desktop Chrome'] });

  test('should maintain desktop functionality without breaking changes', async ({ page }) => {
    await page.goto('/products');
    
    // Wait for products to load
    await page.waitForSelector('[data-testid="product-card"]', { timeout: 10000 });
    
    // Test cart functionality on desktop
    const firstProductCard = page.locator('[data-testid="product-card"]').first();
    await firstProductCard.hover();
    
    const addToCartButton = firstProductCard.locator('button').filter({ hasText: /ajouter/i }).first();
    await addToCartButton.click();
    
    // Handle modal if present
    const modal = page.locator('[role="dialog"]');
    if (await modal.isVisible({ timeout: 2000 })) {
      const sizeButton = modal.locator('button').filter({ hasText: /M|L|S|Unique/i }).first();
      if (await sizeButton.isVisible()) await sizeButton.click();
      
      const colorButton = modal.locator('button[style*="background-color"]').first();
      if (await colorButton.isVisible()) await colorButton.click();
      
      await modal.locator('button').filter({ hasText: /ajouter au panier/i }).click();
    }
    
    // Verify toast appears on desktop too
    await expect(page.locator('[data-testid="toast"]').or(page.locator('.toast-mobile'))).toBeVisible({ timeout: 5000 });
    
    // Verify cart counter updates
    await expect(page.locator('[data-testid="cart-counter"]')).toBeVisible({ timeout: 3000 });
    
    // Verify desktop-specific styling
    const toast = page.locator('[data-testid="toast"]').or(page.locator('.toast-mobile')).first();
    const toastBox = await toast.boundingBox();
    
    if (toastBox) {
      // On desktop, toast should be positioned in top-right area
      const viewportSize = page.viewportSize();
      if (viewportSize) {
        expect(toastBox.x).toBeGreaterThan(viewportSize.width * 0.6); // Should be in right area
      }
    }
  });
});