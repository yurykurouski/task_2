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
        await this.robustHover(this.toolTipButton);
    }

    async hoverInput(): Promise<void> {
        await this.robustHover(this.toolTipTextField);
    }

    async hoverContraryLink(): Promise<void> {
        await this.robustHover(this.contraryLink);
    }

    async hoverSectionLink(): Promise<void> {
        await this.robustHover(this.sectionLink);
    }

    async getToolTipText(): Promise<string | null> {
        const tooltip = this.tooltip.last();
        const text = await tooltip.textContent();

        await this.page.mouse.move(0, 0);
        await tooltip.waitFor({ state: 'hidden' });
        return text;
    }

    private async robustHover(locator: Locator): Promise<void> {
        await this.removeObstructingElements();
        await locator.scrollIntoViewIfNeeded();

        // Retry hover up to 3 times if tooltip doesn't appear
        for (let i = 0; i < 3; i++) {
            await locator.hover();
            try {
                // Wait for tooltip to appear quickly
                await this.tooltip.last().waitFor({ state: 'visible', timeout: 2000 });
                return; // Tooltip appeared, success
            } catch (e) {
                if (i === 2) throw new Error(`Tooltip did not appear after hovering ${await locator.innerText()} 3 times`);

                // If failed, move mouse away and try again
                await this.page.mouse.move(0, 0);
                await this.page.waitForTimeout(500);
            }
        }
    }
}
