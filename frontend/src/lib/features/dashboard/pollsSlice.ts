import { createSlice } from "@reduxjs/toolkit";
import { v4 as uuidv4 } from "uuid";
import dayjs from "dayjs";

const generateUniqueId = () => {
  const fullUuid = uuidv4();

  // Extract the first 8 characters
  const shortUuid = fullUuid.substr(0, 8);

  // Ensure the first character is a letter
  const firstCharacter = shortUuid.charAt(0);
  const isLetter = /^[a-zA-Z]$/.test(firstCharacter);

  if (!isLetter) {
    // If the first character is not a letter, replace it with a random letter
    const randomLetter = String.fromCharCode(65 + Math.floor(Math.random() * 26)); // A-Z
    return randomLetter + shortUuid.substring(1);
  }

  return shortUuid;
};

export const pollsSlice = createSlice({
  name: "Polls slice",
  initialState: {
    showModal: false,
    showCreatePoll: false,
    showZapPoll: false,
    showRecordings: false,
    patientDetails: {
      mrn: "",
      visitId: "",
      timestamp:"",
      patient_name: "",
      date: "",
      dob:dayjs().format("YYYY-MM-DD"),
      gender:"",
      details:[""], 
      newAppend:"false",
    },
  },
  reducers: {
    newPatient: (state) => {
      state.showModal = !state.showModal;
      const uniqueId = generateUniqueId();
      state.patientDetails.visitId = uniqueId;
    },

    showHistory: (state) => {
      state.showModal = false;
      state.showRecordings = false;
    },

    startNewPatient: (state) => {
      state.showRecordings = true;
      state.showModal = !state.showModal;
      // state.patientDetails = { ...state.patientDetails, date: "abc" };
    },
    setPatientData: (state, action) => {
      const { name, value } = action.payload;
      console.log(name, value);
      state.patientDetails = { ...state.patientDetails, [name]: value };
      console.log("The new data", JSON.parse(JSON.stringify(state.patientDetails)))
    },

    resetData: (state) => {
      state.patientDetails = {
        mrn: "",
        visitId: "",
        timestamp:"",
        patient_name: "",
        date: "",
        dob: dayjs().format("YYYY-MM-DD"),
        gender:"",
        details:[""],
        newAppend:"false",
    }
  }}
  
});

export const { newPatient, startNewPatient, setPatientData, showHistory, resetData } = pollsSlice.actions;

export default pollsSlice.reducer;
