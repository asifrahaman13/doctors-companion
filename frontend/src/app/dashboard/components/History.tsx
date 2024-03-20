/* eslint-disable @next/next/no-img-element */
"use client";
import Loader from "@/app/components/Loader";
import React, { useEffect, useState } from "react";
import { fetchHistory, confirmSave, getSummary } from "@/app/api/patients/history";
import { PageProps, VitalSigns, TreatmentPlan } from "@/app/types/Dashboard_Types";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/lib/store";
import Success from "./Success";

import {
  changeSummary,
  setBasicData,
  setTranscriptions,
  changeReviewSystem,
  changeHPI,
  changePastMedicalHistory,
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
} from "@/lib/features/history/historySlice";
import { changeTranscript } from "@/lib/features/history/historySlice";

const History: React.FC<PageProps> = ({ patientId, patientName }) => {
  const historySlice = useSelector((state: RootState) => state.history);
  const [date, setDate] = useState("");
  const [activeIndex, setActiveIndex] = useState(null);
  const dispatch = useDispatch();
  const [fetching, setFetching] = useState(true);
  const [patientData, setPatientData] = useState({
    mrn: "",
    patient_name: "",
    gender: "",
    age: "",
    dob: "",
  });
  const toggleFaq = (index: any) => {
    setActiveIndex((prevIndex) => (prevIndex === index ? null : index));
  };
  useEffect(() => {
    async function GetPatientHisory() {
      if (patientId === "") {
        setFetching(false);
        return;
      }
      try {
        const access_token = localStorage.getItem("access_token");
        if (access_token) {
          const summary = await getSummary(access_token, patientId);

          if (summary?.status === 200) {
            dispatch(setBasicData({ summary: summary.data }));
            setFetching(false);
          }
          const response = await fetchHistory(access_token, patientId);
          if (response?.status === 200) {
            console.log(response.data);
            setDate(response.data.date);
            setPatientData(response.data);
            if (response?.data.details) {
              dispatch(setTranscriptions({ details: response?.data.details }));
            }
          }
        }
      } catch (error) {
        console.log(error);
      }
    }
    GetPatientHisory();
  }, [dispatch, patientId]);
  const [message, setMessage] = useState({
    msg: "",
    statuscode: 0,
  });
  async function ConfirmSave() {
    try {
      const access_token = localStorage.getItem("access_token") || "";
      const response = await confirmSave(access_token, patientId, historySlice.details, JSON.parse(JSON.stringify(historySlice.summary)));
      if (response?.status === 200) {
        setMessage({ msg: "Data is saved successfully and uploaded to s3", statuscode: 200 });
      }
    } catch (error) {
      console.log(error);
    }
    handleShowToast();
  }

  const [showToast, setShowToast] = useState(false);

  // Function to show the toast
  const handleShowToast = () => {
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
    }, 3000); // Hide the toast after 3 seconds (adjust as needed)
  };

  const [collapse, setCollapse] = useState(false);

  return (
    <>
      <div className="relative">{showToast && <Success message={message} />}</div>

      {fetching == true && <Loader />}
      <div className=" w-full  xl:flex">
        {patientId === "" && (
          <>
            <div className="w-full flex items-center justify-center"> Nothing to display. Please click on the New visit tab to start creating one.</div>
          </>
        )}

        {patientId !== "" && (
          <>
            {" "}
            <div className={`${collapse === true ? "flex grow" : ""} border-0 w-full xl:w-2/3 p-4 flex flex-col gap-4 overflow-y-scroll no-scrollbar`}>
              <div className="w-full flex ">
                <div className="w-full">
                  <div className="border rounded-xl bg-white p-4 flex flex-col gap-4">
                    <div className="text-2xl font-medium">{patientName}</div>
                    <div className="flex text-gray-400 gap-2">
                      <div>{patientData.gender}</div>
                      <div>{patientData.age}</div>|<div> 2469 Peachtree Ln, Atlanta, GA 30319</div>
                    </div>
                    <div className="flex text-gray-400 gap-2">
                      <div>
                        <span className="text-gray-700">Dob: </span>
                        <span>{patientData.dob}</span>
                      </div>
                      <div>
                        <span className="text-gray-700">MRN: </span>
                        <span>{patientData.mrn}</span>
                      </div>
                      <div>
                        <span className="text-gray-700">Last Visit: </span>
                        <span>05 Jan </span>
                      </div>
                    </div>
                    <div className="flex gap-8 flex-wrap">
                      <button className="flex items-center justify-center gap-2">
                        <img src="/images/visits/review.svg" alt="" />
                        <div className="text-gray-500">Review</div>
                      </button>
                      <button className="flex items-center justify-center gap-2 ">
                        <img src="/images/visits/notes.svg" alt="" />
                        <div className="border-b-2 border-indigo-500 text-indigo-500 px-2 ">Notes</div>
                      </button>
                      <button className="flex items-center justify-center gap-2">
                        <img src="/images/visits/documentation.svg" alt="" />
                        <div className="text-gray-500">Documentation</div>
                      </button>
                      <button className="flex items-center justify-center gap-2">
                        <img src="/images/visits/instructions.svg" alt="" />
                        <div className="text-gray-500">Instructions</div>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="border border-gray-200 p-4 rounded-xl">
                <div>
                  <div key={1} className="bg-white p-4 border border-gray-200 rounded-xl mb-4 transition duration-300 ease-in-out">
                    <div className="flex items-center justify-between cursor-pointer">
                      <h2 className="text-lg font-semibold">Summary</h2>
                      <img src="/images/UI icon_info_filled.svg" alt="" className="p-2" />
                      <img
                        src="/images/copy.svg" // Path to your image file inside the public directory
                        alt="Interface Image"
                        className=" ml-auto"
                      />
                      <svg
                        className={`w-6 h-6 ${activeIndex === 0 ? "transform rotate-180" : ""}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                        onClick={() => toggleFaq(1)}
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={activeIndex === 1 ? "M19 9l-7 7-7-7" : "M5 15l7-7 7 7"} />
                      </svg>
                    </div>
                    {activeIndex === 1 && (
                      <>
                        <textarea
                          className="text-Pri-Dark mt-4 outline-none w-full h-auto flex flex-wrap"
                          value={historySlice?.summary.Summary}
                          onChange={(e) => {
                            dispatch(changeSummary({ summary: e.target.value }));
                          }}
                          rows={10}
                        ></textarea>
                      </>
                    )}
                  </div>

                  <div key={2} className="bg-white p-4 border border-gray-200 rounded-xl mb-4 transition duration-300 ease-in-out">
                    <div className="flex items-center justify-between cursor-pointer">
                      <h2 className="text-lg font-semibold">Subjective</h2>
                      <img src="/images/UI icon_info_filled.svg" alt="" className="p-2" />
                      <img src="/images/copy.svg" alt="" className=" ml-auto" />
                      {/* <img
                    src="/images/copy.svg" // Path to your image file inside the public directory
                    alt="Interface Image"
                    className=" ml-auto"
                  /> */}
                      <svg
                        className={`w-6 h-6 ${activeIndex === 1 ? "transform rotate-180" : ""}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                        onClick={() => toggleFaq(2)}
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={activeIndex === 2 ? "M19 9l-7 7-7-7" : "M5 15l7-7 7 7"} />
                      </svg>
                    </div>
                    {activeIndex === 2 && (
                      <>
                        <div className="text-md font-semibold">History of Present Illness</div>
                        <textarea
                          className="text-Pri-Dark mt-4 outline-none w-full h-auto flex flex-wrap"
                          value={historySlice?.summary?.Subjective?.History_of_PresentIllness}
                          onChange={(e) => {
                            dispatch(changeHPI({ HPI: e.target.value }));
                          }}
                          rows={10}
                        ></textarea>
                        <div className="text-md font-semibold mt-4">Pertinent Past MedicalHistory</div>
                        <textarea
                          className="text-Pri-Dark mt-4 outline-none w-full h-auto flex flex-wrap"
                          value={historySlice?.summary?.Subjective?.Pertinent_Past_MedicalHistory}
                          onChange={(e) => {
                            dispatch(changePastMedicalHistory({ pastMedicalHistory: e.target.value }));
                          }}
                        ></textarea>
                        <div className="text-md font-semibold">Review of systems</div>
                        <textarea
                          className="text-Pri-Dark mt-4 outline-none w-full h-auto flex flex-wrap"
                          value={historySlice?.summary?.Subjective?.Review_of_Systems}
                          onChange={(e) => {
                            dispatch(changeReviewSystem({ reviewSystem: e.target.value }));
                          }}
                        ></textarea>

                        <div className="text-md font-semibold">Medication allergies</div>
                        <textarea
                          className="text-Pri-Dark mt-4 outline-none w-full h-auto flex flex-wrap"
                          value={historySlice?.summary?.Subjective?.Medication_Allergies}
                          onChange={(e) => {
                            dispatch(changeMedicationAllergies({ allergies: e.target.value }));
                          }}
                        ></textarea>

                        <div className="text-md font-semibold">Family History</div>
                        <textarea
                          className="text-Pri-Dark mt-4 outline-none w-full h-auto flex flex-wrap"
                          value={historySlice?.summary?.Subjective?.Family_History}
                          onChange={(e) => {
                            dispatch(changeFamilyHistory({ "Family History": e.target.value }));
                          }}
                        ></textarea>

                        <div className="text-md font-semibold">Social History</div>
                        <textarea
                          className="text-Pri-Dark mt-4 outline-none w-full h-auto flex flex-wrap"
                          value={historySlice?.summary?.Subjective?.Social_History}
                          onChange={(e) => {
                            dispatch(changeSocialHistory({ "Social History": e.target.value }));
                          }}
                        ></textarea>

                        <div className="text-md font-semibold mt-4">Current medications</div>
                        {historySlice?.summary?.Subjective?.Current_Medications?.map((item, index) => (
                          <div key={index}>
                            <div className="text-md font-semibold mt-4">Medication name</div>
                            <textarea
                              className="text-Pri-Dark mt-4 outline-none w-full h-auto flex flex-wrap"
                              value={item.Medication_Name}
                              onChange={(e) => {
                                dispatch(changeMedicationName({ index: index, medicationName: e.target.value }));
                              }}
                            ></textarea>
                            <div className="text-md font-semibold mt-4">Dosage</div>
                            <textarea
                              className="text-Pri-Dark mt-4 outline-none w-full h-auto flex flex-wrap"
                              value={item.Dosage_Frequency}
                              onChange={(e) => {
                                dispatch(changeMedicationDosage({ index: index, dosage: e.target.value }));
                              }}
                            ></textarea>
                          </div>
                        ))}
                      </>
                    )}
                  </div>

                  <div key={3} className="bg-white p-4 border border-gray-200 rounded-xl mb-4 transition duration-300 ease-in-out">
                    <div className="flex items-center justify-between cursor-pointer">
                      <h2 className="text-lg font-semibold">Objective</h2>
                      <img src="/images/UI icon_info_filled.svg" alt="" className="p-2" />
                      <img
                        src="/images/copy.svg" // Path to your image file inside the public directory
                        alt="Interface Image"
                        className=" ml-auto"
                      />
                      <svg
                        className={`w-6 h-6 ${activeIndex === 2 ? "transform rotate-180" : ""}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                        onClick={() => toggleFaq(3)}
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={activeIndex === 3 ? "M19 9l-7 7-7-7" : "M5 15l7-7 7 7"} />
                      </svg>
                    </div>
                    {activeIndex === 3 && (
                      <>
                        <div className="text-md font-semibold mt-4">Physical Exam</div>

                        <textarea
                          className="text-Pri-Da mt-4 outline-none w-full h-auto flex flex-wrap"
                          value={historySlice?.summary?.Objective?.Physical_Exam}
                          onChange={(e) => {
                            dispatch(changePhysicalExam({ physicalExam: e.target.value }));
                          }}
                        ></textarea>

                        <div className="text-md font-semibold mt-4">Lab data</div>
                        <textarea
                          className="text-Pri-Dark mt-4 outline-none w-full h-auto flex flex-wrap"
                          value={historySlice?.summary?.Objective.Lab_Data}
                          onChange={(e) => {
                            dispatch(changeLabData({ labdata: e.target.value }));
                          }}
                        ></textarea>
                        {Object.keys(historySlice?.summary?.Objective?.VitalSigns).map((key) => (
                          <>
                            <div className="text-md font-semibold mt-4">{key}</div>

                            <textarea
                              className="text-Pri-Dark mt-4 outline-none w-full h-auto flex flex-wrap"
                              value={historySlice?.summary?.Objective?.VitalSigns[key as keyof VitalSigns]}
                              onChange={(e) => {
                                dispatch(changeVitalSign({ name: key, value: e.target.value }));
                              }}
                            ></textarea>
                          </>
                        ))}

                        {/* <textarea className="text-Pri-Dark mt-4 outline-none w-full h-auto flex flex-wrap" value={data?.objective}></textarea> */}
                      </>
                    )}
                  </div>

                  <div key={4} className="bg-white p-4 border border-gray-200 rounded-xl mb-4 transition duration-300 ease-in-out">
                    <div className="flex items-center justify-between cursor-pointer">
                      <h2 className="text-lg font-semibold">Assessments </h2>
                      <img src="/images/UI icon_info_filled.svg" alt="" className="p-2" />
                      <img
                        src="/images/copy.svg" // Path to your image file inside the public directory
                        alt="Interface Image"
                        className=" ml-auto"
                      />
                      <svg
                        className={`w-6 h-6 ${activeIndex === 3 ? "transform rotate-180" : ""}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                        onClick={() => toggleFaq(4)}
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={activeIndex === 4 ? "M19 9l-7 7-7-7" : "M5 15l7-7 7 7"} />
                      </svg>
                    </div>
                    {activeIndex === 4 && (
                      <>
                        <div className="text-md font-semibold mt-4">Assessment Description</div>
                        <textarea
                          className="text-Pri-Dark mt-4 outline-none w-full h-auto flex flex-wrap"
                          value={historySlice?.summary?.Assessment?.Assessment_Description}
                          onChange={(e) => {
                            dispatch(changeAssessmentDescription({ assessmentDescription: e.target.value }));
                          }}
                        ></textarea>
                        {historySlice?.summary?.Assessment?.ProblemList?.map((item, index) => (
                          <div key={index}>
                            <div className="flex w-full items-start h-full ">
                              <div className="w-6 text-Pri-Dark  outline-none h-full  flex flex-wrap ">{item?.Problem_Number}</div>
                              <div className="w-full h-full bg-pin">
                                <textarea
                                  className="text-Pri-Dark h-full outline-none w-full flex flex-wrap"
                                  value={item?.Problem_Description}
                                  rows={5}
                                  onChange={(e) => {
                                    dispatch(changeProblemDescription({ problemNumber: item?.Problem_Number, problemDescription: e.target.value }));
                                  }}
                                ></textarea>
                              </div>
                            </div>
                          </div>
                        ))}

                        <div className="text-md font-semibold mt-4">Differential Description</div>
                        {historySlice?.summary?.Assessment?.Differential_Diagnoses?.map((item, index) => (
                          <div key={index}>
                            <textarea
                              className="text-Pri-Dark mt-4 outline-none w-full h-auto flex flex-wrap"
                              value={item}
                              onChange={(e) => {
                                dispatch(changeDifferentialDiagnosis({ index: index, diagnosis: e.target.value }));
                              }}
                            ></textarea>
                          </div>
                        ))}
                      </>
                    )}
                  </div>

                  <div key={5} className="bg-white p-4 border border-gray-200 rounded-xl mb-4 transition duration-300 ease-in-out">
                    <div className="flex items-center justify-between cursor-pointer">
                      <h2 className="text-lg font-semibold"> Plans</h2>
                      <img src="/images/UI icon_info_filled.svg" alt="" className="p-2" />
                      <img src="/images/copy.svg" alt="Interface Image" className=" ml-auto" />
                      <svg
                        className={`w-6 h-6 ${activeIndex === 4 ? "transform rotate-180" : ""}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                        onClick={() => toggleFaq(5)}
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={activeIndex === 5 ? "M19 9l-7 7-7-7" : "M5 15l7-7 7 7"} />
                      </svg>
                    </div>
                    {activeIndex === 5 && (
                      <>
                        <div className="text-md font-semibold mt-4">Diagnostic plans</div>
                        <textarea
                          className="text-Pri-Dark mt-4 outline-none w-full h-auto flex flex-wrap"
                          value={historySlice?.summary?.Plan?.Diagnostic_Plan}
                          onChange={(e) => {
                            dispatch(changeDiagnosticPlan({ diagnosticPlan: e.target.value }));
                          }}
                        ></textarea>

                        {Object.keys(historySlice?.summary?.Plan?.Treatment_Plan).map((key) => (
                          <>
                            <div className="text-md font-semibold mt-4">{key}</div>
                            <textarea
                              className="text-Pri-Dark mt-4 outline-none w-full h-auto flex flex-wrap"
                              value={historySlice?.summary?.Plan?.Treatment_Plan[key as keyof TreatmentPlan]}
                              onChange={(e) => {
                                dispatch(changeTratmentPlan({ name: key, value: e.target.value }));
                              }}
                            ></textarea>
                          </>
                        ))}
                        <div className="text-md font-semibold mt-4">Followup plans</div>
                        <textarea
                          className="text-Pri-Dark mt-4 outline-none w-full h-auto flex flex-wrap"
                          value={historySlice?.summary?.Plan?.FollowUp}
                          onChange={(e) => {
                            dispatch(changeFollowUp({ followUp: e.target.value }));
                          }}
                        ></textarea>
                      </>
                    )}
                  </div>

                  {/* <div key={6} className="bg-white p-4 rounded-md mb-4 transition duration-300 ease-in-out">
                    <div className="flex items-center justify-between cursor-pointer">
                      <h2 className="text-lg font-semibold">Additional Notes</h2>
                      <img src="/images/copy.svg" alt="" className=" ml-auto" />

                      <svg
                        className={`w-6 h-6 ${activeIndex === 6 ? "transform rotate-180" : ""}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                        onClick={() => toggleFaq(6)}
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={activeIndex === 6 ? "M19 9l-7 7-7-7" : "M5 15l7-7 7 7"} />
                      </svg>
                    </div>
                    {activeIndex === 6 && <textarea className="text-Pri-Dark mt-4 outline-none w-full h-auto flex flex-wrap" value={historySlice?.medications}></textarea>}
                  </div>   */}
                </div>

                <div className="w-full flex justify-end ">
                  <div className="bg-purple-500 rounded-xl flex p-4 gap-2">
                    <img
                      src="/images/upload.svg" // Path to your image file inside the public directory
                      alt="Interface Image"
                    />
                    <button
                      className="text-white l"
                      onClick={(e) => {
                        ConfirmSave();
                      }}
                    >
                      Confirm & save
                    </button>
                  </div>
                </div>
              </div>
            </div>{" "}
            <div className={`${collapse === true ? "w-16 overflow-y-hidden" : "lg:w-1/3 overflow-y-auto w-full"}   bg-white p-4  h-screen no-scrollbar p-b-8 mb-12 flex flex-col gap-4`}>
              {collapse === true && (
                <>
                  <button
                    onClick={(e) => {
                      setCollapse(false);
                    }}
                  >
                    <img src="/images/history/right_collapse.svg" alt="" />
                  </button>
                </>
              )}

              {collapse === false && (
                <>
                  <div className="flex">
                    <button
                      onClick={(e) => {
                        setCollapse(true);
                      }}
                    >
                      {">>"}
                    </button>
                    <div className="text-xl ml-auto">Transcript</div>
                  </div>

                  <div className="flex">
                    <button className="rounded-2xl border border-yellow-500 p-1 pl-4 pr-4">Full</button>
                    <div className="text-xl ml-auto flex gap-2 items-center">
                      {/* <div>8:05 min</div> */}
                      <img src="/images/evva/mic.svg" alt="" />
                    </div>
                  </div>
                  <div className="flex flex-col gap-4 mt-6 p-  ">
                    {historySlice?.details.map((item, index) => (
                      <>
                        {item != null && item !== "" && (
                          <>
                            {item.substring(0, 9) === "Speaker-1" && (
                              <div key={index}>
                                <div className="flex w-full items-start gap-2">
                                  <div className="rounded-full bg-yellow-100 ml-auto flex items-center w-8 h-8 justify-center p-4">1</div>

                                  <textarea
                                    id="review-text"
                                    className="w-full outline-none resize-none "
                                    value={item}
                                    rows={Math.ceil(item.length / 50)}
                                    onChange={(e) => {
                                      dispatch(changeTranscript({ index: index, newTranscript: e.target.value }));
                                    }}
                                  />
                                </div>
                              </div>
                            )}

                            {item.substring(0, 9) !== "Speaker-1" && (
                              <div key={index}>
                                <div className="flex w-full items-start gap-2">
                                  <div className="rounded-full bg-indigo-100 ml-auto flex items-center w-8 h-8 justify-center p-4">2</div>

                                  <textarea
                                    id="review-text"
                                    className="w-full outline-none resize-none "
                                    value={item}
                                    rows={Math.ceil(item.length / 50)}
                                    onChange={(e) => {
                                      dispatch(changeTranscript({ index: index, newTranscript: e.target.value }));
                                    }}
                                  />
                                </div>
                              </div>
                            )}
                          </>
                        )}
                      </>
                    ))}
                  </div>
                </>
              )}
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default History;
