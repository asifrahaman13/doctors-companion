export interface PageProps {
    patientId: string;
    patientName: string;
}

type Medication = {
    MedicationName: string;
    Dosage: string;
};

export type VitalSigns = {
    Heart_Rate: string;
    Blood_Pressure: string
    Respiratory_Rate: string
    Temperature: string
    Oxygen_Saturation: string
};

type Problem = {
    Problem_Number: number;
    Problem_Description: string;
};

type SubjectiveData = {
    History_of_PresentIllness: string;
    PertinentPastMedicalHistory: string;
    Review_of_Systems: string;
    Current_Medications: Medication[];
    Medication_Allergies: string;
    Family_History: string;
    Social_History: string;
};

type ObjectiveData = {
    VitalSigns: VitalSigns;
    Physical_Exam: string;
    Lab_Data: string;
};

type AssessmentData = {
    Assessment_Description: string;
    ProblemList: Problem[];
    Differential_Diagnoses: string[]; 
};

export type TreatmentPlan = {
    Patient_Education: string;
    Pharmacotherapy: string;
    Other_Therapeutic_Procedures: string
};

type PlanData = {
    Diagnostic_Plan: string;
    Treatment_Plan: TreatmentPlan;
    FollowUp: string;
};

export type Data = {
    Summary: string;
    Subjective: SubjectiveData;
    Objective: ObjectiveData;
    Assessment: AssessmentData;
    Plan: PlanData;
    transcript: string[];
};