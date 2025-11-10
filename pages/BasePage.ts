import { Page } from '@playwright/test';
import { PAGES } from '../constants/pages';


export class BasePage {
    readonly page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    async navigate(path: PAGES): Promise<void> {
        await this.page.goto(path);

        await this.page.evaluate(() => {
            const ads = document.querySelector('#fixedban');
            if (ads) ads.remove();
        });
    }
}