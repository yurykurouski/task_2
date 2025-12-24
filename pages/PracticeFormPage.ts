import { Page, Locator } from '@playwright/test';
import type { FormData, ModalData } from './types';
import { BasePage } from './BasePage';


export class PracticeFormPage extends BasePage {
    readonly firstNameInput: Locator;
    readonly lastNameInput: Locator;
    readonly emailInput: Locator;
    readonly mobileInput: Locator;
    readonly dateOfBirthInput: Locator;
    readonly subjectsInput: Locator;
    readonly uploadPictureInput: Locator;
    readonly currentAddressTextarea: Locator;
    readonly stateDropdown: Locator;
    readonly stateInput: Locator;
    readonly cityDropdown: Locator;
    readonly cityInput: Locator;
    readonly submitButton: Locator;
    readonly modalTitle: Locator;
    readonly modalBody: Locator;
    readonly closeButton: Locator;
    readonly yearDropdown: Locator;
    readonly monthDropdown: Locator;

    constructor(page: Page) {
        super(page);

        // Form field locators
        this.firstNameInput = page.locator('#firstName');
        this.lastNameInput = page.locator('#lastName');
        this.emailInput = page.locator('#userEmail');
        this.mobileInput = page.locator('#userNumber');
        this.dateOfBirthInput = page.locator('#dateOfBirthInput');
        this.subjectsInput = page.locator('#subjectsInput');
        this.uploadPictureInput = page.locator('#uploadPicture');
        this.currentAddressTextarea = page.locator('#currentAddress');
        this.stateDropdown = page.locator('#state');
        this.stateInput = page.locator('#react-select-3-input');
        this.cityDropdown = page.locator('#city');
        this.cityInput = page.locator('#react-select-4-input');
        this.submitButton = page.getByRole('button', { name: 'Submit' });

        this.yearDropdown = page.locator('.react-datepicker__year-select');
        this.monthDropdown = page.locator('.react-datepicker__month-select');

        this.modalTitle = page.locator('#example-modal-sizes-title-lg');
        this.modalBody = page.locator('.modal-body');
        this.closeButton = page.locator('#closeLargeModal');
    }

    async fillFirstName(firstName: string): Promise<void> {
        await this.firstNameInput.fill(firstName);
    }

    async fillLastName(lastName: string): Promise<void> {
        await this.lastNameInput.fill(lastName);
    }

    async fillEmail(email: string): Promise<void> {
        await this.emailInput.fill(email);
    }
    async selectGender(gender: string): Promise<void> {
        const genderLocator = this.page.getByText(gender, { exact: true });
        await genderLocator.click();
    }

    async fillMobile(mobile: string): Promise<void> {
        await this.mobileInput.fill(mobile);
    }

    async selectDateOfBirth(date: string): Promise<void> {
        await this.dateOfBirthInput.click();

        const [day, month, year] = date.split(' ');
        await this.yearDropdown.selectOption(year);
        const monthMap: { [key: string]: string } = {
            'Jan': '0', 'Feb': '1', 'Mar': '2', 'Apr': '3',
            'May': '4', 'Jun': '5', 'Jul': '6', 'Aug': '7',
            'Sep': '8', 'Oct': '9', 'Nov': '10', 'Dec': '11'
        };
        await this.monthDropdown.selectOption(monthMap[month]);
        const dayNumber = day.padStart(2, '0');
        const dayLocator = this.page.locator(
            `.react-datepicker__day--0${dayNumber}:not(.react-datepicker__day--outside-month)`
        );
        await dayLocator.first().click();

        await this.page.waitForTimeout(300);
    }
    async addSubjects(subjects: string[]): Promise<void> {
        for (const subject of subjects) {
            await this.subjectsInput.scrollIntoViewIfNeeded();
            await this.subjectsInput.fill(subject);
            await this.page.waitForTimeout(300);
            await this.page.keyboard.press('Enter');
            await this.page.waitForTimeout(200);
        }
    }
    async selectHobbies(hobbies: string[]): Promise<void> {
        for (const hobby of hobbies) {
            const hobbyLocator = this.page.locator(`//label[contains(text(), "${hobby}")]`);
            await hobbyLocator.scrollIntoViewIfNeeded();
            await hobbyLocator.click();
        }
    }

    async uploadPicture(filePath: string): Promise<void> {
        await this.uploadPictureInput.setInputFiles(filePath);
    }

    async fillCurrentAddress(address: string): Promise<void> {
        await this.currentAddressTextarea.fill(address);
    }

    async selectState(state: string): Promise<void> {
        await this.stateDropdown.scrollIntoViewIfNeeded();
        await this.stateDropdown.click();

        await this.page.waitForTimeout(500);
        await this.page.keyboard.type(state);
        await this.page.waitForTimeout(300);

        await this.page.keyboard.press('Enter');
    }

    async selectCity(city: string): Promise<void> {
        await this.cityDropdown.scrollIntoViewIfNeeded();
        await this.cityDropdown.click();

        await this.page.waitForTimeout(500);
        await this.page.keyboard.type(city);
        await this.page.waitForTimeout(300);

        await this.page.keyboard.press('Enter');
    }

    async submitForm(): Promise<void> {
        await this.removeObstructingElements();
        await this.submitButton.scrollIntoViewIfNeeded();
        await this.submitButton.click();
    }

    async fillCompleteForm(formData: FormData): Promise<void> {
        await this.fillFirstName(formData.firstName);
        await this.fillLastName(formData.lastName);
        await this.fillEmail(formData.email);
        await this.selectGender(formData.gender);
        await this.fillMobile(formData.mobile);
        await this.selectDateOfBirth(formData.dateOfBirth);
        await this.addSubjects(formData.subjects);
        await this.selectHobbies(formData.hobbies);

        if (formData.picturePath) {
            await this.uploadPicture(formData.picturePath);
        }

        await this.fillCurrentAddress(formData.currentAddress);
        await this.selectState(formData.state);
        await this.selectCity(formData.city);
    }

    async getModalTitle(): Promise<string | null> {
        return await this.modalTitle.textContent();
    }

    async getModalData(): Promise<ModalData> {
        const rows = await this.modalBody.locator('table tr').all();
        const data: ModalData = {};

        for (const row of rows) {
            const cells = await row.locator('td').all();
            if (cells.length === 2) {
                const label = await cells[0].textContent();
                const value = await cells[1].textContent();
                if (label && value) {
                    data[label] = value;
                }
            }
        }

        return data;
    }

    async closeModal(): Promise<void> {
        await this.closeButton.click();
    }
}

export type { FormData, ModalData };
