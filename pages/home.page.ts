import { Locator, Page } from "@playwright/test";
import { waitUntilSiteIsReady } from "../utils/site.utils";

export class HomePage {
    readonly page: Page;
    readonly signInButton           :Locator;
    readonly productCards           :Locator;
    readonly outOfStockProducts     :Locator;
    readonly inStockProductCards    :Locator;
    readonly cartNavButton          :Locator;
    readonly favoritesLink          :Locator;

    constructor(page: Page) {
        this.page = page;
        this.signInButton       = this.page.getByTestId('nav-sign-in');
        this.productCards       = this.page.locator('//a[@class="card"]');
        this.outOfStockProducts = this.productCards.getByTestId('out-of-stock');
        this.inStockProductCards = this.productCards.filter({hasNot: this.outOfStockProducts});
        this.cartNavButton       = this.page.getByTestId('nav-cart');
        this.favoritesLink      = this.page.getByTestId('nav-favorites');
    }

    async clickInStockProduct() {
        await this.inStockProductCards.first().click();
    }

    async navigateToHomePage() {
        await this.page.goto(process.env.BASE_URL as string, { waitUntil: 'domcontentloaded' });
        await waitUntilSiteIsReady(this.page);
    }

    async clickSignInButton() {
        await this.signInButton.click();
    }

    async clickCartNavButton() {
        await this.cartNavButton.click();
    }

    async openMyFavorites() {
        await waitUntilSiteIsReady(this.page);
        await this.favoritesLink.click();
    }
}
