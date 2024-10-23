"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.min.css";
import Link from "next/link";
import { signIn } from "next-auth/react";

const page = () => {
  const Router = useRouter();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleData = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:8100/login/sendData", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        return console.log(
          `Error in Signup POST: ${data.message || "Unknown error"}`
        );
      }
      console.log(`SignUp --POSTED:`, data);

      const result = await signIn("credentials", {
        email: formData.email,
        password: formData.password,
        redirect: true,
        redirectTo: "/",
      });

      if (result?.error) {
        console.error(`Error in SignIn: ${result.error}`);
      } else {
        Router.push("/");
      }
    } catch (error) {
      console.error(`FrontEnd --Error in Signup: ${error.message}`);
    }

    console.log(formData);
    toast.info("Done!");
  };

  const handleMedia = async (provider) => {
    try {
      const result = await signIn(provider, { redirect: false });

      console.log(`SignIn Result for ${provider}:`, result);

      if (result && result.error) {
        console.error(`Error in ${provider} SignIn: ${result.error}`);
      } else if (result) {
        Router.push("/");
      } else {
        console.error(`No result returned from ${provider} SignIn`);
      }
    } catch (error) {
      console.log(
        `FrontEnd -- Error in SignIn with ${provider}: ${error.message}`
      );
    }
  };

  return (
    <div className="w-full h-[100dvh] bg-black flex flex-col items-center justify-center gap-4">
      <ToastContainer />
      <h1 className="text-white font-[500] text-[2.5rem]">
        WeatherPulse<sup>{">>"}</sup>
      </h1>
      <button
        type="button"
        onClick={() => handleMedia("google")}
        className="w-[320px] h-[7dvh] p-2 bg-zinc-500 text-white font-[500] rounded"
      >
        Login with Google
      </button>
      <button
        type="button"
        onClick={() => handleMedia("github")}
        className="w-[320px] h-[7dvh] p-2 bg-white text-black font-[500] rounded"
      >
        Login with Github
      </button>
      <form
        onSubmit={handleSubmit}
        className="w-[max-content] h-[max-content] bg-zinc-900 flex flex-col items-start justify-center rounded-[8px] gap-3 shadow-xl p-6"
      >
        <div className="w-[max-content] h-[max-content] flex flex-col items-start justify-around gap-2">
          <label htmlFor="email" className="font-[500] text-[.9rem] text-white">
            Email
          </label>
          <input
            type="email"
            name="email"
            id="email"
            value={formData.email}
            onChange={handleData}
            className="w-[320px] h-[6dvh] rounded px-2 py-1 text-[.9rem] font-[500] outline-none text-white border bg-zinc-800 border-zinc-800"
            placeholder="name@gmail.com"
            required
          />
        </div>
        <div className="w-[max-content] h-[max-content] flex flex-col items-start justify-around gap-2">
          <label
            htmlFor="password"
            className="font-[500] text-[.9rem] text-white"
          >
            Password
          </label>
          <input
            type="password"
            name="password"
            id="password"
            value={formData.password}
            onChange={handleData}
            className="w-[320px] h-[6dvh] rounded px-2 py-1 text-[.9rem] font-[500] outline-none text-white border bg-zinc-800 border-zinc-800"
            placeholder="Message"
            required
          />
        </div>
        <button
          className="w-full h-[7dvh] p-2 bg-blue-500 text-white font-[500] rounded"
          type="submit"
        >
          Signin
        </button>
        <Link href={"/signup"} className="text-white text-[.9rem] font-[500]">
          Don't have an Account? Signup
        </Link>
      </form>
    </div>
  );
};

export default page;
