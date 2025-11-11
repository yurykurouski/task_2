import { Page, Locator } from '@playwright/test';
import type { FormData, ModalData } from './types';
import { BasePage } from './BasePage';


export class PracticeFormPage extends BasePage {
    readonly firstNameInput: Locator;
    readonly lastNameInput: Locator;
    readonly emailInput: Locator;
    readonly genderMaleRadio: Locator;
    readonly genderFemaleRadio: Locator;
    readonly genderOtherRadio: Locator;
    readonly mobileInput: Locator;
    readonly dateOfBirthInput: Locator;
    readonly subjectsInput: Locator;
    readonly hobbySportsCheckbox: Locator;
    readonly hobbyReadingCheckbox: Locator;
    readonly hobbyMusicCheckbox: Locator;
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

    constructor(page: Page) {
        super(page);

        // Form field locators
        this.firstNameInput = page.locator('#firstName');
        this.lastNameInput = page.locator('#lastName');
        this.emailInput = page.locator('#userEmail');
        //TODO: Try to use xpath locator with template literals
        this.genderMaleRadio = page.locator('label[for="gender-radio-1"]');
        this.genderFemaleRadio = page.locator('label[for="gender-radio-2"]');
        this.genderOtherRadio = page.locator('label[for="gender-radio-3"]');
        this.mobileInput = page.locator('#userNumber');
        this.dateOfBirthInput = page.locator('#dateOfBirthInput');
        this.subjectsInput = page.locator('#subjectsInput');
        //TODO: Recheck locator, try to use xpath locator
        // These locators are hard to maintain because they rely on static 'for' attribute values.
        // If the checkbox IDs change, the selectors will break.
        // It's better to use XPath with template literals (e.g., `//label[contains(text(), "${hobbyName}")]`)
        // to make the locators more flexible and easier to update.
        this.hobbySportsCheckbox = page.locator('label[for="hobbies-checkbox-1"]');
        this.hobbyReadingCheckbox = page.locator('label[for="hobbies-checkbox-2"]');
        this.hobbyMusicCheckbox = page.locator('label[for="hobbies-checkbox-3"]');
        this.uploadPictureInput = page.locator('#uploadPicture');
        this.currentAddressTextarea = page.locator('#currentAddress');
        this.stateDropdown = page.locator('#state');
        this.stateInput = page.locator('#react-select-3-input');
        this.cityDropdown = page.locator('#city');
        this.cityInput = page.locator('#react-select-4-input');
        this.submitButton = page.locator('#submit');

        // Modal result locators
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
    //TODO rewrite without switch case
    async selectGender(gender: string): Promise<void> {
        switch (gender.toLowerCase()) {
            case 'male':
                await this.genderMaleRadio.click({ force: true });
                break;
            case 'female':
                await this.genderFemaleRadio.click({ force: true });
                break;
            case 'other':
                await this.genderOtherRadio.click({ force: true });
                break;
            default:
                throw new Error(`Invalid gender: ${gender}`);
        }
    }

    async fillMobile(mobile: string): Promise<void> {
        await this.mobileInput.fill(mobile);
    }

    async selectDateOfBirth(date: string): Promise<void> {
        await this.dateOfBirthInput.click();

        const [day, month, year] = date.split(' ');
//TODO: Remove locator to the constructor
        const yearDropdown = this.page.locator('.react-datepicker__year-select');
        await yearDropdown.selectOption(year);
//TODO: Remove locator to the constructor
        const monthDropdown = this.page.locator('.react-datepicker__month-select');
        const monthMap: { [key: string]: string } = {
            'Jan': '0', 'Feb': '1', 'Mar': '2', 'Apr': '3',
            'May': '4', 'Jun': '5', 'Jul': '6', 'Aug': '7',
            'Sep': '8', 'Oct': '9', 'Nov': '10', 'Dec': '11'
        };
        await monthDropdown.selectOption(monthMap[month]);
//TODO: Remove locator to the constructor
        const dayNumber = day.padStart(2, '0');
        const dayLocator = this.page.locator(
            `.react-datepicker__day--0${dayNumber}:not(.react-datepicker__day--outside-month)`
        );
        await dayLocator.first().click();

        await this.page.waitForTimeout(300);
    }
//TODO: try to use selectOption method
    async addSubjects(subjects: string[]): Promise<void> {
        for (const subject of subjects) {
            await this.subjectsInput.scrollIntoViewIfNeeded();
            await this.subjectsInput.fill(subject);
            await this.page.waitForTimeout(300);
            await this.page.keyboard.press('Enter');
            await this.page.waitForTimeout(200);
        }
    }
//TODO rewrite without switch case
    async selectHobbies(hobbies: string[]): Promise<void> {
        for (const hobby of hobbies) {
            switch (hobby.toLowerCase()) {
                case 'sports':
                    await this.hobbySportsCheckbox.scrollIntoViewIfNeeded();
                    await this.hobbySportsCheckbox.click({ force: true });
                    break;
                case 'reading':
                    await this.hobbyReadingCheckbox.scrollIntoViewIfNeeded();
                    await this.hobbyReadingCheckbox.click({ force: true });
                    break;
                case 'music':
                    await this.hobbyMusicCheckbox.scrollIntoViewIfNeeded();
                    await this.hobbyMusicCheckbox.click({ force: true });
                    break;
                default:
                    throw new Error(`Invalid hobby: ${hobby}`);
            }
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
        await this.stateDropdown.click({ force: true });

        await this.page.waitForTimeout(500);
        await this.page.keyboard.type(state);
        await this.page.waitForTimeout(300);

        await this.page.keyboard.press('Enter');
    }

    async selectCity(city: string): Promise<void> {
        await this.cityDropdown.scrollIntoViewIfNeeded();
        await this.cityDropdown.click({ force: true });

        await this.page.waitForTimeout(500);
        await this.page.keyboard.type(city);
        await this.page.waitForTimeout(300);

        await this.page.keyboard.press('Enter');
    }

    async submitForm(): Promise<void> {
        await this.submitButton.scrollIntoViewIfNeeded();
        await this.submitButton.click({ force: true });
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
