import { test, expect } from '@playwright/test';
import { SelectMenuPage } from '../pages/SelectMenuPage';
import { PAGES } from '../constants/pages';

test.describe('Select Menu Tests', () => {
    let selectMenuPage: SelectMenuPage;

    test.beforeEach(async ({ page }) => {
        selectMenuPage = new SelectMenuPage(page);
        await selectMenuPage.navigate(PAGES.SELECT_MENU);
    });

    test('should cover functionality with dropdowns', async () => {
        await selectMenuPage.selectValue('Group 2, option 1');

        await selectMenuPage.selectOne('Other');

        await selectMenuPage.selectOldStyle('Green');

        await selectMenuPage.selectMulti(['Black', 'Blue']);

        await expect(selectMenuPage.withOptGroup).toContainText('Group 2, option 1');
        await expect(selectMenuPage.selectOneDropdown).toContainText('Other');
        await expect(selectMenuPage.oldSelectMenu).toHaveValue('2');

        await expect(selectMenuPage.multiselectDropdown).toContainText('Black');
        await expect(selectMenuPage.multiselectDropdown).toContainText('Blue');
    });

    test('should allow multiple selections in standard multi select (negative/additional)', async () => {
        await selectMenuPage.selectStandardMulti(['volvo', 'saab']);
        const selectedOptions = await selectMenuPage.standardMultiSelect.evaluate((node: HTMLSelectElement) => {
            return Array.from(node.selectedOptions).map(option => option.value);
        });
        expect(selectedOptions).toContain('volvo');
        expect(selectedOptions).toContain('saab');
    });
});
