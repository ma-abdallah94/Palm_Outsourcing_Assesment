import { expect, Locator, Page } from "@playwright/test";
import { Fluent } from "../utils/fluent";

export class SignInPage extends Fluent {
    readonly page: Page;
    readonly emailInput: Locator;
    readonly passwordInput: Locator;
    readonly loginSubmitButton: Locator;

    constructor(page: Page) {
        super();
        this.page = page;
        this.emailInput = this.page.getByTestId('email');
        this.passwordInput = this.page.getByTestId('password');
        this.loginSubmitButton = this.page.getByTestId('login-submit');
    }

    navigateToSignInPage(): this {
        return this.step(() => this.page.goto(process.env.BASE_URL as string + '/signin'));
    }

    enterEmail(email: string): this {
        return this.step(() => this.emailInput.fill(email));
    }

    enterPassword(password: string): this {
        return this.step(() => this.passwordInput.fill(password));
    }

    clickLoginSubmitButton(): this {
        return this.step(() => this.loginSubmitButton.click());
    }

    login(email: string, password: string): this {
        return this.step(async () => {
            await this.emailInput.fill(email);
            await this.passwordInput.fill(password);
            await this.loginSubmitButton.click();
        });
    }

    loginIfVisible(email: string, password: string): this {
        return this.step(async () => {
            if (await this.emailInput.isVisible()) {
                await this.emailInput.fill(email);
                await this.passwordInput.fill(password);
                await this.loginSubmitButton.click();
            }
        });
    }

    expectAccountPage(): this {
        return this.step(() => expect(this.page).toHaveURL(process.env.BASE_URL as string + 'account'));
    }
}