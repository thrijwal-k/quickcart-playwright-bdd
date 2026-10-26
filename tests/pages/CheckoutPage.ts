import { Page, Locator } from '@playwright/test';

export interface Customer {
  name: string;
  email: string;
  postcode: string;
}

export class CheckoutPage {
  readonly name: Locator;
  readonly email: Locator;
  readonly postcode: Locator;
  readonly placeOrder: Locator;
  readonly errors: Locator;
  readonly confirmation: Locator;
  readonly orderId: Locator;
  readonly orderTotal: Locator;

  constructor(private readonly page: Page) {
    this.name = page.getByTestId('name');
    this.email = page.getByTestId('email');
    this.postcode = page.getByTestId('postcode');
    this.placeOrder = page.getByTestId('place-order');
    this.errors = page.getByTestId('checkout-error');
    this.confirmation = page.getByTestId('confirmation');
    this.orderId = page.getByTestId('order-id');
    this.orderTotal = page.getByTestId('order-total');
  }

  async fill(customer: Customer) {
    await this.name.fill(customer.name);
    await this.email.fill(customer.email);
    await this.postcode.fill(customer.postcode);
  }

  async submit(customer: Customer) {
    await this.fill(customer);
    await this.placeOrder.click();
  }
}
