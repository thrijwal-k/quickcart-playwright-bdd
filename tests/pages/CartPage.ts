import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class CartPage extends BasePage {
  readonly lines: Locator;
  readonly subtotal: Locator;
  readonly empty: Locator;
  readonly checkoutButton: Locator;

  constructor(page: Page) {
    super(page);
    this.lines = page.getByTestId('cart-line');
    this.subtotal = page.getByTestId('subtotal');
    this.empty = page.getByTestId('empty-cart');
    this.checkoutButton = page.getByTestId('checkout');
  }

  line(name: string): Locator {
    return this.page.locator(`[data-testid="cart-line"][data-product="${name}"]`);
  }

  quantity(name: string): Locator {
    return this.line(name).getByTestId('line-qty');
  }

  async increase(name: string) {
    await this.page.getByRole('button', { name: `Increase ${name}` }).click();
  }

  async decrease(name: string) {
    await this.page.getByRole('button', { name: `Decrease ${name}` }).click();
  }

  async remove(name: string) {
    await this.line(name).getByTestId('remove-line').click();
  }

  async checkout() {
    await this.checkoutButton.click();
  }
}
