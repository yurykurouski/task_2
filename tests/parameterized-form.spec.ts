import { test, expect } from '@playwright/test';
import { PracticeFormPage } from '../pages/PracticeFormPage';
import { PAGES } from '../constants/pages';
import { faker } from '@faker-js/faker';

const testData = [
    { gender: 'Male', hobby: 'Sports' },
    { gender: 'Female', hobby: 'Reading' },
    { gender: 'Other', hobby: 'Music' },
];

test.describe('Parameterized Practice Form Tests', () => {
    let practiceFormPage: PracticeFormPage;

    test.beforeEach(async ({ page }) => {
        practiceFormPage = new PracticeFormPage(page);
        await practiceFormPage.navigate(PAGES.PRACTICE_FORM);
    });

    for (const data of testData) {
        test(`should submit form with gender ${data.gender} and hobby ${data.hobby}`, async () => {
            const firstName = faker.person.firstName();
            const lastName = faker.person.lastName();
            const mobile = faker.string.numeric(10);

            await practiceFormPage.fillFirstName(firstName);
            await practiceFormPage.fillLastName(lastName);
            await practiceFormPage.selectGender(data.gender);
            await practiceFormPage.fillMobile(mobile);
            await practiceFormPage.selectHobbies([data.hobby]);

            await practiceFormPage.submitForm();

            await expect(practiceFormPage.modalTitle).toBeVisible();
            const modalData = await practiceFormPage.getModalData();
            expect(modalData['Gender']).toBe(data.gender);
            expect(modalData['Hobbies']).toContain(data.hobby);
        });
    }
});
