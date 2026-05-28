import { Page, Locator } from '@playwright/test';

export class InventoryPage {
  readonly page: Page;
  readonly cartBadge: Locator;
  readonly cartLink: Locator;

  constructor(page: Page) {
    this.page = page;
    this.cartBadge = page.getByTestId('shopping-cart-badge');
    this.cartLink = page.getByTestId('shopping-cart-link');
  }

  addToCartButton(productTestId: string): Locator {
    return this.page.getByTestId(`add-to-cart-${productTestId}`);
  }

  async addToCart(productTestId: string): Promise<void> {
    await this.addToCartButton(productTestId).click();
  }

  async getCartCount(): Promise<number> {
    const text = await this.cartBadge.textContent();
    return text ? parseInt(text, 10) : 0;
  }

  async goToCart(): Promise<void> {
    await this.cartLink.click();
  }
}
