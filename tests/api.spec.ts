import { test } from '../utils/fixtures/base.fixture';

test('login token can read the products list', async ({ api }) => {
    const email = (process.env.CUSTOMER2_EMAIL as string).trim();
    const password = (process.env.CUSTOMER2_PASSWORD as string).trim();

    await api.login(email, password).expectProductList();
});
