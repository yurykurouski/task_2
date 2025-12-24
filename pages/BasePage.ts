import { Page } from '@playwright/test';
import { PAGES } from '../constants/pages';


export class BasePage {
    readonly page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    async navigate(path: PAGES): Promise<void> {
        await this.page.goto(path, { waitUntil: 'domcontentloaded' });

        // Add style tag to hide ads consistently
        await this.page.addStyleTag({
            content: `
                #fixedban, footer, iframe[src*="google"], [id*="google_ads_iframe"], .ad-plus-container {
                    display: none !important;
                    visibility: hidden !important;
                    height: 0 !important;
                    width: 0 !important;
                    pointer-events: none !important;
                    z-index: -1000 !important;
                }
            `
        });

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