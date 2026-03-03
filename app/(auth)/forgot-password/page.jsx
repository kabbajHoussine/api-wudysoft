"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import useDarkMode from "@/hooks/useDarkMode";
import { Icon } from "@iconify/react";
import { ToastContainer } from "react-toastify";
import ForgotForm from "@/components/partials/auth/forgot-pass";

const ForgotPassPage = () => {
  const [isDark] = useDarkMode();
  const [currentYear] = useState(new Date().getFullYear());

  return (
    <div className="loginwrapper">
      <ToastContainer
        position="top-right"
        autoClose={3000}
        newestOnTop
        theme="colored"
        toastClassName={(o) =>
          `relative flex p-1 min-h-10 rounded-md justify-between overflow-hidden cursor-pointer ${
            o?.type === "success"
              ? "bg-emerald-500 text-white"
              : o?.type === "error"
              ? "bg-red-500 text-white"
              : "bg-teal-500 text-white"
          } dark:text-slate-100 text-sm p-3 m-2 rounded-lg shadow-md`
        }
      />
      <div className="lg-inner-column">
        {/* Kolom kiri dengan background */}
        <div
          className="left-column bg-cover bg-no-repeat bg-center"
          style={{
            backgroundImage: `url(/assets/images/all-img/login-bg.png)`,
          }}
        >
          <div className="flex flex-col h-full justify-center">
            <div className="flex-1 flex flex-col justify-center items-center">
              <Link href="/">
                <img
                  src="/assets/images/logo/logo-white.svg"
                  alt="Logo"
                  className="mb-10"
                />
              </Link>
            </div>
            <div>
              <div className="black-500-title max-w-[525px] mx-auto pb-20 text-center text-white">
                Unlock your Project{" "}
                <span className="font-bold">performance</span>
              </div>
            </div>
          </div>
        </div>

        {/* Kolom kanan dengan efek frost */}
        <div className="right-column relative">
          <div className="inner-content h-full flex flex-col backdrop-blur-md bg-white/30 dark:bg-slate-800/30 rounded-l-2xl shadow-xl">
            <div className="auth-box h-full flex flex-col justify-center px-8 lg:px-16">
              <div className="mobile-logo text-center mb-6 lg:hidden block">
                <Link href="/">
                  <img
                    src={
                      isDark
                        ? "/assets/images/logo/logo-white.svg"
                        : "/assets/images/logo/logo.svg"
                    }
                    alt="Logo"
                    className="mx-auto"
                  />
                </Link>
              </div>

              <div className="text-center 2xl:mb-10 mb-4">
                <h4 className="font-medium text-slate-900 dark:text-white">
                  Forgot password?
                </h4>
                <div className="text-slate-600 dark:text-slate-300 text-base">
                  Enter your email to receive a password reset link.
                </div>
              </div>

              <ForgotForm />

              <div className="md:max-w-[345px] mt-6 mx-auto font-normal text-slate-600 dark:text-slate-300 mt-12 uppercase text-sm text-center">
                <Link
                  href="/login"
                  className="text-slate-900 dark:text-white font-medium hover:underline"
                >
                  Back to Sign in
                </Link>
              </div>
            </div>

            <div className="auth-footer text-center text-slate-500 dark:text-slate-400 py-4">
              Copyright {currentYear}, Dashcode All Rights Reserved.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassPage;