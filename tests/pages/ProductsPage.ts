import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class ProductsPage extends BasePage {
  readonly search: Locator;
  readonly cards: Locator;
  readonly noResults: Locator;

  constructor(page: Page) {
    super(page);
    this.search = page.getByTestId('search');
    this.cards = page.getByTestId('product-card');
    this.noResults = page.getByTestId('no-results');
  }

  card(name: string): Locator {
    return this.page.locator(`[data-testid="product-card"][data-product="${name}"]`);
  }

  addButton(name: string): Locator {
    return this.card(name).getByTestId('add-to-cart');
  }

  async searchFor(term: string) {
    await this.search.fill(term);
  }

  async add(name: string, times = 1) {
    for (let i = 0; i < times; i++) await this.addButton(name).click();
  }
}
