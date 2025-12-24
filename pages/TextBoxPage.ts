import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class TextBoxPage extends BasePage {
    readonly fullNameInput: Locator;
    readonly emailInput: Locator;
    readonly currentAddressInput: Locator;
    readonly permanentAddressInput: Locator;
    readonly submitButton: Locator;
    readonly outputArea: Locator;

    constructor(page: Page) {
        super(page);
        this.fullNameInput = page.locator('#userName');
        this.emailInput = page.locator('#userEmail');
        this.currentAddressInput = page.locator('#currentAddress');
        this.permanentAddressInput = page.locator('#permanentAddress');
        this.submitButton = page.locator('#submit');
        this.outputArea = page.locator('#output');
    }

    async fillForm(name: string, email: string, currentAddress: string, permanentAddress: string): Promise<void> {
        await this.fullNameInput.fill(name);
        await this.emailInput.fill(email);
        await this.currentAddressInput.fill(currentAddress);
        await this.permanentAddressInput.fill(permanentAddress);
    }

    async submit(): Promise<void> {
        await this.submitButton.click();
    }

    async getOutput(): Promise<string | null> {
        if (await this.outputArea.isVisible()) {
            return await this.outputArea.textContent();
        }
        return null;
    }
}
