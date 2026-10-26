import { Locator, Page } from "@playwright/test";
import { Fluent } from "../utils/fluent";




export class HomePage extends Fluent {
    readonly page: Page;
    readonly signInButton           :Locator;
    readonly productCards           :Locator;
    readonly outOfStockProducts     :Locator;
    readonly inStockProductCards    :Locator;
    readonly cartNavButton          :Locator;
    readonly accountMenuButton      :Locator;
    readonly myFavoritesLink        :Locator;


    constructor(page: Page) {
        super();
        this.page = page; 
        this.signInButton       = this.page.getByTestId('nav-sign-in');
        this.productCards       = this.page.locator('//a[@class="card"]');
        this.outOfStockProducts = this.productCards.getByTestId('out-of-stock');
        this.inStockProductCards = this.productCards.filter({hasNot: this.outOfStockProducts});
        this.cartNavButton       = this.page.getByTestId('nav-cart');
        this.accountMenuButton  = this.page.getByTestId('nav-menu');
        this.myFavoritesLink    = this.page.getByTestId('nav-my-favorites');
    }

    clickInStockProduct(): this {
        return this.step(() => this.inStockProductCards.first().click());
    }

    navigateToHomePage(): this {
        return this.step(() => this.page.goto(process.env.BASE_URL as string, { waitUntil: 'domcontentloaded' }));
    }

    clickSignInButton(): this {
        return this.step(() => this.signInButton.click());
    }

    clickCartNavButton(): this {
        return this.step(() => this.cartNavButton.click());
    }

    openMyFavorites(): this {
        return this.step(async () => {
            await this.accountMenuButton.click();
            await this.myFavoritesLink.click();
        });
    }


}