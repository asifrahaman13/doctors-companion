/* eslint-disable @next/next/no-img-element */
"use client";
import React from "react";
import { useState, useEffect, useRef } from "react";
import { SpeechConfig, AudioConfig, ServicePropertyChannel, OutputFormat, ConversationTranscriber } from "microsoft-cognitiveservices-speech-sdk";
import History from "./History";
import Patient from "./Patient";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/lib/store";
import { showHistory } from "@/lib/features/dashboard/pollsSlice";
import { getPatientHisory, appendData, sendDetailedData, uploadData } from "@/app/api/patients/history";
import { speakerConfig } from "@/app/config/config";
import useAutosizeTextArea from "./useAutosizeTextArea";
import Loader from "@/app/components/Loader";
import { HistoryItem } from "@/app/types/Visit_Types";
import { newPatient } from "@/lib/features/dashboard/pollsSlice";
import { setAllHistory } from "@/lib/features/history/allHistorySlice";

interface PrevItem {
  privJson: string;
  privSpeakerId: string;
}

interface TranscriptionData {
  visitId: string;
  prev: PrevItem[];
}

const Visits = () => {
  const pollsSlice = useSelector((state: RootState) => state.polls);
  const allHistorySlice = useSelector((state: RootState) => state.allHistory);
  const [data, setData] = useState([""]);
  const [isRecording, setIsRecording] = useState(false);
  const [fetching, setFetching] = useState(true);
  const dispatch = useDispatch();
  const [patientId, setPatient] = useState("");
  const [patientName, setPatientName] = useState("");
  let recognizer: any;
  let conversationTranscriber: any;
  const [speaker, setSpeaker] = useState(speakerConfig());
  const [record_state, setRecordState] = useState("initial");
  async function AppendData(access_token: string, patientId: string, p: string) {
    await appendData(access_token, patientId, p);
  }
  const [currSpeaker, setCurrSpeaker] = useState("");
  const speechConfig = SpeechConfig.fromSubscription(speaker?.SPEECH_KEY || "", speaker?.SPEECH_REGION || "");
  speechConfig.speechRecognitionLanguage = "en-US";
  speechConfig.setServiceProperty("wordLevelConfidence", "true", ServicePropertyChannel.UriQueryParameter);
  speechConfig.outputFormat = OutputFormat.Detailed;
  const audioConfig = AudioConfig.fromDefaultMicrophoneInput();
  conversationTranscriber = new ConversationTranscriber(speechConfig, audioConfig);
  const [t, setT] = useState<TranscriptionData>({
    visitId: pollsSlice.patientDetails.visitId,
    prev: [],
  });

  const initializeSpeechRecognizer = async () => {
    const access_token = localStorage.getItem("access_token") || "";
    if (isRecording) {
      conversationTranscriber.sessionStarted = function (s: any, e: any) {
        setT((prev) => ({ ...prev, visitId: pollsSlice.patientDetails.visitId }));
      };
      conversationTranscriber.sessionStopped = function (s: any, e: any) {
        conversationTranscriber.stopTranscribingAsync();
      };
      conversationTranscriber.canceled = function (s: any, e: any) {
        conversationTranscriber.stopTranscribingAsync();
      };
      conversationTranscriber.transcribed = function (s: any, e: any) {
        let parts = e.result.speakerId.split("-");
        parts[0] = "Speaker";
        let newSpeakerId = parts.join("-");
        if (e.result.speakerId != "Unknown") {
          console.log(`${newSpeakerId}: ${e.result.text}`);
          setCurrSpeaker(newSpeakerId);
          setData((prev) => [...prev, `${newSpeakerId}: ${e.result.text}`]);
          AppendData(access_token, pollsSlice.patientDetails.visitId, `${newSpeakerId}: ${e.result.text}`);

          setT((prev) => ({
            ...prev,
            prev: [...prev.prev, { privJson: e.result.privJson, privSpeakerId: e.result.privSpeakerId }],
          }));
        }
      };

      // Start conversation transcription
      conversationTranscriber.startTranscribingAsync(
        function () {},
        function (err: any) {
          console.trace("err - starting transcription: " + err);
        }
      );

      try {
        await recognizer.startContinuousRecognitionAsync();
        setIsRecording(true);
      } catch (error) {
        console.error("Error starting recognition:", error);
      }
    }
  };
  useEffect(() => {
    initializeSpeechRecognizer();

    return () => {
      if (conversationTranscriber) {
        conversationTranscriber.stopTranscribingAsync(
          () => {
            conversationTranscriber.close();
          },
          (error: any) => {
            console.error("Error stopping recognition:", error);
          }
        );
      }
    };
  }, [isRecording]);

  const stopRecording = async () => {
    setRecordState("initial");
    console.log(t);
    setIsRecording(false);
    stopClock();
    conversationTranscriber.stopTranscribingAsync();

    try {
      const access_token = localStorage.getItem("access_token") || "";
      await sendDetailedData(access_token, t);
      await uploadData(access_token, data.join(","), pollsSlice.patientDetails.visitId);
    } catch (error) {
      console.log("Error stopping recording:", error);
    }
  };

  const startRecording = () => {
    setRecordState("recording");
    if (!isRecording) {
      setIsRecording(true);
      startClock();
    }
  };

  useEffect(() => {
    async function FetchHistory() {
      try {
        const access_token = localStorage.getItem("access_token");
        if (access_token) {
          const response = await getPatientHisory(access_token);
          
          if (response) {
            if (response.status === 200) {
              dispatch(setAllHistory({ previousHistory: response.data }));
              setPatient(response.data[0].visitId);
              setPatientName(response.data[0].patient_name);
              setFetching(false);
            }
          }
        }
      } catch (error) {
        console.log("Error fetching history");
      }
    }
    FetchHistory();
  }, [dispatch]);
  const [value, setValue] = useState("");
  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  useAutosizeTextArea(textAreaRef.current, value);

  const handleChange = (evt: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = evt.target?.value;

    setValue(val);
  };

  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    let interval: any;

    if (isRunning) {
      interval = setInterval(() => {
        setTime((prevTime) => prevTime + 1);
      }, 1000);
    } else {
      clearInterval(interval);
    }

    return () => clearInterval(interval);
  }, [isRunning]);

  const startClock = () => {
    setIsRunning(true);
  };

  const stopClock = () => {
    setIsRunning(false);
    setTime(0);
  };

  const pauseClock = () => {
    console.log("pause clock");
    setRecordState("paused");
    setIsRunning(false);
    setIsRecording(false);
  };

  const resumeClock = () => {
    setRecordState("recording");
    setIsRunning(true);
    setIsRecording(true);
  };

  const formatTime = (timeInSeconds: any) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = timeInSeconds % 60;
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  };

  const [publish, setPublish] = useState("Publish");
  const [collapse, setCollapse] = useState(false);

  return (
    <>
      {fetching === true && <Loader />}

      <div className="xl:flex   w-full  sticky top-0 h-screen overflow-y-scroll">
        <div className={`${collapse === true ? "w-16" : "xl:w-1/5"}  bg-white flex flex-col items-center  h-screen overflow-y-auto no-scrollbar`}>
          {collapse === true && (
            <>
              <div className="p-2 flex flex-col items-center gap-10 mt-4">
                <button
                  onClick={(e) => {
                    setCollapse(false);
                  }}
                >
                  <img src="/images/visits/menu_outline.svg" alt="" />
                </button>
                <button>
                  <img src="/images/visits/new_visit.svg" alt="" />
                </button>
              </div>
            </>
          )}
          {collapse === false && (
            <div className="border-r w-full border-gray-200 flex flex-col h-screen ">
              <div className="w-full flex items-center p-4 gap-2">
                <img src="/images/medical_plus.svg" alt="" />
                <div>Visits</div>
                <button
                  className="ml-auto"
                  onClick={(e) => {
                    setCollapse(true);
                  }}
                >
                  {"<<"}
                </button>
              </div>
              <div className="w-full  items-center flex flex-row ">
                <button
                  className="bg-white flex items-center justify-center border-2 border-spacing-2 border-dotted border-Ind text-Ind m-2  w-full rounded-xl p-2  gap-2"
                  onClick={() => {
                    dispatch(newPatient());
                  }}
                >
                  <img src="/images/plus.svg" alt="" className="" />
                  <div className="text-Ind "> New Visit</div>
                </button>
              </div>
              {allHistorySlice.patientDetails?.map((item, index) => (
                <>
                  {item.visitId !== "" && (
                    <div className="w-full flex  flex-col gap-0 text-sm" key={index}>
                      <button
                        className="w-full border border-gray-100  p-4 flex flex-col items-between bg-red  m-0 hover:bg-Amber-Orange"
                        onClick={(e) => {
                          setPatient(item.visitId);
                          setPatientName(item.patient_name);
                          dispatch(showHistory());
                        }}
                      >
                        <div className="flex items-center gap-2">
                        {/* {!item?.newAppend && <img src="/images/visits/done.svg" alt="" />} */}
                          {/* {item?.newAppend} */}
                        {(item?.newAppend) ? <img src="/images/visits/undone.svg" alt="" />:<img src="/images/visits/done.svg" alt="" />}
                         
                          <div> {item.timestamp}</div>
                        </div>
                        <div>
                          <div className="font-semibold p-1">{item.patient_name}</div>
                        </div>
                        <div className="flex flex-row justify-between w-full ">
                          <span className="text-gray-400 p-1"> <span className="font-medium">DoB:</span> {item.dob}</span>
                          <span className="text-gray-400 p-1"> {"."}</span>
                          <span className="text-gray-400 p-1"><span className="font-medium">MRN: </span>{item.visitId} </span>
                        </div>
                      </button>
                    </div>
                  )}
                </>
              ))}

              <div className="w-full flex flex-col gap-0 p-4 mt-auto">
                <div className="mt-auto flex w-full p-2 gap-1">
                  <img src="/images/visits/settings.svg" alt="" />
                  <div>Settings</div>
                </div>
                <div className="flex w-full p-2 gap-1">
                  <img src="/images/visits/question.svg" alt="" />
                  <div>Help & getting started</div>
                </div>

                <div className="text-yellow-500 w-full flex text-center justify-center p-8">powered by Evva A.I. v1.01</div>
              </div>
            </div>
          )}
        </div>

        {pollsSlice.showRecordings == true && (
          <>
            {" "}
            {/* <div className="w-full xl:w-1/2 flex flex-col">
              <div className=" h-1/6 flex-col justify-center flex p-4">
                <div className="text-3xl"> {pollsSlice.patientDetails.name}</div>
                <div>{pollsSlice.patientDetails.visitId}</div>
              </div>

              <div className="flex flex-col justify-center  items-center ">
                <div>Tap on the microphone button</div>
                <div>to get started</div>
              </div>
              <div className="flex text-3xl p-6 justify-center ">
                <div> {formatTime(time) || "00:00"} </div>
              </div>

              {record_state === "initial" && (
                <>
                  <div className=" text-white p-2 m-2 flex justify-center">
                    <button onClick={startRecording}>
                      <img src="/images/mic.svg" className="bg-MIC p-4 rounded-xl" alt="" />
                    </button>
                  </div>
                </>
              )}

              {record_state === "recording" && (
                <>
                  <div className="flex justify-center gap-2">
                    <button className="h-12 w-12 rounded-xl bg-orange-300 flex items-center justify-center" onClick={stopRecording}>
                      <img src="/images/close.svg" alt="Interface Image" />
                    </button>

                    <button className="h-12 w-12 flex justify-center items-center rounded-xl bg-purple-600" onClick={pauseClock}>
                      <img src="/images/pause.svg" alt="Interface Image" />
                    </button>
                  </div>
                </>
              )}

              {record_state === "paused" && (
                <>
                  <div className="flex justify-center gap-2">
                    <button className="h-12 w-12 rounded-xl bg-orange-300 flex items-center justify-center" onClick={stopRecording}>
                      <img src="/images/close.svg" alt="Interface Image" />
                    </button>

                    <button className="h-12 w-12 flex justify-center items-center rounded-xl bg-purple-600" onClick={resumeClock}>
                      <img src="/images/mic.svg" alt="Interface Image" />
                    </button>
                  </div>
                </>
              )}
            </div>
            <div className="bg-white flex-grow h-screen overflow-y-auto ">
              <div className="flex  gap-2   items-center p-4 ">
                <button className="text-blue-800 border-b-2 border-blue-800">Transcript</button>
                <div className="text-gray-400">Codes</div>
                <div className="text-gray-400">CDS</div>
                <div className="text-gray-400">Evva360</div>
              </div>
              <div className="flex flex-col gap-4 mt-6 p-2 ">
                {data.map((item, index) => (
                  <>
                    {item != null && item != "" && (
                      <>
                        <div className="flex " key={index}>
                          <div className="flex items-start p-2 ">
                            <img
                              // Path to your image file inside the public directory
                              alt="Interface Image"
                              src="/images/person.svg"
                            />
                          </div>
                          <textarea id="review-text" onChange={handleChange} ref={textAreaRef} rows={1} value={item.toString()} className="w-full outline-none p-1" />
                        </div>
                      </>
                    )}
                  </>
                ))}
              </div>
            </div> */}
            <div className="w-full flex  ">
              <div className="w-2/3 p-4">
                <div className="border rounded-xl bg-white p-4 flex flex-col gap-4">
                  <div className="text-2xl font-medium">{pollsSlice.patientDetails.patient_name}</div>
                  <div className="flex text-gray-400 gap-2">
                    <div>{pollsSlice.patientDetails.gender}</div>
                    <div>{""}</div>|<div> 2469 Peachtree Ln, Atlanta, GA 30319</div>
                  </div>
                  <div className="flex text-gray-400 gap-2">
                    <div>
                      <span className="text-gray-700">Dob: </span>
                      <span>{pollsSlice.patientDetails.dob}</span>
                    </div>
                    <div>
                      <span className="text-gray-700">MRN: </span>
                      <span>{pollsSlice.patientDetails.mrn}</span>
                    </div>
                    <div>
                      <span className="text-gray-700">Last Visit: </span>
                      <span>05 Jan </span>
                    </div>
                  </div>
                  <div className="flex gap-8">
                    <button className="flex items-center justify-center gap-2">
                      <img src="/images/visits/review.svg" alt="" />
                      <div className="text-gray-500">Review</div>
                    </button>
                    <button className="flex items-center justify-center gap-2 ">
                      <img src="/images/visits/notes.svg" alt="" />
                      <div className="border-b-2 border-indigo-500 text-black">Notes</div>
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

              <div className="w-1/3 bg-white flex flex-col items-center p-4">
                <div className=" flex w-full justify-between">
                  <button>{">>"}</button>
                  <div>Transcription</div>
                </div>
                <div className="w-full flex flex-col items-center p-16  gap-8">
                  <div className="w-1/2">Tap on the microphone button to get started...</div>
                  <div className="text-4xl font-semibold"> {formatTime(time) || "00:00"}</div>
                  <div className="w-full flex items-center justify-center gap-6">
                    {record_state == "initial" && (
                      <button onClick={startRecording}>
                        <img src="/images/evva/mic.svg" alt="" />
                      </button>
                    )}

                    {record_state == "recording" && (
                      <>
                        <button>
                          <img src="/images/evva/group.svg" alt="" />
                        </button>
                        <button onClick={pauseClock}>
                          <img src="/images/evva/pause.svg" alt="" />
                        </button>
                        <button onClick={stopRecording}>
                          <img src="/images/evva/resume.svg" alt="" />
                        </button>
                      </>
                    )}

                    {record_state == "paused" && (
                      <>
                        {" "}
                        <button onClick={startRecording}>
                          <img src="/images/evva/mic.svg" alt="" />
                        </button>
                      </>
                    )}
                  </div>
                </div>

                <div className="border w-full border-gray-100"> </div>
                <div className="bg-white flex-grow h-screen overflow-y-auto w-full ">
                  <div>Dr Jane Smith</div>
                  <div className="flex flex-col gap-4 mt-6 p-2 ">
                    {data.map((item, index) => (
                      <>
                        {item != null && item != "" && (
                          <>
                            {item.substring(0, 9) === "Speaker-1" && (
                              <div key={index}>
                                <div className="flex w-full items-start gap-2">
                                  <div className="rounded-full bg-yellow-100 ml-auto flex items-center w-8 h-8 justify-center p-4">1</div>

                                  <textarea
                                    id="review-text"
                                    className="w-full outline-none resize-none "
                                    ref={textAreaRef}
                                    value={item.toString()}
                                    rows={Math.ceil(item.length / 50)}
                                    onChange={(e) => {
                                      handleChange;
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
                                    ref={textAreaRef}
                                    value={item.toString()}
                                    rows={Math.ceil(item.length / 50)}
                                    onChange={(e) => {
                                      handleChange;
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
                </div>
              </div>
            </div>
          </>
        )}

        {pollsSlice.showRecordings == false && <History patientId={patientId} patientName={patientName} />}
      </div>
      <Patient />
    </>
  );
};

export default Visits;
