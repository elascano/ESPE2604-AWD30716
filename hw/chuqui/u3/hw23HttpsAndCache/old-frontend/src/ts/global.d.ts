declare var Vue: any;

interface Window {
    __PAYMENT__?: {
        id: string;
        patientID: string;
        amount: string | number;
        date: string;
        paymentType: string;
        paymentMethod: string;
    };
    __PATIENT__?: {
        patientID: string;
        fullName: string;
        birthday: string;
        phone: string;
        gender: string;
        reasonForConsultation: string;
        legalRepresentative: string;
    };
}
