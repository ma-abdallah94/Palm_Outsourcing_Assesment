import { expect, Locator, Page } from "@playwright/test";
import { Fluent } from "../utils/fluent";

export class ProductPage extends Fluent {
    readonly page: Page;
    readonly productName: Locator;
    readonly productAddToCartButton: Locator;
    readonly addedToCartMessage: Locator;
    


    constructor(page: Page) {
        super();
        this.page = page;
        this.productName = this.page.getByTestId('product-name');
        this.productAddToCartButton = this.page.getByTestId('add-to-cart');
        this.addedToCartMessage = this.page.getByRole('alert', { name: 'Product added to shopping' });
    }

    clickProductAddToCartButton(): this {
        return this.step(() => this.productAddToCartButton.click());
    }

    addProductToCart(): this {
        return this.step(async () => {
            await this.productAddToCartButton.click();
            await expect(this.addedToCartMessage).toBeVisible();
        });
    }

    async extractProductName() {
        await this;
        return await this.productName.textContent();
    }
}
