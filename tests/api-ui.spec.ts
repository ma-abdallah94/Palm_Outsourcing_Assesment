import { test } from '../utils/fixtures/base.fixture';
import data from '../data/data.json';

test('a favorite created through the API shows in the UI', async ({ api, homePage, signInPage, favoritesPage }) => {
    const email = `palm.${Date.now()}@example.com`;
    const customer = { ...data.registration, email };

    const productName = await api
        .registerCustomer(customer)
        .login(email, customer.password)
        .addFirstProductToFavorites();

    await homePage.navigateToHomePage().clickSignInButton();
    await signInPage.login(email, customer.password).expectAccountPage();
    await homePage.openMyFavorites();
    await favoritesPage.expectProduct(productName);
});
