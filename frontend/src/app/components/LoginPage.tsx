/* eslint-disable @next/next/no-img-element */
"use client";
import React, { useEffect, useState } from "react";
import { Fragment } from "react";
import { LoginData, Authenticate } from "@/app/api/auth/Login";


const LoginPage = () => {
  const [loginData, setLoginData] = useState({
    membername: "",
    memberpass: "",
  });
  useEffect(() => {
    async function AuthenticateUser() {
      try {
        const access_token = localStorage.getItem("access_token");
        if (access_token != null) {
          const response = await Authenticate();
          if (response == true) {
            window.location.href = "/dashboard";
          }
        }
      } catch (err) {
        console.log(err);
      }
    }

    AuthenticateUser();
  }, []);

  async function handleLogin() {
    try {
      const response = await LoginData(loginData);
      if (response?.status === 200) {
        if (response?.data.access_token != null) {
          localStorage.setItem("access_token", response.data.access_token);
          window.location.href = "/dashboard";
        }
      }
    } catch (err) {
      console.log(err);
    }
  }

  function handleLoginData(event: any) {
    const { name, value } = event.target;
    setLoginData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  }
  return (
    <Fragment>
      <div className="h-screen">
        <div className="flex min-h-full w-screen ">
          <div className="relative hidden w-1/2  lg:block">
            <img
              className="absolute inset-0 h-full w-full object-cover"
              src="https://www.sattva.co.in/wp-content/uploads/2022/12/Untitled-1200-%C3%97-630-px.png"
              alt=""
            />
          </div>

          <div className="flex flex-col justify-center w-full xl:w-1/2 px-4 py-12  lg:flex-none lg:px-20 xl:px-24 bg-gray-50">
            <div className="mx-auto w-full max-w-sm lg:w-96">
              <div>
                <img
                  className="h-10 w-auto"
                  src="https://tailwindui.com/img/logos/mark.svg?color=yellow&shade=600"
                  alt="Your Company"
                />
                <h2 className="mt-8 text-2xl font-bold leading-9 tracking-tight text-gray-900">Sign in to your account</h2>
              </div>

              <div className="mt-10">
                <div>
                  <div className="space-y-6">
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
                        User name
                      </label>
                      <div className="mt-2">
                        <input
                          id="membername"
                          name="membername"
                          type="text"
                          autoComplete="email"
                          required
                          placeholder="e.g example@3"
                          className="block w-full rounded-md border-2 focus:border-yellow-600 outline-none py-1.5 shadow-sm  ring-gray-300 placeholder:text-gray-400 p-2  sm:text-sm sm:leading-6"
                          onChange={(e) => {
                            handleLoginData(e);
                          }}
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">
                        Password
                      </label>
                      <div className="mt-2">
                        <input
                          id="memberpass"
                          name="memberpass"
                          type="password"
                          autoComplete="current-password"
                          required
                          placeholder="Enter your password"
                          className="block w-full rounded-md border-2 focus:border-yellow-600 outline-none py-1.5 shadow-sm  ring-gray-300 placeholder:text-gray-400 p-2  sm:text-sm sm:leading-6"
                          onChange={(e) => {
                            handleLoginData(e);
                          }}
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <input id="remember-me" name="remember-me" type="checkbox" className="h-4 w-4 rounded border-gray-300 text-yellow-600 focus:ring-yellow-600" />
                        <label htmlFor="remember-me" className="ml-3 block text-sm leading-6 text-gray-700">
                          Remember me
                        </label>
                      </div>

                      <div className="text-sm leading-6">
                        <a href="#" className="font-semibold text-yellow-600 hover:text-yellow-500">
                          Forgot password?
                        </a>
                      </div>
                    </div>

                    <div>
                      <button
                        type="submit"
                        className="flex w-full justify-center rounded-md bg-yellow-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-yellow-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-yellow-600"
                        onClick={(e) => {
                          handleLogin();
                        }}
                      >
                        Sign in
                      </button>
                    </div>
                  </div>
                </div>

                <div className="mt-10"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default LoginPage;
