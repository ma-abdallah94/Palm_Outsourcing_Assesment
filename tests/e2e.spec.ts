import { test, expect } from '../utils/fixtures/base.fixture';
import data from '../data/data.json';

test.only('navigate to home page', async ({ homePage , page , signInPage , productPage , cartPage }) => {
  await homePage.navigateToHomePage();
  await expect(page).toHaveTitle(/Practice Software Testing/);

  await homePage.clickSignInButton();
  await expect(page).toHaveTitle(/Sign In/);

  await signInPage.login(process.env.CUSTOMER2_EMAIL as string, process.env.CUSTOMER2_PASSWORD as string);
  await expect(page).toHaveURL(process.env.BASE_URL as string + '/account');

  await homePage.navigateToHomePage();
  await homePage.clickInStockProduct(); 
  await expect(productPage.productName).toBeVisible();
  const productName = await productPage.extractProductName();
 
 
  await productPage.clickProductAddToCartButton();
  await expect(productPage.addedToCartMessage).toBeVisible();

  
  await homePage.clickCartNavButton();
  await expect(cartPage.cartItemName(productName as string)).toBeVisible();


  await cartPage.clickCartCheckoutButton();
  await expect(page).toHaveURL(process.env.BASE_URL as string + '/checkout');

  await cartPage.clickProceedToStep2();

  if (await signInPage.emailInput.isVisible()) {
    await signInPage.login(process.env.CUSTOMER2_EMAIL as string, process.env.CUSTOMER2_PASSWORD as string);
  }
  await expect(cartPage.youAreLoggedInMessage(data.youAreLoggedInMessage)).toBeVisible();
  await cartPage.clickProceedToStep3();


  await cartPage.fillShippingAddress(
    data.billingAddress.country,
    data.billingAddress.postalCode,
    data.billingAddress.houseNumber,
    data.billingAddress.street,
    data.billingAddress.city,
    data.billingAddress.state,
  );
  await cartPage.clickStep3AddressFinish();

  await cartPage.pickPaymentMethod(data.cashPaymentMethod);
  await cartPage.clickStep4CheckpaymentButton();
  await expect(cartPage.paymentSuccessMessage).toBeVisible();

  await cartPage.clickStep4ConfirmButton();
  await expect(cartPage.thanksForYourOrderMessage(data.thanksForYourOrderMessage)).toBeVisible();
});

