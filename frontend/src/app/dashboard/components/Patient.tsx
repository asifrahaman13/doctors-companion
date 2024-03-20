"use client";
import { newPatient, startNewPatient, setPatientData, resetData } from "@/lib/features/dashboard/pollsSlice";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/lib/store";
import { saveData } from "@/app/api/patients/history";
import { setAllHistory, appendCurrentHistory } from "@/lib/features/history/allHistorySlice";
import { Listbox, Transition } from "@headlessui/react";
import { Fragment, useState } from "react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import dayjs from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

const CreatePoll = () => {
  function getTimeString() {
    const timestamp = Date.now();
    const date = new Date(timestamp);
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    return `${hours}:${minutes}`;
  }

  function getDateString() {
    const timestamp = Date.now(); // Example timestamp
    const date = new Date(timestamp);
    const year = date.getFullYear().toString();
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    return `${year}-${month}-${day}`;
  }
  const pollsSlice = useSelector((state: RootState) => state.polls);
  const dispatch = useDispatch();

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    dispatch(setPatientData({ name: name, value: value }));
  };

  async function handleSubmit() {
    // Example timestamp
    const formattedTime = getTimeString();
    console.log(formattedTime);
    const formatCurrDate = getDateString();
    console.log(formatCurrDate);
    dispatch(appendCurrentHistory({ newData: pollsSlice.patientDetails }));
    dispatch(setPatientData({ name: "timestamp", value: formattedTime }));
    dispatch(setPatientData({ name: "date", value: formatCurrDate }));
    dispatch(setPatientData({ name: "newAppend", value: "true" }));

    try {
      const access_token = localStorage.getItem("access_token") || "";
      const response = await saveData(access_token, pollsSlice.patientDetails);
      // dispatch(resetData())
    } catch (err) {
      console.log(err);
    }
  }
  const people = [
    { id: 1, name: "Male" },
    { id: 2, name: "Female" },
    { id: 3, name: "Non Binary" },
  ];
  function classNames(...classes: (string | boolean | undefined | null)[]): string {
    return classes.filter(Boolean).join(" ");
  }

  const [selected, setSelected] = useState(people[0]);

  const handleDateChange = (date: any) => {
    console.log(date);
    dispatch(setPatientData({ name: "dob", value: `${date?.$y}-${date?.$M + 1}-${date?.$D}` }));
  };

  return (
    <>
      {pollsSlice.showModal ? (
        <>
          <div className="backdrop-blur-sm bg-opacity-50 justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none ">
            <div className="min-h-screen w-full  flex flex-row items-center justify-center">
              <div className="bg-Almost-White h-screen md:h-1/4 lg:w-1/3 xl:max-w-lg p-4 rounded-xl">
                <div className="flex flex-row">
                  <div className="w-1/2 font-semibold mb-8">New Visit</div>
                  <div className="w-1/2 flex justify-end ">
                    <button
                      className="bg-Cross rounded-3xl h-6 w-6"
                      onClick={(e) => {
                        dispatch(newPatient());
                      }}
                    >
                      ✕
                    </button>
                  </div>
                </div>
                <div className="flex flex-col xl:flex-row ">
                  <div className="w-full p-4 bg-Almost-white flex flex-col gap-8 ">
                    <div className="">The system will allow users to auto-pull appointments from EHR or search for patients by name or MRN once the EHR integration is activated during the pilot.</div>

                    <div>
                      <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
                        Visit ID
                      </label>
                      <div className="mt-2">
                        <input
                          type="text"
                          name="visitId"
                          id="iwantto"
                          className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm outline-none ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 p-4"
                          // placeholder="E.g. usernameandid "
                          value={pollsSlice.patientDetails.visitId}
                          onChange={(e) => {
                            dispatch(setPatientData({ visitId: e.target.value }));
                          }}
                        />
                      </div>
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
                        Patient name
                      </label>
                      <div className="mt-2">
                        <textarea
                          rows={2}
                          name="patient_name"
                          id="tellusmore"
                          className="block  w-full h-12 rounded-md border-0 py-1.5 text-gray-900 shadow-sm outline-none ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 p-4"
                          placeholder="Eg. Adam Stephen"
                          value={pollsSlice.patientDetails.patient_name}
                          onChange={(e) => {
                            dispatch(setPatientData({ name: "patient_name", value: e.target.value }));
                          }}
                        />
                      </div>
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
                        MRN
                      </label>
                      <div className="mt-2">
                        <input
                          type="text"
                          name="mrn"
                          id="MRN"
                          className="block w-full h-12 rounded-md border-0 py-1.5 text-gray-900 shadow-sm outline-none ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 p-4"
                          // placeholder="E.g. usernameandid "
                          value={pollsSlice.patientDetails.mrn}
                          onChange={(e) => {
                            dispatch(setPatientData({ name: "mrn", value: e.target.value }));
                          }}
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
                        DOB
                      </label>
                      {/* <div className="mt-2">
                        <input
                          type="text"
                          name="dob"
                          id="dob"
                          className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm outline-none ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 p-4"
                          // placeholder="E.g. usernameandid "
                          value={pollsSlice.patientDetails.dob}
                          onChange={(e) => {
                            dispatch(setPatientData({ name: "dob", value: e.target.value }));
                          }}
                        />
                      </div> */}

                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker
                          sx={{
                            width: 450,
                            height: 1,
                            border:'none', 
                            color: "success.main",
                          }}
                          defaultValue={dayjs(dayjs(pollsSlice.patientDetails.dob).format("YYYY-MM-DD"))}
                          onChange={(e) => {
                            handleDateChange(e);
                          }}
                        />
                      </LocalizationProvider>
                    </div>
                    <div >
                      {/* <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
                        Gender
                      </label>
                      <div className="mt-2">
                        <input
                          type="text"
                          name="gender"
                          id="gender"
                          className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm outline-none ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 p-4"
                          // placeholder="E.g. usernameandid "
                          value={pollsSlice.patientDetails.gender}
                          onChange={(e) => {
                            dispatch(setPatientData({ name: "gender", value: e.target.value }));
                          }}
                        />
                      </div> */}

                      <Listbox
                        value={selected}
                        onChange={(selected) => {
                          setSelected(selected);
                          dispatch(setPatientData({ name: "gender", value: selected.name }));
                          console.log(selected.name);
                        }}
                      >
                        {({ open }) => (
                          <>
                            <Listbox.Label className="block text-sm font-medium h-12leading-6 text-gray-900">Gender</Listbox.Label>
                            <div className="relative mt-2">
                              <Listbox.Button className="relative w-full cursor-default rounded-md h-12 bg-white py-1.5 pl-3 pr-10 text-left border border-gray-100 text-gray-900 shadow-sm  focus:ring-indigo-600 sm:text-sm sm:leading-6">
                                <span className="block truncate">{selected.name}</span>
                                <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                                  <ChevronUpDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                                </span>
                              </Listbox.Button>

                              <Transition show={open} as={Fragment} leave="transition ease-in duration-100" leaveFrom="opacity-100" leaveTo="opacity-0">
                                <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                                  {people.map((person) => (
                                    <Listbox.Option
                                      key={person.id}
                                      className={({ active }) => classNames(active ? "bg-indigo-600 text-white" : "text-gray-900", "relative cursor-default select-none py-2 pl-3 pr-9")}
                                      value={person}
                                    >
                                      {({ selected, active }) => (
                                        <>
                                          <span className={classNames(selected ? "font-semibold" : "font-normal", "block truncate")}>{person.name}</span>

                                          {selected ? (
                                            <span className={classNames(active ? "text-white" : "text-indigo-600", "absolute inset-y-0 right-0 flex items-center pr-4")}>
                                              <CheckIcon className="h-5 w-5" aria-hidden="true" />
                                            </span>
                                          ) : null}
                                        </>
                                      )}
                                    </Listbox.Option>
                                  ))}
                                </Listbox.Options>
                              </Transition>
                            </div>
                          </>
                        )}
                      </Listbox>
                    </div>

                    <div className="w-full  flex justify-end mt-4">
                      <button
                        className="bg-black text-white p-3 rounded-xl"
                        onClick={(e) => {
                          dispatch(startNewPatient());
                          handleSubmit();
                        }}
                      >
                        Create visit
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
        </>
      ) : null}
    </>
  );
};

export default CreatePoll;
