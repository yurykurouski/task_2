import { test, expect } from '@playwright/test';
import { ToolTipsPage } from '../pages/ToolTipsPage';
import { PAGES } from '../constants/pages';

test.describe('Tool Tips Tests', () => {
    let toolTipsPage: ToolTipsPage;

    test.beforeEach(async ({ page }) => {
        toolTipsPage = new ToolTipsPage(page);
        await toolTipsPage.navigate(PAGES.TOOL_TIPS);
    });

    test('should check text on all tooltips', async () => {
        await toolTipsPage.hoverButton();
        expect(await toolTipsPage.getToolTipText()).toBe('You hovered over the Button');

        await toolTipsPage.hoverInput();
        expect(await toolTipsPage.getToolTipText()).toBe('You hovered over the text field');

        await toolTipsPage.hoverContraryLink();
        expect(await toolTipsPage.getToolTipText()).toBe('You hovered over the Contrary');

        await toolTipsPage.hoverSectionLink();
        expect(await toolTipsPage.getToolTipText()).toBe('You hovered over the 1.10.32');
    });

    test('should hide tooltip after mouse leaves (negative scenario)', async ({ page }) => {
        await toolTipsPage.hoverButton();
        await expect(toolTipsPage.tooltip).toBeVisible();

        await page.mouse.move(0, 0);
        await expect(toolTipsPage.tooltip).toBeHidden();
    });
});
