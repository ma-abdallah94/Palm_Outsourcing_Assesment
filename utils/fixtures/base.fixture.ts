import { test as base } from '@playwright/test';
import { HomePage } from '../../pages/home.page';
import { SignInPage } from '../../pages/signIn.page';
import { ProductPage } from '../../pages/product.page';
import { CartPage } from '../../pages/cart.page';




type pages = {
    homePage: HomePage
    signInPage: SignInPage
    productPage: ProductPage
    cartPage: CartPage
}

export const test = base.extend<pages>({
    homePage: async ({ page }, use) => await use(new HomePage(page)),
    signInPage: async ({ page }, use) => await use(new SignInPage(page)),
    productPage: async ({ page }, use) => await use(new ProductPage(page)),
    cartPage: async ({ page }, use) => await use(new CartPage(page)),
})

export {expect} from '@playwright/test';