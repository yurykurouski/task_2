import { FormData } from '../../pages/PracticeFormPage';
import * as path from 'path';

const testImagePath = path.join(__dirname, '../..', 'test-data', 'test-image.png');

const formData: FormData = {
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    gender: 'Male',
    mobile: '1234567890',
    dateOfBirth: '15 Jan 1990',
    subjects: ['Maths', 'Physics'],
    hobbies: ['Sports', 'Reading'],
    picturePath: testImagePath,
    currentAddress: '123 Main Street, Apt 4B, New York',
    state: 'NCR',
    city: 'Delhi'
};


export const getFormData = (customFields?: Partial<FormData>) => {
    return { ...formData, ...customFields };
}