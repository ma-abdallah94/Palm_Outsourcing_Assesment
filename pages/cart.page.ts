import { expect, Locator, Page } from "@playwright/test";
import { Fluent } from "../utils/fluent";
import { SignInPage } from "./signIn.page";

export class CartPage extends Fluent {
    readonly page: Page;
    readonly cartItemName                   :(itemName: string) => Locator;
    readonly youAreLoggedInMessage          :(message: string) => Locator;
    readonly step1ProceedToCheckoutButton   : Locator;
    readonly step2ProceedToCheckoutButton   : Locator;
    readonly step3ProceedToCheckoutButton   : Locator;
    readonly step4FinishButton              : Locator;
    readonly billingAddressCountryDropdownInput: Locator;
    readonly postalCodeInput                : Locator;
    readonly houseNumberInput               : Locator;
    readonly streetInput                    : Locator;
    readonly cityInput                      : Locator;
    readonly stateInput                     : Locator;
    readonly postcodeLookupLoading          : Locator;
    readonly paymentMethodDropdownInput     : Locator;
    readonly paymentSuccessMessage          : Locator;
    readonly thanksForYourOrderMessage      : (message: string) => Locator;
    readonly stepsCheckoutBar               : Locator;



    constructor(page: Page) {
        super();
        this.page = page;
        this.cartItemName                       = (itemName) => this.page.getByRole('cell', { name: itemName, exact: true });
        this.youAreLoggedInMessage              = (message) => this.page.getByText(message);
        this.step1ProceedToCheckoutButton       = this.page.getByTestId('proceed-1');
        this.step2ProceedToCheckoutButton       = this.page.getByTestId('proceed-2');
        this.step3ProceedToCheckoutButton       = this.page.getByTestId('proceed-3');
        this.step4FinishButton                  = this.page.getByTestId('finish');
        this.billingAddressCountryDropdownInput = this.page.getByTestId('country');
        this.postalCodeInput                    = this.page.getByTestId('postal_code');
        this.houseNumberInput                   = this.page.getByTestId('house_number');
        this.streetInput                        = this.page.getByTestId('street');
        this.cityInput                          = this.page.getByTestId('city');
        this.stateInput                         = this.page.getByTestId('state');
        this.postcodeLookupLoading              = this.page.getByTestId('postcode-lookup-loading');
        this.paymentMethodDropdownInput         = this.page.getByRole('combobox', { name: 'Payment Method' });
        this.paymentSuccessMessage              = this.page.getByTestId('payment-success-message');
        this.thanksForYourOrderMessage          = (message) => this.page.getByText(message);
        this.stepsCheckoutBar                   = this.page.locator('//ul[@class="steps-4 steps-indicator"]');
    }
    expectCheckoutWithItem(itemName: string): this {
        return this.step(async () => {
            await expect(this.page).toHaveURL(process.env.BASE_URL as string + 'checkout');
            await this.stepsCheckoutBar.waitFor({ state: 'visible' });
            await expect(this.cartItemName(itemName)).toBeVisible();
        });
    }

    continueAsSignedIn(signInPage: SignInPage, email: string, password: string, message: string): this {
        return this.step(async () => {
            await this.step1ProceedToCheckoutButton.click();
            await signInPage.loginIfVisible(email, password);
            await expect(this.youAreLoggedInMessage(message)).toBeVisible();
            await this.step2ProceedToCheckoutButton.click();
        });
    }

    fillShippingAddress(country: string, postalCode: string, houseNumber: string, street: string, city: string, state: string): this {
        return this.step(() => this.fillEmptyAddressFields(country, postalCode, houseNumber, street, city, state));
    }

    confirmAddress(): this {
        return this.step(() => this.step3ProceedToCheckoutButton.click());
    }

    payWithCashOnDelivery(paymentMethod: string, thanksMessage: string): this {
        return this.step(async () => {
            await this.paymentMethodDropdownInput.selectOption(paymentMethod);
            await this.step4FinishButton.filter({ hasText: 'Check payment' }).click();
            await expect(this.paymentSuccessMessage).toBeVisible();
            await this.step4FinishButton.filter({ hasText: 'Confirm' }).click();
            await expect(this.thanksForYourOrderMessage(thanksMessage)).toBeVisible();
        });
    }

    private async fillEmptyAddressFields(country: string, postalCode: string, houseNumber: string, street: string, city: string, state: string) {
        if ((await this.billingAddressCountryDropdownInput.inputValue()).trim() === '') {
            await this.billingAddressCountryDropdownInput.selectOption(country);
        }
        if ((await this.postalCodeInput.inputValue()).trim() === '') {
            await this.postalCodeInput.fill(postalCode);
        }
        if ((await this.houseNumberInput.inputValue()).trim() === '') {
            await this.houseNumberInput.fill(houseNumber);
        }

        // These three fields can trigger a lookup that fills street, city, and state.
        await this.postcodeLookupLoading.waitFor({ state: 'visible', timeout: 2000 }).catch(() => undefined);
        await expect(this.postcodeLookupLoading).toBeHidden();

        if ((await this.streetInput.inputValue()).trim() === '') {
            await this.streetInput.fill(street);
        }
        if ((await this.cityInput.inputValue()).trim() === '') {
            await this.cityInput.fill(city);
        }
        if ((await this.stateInput.inputValue()).trim() === '') {
            await this.stateInput.fill(state);
        }

        await expect(this.billingAddressCountryDropdownInput).not.toHaveValue('');
        await expect(this.postalCodeInput).not.toHaveValue('');
        await expect(this.houseNumberInput).not.toHaveValue('');
        await expect(this.streetInput).not.toHaveValue('');
        await expect(this.cityInput).not.toHaveValue('');
        await expect(this.stateInput).not.toHaveValue('');
        await expect(this.step3ProceedToCheckoutButton).toBeEnabled();
    }
 
    clickProceedToStep2(): this {
        return this.step(() => this.step1ProceedToCheckoutButton.click());
    }

    clickProceedToStep3(): this {
        return this.step(() => this.step2ProceedToCheckoutButton.click());
    }

    clickStep3AddressFinish(): this {
        return this.step(() => this.step3ProceedToCheckoutButton.click());
    }

    pickPaymentMethod(paymentMethod: string): this {
        return this.step(() => this.paymentMethodDropdownInput.selectOption(paymentMethod));
    }

    clickStep4CheckpaymentButton(): this {
        return this.step(() => this.step4FinishButton.filter({ hasText: 'Check payment' }).click());
    }

    clickStep4ConfirmButton(): this {
        return this.step(() => this.step4FinishButton.filter({ hasText: 'Confirm' }).click());
    }

    waitForStepsCheckoutBar(): this {
        return this.step(() => this.stepsCheckoutBar.waitFor({ state: 'visible' }));
    }



}   