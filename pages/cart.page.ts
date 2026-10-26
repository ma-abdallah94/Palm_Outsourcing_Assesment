import { Locator, Page } from "@playwright/test";

export class CartPage {
    readonly page: Page;
    readonly cartItemName:(itemName: string) => Locator;
    readonly cartCheckoutButton: Locator;

    constructor(page: Page) {
        this.page = page;
        this.cartItemName = (itemName: string) => this.page.getByText(itemName);
        this.cartCheckoutButton = this.page.getByTestId('checkout');
    }
    
    async clickCartCheckoutButton() {
        await this.cartCheckoutButton.click();
    }

    async youAreLoggedInMessage(message: string) {
        return this.page.getByText(message);
    }
}   