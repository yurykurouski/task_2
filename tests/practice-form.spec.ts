import { test, expect } from '@playwright/test';
import { PracticeFormPage, FormData } from '../pages/PracticeFormPage';
import { getFormData } from './mocks/formData';
import { PAGES } from '../constants/pages';


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
});
