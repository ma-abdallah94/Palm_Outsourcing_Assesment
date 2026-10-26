import { Locator, Page } from "@playwright/test";

export class ProductPage {
    readonly page: Page;
    readonly productName: Locator;
    readonly productAddToCartButton: Locator;
    readonly addedToCartMessage: Locator;

    constructor(page: Page) {
        this.page = page;
        this.productName = this.page.getByTestId('product-name');
        this.productAddToCartButton = this.page.getByTestId('add-to-cart');
        this.addedToCartMessage = this.page.getByRole('alert', { name: 'Product added to shopping' });
    }

    async clickProductAddToCartButton() {
        await this.productAddToCartButton.click();
    }

    async extractProductName() {
        return await this.productName.textContent();
    }
}
