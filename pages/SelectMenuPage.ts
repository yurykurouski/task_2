import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class SelectMenuPage extends BasePage {
    readonly withOptGroup: Locator;
    readonly selectOneDropdown: Locator;
    readonly selectOneInput: Locator;
    readonly oldSelectMenu: Locator;
    readonly multiselectDropdown: Locator;
    readonly multiselectInput: Locator;
    readonly standardMultiSelect: Locator;

    constructor(page: Page) {
        super(page);
        this.withOptGroup = page.locator('#withOptGroup');
        this.selectOneDropdown = page.locator('#selectOne');
        this.selectOneInput = page.locator('#react-select-3-input');
        this.oldSelectMenu = page.locator('#oldSelectMenu');
        this.multiselectDropdown = page.locator('//p[b[text()="Multiselect drop down"]]/following-sibling::div');
        this.multiselectInput = page.locator('#react-select-4-input');
        this.standardMultiSelect = page.locator('#cars');
    }

    async selectValue(option: string): Promise<void> {
        await this.withOptGroup.click();
        await this.page.locator(`div[id^="react-select-2-option"]:has-text("${option}")`).click();
    }

    async selectOne(option: string): Promise<void> {
        await this.selectOneInput.fill(option);
        await this.page.keyboard.press('Enter');
    }

    async selectOldStyle(color: string): Promise<void> {
        await this.oldSelectMenu.selectOption({ label: color });
    }

    async selectMulti(colors: string[]): Promise<void> {
        for (const color of colors) {
            await this.multiselectInput.fill(color);
            await this.page.keyboard.press('Enter');
        }
    }

    async selectStandardMulti(cars: string[]): Promise<void> {
        await this.standardMultiSelect.selectOption(cars);
    }
}
