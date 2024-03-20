/* eslint-disable @next/next/no-img-element */
"use client";
import Visits from "./components/Visits";
import { Fragment } from "react";
import { RootState } from "@/lib/store";
import React, { useState } from "react";
import { Disclosure, Menu, Transition } from "@headlessui/react";
import Integrations from "./components/Integrations";
import Reports from "./components/Reports";
import { useDispatch, useSelector } from "react-redux";
import { toogleChanges } from "@/lib/features/workspace/workSpaceHeaderSlice";
import { newPatient } from "@/lib/features/dashboard/pollsSlice";

import { Bars3Icon, BellIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { navigation, userNavigation, classNames, user } from "@/static/dashboard";

export default function Example() {
  const workspaceHeader = useSelector((state: RootState) => state.workspaceHeader);
  const [publish, setPublish] = useState("Publish");
  const dispatch = useDispatch();

  const renderSection = () => {
    switch (workspaceHeader.header) {
      case "Visits":
        return <Visits />;
      case "Integrations":
        return <Integrations />;
      case "Reports":
        return <Reports />;
      case "Visits":
        return <Visits />;
    }
  };

  function handleLogout() {
    localStorage.removeItem("access_token");
    window.location.href = "/";
  }

  return (
    <>
      <div className={`flex flex-col h-screen overflow-x-hidden `}>
        <Disclosure as="header" className="bg-white  border border-gray-100">
          {({ open }) => (
            <>
              <div className="mx-auto px-2 sm:px-4 lg:divide-y lg:divide-Neutral lg:px-8">
                <div className="relative flex h-16 justify-between">
                  <div className="relative z-10 flex px-2 lg:px-0">
                    <div className="flex gap-4 flex-shrink-0 items-center">
                      <img alt="Interface Image" className="h-12 w-auto" src="/images/va.svg" />
                      <div className="border-r h-12"></div>
                      {/* <img alt="Interface Image" className="h-12 w-auto" src="/logo.svg" /> */}
                    </div>
                  </div>
                  <div className="relative z-0 flex flex-1 items-center justify-center px-2 sm:absolute sm:inset-0">
                    <div className="w-full hidden lg:block sm:max-w-xs">
                      <nav className="sm:hidden lg:flex lg:space-x-" aria-label="Global">
                        <button key="" name="random" className="text-Accent-Blue text-gray-900 hover:bg-gray-50 hover:text-gray-900 flex items-center   px-3 text-sm font-medium gap-2">
                          <img src={`/images/evva/patients.svg`} alt="" />
                          <div
                            className=" text-medium text-Gray
                    font-semibold"
                          >
                            Patients
                          </div>
                        </button>
                        {navigation.map((item, index) => (
                          <>
                            <button
                              name={item.name}
                              className={classNames(
                                item.name == workspaceHeader.header ? "text-Accent-Blue " : "text-gray-900 hover:bg-gray-50 hover:text-gray-900",
                                " items-center px-3 text-sm font-medium flex gap-2 border border-yellow-500 bg-yellow-100 rounded-2xl p-2"
                              )}
                              aria-current={item.current ? "page" : undefined}
                              onClick={(e) => {
                                dispatch(toogleChanges({ name: item.name }));
                              }}
                            >
                              <img src={`/images/evva/visits.svg`} alt="" />
                              <div className={`${item.name == workspaceHeader.header ? " text-black" : ""} text-medium font-semibold`}> {item.name}</div>
                            </button>
                            <hr />
                          </>
                        ))}

                        <button key="" name="random" className="text-Accent-Blue text-gray-900 hover:bg-gray-50 hover:text-gray-900 flex gap-2 items-center   px-3 text-sm font-medium ">
                          <img src={`/images/evva/reports.svg`} alt="" />
                          <div className=" text-medium text-Gray font-semibold">Reports</div>
                        </button>

                        {/* <div className="w-full items-center flex flex-row justify-end">
                    <div>
                      {publish === "Publish" && (
                        <button
                          className="bg-white flex items-center justify-around border-2 border-spacing-2 border-dotted border-Ind text-Ind m-2  w-32 rounded-xl pl-4 pr-4 pt-2 pb-2"
                          onClick={() => dispatch(newPatient())}
                        >
                          <img src="/images/plus.svg" alt="" />
                          <div className="text-Ind"> New Visit</div>
                        </button>
                      )}

                      {publish === "Publishing" && <button className="bg-Pri-Dark bg-opacity-50 m-2 text-white w-32 rounded-xl pl-4 pr-4 pt-2 pb-2">Publishing</button>}
                    </div>
                  </div> */}
                      </nav>
                    </div>
                  </div>
                  <div className="relative z-50 flex items-center lg:hidden">
                    {/* Mobile menu button */}
                    <Disclosure.Button className="relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500">
                      <span className="absolute -inset-0.5" />
                      <span className="sr-only">Open menu</span>
                      {open ? <XMarkIcon className="block h-6 w-6" aria-hidden="true" /> : <Bars3Icon className="block h-6 w-6" aria-hidden="true" />}
                    </Disclosure.Button>
                  </div>
                  <div className="hidden lg:relative lg:z-50 lg:ml-4 lg:flex lg:items-center">
                    <button type="button">
                      <BellIcon className="h-6 w-auto mr-6" aria-hidden="true" />
                    </button>

                    {/* Profile dropdown */}
                    <Menu as="div" className="relative ">
                      <Menu.Button className="-m-1.5 flex items-center p-">
                        <span className="sr-only">Open user menu</span>
                        <img className="h-8 w-8 rounded-full bg-orange-200 mr-4" src="/images/person.png" alt="" />
                      </Menu.Button>
                      <Transition
                        as={Fragment}
                        enter="transition ease-out duration-100"
                        enterFrom="transform opacity-0 scale-95"
                        enterTo="transform opacity-100 scale-100"
                        leave="transition ease-in duration-75"
                        leaveFrom="transform opacity-100 scale-100"
                        leaveTo="transform opacity-0 scale-95"
                      >
                        <Menu.Items className="absolute p-4 right-0 mt-2.5 w-64 origin-top-right rounded-md bg-white py-2 shadow-lg ring-1 ring-gray-900/5 focus:outline-none">
                          {userNavigation.map((item, index) => (
                            <Menu.Item key={index}>
                              {({ active }) => (
                                <>
                                  <div className="flex flex-row mt-4 px-3 py-1">
                                    {/* <div>
                                      <img src={item.href} className="h-8 w-8 rounded-full bg-orange-200 mr-4" alt="" />
                                    </div> */}
                                    <div>
                                      {" "}
                                      {item.name === "Log out" ? (
                                        <>
                                          {" "}
                                          <button
                                            onClick={(e) => {
                                              handleLogout();
                                            }}
                                            className={classNames(active ? "bg-gray-50" : "", "mt-4 px-3  text-yellow-600 py-1 text-sm leading-6 ")}
                                          >
                                            {item.name}
                                          </button>
                                        </>
                                      ) : (
                                        <>
                                          {" "}
                                          <a href={item.href} className={classNames(active ? "bg-gray-50" : "", "mt-4 px-3 py-1 text-sm leading-6 text-gray-900")}>
                                            {item.name}
                                          </a>
                                        </>
                                      )}
                                    </div>
                                  </div>
                                </>
                              )}
                            </Menu.Item>
                          ))}
                        </Menu.Items>
                      </Transition>
                    </Menu>
                  </div>
                </div>
              </div>

              <Disclosure.Panel as="nav" className="lg:hidden" aria-label="Global">
                <div className="space-y-1 px-2 pb-3 pt-2">
                  {navigation.map((item, index) => (
                    <Disclosure.Button
                      key={index}
                      as="a"
                      href={item.href}
                      className={classNames(item.current ? "bg-gray-100 text-gray-900" : "text-gray-900 hover:bg-gray-50 hover:text-gray-900", "block rounded-md py-2 px-3 text-base font-medium")}
                      aria-current={item.current ? "page" : undefined}
                    >
                      {item.name}
                    </Disclosure.Button>
                  ))}
                </div>
                <div className="border-t border-gray-200 pb-3 pt-4">
                  <div className="flex items-center px-4">
                    <div className="flex-shrink-0">
                      <img className="h-10 w-10 rounded-full" src={user.imageUrl} alt="" />
                    </div>
                    <div className="ml-3">
                      <div className="text-base font-medium text-gray-800">{user.name}</div>
        
                    </div>
                    <button
                      type="button"
                      className="relative ml-auto flex-shrink-0 rounded-full bg-white p-1 text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    >
                      <span className="absolute -inset-1.5" />
                      <span className="sr-only">View notifications</span>
                      <BellIcon className="h-6 w-6" aria-hidden="true" />
                    </button>
                  </div>
                  <div className="mt-3 space-y-1 px-2">
                    {userNavigation.map((item, index) => (
                      <Disclosure.Button key={index} as="a" href={item.href} className="block rounded-md px-3 py-2 text-base font-medium text-gray-500 hover:bg-gray-50 hover:text-gray-900">
                        {item.name}
                      </Disclosure.Button>
                    ))}
                  </div>
                </div>
              </Disclosure.Panel>
            </>
          )}
        </Disclosure>

        <div className="grow">{renderSection()}</div>
      </div>
    </>
  );
}
