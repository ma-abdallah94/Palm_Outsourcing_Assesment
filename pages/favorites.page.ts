import { expect, Locator, Page } from '@playwright/test';
import { Fluent } from '../utils/fluent';

export class FavoritesPage extends Fluent {
    readonly page: Page;
    readonly productName: (name: string) => Locator;

    constructor(page: Page) {
        super();
        this.page = page;
        this.productName = (name) => this.page.getByTestId('product-name').filter({ hasText: name });
    }

    expectProduct(name: string): this {
        return this.step(() => expect(this.productName(name)).toBeVisible());
    }
}
