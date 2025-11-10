import { Page, Locator } from '@playwright/test';

export class AlertsPage {
    readonly page: Page;
    readonly alertButton: Locator;
    readonly timerAlertButton: Locator;
    readonly confirmButton: Locator;
    readonly promtButton: Locator;
    readonly confirmResult: Locator;
    readonly promptResult: Locator;

    constructor(page: Page) {
        this.page = page;

        // Locators for all buttons on the alerts page
        this.alertButton = page.locator('#alertButton');
        this.timerAlertButton = page.locator('#timerAlertButton');
        this.confirmButton = page.locator('#confirmButton');
        this.promtButton = page.locator('#promtButton');

        // Result text locators
        this.confirmResult = page.locator('#confirmResult');
        this.promptResult = page.locator('#promptResult');
    }

    async navigate(): Promise<void> {
        await this.page.goto('/alerts');

        await this.page.evaluate(() => {
            const ads = document.querySelector('#fixedban');
            if (ads) ads.remove();
        });
    }

    async clickAlertButton(): Promise<string> {
        let message: string = '';

        this.page.once('dialog', async dialog => {
            message = dialog.message();
            await dialog.accept();
        });
        await this.alertButton.click({ force: true });

        await this.page.waitForTimeout(100);
        return message;
    }

    async clickTimerAlertButton(): Promise<string> {
        let message: string = '';

        this.page.once('dialog', async dialog => {
            message = dialog.message();
            await dialog.accept();
        });
        await this.timerAlertButton.click({ force: true });

        await this.page.waitForTimeout(5500);
        return message;
    }

    async clickConfirmButton(accept: boolean = true): Promise<string> {
        let message: string = '';

        this.page.once('dialog', async dialog => {
            message = dialog.message();
            if (accept) {
                await dialog.accept();
            } else {
                await dialog.dismiss();
            }
        });
        await this.confirmButton.click({ force: true });

        await this.page.waitForTimeout(100);
        return message;
    }

    async clickPromptButton(text: string | null = null): Promise<string> {
        let message: string = '';

        this.page.once('dialog', async dialog => {
            message = dialog.message();
            if (text !== null) {
                await dialog.accept(text);
            } else {
                await dialog.dismiss();
            }
        });
        await this.promtButton.click({ force: true });

        await this.page.waitForTimeout(100);
        return message;
    }

    async getConfirmResult(): Promise<string | null> {
        return await this.confirmResult.textContent();
    }

    async getPromptResult(): Promise<string | null> {
        return await this.promptResult.textContent();
    }

    async isPromptResultVisible(): Promise<boolean> {
        return await this.promptResult.isVisible();
    }
}
