"use client";

import type React from "react";
import { useEffect, useState } from "react";
import { Lock, User } from "lucide-react";
import { useLogin } from "@/hooks/login/UseLogin";
import { Toaster } from "react-hot-toast";

export default function Login() {
  const { login, loading } = useLogin();
  const [formdata, setformfata] = useState({
    username: "",
    password: "",
  });
  const [isValid, setIsValid] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setformfata((prev) => ({ ...prev, [name]: value }));
  };

  useEffect(() => {
    const isFormValid =
      formdata.username.trim() !== "" && formdata.password.trim() !== "";
    setIsValid(isFormValid);
  }, [formdata]);

  const handleLogin = (e: any) => {
    const { username, password } = Object.fromEntries(e);
    login(username, password);
  };

  return (
    <section className="w-full max-w-md mx-auto">
      <Toaster position="top-center" />
      <div className="card bg-base-100/90 backdrop-blur-sm shadow-xl border border-primary/20">
        <div className="card-body p-8">
          <div className="flex flex-col items-center mb-6">
            <div className="avatar placeholder mb-4">
              <div className="bg-gradient-to-r from-primary to-secondary text-white rounded-full w-20 h-20">
                <Lock className="h-10 w-10" />
              </div>
            </div>
            <h2 className="card-title text-3xl font-bold text-center mb-2 text-secondary">
              Sign In
            </h2>
            <p className="text-center text-sm opacity-70 max-w-xs">
              Enter your credentials to access your account
            </p>
          </div>

          <form action={handleLogin} className="mt-2">
            <div className="space-y-5">
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium text-secondary">
                    Username
                  </span>
                </label>
                <label className="input input-bordered flex items-center gap-2 focus-within:border-primary">
                  <User className="h-5 w-5 text-primary" />
                  <input
                    type="text"
                    className="grow"
                    placeholder="Enter your username"
                    name="username"
                    required
                    onChange={handleInputChange}
                  />
                </label>
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium text-secondary">
                    Password
                  </span>
                </label>
                <label className="input input-bordered flex items-center gap-2 focus-within:border-primary">
                  <Lock className="h-5 w-5 text-primary" />
                  <input
                    type="password"
                    className="grow"
                    placeholder="Enter your password"
                    name="password"
                    required
                    onChange={handleInputChange}
                  />
                </label>
              </div>

              <div className="form-control">
                <label className="label cursor-pointer justify-start gap-3">
                  <input
                    type="checkbox"
                    className="checkbox checkbox-secondary"
                  />
                  <span className="label-text">Remember me</span>
                </label>
              </div>

              <div className="form-control mt-8">
                <button
                  type="submit"
                  className={`btn bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white border-none btn-block ${
                    loading ? "" : ""
                  }`}
                  disabled={loading || !isValid}
                >
                  {loading ? <span className="loading"></span> : null}
                  Sign In
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
