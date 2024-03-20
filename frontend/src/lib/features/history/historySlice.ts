import { createSlice } from "@reduxjs/toolkit";
import { TreatmentPlan } from "@/app/types/Dashboard_Types";
import { VitalSigns } from "@/app/types/Dashboard_Types";

export const historySlice = createSlice({
  name: "History slice",
  initialState: {
    summary: {
      Summary: "",
      Subjective: {
        History_of_PresentIllness: "",
        Review_of_Systems: "",
        Pertinent_Past_MedicalHistory: "",
        Current_Medications: [
          {
            Medication_Name: "",
            Dosage_Frequency: "",
          },
        ],
        Medication_Allergies: "",
        Family_History: "",
        Social_History: "",
      },
      Objective: {
        VitalSigns: {
          Heart_Rate: "",
          Blood_Pressure: "Not discussed by doctor",
          Respiratory_Rate: "Not discussed by doctor",
          Temperature: "Not discussed by doctor",
          Oxygen_Saturation: "Not discussed by doctor",
        },
        Physical_Exam: "Not discussed by doctor",
        Lab_Data: "Not discussed by doctor",
      },
      Assessment: {
        Assessment_Description: "The doctor assesses that the patient's symptoms are consistent with migraines, but wants to rule out other causes due to increased frequency and intensity.",
        ProblemList: [
          {
            Problem_Number: 1,
            Problem_Description: "Headaches",
          },
        ],
        Differential_Diagnoses: [],
      },
      Plan: {
        Diagnostic_Plan: "Complete blood count, Erythrocyte sedimentation rate, Thyroid function tests, Brain MRI",
        Treatment_Plan: {
          Patient_Education:
            "Starting a preventive medication called Topiramate at a low dose and as needed, Trying a triptan, like sumatriptan, instead of or in addition to Ibuprofen for acute attacks, Implementing lifestyle changes such as regular sleep, hydration, stress management, and identifying dietary triggers",
          Pharmacotherapy: "Topiramate, sumatriptan",
          Other_Therapeutic_Procedures:
            "Starting a preventive medication called Topiramate at a low dose, Trying a triptan medication, specifically sumatriptan, as an alternative or in addition to Ibuprofen for relief of acute headaches, Implementing lifestyle changes such as regular sleep, hydration, stress management, and identifying dietary triggers",
        },
        FollowUp: "Follow-up appointment in 4 to 6 weeks",
      },
    },
    details: [""],
  },
  reducers: {
    setBasicData: (state, action) => {
      const { summary } = action.payload;
      state.summary = summary;
    },

    setTranscriptions: (state, action) => {
      const { details } = action.payload;
      state.details = details;
    },

    changeTranscript: (state, action) => {
      const { index, newTranscript } = action.payload;
      state.details = [
        ...state.details.slice(0, index), // Copy the elements before the index
        newTranscript, // Insert the new transcript at the specified index
        ...state.details.slice(index + 1), // Copy the elements after the index
      ];
    },

    changeSummary: (state, action) => {
      const { summary } = action.payload;
      state.summary.Summary = summary;
    },

    changePhysicalExam: (state, action) => {
      const { physicalExam } = action.payload;
      state.summary.Objective.Physical_Exam = physicalExam;
    },

    changeLabData: (state, action) => {
      const { labdata } = action.payload;
      state.summary.Objective.Lab_Data = labdata;
    },

    changeHPI: (state, action) => {
      const { HPI } = action.payload;
      state.summary.Subjective.History_of_PresentIllness = HPI;
    },

    changeMedicationAllergies: (state, action) => {
      const { allergies } = action.payload;
      state.summary.Subjective.Medication_Allergies = allergies;
    },

    changeFamilyHistory: (state, action) => {
      const { history } = action.payload;
      state.summary.Subjective.Family_History = history;
    },

    changeSocialHistory: (state, action) => {
      const { socialHistory } = action.payload;
      state.summary.Subjective.Social_History = socialHistory;
    },

    changePastMedicalHistory: (state, action) => {
      const { pastMedicalHistory } = action.payload;
      state.summary.Subjective.Pertinent_Past_MedicalHistory = pastMedicalHistory;
    },

    changeReviewSystem: (state, action) => {
      const { reviewSystem } = action.payload;
      state.summary.Subjective.Review_of_Systems = reviewSystem;
    },
    changeAssessment: (state, action) => {
      const { assessmentDescription } = action.payload;
      state.summary.Assessment.Assessment_Description = assessmentDescription;
    },

    changeDiagnosticPlan: (state, action) => {
      const { diagnosticPlan } = action.payload;
      state.summary.Plan.Diagnostic_Plan = diagnosticPlan;
    },
    changeTratmentPlan: (state, action) => {
      const { name, value } = action.payload;
      // Access the Plan object and then the TreatmentPlan object
      state.summary.Plan.Treatment_Plan[name as keyof TreatmentPlan] = value;

    },

    changeFollowUp: (state, action) => {
      const { followUp } = action.payload;
      state.summary.Plan.FollowUp = followUp;
    },

    changeMedicationName: (state: any, action) => {
      const { index, medicationName } = action.payload;
      state.summary.Subjective.CurrentMedications[index].MedicationName = medicationName;
    },
    changeMedicationDosage: (state: any, action) => {
      const { index, dosage } = action.payload;
      state.summary.Subjective.CurrentMedications[index].Dosage = dosage;
    },

    changeAssessmentDescription: (state, action) => {
      const { assessmentDescription } = action.payload;
      state.summary.Assessment.Assessment_Description = assessmentDescription;
    },
    changeProblemDescription: (state, action) => {
      const { problemNumber, problemDescription } = action.payload;
      // Find the index of the problem in the ProblemList array
      const index = state.summary.Assessment.ProblemList.findIndex((problem) => problem.Problem_Number === problemNumber);
      if (index !== -1) {
        // Update the problem description
        state.summary.Assessment.ProblemList[index].Problem_Description = problemDescription;
      }
    },

    changeDifferentialDiagnosis: (state: any, action) => {
      const { index, diagnosis } = action.payload;
      state.summary.Assessment.DifferentialDiagnoses = [
        ...state.summary.Assessment.DifferentialDiagnoses.slice(0, index), // Copy the elements before the index
        diagnosis, // Replace the diagnosis at the specified index
        ...state.summary.Assessment.DifferentialDiagnoses.slice(index + 1), // Copy the elements after the index
      ];
    },

    changeVitalSign: (state, action) => {
      const { name, value } = action.payload;
      // Access the Plan object and then the TreatmentPlan object
      state.summary.Objective.VitalSigns[name as keyof VitalSigns] = value;
    },
  },
});

export const {
  setBasicData,
  changeTranscript,
  changeSummary,
  setTranscriptions,
  changeHPI,
  changePastMedicalHistory,
  changeReviewSystem,
  changeAssessment,
  changeDiagnosticPlan,
  changeTratmentPlan,
  changeFollowUp,
  changeMedicationName,
  changeMedicationDosage,
  changeAssessmentDescription,
  changeProblemDescription,
  changeVitalSign,
  changePhysicalExam,
  changeLabData,
  changeDifferentialDiagnosis,
  changeMedicationAllergies,
  changeFamilyHistory,
  changeSocialHistory,
} = historySlice.actions;

export default historySlice.reducer;
