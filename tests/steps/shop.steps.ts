import { expect } from '@playwright/test';
import { Given, When, Then } from '../fixtures';

// ---------- Sign in ----------
Given('I am on the QuickCart sign-in page', async ({ loginPage }) => {
  await loginPage.open();
});

Given('I am signed in as a shopper', async ({ loginPage, productsPage }) => {
  await loginPage.open();
  await loginPage.signIn('shopper', 'Passw0rd!');
  await expect(productsPage.welcome).toBeVisible();
});

When('I sign in as {string} with password {string}', async ({ loginPage }, username: string, password: string) => {
  await loginPage.signIn(username, password);
});

When('I sign out', async ({ productsPage }) => {
  await productsPage.signOut();
});

Then('I see the welcome message {string}', async ({ productsPage }, message: string) => {
  await expect(productsPage.welcome).toHaveText(message);
});

Then('I see the sign-in error {string}', async ({ loginPage }, message: string) => {
  await expect(loginPage.error).toHaveText(message);
});

Then('I am back on the sign-in page', async ({ loginPage }) => {
  await expect(loginPage.submit).toBeVisible();
});

// ---------- Products ----------
When('I search for {string}', async ({ productsPage }, term: string) => {
  await productsPage.searchFor(term);
});

Then('I see {int} products', async ({ productsPage }, count: number) => {
  await expect(productsPage.cards).toHaveCount(count);
});

Then('the {string} product cannot be added to the cart', async ({ productsPage }, name: string) => {
  await expect(productsPage.addButton(name)).toBeDisabled();
  await expect(productsPage.addButton(name)).toHaveText('Sold out');
});

When(/^I add "(.+)" to the cart (\d+) times?$/, async ({ productsPage }, name: string, times: number) => {
  await productsPage.add(name, Number(times));
});

// ---------- Cart ----------
Given('I open my cart', async ({ productsPage }) => {
  await productsPage.goToCart();
});

Then(/^my cart shows (\d+) items?$/, async ({ productsPage }, count: number) => {
  await expect(productsPage.cartCount).toHaveText(String(count));
});

Then('my cart has {int} lines', async ({ cartPage }, count: number) => {
  await expect(cartPage.lines).toHaveCount(count);
});

Then('the subtotal is {string}', async ({ cartPage }, amount: string) => {
  await expect(cartPage.subtotal).toHaveText(amount);
});

When('I increase the quantity of {string}', async ({ cartPage }, name: string) => {
  await cartPage.increase(name);
});

When('I decrease the quantity of {string}', async ({ cartPage }, name: string) => {
  await cartPage.decrease(name);
});

When('I remove {string} from the cart', async ({ cartPage }, name: string) => {
  await cartPage.remove(name);
});

Then('the quantity of {string} is {int}', async ({ cartPage }, name: string, qty: number) => {
  await expect(cartPage.quantity(name)).toHaveText(String(qty));
});

Then('I see the message {string}', async ({ page }, message: string) => {
  await expect(page.getByText(message, { exact: true })).toBeVisible();
});

// ---------- Checkout ----------
Given('I go to checkout', async ({ cartPage }) => {
  await cartPage.checkout();
});

When(
  'I place the order as {string} with email {string} and postcode {string}',
  async ({ checkoutPage }, name: string, email: string, postcode: string) => {
    await checkoutPage.submit({ name, email, postcode });
  },
);

Then('I see the order confirmation', async ({ checkoutPage }) => {
  await expect(checkoutPage.confirmation).toHaveText('Order confirmed');
  await expect(checkoutPage.orderId).toHaveText(/^\d+$/);
});

Then('the order total is {string}', async ({ checkoutPage }, amount: string) => {
  await expect(checkoutPage.orderTotal).toHaveText(amount);
});

Then('I see the checkout error {string}', async ({ checkoutPage }, error: string) => {
  await expect(checkoutPage.errors).toContainText([error]);
});
