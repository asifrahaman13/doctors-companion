import { createSlice } from "@reduxjs/toolkit";

export const allHistorySlice = createSlice({
  name: "AllHistory slice",
  initialState: {
    patientDetails: [
      {
        visitId: "",
        patient_name: "",
        mrn: "",
        dob: "",
        gender: "",
        timestamp:"",
        date: "",
        details: [""],
        newAppend: false,
      },
    ],
  },
  reducers: {
    setAllHistory: (state, action) => {
      const { previousHistory } = action.payload;
      state.patientDetails = previousHistory;
      console.log("The data is ")
      console.log(JSON.parse(JSON.stringify(state.patientDetails)));
      console.log(state.patientDetails);
    },
    appendCurrentHistory: (state, action) => {
      const { newData } = action.payload;
      console.log(newData)
      state.patientDetails.push(newData);
      console.log(JSON.parse(JSON.stringify(state.patientDetails)));
      console.log(state.patientDetails);
    },
  },
});

export const { setAllHistory,appendCurrentHistory } = allHistorySlice.actions;

export default allHistorySlice.reducer;
