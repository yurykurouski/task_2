import { test, expect } from '@playwright/test';
import { PracticeFormPage, FormData } from '../pages/PracticeFormPage';
import { getFormData } from './mocks/formData';
import { PAGES } from '../constants/pages';
import { faker } from '@faker-js/faker';


test.describe('Practice Form Tests', () => {
    let practiceFormPage: PracticeFormPage;

    test.beforeEach(async ({ page }) => {
        practiceFormPage = new PracticeFormPage(page);
        await practiceFormPage.navigate(PAGES.PRACTICE_FORM);
    });

    test('should fill complete form and verify submission', async ({ page }) => {
        const formData: FormData = getFormData();

        await practiceFormPage.fillCompleteForm(formData);

        await practiceFormPage.submitForm();

        await expect(practiceFormPage.modalTitle).toBeVisible({ timeout: 10000 });

        const modalTitle = await practiceFormPage.getModalTitle();
        expect(modalTitle).toBe('Thanks for submitting the form');

        const modalData = await practiceFormPage.getModalData();

        expect(modalData['Student Name']).toBe(`${formData.firstName} ${formData.lastName}`);

        expect(modalData['Student Email']).toBe(formData.email);

        expect(modalData['Gender']).toBe(formData.gender);

        expect(modalData['Mobile']).toBe(formData.mobile);

        expect(modalData['Date of Birth']).toContain('15');
        expect(modalData['Date of Birth']).toContain('January');
        expect(modalData['Date of Birth']).toContain('1990');

        expect(modalData['Subjects']).toContain('Maths');
        expect(modalData['Subjects']).toContain('Physics');

        expect(modalData['Hobbies']).toContain('Sports');
        expect(modalData['Hobbies']).toContain('Reading');

        expect(modalData['Picture']).toContain('test-image.png');

        expect(modalData['Address']).toBe(formData.currentAddress);

        expect(modalData['State and City']).toBe(`${formData.state} ${formData.city}`);

        await practiceFormPage.closeModal();
    });

    test('should fill form with different gender - Female', async ({ page }) => {
        const femaleData = {
            firstName: 'Jane',
            lastName: 'Smith',
            gender: 'Female',
        };

        const formData = getFormData(femaleData)

        await practiceFormPage.fillCompleteForm(formData);
        await practiceFormPage.submitForm();

        await expect(practiceFormPage.modalTitle).toBeVisible({ timeout: 10000 });

        const modalData = await practiceFormPage.getModalData();

        expect(modalData['Student Name']).toBe('Jane Smith');
        expect(modalData['Gender']).toBe('Female');
    });

    test('should fill form with Other gender and all hobbies', async ({ page }) => {
        const otherGenderData = {
            gender: 'Other',
            hobbies: ['Sports', 'Reading', 'Music'],
        };

        const formData = getFormData(otherGenderData)

        await practiceFormPage.fillCompleteForm(formData);
        await practiceFormPage.submitForm();

        await expect(practiceFormPage.modalTitle).toBeVisible({ timeout: 10000 });

        const modalData = await practiceFormPage.getModalData();

        expect(modalData['Hobbies']).toContain('Sports');
        expect(modalData['Hobbies']).toContain('Reading');
        expect(modalData['Hobbies']).toContain('Music');
        expect(modalData['Gender']).toBe('Other');
    });

    test('should fill only mandatory fields and verify submission', async ({ page }) => {
        const mandatoryData = {
            firstName: faker.person.firstName(),
            lastName: faker.person.lastName(),
            gender: 'Male',
            mobile: faker.string.numeric(10)
        };

        await practiceFormPage.fillFirstName(mandatoryData.firstName);
        await practiceFormPage.fillLastName(mandatoryData.lastName);
        await practiceFormPage.selectGender(mandatoryData.gender);
        await practiceFormPage.fillMobile(mandatoryData.mobile);

        await practiceFormPage.submitForm();

        await expect(practiceFormPage.modalTitle).toBeVisible();
        const modalData = await practiceFormPage.getModalData();
        expect(modalData['Student Name']).toBe(`${mandatoryData.firstName} ${mandatoryData.lastName}`);
        expect(modalData['Gender']).toBe(mandatoryData.gender);
        expect(modalData['Mobile']).toBe(mandatoryData.mobile);
    });

    test('should show validation error when mandatory fields are empty (negative scenario)', async ({ page }) => {
        await practiceFormPage.submitForm();

        const form = page.locator('form#userForm');
        await expect(form).toHaveClass(/was-validated/);

        await page.waitForTimeout(500);

        const firstNameBorder = await practiceFormPage.firstNameInput.evaluate((el) => getComputedStyle(el).borderColor);
        expect(firstNameBorder).toBe('rgb(220, 53, 69)');

        await expect(practiceFormPage.modalTitle).not.toBeVisible();
    });
});
