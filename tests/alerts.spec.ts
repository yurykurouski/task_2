import { test, expect } from '@playwright/test';
import { AlertsPage } from '../pages/AlertsPage';
import { PAGES } from '../constants/pages';


test.describe('Alerts Page Tests', () => {
    let alertsPage: AlertsPage;

    test.beforeEach(async ({ page }) => {
        alertsPage = new AlertsPage(page);
        await alertsPage.navigate(PAGES.ALERTS);
    });

    test('should display and accept simple alert', async () => {
        const alertMessage = await alertsPage.clickAlertButton();

        expect(alertMessage).toBe('You clicked a button');
    });

    test('should display and accept timer alert after 5 seconds', async () => {
        const alertMessage = await alertsPage.clickTimerAlertButton();

        expect(alertMessage).toBe('This alert appeared after 5 seconds');
    });

    test('should display confirm alert and accept it', async () => {
        const alertMessage = await alertsPage.clickConfirmButton(true);
        expect(alertMessage).toBe('Do you confirm action?');

        const resultText = await alertsPage.getConfirmResult();
        expect(resultText).toBe('You selected Ok');
    });

    test('should display confirm alert and dismiss it', async () => {
        const alertMessage = await alertsPage.clickConfirmButton(false);

        expect(alertMessage).toBe('Do you confirm action?');

        const resultText = await alertsPage.getConfirmResult();
        expect(resultText).toBe('You selected Cancel');
    });

    test('should display prompt alert and accept with text', async () => {
        const testName = 'John Doe';
        const alertMessage = await alertsPage.clickPromptButton(testName);

        expect(alertMessage).toBe('Please enter your name');

        const resultText = await alertsPage.getPromptResult();
        expect(resultText).toContain(testName);
    });

    test('should display prompt alert and cancel it', async () => {
        const alertMessage = await alertsPage.clickPromptButton(null);

        expect(alertMessage).toBe('Please enter your name');

        const isVisible = await alertsPage.isPromptResultVisible();

        if (isVisible) {
            const resultText = await alertsPage.getPromptResult();
            expect(resultText).toBe('');
        }
    });

    test('should handle all alert buttons in sequence', async () => {
        const alert1 = await alertsPage.clickAlertButton();
        expect(alert1).toBe('You clicked a button');

        const alert2 = await alertsPage.clickTimerAlertButton();
        expect(alert2).toBe('This alert appeared after 5 seconds');

        const alert3 = await alertsPage.clickConfirmButton(true);
        expect(alert3).toBe('Do you confirm action?');
        expect(await alertsPage.getConfirmResult()).toBe('You selected Ok');

        const alert4 = await alertsPage.clickPromptButton('Test User');
        expect(alert4).toBe('Please enter your name');

        expect(await alertsPage.getPromptResult()).toContain('Test User');
    });
});
