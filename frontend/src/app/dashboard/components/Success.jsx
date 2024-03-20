"use client";
import React from "react";

const Success = (props) => {
  const { msg, statuscode } = props.message;

  return (
    <>
      {statuscode == 200 && <div className="fixed top-0 left-0 w-full bg-green-600 text-white text-center py-4 px-6 z-50 animate-toast-slide">{msg}</div>}

      {statuscode == 400 && <div className="fixed top-0 left-0 w-full bg-red-600 text-white text-center py-4 px-6 z-50 animate-toast-slide">Something went wrong.</div>}
    </>
  );
};

export default Success;
