import { Page } from '@playwright/test';
import { PAGES } from '../constants/pages';


export class BasePage {
    readonly page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    async navigate(path: PAGES): Promise<void> {
        await this.page.goto(path, { waitUntil: 'domcontentloaded' });

        await this.page.evaluate(() => {
            const ads = document.querySelector('#fixedban');
            if (ads) ads.remove();
        });
    }

    async removeObstructingElements(): Promise<void> {
        await this.page.evaluate(() => {
            const selectors = ['#fixedban', 'footer'];
            selectors.forEach(selector => {
                const element = document.querySelector(selector);
                if (element) {
                    element.remove();
                }
            });
        });
    }
}