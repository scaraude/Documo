import { test, expect } from '@playwright/test';

test.describe('Simple E2E Success Tests', () => {
  
  test('should successfully load the application', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Take screenshot
    await page.screenshot({ 
      path: 'e2e/screenshots/app-success.png', 
      fullPage: true 
    });
    
    // Verify basic functionality
    const pageContent = await page.textContent('body');
    const title = await page.title();
    
    console.log('✅ Page loaded successfully');
    console.log('📄 Title:', title);
    console.log('📝 Content length:', pageContent?.length || 0);
    
    // Basic assertions
    expect(title).toBe('Document Transfer App');
    expect(pageContent).toBeTruthy();
    expect(pageContent?.length).toBeGreaterThan(1000);
    
    // Verify Next.js is working
    const nextRoot = await page.locator('[id^="__next"]').count();
    expect(nextRoot).toBeGreaterThan(0);
    
    console.log('✅ Next.js app is working correctly');
  });

  test('should have working navigation elements', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Count interactive elements
    const buttons = await page.locator('button').count();
    const links = await page.locator('a').count();
    
    console.log(`✅ Found ${buttons} buttons and ${links} links`);
    
    expect(buttons + links).toBeGreaterThan(0);
    
    // Test that at least one link is present and has proper attributes
    if (links > 0) {
      const firstLink = page.locator('a').first();
      const href = await firstLink.getAttribute('href');
      console.log(`✅ First link href: ${href}`);
      expect(href).toBeTruthy();
    }
  });

  test('should display proper page content', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    const pageContent = await page.textContent('body');
    
    // Check for expected content
    const expectedContent = [
      'Document Transfer',
      'Accueil', // French for Home
      'Dossiers', // French for Folders
      'Demandes' // French for Requests
    ];
    
    let foundContent = 0;
    for (const content of expectedContent) {
      if (pageContent?.includes(content)) {
        foundContent++;
        console.log(`✅ Found expected content: ${content}`);
      }
    }
    
    expect(foundContent).toBeGreaterThan(0);
    console.log(`✅ Found ${foundContent}/${expectedContent.length} expected content elements`);
  });

  test('should have proper CSS styling', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Check if Tailwind CSS is working
    const bodyStyles = await page.locator('body').evaluate(el => {
      const styles = window.getComputedStyle(el);
      return styles.fontFamily;
    });
    
    console.log('✅ Font family:', bodyStyles);
    expect(bodyStyles).toContain('Inter');
    
    // Count styled elements
    const styledElements = await page.locator('[class]').count();
    console.log(`✅ Found ${styledElements} elements with CSS classes`);
    expect(styledElements).toBeGreaterThan(10);
  });

  test('should handle page routing', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    const initialUrl = page.url();
    console.log('✅ Initial URL:', initialUrl);
    expect(initialUrl).toContain('localhost:3000');
    
    // Try navigating to a different route
    await page.goto('/folder-types');
    await page.waitForLoadState('networkidle');
    
    const newUrl = page.url();
    console.log('✅ Navigated to:', newUrl);
    expect(newUrl).toContain('/folder-types');
    
    // Should still have content
    const content = await page.textContent('body');
    expect(content).toBeTruthy();
    expect(content?.length || 0).toBeGreaterThan(100);
    
    console.log('✅ Routing is working correctly');
  });
});