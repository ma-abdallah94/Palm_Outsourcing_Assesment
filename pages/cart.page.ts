import { expect, Locator, Page } from "@playwright/test";

export class CartPage {
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
    async fillShippingAddress(country: string, postalCode: string, houseNumber: string, street: string, city: string, state: string) {
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
 
    async clickProceedToStep2() {
        await this.step1ProceedToCheckoutButton.click();
    }
    async clickProceedToStep3() {
        await this.step2ProceedToCheckoutButton.click();
    }
    async clickStep3AddressFinish() {
        await this.step3ProceedToCheckoutButton.click();
    }
   
    async pickPaymentMethod(paymentMethod: string) {
        await this.paymentMethodDropdownInput.selectOption(paymentMethod);
    }

    async clickStep4CheckpaymentButton() {
        await this.step4FinishButton.filter({ hasText: 'Check payment' }).click();
    }

    async clickStep4ConfirmButton() {
        await this.step4FinishButton.filter({ hasText: 'Confirm' }).click();
    }

    async waitForStepsCheckoutBar() {
        await this.stepsCheckoutBar.waitFor({ state: 'visible' });
    }



}   