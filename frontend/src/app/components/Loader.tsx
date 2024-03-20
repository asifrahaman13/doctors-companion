/* eslint-disable @next/next/no-img-element */
import React from "react";

const Loader = () => {
  return (
    <>
      <div className="fixed inset-0 z-10 h-screen bg-[rgba(0,0,0,0.7)] flex items-center justify-center flex-col">
        <img
          src="/loader.svg" // Path to your image file inside the public directory
          alt="Interface Image"
          className="w-[100px] h-[100px] object-contain"
        />
        <p className="mt-[20px] font-epilogue font-bold text-[20px] text-white text-center">
          The process is being completed <br /> Please wait...
        </p>
      </div>
    </>
  );
};

export default Loader;
