"use client";

import type React from "react";
import { useState } from "react";
import { Mail, Lock, User } from "lucide-react";
import { useLogin } from "@/hooks/login/UseLogin";
import { Toaster } from "react-hot-toast";

export default function Login() {
  const [modalOpen, setModalOpen] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useLogin();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    login(email, password);
    console.log("Login attempt with:", { email, password });
  };

  const openModal = () => {
    setModalOpen(true);
    const modal = document.getElementById(
      "login_modal"
    ) as HTMLDialogElement | null;
    if (modal) modal.showModal();
  };

  const closeModal = () => {
    setModalOpen(false);
    const modal = document.getElementById(
      "login_modal"
    ) as HTMLDialogElement | null;
    if (modal) modal.close();
  };

  return (
    <section className="w-full max-w-md mx-auto">
      <Toaster />
      <div className="modal-box p-0 max-w-md bg-white shadow-xl overflow-hidden">
        <div className="card w-full border-none">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-lg"></div>
          <div className="card-body relative z-10">
            <form method="dialog">
              <button
                className="btn btn-sm btn-circle btn-ghost absolute right-4 top-4 text-primary"
                onClick={closeModal}
              >
                ✕
              </button>
            </form>

            <div className="flex flex-col items-center mb-4">
              <div className="w-16 h-16 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center mb-2">
                <Lock className="h-8 w-8 text-white" />
              </div>
              <h2 className="card-title text-2xl font-bold text-center text-primary">
                Sign In
              </h2>
              <p className="text-center text-sm opacity-70">
                Enter your credentials to access your account
              </p>
            </div>

            <form onSubmit={handleLogin}>
              <div className="space-y-4">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text text-primary font-medium">
                      Username
                    </span>
                  </label>
                  <div className="relative ">
                    <User className="absolute left-3 top-4 h-4 w-4 text-secondary" />
                    <input
                      type="text"
                      placeholder="usename"
                      className="input w-full pl-10 border-secondary/30 focus:border-secondary"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="form-control">
                  <div className="flex items-center justify-between">
                    <label className="label">
                      <span className="label-text text-primary font-medium">
                        Password
                      </span>
                    </label>
                    <button
                      type="button"
                      className="btn btn-link btn-xs text-secondary p-0 h-auto"
                    >
                      Forgot password?
                    </button>
                  </div>
                  <div className="relative flex items-center justify-center">
                    <Lock className="absolute left-3 top-4 h-4 w-4 text-secondary" />
                    <input
                      type="password"
                      placeholder="password"
                      className="input  w-full pl-10 border-secondary/30 focus:border-secondary"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="form-control">
                  <label className="label cursor-pointer justify-start gap-2">
                    <input
                      type="checkbox"
                      className="checkbox checkbox-secondary"
                    />
                    <span className="label-text">Remember me</span>
                  </label>
                </div>

                <div className="form-control mt-6">
                  <button
                    type="submit"
                    className="btn btn-block bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-white font-semibold border-none"
                  >
                    Sign In
                  </button>
                </div>

                <div className="text-center text-sm mt-4">
                  Don't have an account?{" "}
                  <button
                    type="button"
                    className="btn btn-link btn-xs text-secondary p-0 h-auto font-medium"
                  >
                    Sign up
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
      <form method="dialog" className="modal-backdrop">
        <button onClick={closeModal}>close</button>
      </form>
    </section>
  );
}
