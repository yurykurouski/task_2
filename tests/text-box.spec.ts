import { test, expect } from '@playwright/test';
import { TextBoxPage } from '../pages/TextBoxPage';
import { PAGES } from '../constants/pages';
import { faker } from '@faker-js/faker';

test.describe('Text Box Tests', () => {
    let textBoxPage: TextBoxPage;

    test.beforeEach(async ({ page }) => {
        textBoxPage = new TextBoxPage(page);
        await textBoxPage.navigate(PAGES.TEXT_BOX);
    });

    test('should fill text box with random data and check result', async () => {
        const name = faker.person.fullName();
        const email = faker.internet.email();
        const currentAddress = faker.location.streetAddress();
        const permanentAddress = faker.location.secondaryAddress();

        await textBoxPage.fillForm(name, email, currentAddress, permanentAddress);
        await textBoxPage.submit();

        const output = await textBoxPage.getOutput();
        expect(output).toContain(`Name:${name}`);
        expect(output).toContain(`Email:${email}`);
        expect(output).toContain(`Current Address :${currentAddress}`);
        expect(output).toContain(`Permananet Address :${permanentAddress}`);
    });

    test('should not show output when email is invalid (negative scenario)', async () => {
        const name = faker.person.fullName();
        const invalidEmail = 'invalid-email';

        await textBoxPage.fillForm(name, invalidEmail, 'Address', 'Address');
        await textBoxPage.submit();

        const outputVisible = await textBoxPage.outputArea.isVisible();

        expect(await textBoxPage.emailInput.getAttribute('class')).toContain('field-error');
        expect(outputVisible).toBeFalsy();
    });
});
