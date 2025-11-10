export interface FormData {
    firstName: string;
    lastName: string;
    email: string;
    gender: string;
    mobile: string;
    dateOfBirth: string;
    subjects: string[];
    hobbies: string[];
    picturePath?: string;
    currentAddress: string;
    state: string;
    city: string;
}

export interface ModalData {
    [key: string]: string;
}