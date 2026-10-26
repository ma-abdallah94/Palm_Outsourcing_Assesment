import { test } from '../utils/fixtures/base.fixture';
import data from '../data/data.json';

test('a favorite created through the API shows in the UI', async ({ api, homePage, signInPage, favoritesPage }) => {
  const email = `palm.${Date.now()}@example.com`;
  const customer = { ...data.registration, email };

  const productName = await test.step('Create a favorite through the API', async () => {
    await api.registerCustomer(customer);
    await api.login(email, customer.password);
    return api.addFirstProductToFavorites();
  });

  await test.step('Sign in', async () => {
    await homePage.navigateToHomePage();
    await homePage.clickSignInButton();
    await signInPage.login(email, customer.password);
    await signInPage.expectAccountPage();
  });

  await test.step('Open favorites and confirm the product', async () => {
    await homePage.openMyFavorites();
    await favoritesPage.expectProduct(productName);
  });
});
