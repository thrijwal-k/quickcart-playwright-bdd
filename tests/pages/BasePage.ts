import { Page, Locator } from '@playwright/test';

/** Shared header elements and navigation available on every signed-in page. */
export class BasePage {
  readonly cartCount: Locator;
  readonly welcome: Locator;

  constructor(protected readonly page: Page) {
    this.cartCount = page.getByTestId('cart-count');
    this.welcome = page.getByTestId('welcome');
  }

  async goToCart() {
    await this.page.getByTestId('nav-cart').click();
  }

  async goToProducts() {
    await this.page.getByTestId('nav-products').click();
  }

  async signOut() {
    await this.page.getByTestId('logout').click();
  }
}
