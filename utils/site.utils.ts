import { expect, Page } from '@playwright/test';

export async function waitUntilSiteIsReady(page: Page) {
    const securityCheck = page.getByRole('heading', { name: 'Performing security verification' });
    await expect(securityCheck).toBeHidden({ timeout: 30_000 });
}
