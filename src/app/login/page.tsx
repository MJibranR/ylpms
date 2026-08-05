"use client";

import { useState, useEffect, useRef } from "react";
import { Eye, EyeOff, Mail, Lock, X, CheckCircle2, ArrowLeft } from "lucide-react";

type ForgotStep = "closed" | "email" | "otp" | "done";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Wire up your auth logic here
    console.log({ email, password });
  };

  // ---- Forgot password flow ----
  const [forgotStep, setForgotStep] = useState<ForgotStep>("closed");
  const [recoveryEmail, setRecoveryEmail] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [resendTimer, setResendTimer] = useState(0);
  const [isSending, setIsSending] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [formError, setFormError] = useState("");
  const otpRefs = useRef<Array<HTMLInputElement | null>>([]);

  useEffect(() => {
    if (resendTimer <= 0) return;
    const t = setTimeout(() => setResendTimer((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [resendTimer]);

  const openForgotFlow = () => {
    setForgotStep("email");
    setRecoveryEmail("");
    setOtp(["", "", "", "", "", ""]);
    setFormError("");
  };

  const closeForgotFlow = () => {
    setForgotStep("closed");
    setFormError("");
  };

  const requestOtp = async (targetEmail: string) => {
    const res = await fetch("/api/auth/send-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: targetEmail }),
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || "Failed to send verification code.");
    }
  };

  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");
    setIsSending(true);
    try {
      await requestOtp(recoveryEmail);
      setOtp(["", "", "", "", "", ""]);
      setForgotStep("otp");
      setResendTimer(30);
    } catch (err) {
      setFormError(
        err instanceof Error ? err.message : "Something went wrong."
      );
    } finally {
      setIsSending(false);
    }
  };

  const handleResendCode = async () => {
    if (resendTimer > 0 || isSending) return;
    setFormError("");
    setIsSending(true);
    try {
      await requestOtp(recoveryEmail);
      setOtp(["", "", "", "", "", ""]);
      setResendTimer(30);
      otpRefs.current[0]?.focus();
    } catch (err) {
      setFormError(
        err instanceof Error ? err.message : "Something went wrong."
      );
    } finally {
      setIsSending(false);
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    if (!/^[0-9]?$/.test(value)) return;
    const next = [...otp];
    next[index] = value;
    setOtp(next);
    if (value && index < otp.length - 1) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const handleOtpPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "");
    if (!pasted) return;
    e.preventDefault();
    const digits = pasted.slice(0, otp.length).split("");
    const next = [...otp];
    digits.forEach((d, i) => (next[i] = d));
    setOtp(next);
    const nextEmptyIndex = next.findIndex((d) => d === "");
    otpRefs.current[nextEmptyIndex === -1 ? otp.length - 1 : nextEmptyIndex]?.focus();
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");
    setIsVerifying(true);
    try {
      const res = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: recoveryEmail, code: otp.join("") }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Incorrect code. Please try again.");
      }
      setForgotStep("done");
    } catch (err) {
      setFormError(
        err instanceof Error ? err.message : "Something went wrong."
      );
      setOtp(["", "", "", "", "", ""]);
      otpRefs.current[0]?.focus();
    } finally {
      setIsVerifying(false);
    }
  };

  const isOtpComplete = otp.every((d) => d !== "");

  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row">
      {/* Left panel */}
      <div className="relative w-full lg:w-1/2 min-h-[500px] lg:min-h-screen bg-[#E8622C] overflow-hidden flex flex-col">
        {/* subtle diagonal shading in the lower right, matching the reference */}
        <div className="pointer-events-none absolute -bottom-24 -right-24 w-[420px] h-[420px] bg-black/10 rounded-full blur-3xl" />
        <div className="pointer-events-none absolute bottom-0 right-0 w-2/3 h-1/2 bg-gradient-to-tl from-black/20 to-transparent" />

        {/* Logo / brand */}
        <div className="relative z-10 flex items-center gap-2 px-8 pt-8 sm:px-12 sm:pt-10">
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#1B2540] text-white">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              className="h-4 w-4"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                d="M12 3l8 4-8 4-8-4 8-4z"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M4 11v5c0 1.5 3.5 3 8 3s8-1.5 8-3v-5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
          <span className="text-white text-sm font-semibold tracking-wide">
            Youth Leaders Program
          </span>
        </div>

        {/* Hero copy */}
        <div className="relative z-10 flex-1 flex flex-col justify-center px-8 sm:px-12 max-w-xl">
          <span className="inline-block w-fit rounded-full bg-white/15 px-3 py-1 text-[11px] font-semibold tracking-wide text-white mb-5">
            JOIN YLP 2.0
          </span>

          <h1 className="text-white font-bold leading-tight text-3xl sm:text-4xl lg:text-[2.6rem] mb-4">
            Open to every
            <br />
            Pakistani university
            <br />
            student.
          </h1>

          <p className="text-white/85 text-sm sm:text-base max-w-md">
            It&rsquo;s not about being the &ldquo;best&rdquo; student. It&rsquo;s about
            investing your time, passion, and energy to make a difference in
            your community.
          </p>
        </div>

        {/* Impact stats bar */}
        <div className="relative z-10 mx-6 mb-6 sm:mx-10 sm:mb-10 rounded-md bg-[#1B2540] px-6 py-5 sm:px-8 sm:py-6">
          <p className="text-[10px] font-semibold tracking-widest text-white/60 mb-4">
            OUR IMPACT IN NUMBERS
          </p>
          <div className="grid grid-cols-3 gap-4 divide-x divide-white/10">
            <div>
              <p className="text-[#E8622C] font-bold text-xl sm:text-2xl">
                100+
              </p>
              <p className="text-white/60 text-[11px] sm:text-xs mt-1">
                Workshops
              </p>
            </div>
            <div className="pl-4">
              <p className="text-[#E8622C] font-bold text-xl sm:text-2xl">
                10,000+
              </p>
              <p className="text-white/60 text-[11px] sm:text-xs mt-1">
                Direct Beneficiaries
              </p>
            </div>
            <div className="pl-4">
              <p className="text-[#E8622C] font-bold text-xl sm:text-2xl">
                5M+
              </p>
              <p className="text-white/60 text-[11px] sm:text-xs mt-1">
                Digital Reach
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Right panel — login form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center bg-white px-6 py-16 sm:px-12">
        <div className="w-full max-w-sm">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Welcome Back
          </h2>
          <p className="text-sm text-gray-500 mb-8">
            Enter your credentials to access your youth portal
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-800 mb-1.5"
              >
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@university.edu"
                  className="w-full rounded-md border border-gray-200 bg-white py-2.5 pl-10 pr-3 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#E8622C]/40 focus:border-[#E8622C]"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-800"
                >
                  Password
                </label>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••"
                  className="w-full rounded-md border border-gray-200 bg-white py-2.5 pl-10 pr-10 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#E8622C]/40 focus:border-[#E8622C]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              <div className="flex justify-end mt-2">
                <button
                  type="button"
                  onClick={openForgotFlow}
                  className="text-xs text-gray-500 hover:text-[#E8622C] transition-colors"
                >
                  Forgot password?
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full rounded-full bg-[#E8622C] py-3 text-sm font-semibold text-white hover:bg-[#d9551f] transition-colors focus:outline-none focus:ring-2 focus:ring-[#E8622C]/50 focus:ring-offset-2"
            >
              Sign In
            </button>
          </form>
        </div>
      </div>

      {/* Forgot password modal */}
      {forgotStep !== "closed" && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
          role="dialog"
          aria-modal="true"
        >
          <div className="relative w-full max-w-sm rounded-xl bg-white p-7 shadow-xl">
            <button
              type="button"
              onClick={closeForgotFlow}
              aria-label="Close"
              className="absolute right-4 top-4 text-gray-400 hover:text-gray-600"
            >
              <X className="h-4 w-4" />
            </button>

            {/* Step 1: enter recovery gmail */}
            {forgotStep === "email" && (
              <>
                <div className="mb-6 flex h-11 w-11 items-center justify-center rounded-full bg-[#E8622C]/10">
                  <Mail className="h-5 w-5 text-[#E8622C]" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-1.5">
                  Reset your password
                </h3>
                <p className="text-sm text-gray-500 mb-6">
                  Enter the Gmail address linked to your account and we&rsquo;ll
                  send a verification code to it.
                </p>
                <form onSubmit={handleSendCode} className="space-y-5">
                  <div>
                    <label
                      htmlFor="recovery-email"
                      className="block text-sm font-medium text-gray-800 mb-1.5"
                    >
                      Gmail Address
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <input
                        id="recovery-email"
                        type="email"
                        required
                        pattern=".+@gmail\.com"
                        title="Please enter a valid Gmail address"
                        value={recoveryEmail}
                        onChange={(e) => setRecoveryEmail(e.target.value)}
                        placeholder="name@gmail.com"
                        className="w-full rounded-md border border-gray-200 bg-white py-2.5 pl-10 pr-3 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#E8622C]/40 focus:border-[#E8622C]"
                      />
                    </div>
                  </div>

                  {formError && (
                    <p className="text-xs font-medium text-red-500">
                      {formError}
                    </p>
                  )}

                  <button
                    type="submit"
                    disabled={isSending}
                    className="w-full rounded-full bg-[#E8622C] py-3 text-sm font-semibold text-white hover:bg-[#d9551f] disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors focus:outline-none focus:ring-2 focus:ring-[#E8622C]/50 focus:ring-offset-2"
                  >
                    {isSending ? "Sending..." : "Send Code"}
                  </button>
                </form>
              </>
            )}

            {/* Step 2: enter OTP */}
            {forgotStep === "otp" && (
              <>
                <button
                  type="button"
                  onClick={() => setForgotStep("email")}
                  className="mb-4 flex items-center gap-1 text-xs text-gray-400 hover:text-gray-600"
                >
                  <ArrowLeft className="h-3.5 w-3.5" />
                  Back
                </button>
                <div className="mb-6 flex h-11 w-11 items-center justify-center rounded-full bg-[#E8622C]/10">
                  <Mail className="h-5 w-5 text-[#E8622C]" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-1.5">
                  Enter verification code
                </h3>
                <p className="text-sm text-gray-500 mb-6">
                  We sent a 6-digit code to{" "}
                  <span className="font-medium text-gray-700">
                    {recoveryEmail || "your Gmail"}
                  </span>
                  . Enter it below to continue.
                </p>
                <form onSubmit={handleVerifyOtp} className="space-y-6">
                  <div className="flex justify-between gap-2">
                    {otp.map((digit, i) => (
                      <input
                        key={i}
                        ref={(el) => {
                          otpRefs.current[i] = el;
                        }}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleOtpChange(i, e.target.value)}
                        onKeyDown={(e) => handleOtpKeyDown(i, e)}
                        onPaste={handleOtpPaste}
                        className="h-12 w-11 rounded-md border border-gray-200 text-center text-lg font-semibold text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#E8622C]/40 focus:border-[#E8622C]"
                      />
                    ))}
                  </div>

                  {formError && (
                    <p className="-mt-3 text-xs font-medium text-red-500">
                      {formError}
                    </p>
                  )}

                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-400">
                      {resendTimer > 0
                        ? `Resend code in 0:${String(resendTimer).padStart(2, "0")}`
                        : "Didn't receive it?"}
                    </span>
                    <button
                      type="button"
                      onClick={handleResendCode}
                      disabled={resendTimer > 0 || isSending}
                      className="font-semibold text-[#E8622C] hover:text-[#d9551f] disabled:text-gray-300 disabled:cursor-not-allowed transition-colors"
                    >
                      {isSending ? "Sending..." : "Resend OTP"}
                    </button>
                  </div>

                  <button
                    type="submit"
                    disabled={!isOtpComplete || isVerifying}
                    className="w-full rounded-full bg-[#E8622C] py-3 text-sm font-semibold text-white hover:bg-[#d9551f] disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed transition-colors focus:outline-none focus:ring-2 focus:ring-[#E8622C]/50 focus:ring-offset-2"
                  >
                    {isVerifying ? "Verifying..." : "Verify Code"}
                  </button>
                </form>
              </>
            )}

            {/* Step 3: done */}
            {forgotStep === "done" && (
              <div className="text-center py-2">
                <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-green-50">
                  <CheckCircle2 className="h-7 w-7 text-green-500" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-1.5">
                  Verified successfully
                </h3>
                <p className="text-sm text-gray-500 mb-7">
                  Your Gmail has been verified. You can now sign in again or
                  set a new password from your inbox link.
                </p>
                <button
                  type="button"
                  onClick={closeForgotFlow}
                  className="w-full rounded-full bg-[#E8622C] py-3 text-sm font-semibold text-white hover:bg-[#d9551f] transition-colors focus:outline-none focus:ring-2 focus:ring-[#E8622C]/50 focus:ring-offset-2"
                >
                  Done
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}