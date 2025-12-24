import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class ToolTipsPage extends BasePage {
    readonly toolTipButton: Locator;
    readonly toolTipTextField: Locator;
    readonly contraryLink: Locator;
    readonly sectionLink: Locator;
    readonly tooltip: Locator;

    constructor(page: Page) {
        super(page);
        this.toolTipButton = page.locator('#toolTipButton');
        this.toolTipTextField = page.locator('#toolTipTextField');
        this.contraryLink = page.getByText('Contrary');
        this.sectionLink = page.getByText('1.10.32');
        this.tooltip = page.locator('.tooltip-inner');
    }

    async hoverButton(): Promise<void> {
        await this.removeObstructingElements();
        await this.toolTipButton.scrollIntoViewIfNeeded();
        await this.toolTipButton.hover();
        await this.page.waitForTimeout(500);
    }

    async hoverInput(): Promise<void> {
        await this.removeObstructingElements();
        await this.toolTipTextField.scrollIntoViewIfNeeded();
        await this.toolTipTextField.hover();
        await this.page.waitForTimeout(500);
    }

    async hoverContraryLink(): Promise<void> {
        await this.removeObstructingElements();
        await this.contraryLink.scrollIntoViewIfNeeded();
        await this.contraryLink.hover();
        await this.page.waitForTimeout(500);
    }

    async hoverSectionLink(): Promise<void> {
        await this.removeObstructingElements();
        await this.sectionLink.scrollIntoViewIfNeeded();
        await this.sectionLink.hover();
        await this.page.waitForTimeout(500);
    }

    async getToolTipText(): Promise<string | null> {
        const tooltip = this.tooltip.last();

        await tooltip.waitFor({ state: 'visible', timeout: 5000 }).catch(() => {
            throw new Error('Tooltip did not appear after hover');
        });
        const text = await tooltip.textContent();

        await this.page.mouse.move(0, 0);
        await tooltip.waitFor({ state: 'hidden' });
        return text;
    }
}
