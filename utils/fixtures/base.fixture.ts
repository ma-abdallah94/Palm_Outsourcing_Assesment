import { test as base } from '@playwright/test';
import { HomePage } from '../../pages/home.page';
import { SignInPage } from '../../pages/signIn.page';
import { ProductPage } from '../../pages/product.page';
import { CartPage } from '../../pages/cart.page';
import { FavoritesPage } from '../../pages/favorites.page';
import { ToolshopApi } from '../api/toolshop.api';

type fixtures = {
    homePage: HomePage
    signInPage: SignInPage
    productPage: ProductPage
    cartPage: CartPage
    favoritesPage: FavoritesPage
    api: ToolshopApi
}

export const test = base.extend<fixtures>({
    homePage: async ({ page }, use) => await use(new HomePage(page)),
    signInPage: async ({ page }, use) => await use(new SignInPage(page)),
    productPage: async ({ page }, use) => await use(new ProductPage(page)),
    cartPage: async ({ page }, use) => await use(new CartPage(page)),
    favoritesPage: async ({ page }, use) => await use(new FavoritesPage(page)),
    api: async ({ request }, use) => await use(new ToolshopApi(request)),
})

export { expect } from '@playwright/test';
