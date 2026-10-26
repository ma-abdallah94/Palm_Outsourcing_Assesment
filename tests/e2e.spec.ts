import { test, expect } from '../utils/fixtures/base.fixture';
import data from '../data/data.json';

test.only('navigate to home page', async ({ homePage, page, signInPage, productPage, cartPage }) => {
  await test.step('Sign in', async () => {
    await homePage.navigateToHomePage();
    await homePage.clickSignInButton();
    await signInPage.login(process.env.CUSTOMER2_EMAIL as string, process.env.CUSTOMER2_PASSWORD as string);
    await expect(page).toHaveURL(process.env.BASE_URL as string + 'account');
  });

  const productName = await test.step('Add an in-stock product to the cart', async () => {
    await homePage.navigateToHomePage();
    await homePage.clickInStockProduct();
    const name = await productPage.extractProductName();

    await productPage.clickProductAddToCartButton();
    await expect(productPage.addedToCartMessage).toBeVisible();
    return name;
  });

  await test.step('Open the cart', async () => {
    await homePage.clickCartNavButton();
    await expect(page).toHaveURL(process.env.BASE_URL as string + 'checkout');
    await cartPage.waitForStepsCheckoutBar();
    await expect(cartPage.cartItemName(productName as string)).toBeVisible();
  });

  await test.step('Continue checkout as the signed-in customer', async () => {
    await cartPage.clickProceedToStep2();

    if (await signInPage.emailInput.isVisible()) {
      await signInPage.login(process.env.CUSTOMER2_EMAIL as string, process.env.CUSTOMER2_PASSWORD as string);
    }
    await expect(cartPage.youAreLoggedInMessage(data.youAreLoggedInMessage)).toBeVisible();
    await cartPage.clickProceedToStep3();
  });

  await test.step('Fill the billing address', async () => {
    await cartPage.fillShippingAddress(
      data.billingAddress.country,
      data.billingAddress.postalCode,
      data.billingAddress.houseNumber,
      data.billingAddress.street,
      data.billingAddress.city,
      data.billingAddress.state,
    );
    await cartPage.clickStep3AddressFinish();
  });

  await test.step('Pay with cash on delivery', async () => {
    await cartPage.pickPaymentMethod(data.cashPaymentMethod);
    await cartPage.clickStep4CheckpaymentButton();
    await expect(cartPage.paymentSuccessMessage).toBeVisible();

    await cartPage.clickStep4ConfirmButton();
    await expect(cartPage.thanksForYourOrderMessage(data.thanksForYourOrderMessage)).toBeVisible();
  });
});
