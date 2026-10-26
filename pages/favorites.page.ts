import { expect, Locator, Page } from '@playwright/test';

export class FavoritesPage {
    readonly page: Page;
    readonly productName: (name: string) => Locator;

    constructor(page: Page) {
        this.page = page;
        this.productName = (name) => this.page.getByTestId('product-name').filter({ hasText: name });
    }

    async expectProduct(name: string) {
        await expect(this.productName(name)).toBeVisible();
    }
}
