import { expect, Locator, Page } from "@playwright/test";
import { waitUntilSiteIsReady } from "../utils/site.utils";

export class SignInPage {
    readonly page: Page;
    readonly emailInput: Locator;
    readonly passwordInput: Locator;
    readonly loginSubmitButton: Locator;

    constructor(page: Page) {
        this.page = page;
        this.emailInput = this.page.getByTestId('email');
        this.passwordInput = this.page.getByTestId('password');
        this.loginSubmitButton = this.page.getByTestId('login-submit');
    }

    async navigateToSignInPage() {
        await this.page.goto(process.env.BASE_URL as string + '/signin');
    }

    async enterEmail(email: string) {
        await this.emailInput.fill(email);
    }

    async enterPassword(password: string) {
        await this.passwordInput.fill(password);
    }

    async clickLoginSubmitButton() {
        await this.loginSubmitButton.click();
    }

    async login(email: string, password: string) {
        await this.enterEmail(email);
        await this.enterPassword(password);
        await this.clickLoginSubmitButton();
        await waitUntilSiteIsReady(this.page);
    }

    async expectAccountPage() {
        await waitUntilSiteIsReady(this.page);
        await expect(this.page.getByTestId('nav-favorites')).toBeVisible();
        await expect(this.page).toHaveURL(process.env.BASE_URL as string + 'account');
    }
}
