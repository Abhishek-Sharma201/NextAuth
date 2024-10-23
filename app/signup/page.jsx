"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.min.css";
import Link from "next/link";

const page = () => {
  const Router = useRouter();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    username: "",
  });

  const handleData = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(formData);

    try {
      const res = await fetch("http://localhost:8100/signup/sendData", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const contentType = res.headers.get("content-type");

      let data;
      if (contentType && contentType.includes("application/json")) {
        data = await res.json();
      } else {
        const errorMessage = await res.text();
        console.error(`Error in Signup POST:`, errorMessage);
        return;
      }

      if (!res.ok) {
        return console.log(
          `Error in Signup POST: ${data.message || "Unknown error"}`
        );
      }

      console.log(`SignUp -- POSTED:`, data);
      toast.info("Signup successful!");
      Router.push("/login");
    } catch (error) {
      console.error(`FrontEnd -- Error in Signup: ${error.message}`);
    }
  };

  return (
    <div className="w-full h-[100dvh] bg-black flex flex-col items-center justify-center gap-4">
      <ToastContainer />
      <h1 className="text-white font-[500] text-[2.5rem]">
        WeatherPulse<sup>{">>"}</sup>
      </h1>
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
            placeholder="Password"
            required
          />
        </div>
        <div className="w-full h-[max-content] flex items-center justify-between">
          <div className="w-[max-content] h-[max-content] flex flex-col items-start justify-around gap-2">
            <label
              htmlFor="firstName"
              className="font-[500] text-[.9rem] text-white"
            >
              Username
            </label>
            <input
              type="text"
              name="username"
              id="username"
              value={formData.username}
              onChange={handleData}
              className="w-[320px] h-[6dvh] rounded px-2 py-1 text-[.9rem] font-[500] outline-none text-white border bg-zinc-800 border-zinc-800"
              placeholder="John"
              required
            />
          </div>
        </div>
        <button
          className="w-full h-[7dvh] p-2 bg-blue-500 text-white font-[500] rounded"
          type="submit"
        >
          Signup
        </button>
        <Link href={"/login"} className="text-white text-[.9rem] font-[500]">
          Already have an Account? Login
        </Link>
      </form>
    </div>
  );
};

export default page;
