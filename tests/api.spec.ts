import { test } from '../utils/fixtures/base.fixture';

test('login token can read the products list', async ({ api }) => {
  const email = (process.env.CUSTOMER2_EMAIL as string).trim();
  const password = (process.env.CUSTOMER2_PASSWORD as string).trim();

  await test.step('Sign in through the API', async () => {
    await api.login(email, password);
  });

  await test.step('Read the products list', async () => {
    await api.expectProductList();
  });
});
