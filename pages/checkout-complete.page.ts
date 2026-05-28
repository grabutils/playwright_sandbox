import { Page, Locator } from '@playwright/test';

export class CheckoutCompletePage {
  readonly page: Page;
  readonly completeContainer: Locator;
  readonly thankYouHeading: Locator;
  readonly backHomeButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.completeContainer = page.getByTestId('checkout-complete-container');
    this.thankYouHeading = page.getByRole('heading', { name: 'Thank you for your order!' });
    this.backHomeButton = page.getByTestId('back-to-products');
  }

  async backToProducts(): Promise<void> {
    await this.backHomeButton.click();
  }
}
