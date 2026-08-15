"use client";

import React, { useState } from "react";
import { Eye, EyeOff, ArrowLeft } from "lucide-react";
import {
  useSignIn,
  useSignUp,
  useUser,
} from "@clerk/nextjs";

// ============================================================
// ICONS
// ============================================================

const GoogleIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5"
    viewBox="0 0 48 48"
  >
    <path
      fill="#FFC107"
      d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-2.641-.21-5.236-.611-7.743z"
    />
    <path
      fill="#FF3D00"
      d="M6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691z"
    />
    <path
      fill="#4CAF50"
      d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238C29.211 35.091 26.715 36 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z"
    />
    <path
      fill="#1976D2"
      d="M43.611 20.083H42V20H24v8h11.303c-.792 2.237-2.231 4.166-4.087 5.571l6.19 5.238C42.022 35.026 44 30.038 44 24c0-2.641-.21-5.236-.611-7.743z"
    />
  </svg>
);

const GitHubIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5"
    fill="currentColor"
    viewBox="0 0 24 24"
  >
    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
  </svg>
);

const AppleIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5"
    fill="currentColor"
    viewBox="0 0 24 24"
  >
    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
  </svg>
);

// ============================================================
// TYPES
// ============================================================

export interface Testimonial {
  avatarSrc: string;
  name: string;
  handle: string;
  text: string;
}

interface SignInPageProps {
  title?: React.ReactNode;
  description?: React.ReactNode;
  heroImageSrc?: string;
  testimonials?: Testimonial[];
  isOpen?: boolean;
  onClose?: () => void;
}

// ============================================================
// GLASS INPUT
// ============================================================

const GlassInputWrapper = ({
  children,
}: {
  children: React.ReactNode;
}) => (
  <div className="rounded-2xl border border-white/10 bg-[rgba(15,15,20,0.55)] backdrop-blur-md transition-colors focus-within:border-[#1f3dbc]/40 focus-within:bg-[#1f3dbc]/10">
    {children}
  </div>
);

// ============================================================
// TESTIMONIAL
// ============================================================

const TestimonialCard = ({
  testimonial,
  delay,
}: {
  testimonial: Testimonial;
  delay: string;
}) => (
  <div
    className={`animate-testimonial ${delay} flex items-start gap-2 rounded-2xl bg-[rgba(15,15,20,0.55)] backdrop-blur-xl border border-white/10 p-3 w-48`}
  >
    <img
      src={testimonial.avatarSrc}
      className="h-8 w-8 object-cover rounded-xl"
      alt="avatar"
    />

    <div className="text-xs leading-snug">
      <p className="flex items-center gap-1 font-medium text-white">
        {testimonial.name}
      </p>

      <p className="text-white/60">
        {testimonial.handle}
      </p>

      <p className="mt-1 text-white/80">
        {testimonial.text}
      </p>
    </div>
  </div>
);

// ============================================================
// MAIN
// ============================================================

export const SignInPage: React.FC<SignInPageProps> = ({
  title = (
    <span className="font-light text-white tracking-tighter">
      Welcome
    </span>
  ),
  description = "Access your account and continue your journey with us",
  heroImageSrc,
  testimonials = [],
  isOpen = false,
  onClose,
}) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [verificationCode, setVerificationCode] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const [isSignUp, setIsSignUp] = useState(false);
  const [isVerifyingEmail, setIsVerifyingEmail] = useState(false);

  const {
    signIn,
    isLoaded: signInLoaded,
  } = useSignIn();

  const {
    signUp,
    setActive: setSignUpActive,
    isLoaded: signUpLoaded,
  } = useSignUp();

  const {
    user,
    isLoaded: userLoaded,
  } = useUser();

  // ============================================================
  // HELPERS
  // ============================================================

  const normalizedEmail = email.trim().toLowerCase();

  const getClerkError = (err: any, fallback: string) => {
    return (
      err?.errors?.[0]?.longMessage ||
      err?.errors?.[0]?.message ||
      err?.message ||
      fallback
    );
  };

  // ============================================================
  // SIGN UP / SIGN IN
  // ============================================================

  const handleFormSubmit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    if (isLoading) return;

    if (!normalizedEmail || !password) {
      setError("Please enter your email and password.");
      return;
    }

    if (userLoaded && user) {
      setError(
        "You are already signed in. Please refresh the page."
      );
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      // ========================================================
      // SIGN UP
      // ========================================================

      if (isSignUp) {
        if (!signUpLoaded || !signUp) {
          setError(
            "Authentication is still loading. Please try again."
          );
          return;
        }

        const result = await signUp.create({
          emailAddress: normalizedEmail,
          password,
        });

        console.log(
          "Clerk sign-up result:",
          result.status,
          result.createdSessionId
        );

        // ------------------------------------------------------
        // ACCOUNT CREATED WITHOUT VERIFICATION
        // ------------------------------------------------------

        if (result.status === "complete") {
          if (result.createdSessionId) {
            await setSignUpActive({
              session: result.createdSessionId,
            });
          }

          setIsVerifyingEmail(false);
          setVerificationCode("");
          setError("");

          onClose?.();

          window.location.href = "/";

          return;
        }

        // ------------------------------------------------------
        // EMAIL VERIFICATION REQUIRED
        // ------------------------------------------------------

        await signUp.prepareEmailAddressVerification({
          strategy: "email_code",
        });

        setVerificationCode("");
        setIsVerifyingEmail(true);
        setError("");

        return;
      }

      // ========================================================
      // SIGN IN
      // ========================================================

      if (!signInLoaded || !signIn) {
        setError(
          "Authentication is still loading. Please try again."
        );
        return;
      }

      const result = await signIn.create({
        identifier: normalizedEmail,
        password,
      });

      console.log(
        "Clerk sign-in result:",
        result.status,
        result.createdSessionId
      );

      // ------------------------------------------------------
      // LOGIN SUCCESS
      // ------------------------------------------------------

      if (result.status === "complete") {
        if (result.createdSessionId) {
          await signIn.setActive({
            session: result.createdSessionId,
          });
        }

        setError("");

        onClose?.();

        window.location.href = "/";

        return;
      }

      // ------------------------------------------------------
      // ADDITIONAL VERIFICATION
      // ------------------------------------------------------

      setError(
        "Additional verification is required to complete sign in."
      );
    } catch (err: any) {
      console.error("Clerk authentication error:", err);

      setError(
        getClerkError(
          err,
          isSignUp
            ? "Unable to create your account."
            : "Unable to sign in."
        )
      );
    } finally {
      setIsLoading(false);
    }
  };

  // ============================================================
  // VERIFY EMAIL
  // ============================================================

  const handleVerifyEmail = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    const code = verificationCode.trim();

    if (!code) {
      setError("Please enter the verification code.");
      return;
    }

    if (code.length !== 6) {
      setError("The verification code must contain 6 digits.");
      return;
    }

    if (!signUpLoaded || !signUp) {
      setError(
        "Authentication is still loading. Please try again."
      );
      return;
    }

    if (isLoading) return;

    setIsLoading(true);
    setError("");

    try {
      const result =
        await signUp.attemptEmailAddressVerification({
          code,
        });

      console.log(
        "Clerk verification result:",
        result.status,
        result.createdSessionId
      );

      // ========================================================
      // VERIFICATION SUCCESS
      // ========================================================

      if (result.status === "complete") {
        if (!result.createdSessionId) {
          throw new Error(
            "Email verified, but Clerk did not return a session."
          );
        }

        await setSignUpActive({
          session: result.createdSessionId,
        });

        setVerificationCode("");
        setIsVerifyingEmail(false);
        setError("");

        // Give Clerk a moment to update the client session
        await new Promise((resolve) =>
          setTimeout(resolve, 300)
        );

        onClose?.();

        window.location.href = "/";

        return;
      }

      // ========================================================
      // VERIFIED BUT OTHER CLERK REQUIREMENTS REMAIN
      // ========================================================

      console.log(
        "Verification incomplete:",
        result
      );

      setError(
        "Email code was accepted, but your account still has additional requirements. Please try again or contact the administrator."
      );
    } catch (err: any) {
      console.error(
        "Email verification error:",
        err
      );

      setError(
        getClerkError(
          err,
          "Invalid verification code. Please try again."
        )
      );
    } finally {
      setIsLoading(false);
    }
  };

  // ============================================================
  // RESEND CODE
  // ============================================================

  const handleResendCode = async () => {
    if (!signUpLoaded || !signUp) {
      setError(
        "Authentication is still loading. Please try again."
      );
      return;
    }

    if (isLoading) return;

    setIsLoading(true);
    setError("");

    try {
      await signUp.prepareEmailAddressVerification({
        strategy: "email_code",
      });

      setVerificationCode("");

      setError("");
    } catch (err: any) {
      console.error(
        "Resend verification error:",
        err
      );

      setError(
        getClerkError(
          err,
          "Unable to resend the verification code."
        )
      );
    } finally {
      setIsLoading(false);
    }
  };

  // ============================================================
  // BACK FROM VERIFICATION
  // ============================================================

  const handleBackFromVerification = () => {
    if (isLoading) return;

    setIsVerifyingEmail(false);
    setVerificationCode("");
    setError("");
  };

  // ============================================================
  // OAUTH
  // ============================================================

  const handleOAuthSignIn = async (
    provider: "google" | "github" | "apple"
  ) => {
    if (!signInLoaded || !signIn) {
      setError(
        "Authentication is still loading. Please try again."
      );
      return;
    }

    if (userLoaded && user) {
      setError(
        "You are already signed in. Please refresh the page."
      );
      return;
    }

    if (isLoading) return;

    setIsLoading(true);
    setError("");

    try {
      await signIn.authenticateWithRedirect({
        strategy: `oauth_${provider}`,
        redirectUrl: "/",
        redirectUrlComplete: "/",
      });
    } catch (err: any) {
      console.error(
        `${provider} OAuth error:`,
        err
      );

      setError(
        getClerkError(
          err,
          `${provider} sign-in failed.`
        )
      );

      setIsLoading(false);
    }
  };

  // ============================================================
  // CLOSED
  // ============================================================

  if (!isOpen) {
    return null;
  }

  // ============================================================
  // ALREADY SIGNED IN
  // ============================================================

  if (userLoaded && user) {
    onClose?.();
    return null;
  }

  // ============================================================
  // UI
  // ============================================================

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="relative bg-[rgba(15,15,20,0.95)] backdrop-blur-xl rounded-2xl shadow-2xl max-w-4xl w-full max-h-[85vh] overflow-hidden border border-white/10">

        {/* CLOSE BUTTON */}

        <button
          type="button"
          onClick={onClose}
          disabled={isLoading}
          className="absolute top-3 right-3 z-20 p-2 rounded-full bg-[rgba(15,15,20,0.8)] hover:bg-[rgba(15,15,20,0.9)] transition-colors text-white disabled:opacity-50"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        <div className="h-[80vh] flex flex-col md:flex-row font-geist w-full">

          {/* ==================================================
              LEFT
          ================================================== */}

          <section className="flex-1 flex items-center justify-center p-6 overflow-y-auto">
            <div className="w-full max-w-sm">

              {/* ==================================================
                  VERIFICATION
              ================================================== */}

              {isVerifyingEmail ? (
                <div className="flex flex-col gap-5">

                  {/* BACK */}

                  <button
                    type="button"
                    onClick={handleBackFromVerification}
                    disabled={isLoading}
                    className="flex items-center gap-2 text-white/60 hover:text-white text-sm transition-colors w-fit disabled:opacity-50"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Back
                  </button>

                  {/* TITLE */}

                  <div className="text-center">
                    <h1 className="text-3xl md:text-4xl font-semibold leading-tight text-white">
                      Verify your email
                    </h1>

                    <p className="mt-3 text-white/60 text-sm leading-relaxed">
                      We sent a verification code to
                    </p>

                    <p className="mt-1 text-white font-medium break-all">
                      {normalizedEmail}
                    </p>
                  </div>

                  {/* ERROR */}

                  {error && (
                    <div className="text-red-400 text-sm text-center bg-red-500/10 border border-red-500/20 rounded-lg p-3">
                      {error}
                    </div>
                  )}

                  {/* FORM */}

                  <form
                    onSubmit={handleVerifyEmail}
                    className="flex flex-col gap-4"
                  >
                    <div>
                      <label className="text-xs font-medium text-white/70">
                        Verification Code
                      </label>

                      <GlassInputWrapper>
                        <input
                          type="text"
                          inputMode="numeric"
                          autoComplete="one-time-code"
                          maxLength={6}
                          value={verificationCode}
                          onChange={(e) => {
                            const value =
                              e.target.value
                                .replace(/\D/g, "")
                                .slice(0, 6);

                            setVerificationCode(value);
                            setError("");
                          }}
                          placeholder="Enter 6-digit code"
                          className="w-full bg-transparent text-center tracking-[0.5em] text-lg font-semibold p-4 rounded-2xl focus:outline-none text-white placeholder:text-white/30 placeholder:tracking-normal"
                          autoFocus
                          required
                        />
                      </GlassInputWrapper>
                    </div>

                    <button
                      type="submit"
                      disabled={
                        isLoading ||
                        verificationCode.length !== 6
                      }
                      className="w-full rounded-2xl bg-[#1f3dbc] py-3 font-medium text-white hover:bg-[#1f3dbc]/90 transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isLoading
                        ? "Verifying..."
                        : "Verify Email"}
                    </button>
                  </form>

                  {/* RESEND */}

                  <div className="text-center">
                    <p className="text-xs text-white/50 mb-2">
                      Didn&apos;t receive the code?
                    </p>

                    <button
                      type="button"
                      onClick={handleResendCode}
                      disabled={isLoading}
                      className="text-sm text-[#4d6be8] hover:text-[#6b84ed] hover:underline transition-colors disabled:opacity-50"
                    >
                      {isLoading
                        ? "Sending..."
                        : "Resend Code"}
                    </button>
                  </div>

                </div>
              ) : (

                /* ==================================================
                   NORMAL LOGIN / SIGN UP
                ================================================== */

                <div className="flex flex-col gap-4">

                  {/* TITLE */}

                  <h1 className="animate-element animate-delay-100 text-3xl md:text-4xl font-semibold leading-tight text-white">
                    {isSignUp
                      ? "Create Account"
                      : "Welcome"}
                  </h1>

                  <p className="animate-element animate-delay-200 text-white/60 text-sm">
                    {isSignUp
                      ? "Join our platform and start building amazing things"
                      : "Access your account and continue your journey with us"}
                  </p>

                  {/* FORM */}

                  <form
                    onSubmit={handleFormSubmit}
                    className="animate-element animate-delay-300 flex flex-col gap-4"
                  >

                    {/* ERROR */}

                    {error && (
                      <div className="animate-element animate-delay-400 text-red-400 text-sm text-center bg-red-500/10 border border-red-500/20 rounded-lg p-2">
                        {error}
                      </div>
                    )}

                    {/* EMAIL */}

                    <div className="animate-element animate-delay-500">
                      <label className="text-xs font-medium text-white/70">
                        Email Address
                      </label>

                      <GlassInputWrapper>
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => {
                            setEmail(e.target.value);
                            setError("");
                          }}
                          placeholder="Enter your email address"
                          autoComplete={
                            isSignUp
                              ? "email"
                              : "username"
                          }
                          className="w-full bg-transparent text-sm p-3 rounded-2xl focus:outline-none text-white placeholder:text-white/40"
                          required
                        />
                      </GlassInputWrapper>
                    </div>

                    {/* PASSWORD */}

                    <div className="animate-element animate-delay-600">
                      <label className="text-xs font-medium text-white/70">
                        Password
                      </label>

                      <GlassInputWrapper>
                        <div className="relative">

                          <input
                            type={
                              showPassword
                                ? "text"
                                : "password"
                            }
                            value={password}
                            onChange={(e) => {
                              setPassword(
                                e.target.value
                              );
                              setError("");
                            }}
                            placeholder="Enter your password"
                            autoComplete={
                              isSignUp
                                ? "new-password"
                                : "current-password"
                            }
                            className="w-full bg-transparent text-sm p-3 pr-10 rounded-2xl focus:outline-none text-white placeholder:text-white/40"
                            required
                          />

                          <button
                            type="button"
                            onClick={() =>
                              setShowPassword(
                                !showPassword
                              )
                            }
                            className="absolute inset-y-0 right-2 flex items-center"
                          >
                            {showPassword ? (
                              <EyeOff className="w-4 h-4 text-white/60 hover:text-white transition-colors" />
                            ) : (
                              <Eye className="w-4 h-4 text-white/60 hover:text-white transition-colors" />
                            )}
                          </button>

                        </div>
                      </GlassInputWrapper>
                    </div>

                    {/* CLERK CAPTCHA */}

                    {isSignUp && (
                      <div
                        id="clerk-captcha"
                        className="animate-element animate-delay-650"
                      />
                    )}

                    {/* SUBMIT */}

                    <button
                      type="submit"
                      disabled={
                        isLoading ||
                        !normalizedEmail ||
                        !password
                      }
                      className="animate-element animate-delay-700 w-full rounded-2xl bg-[#1f3dbc] py-3 font-medium text-white hover:bg-[#1f3dbc]/90 transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isLoading
                        ? isSignUp
                          ? "Creating Account..."
                          : "Signing In..."
                        : isSignUp
                        ? "Create Account"
                        : "Sign In"}
                    </button>

                    {/* DIVIDER */}

                    <div className="animate-element animate-delay-800 relative flex items-center justify-center">
                      <span className="w-full border-t border-white/10" />

                      <span className="px-3 text-xs text-white/60 bg-[rgba(15,15,20,0.95)] absolute">
                        Or continue with
                      </span>
                    </div>

                    {/* OAUTH */}

                    <div className="animate-element animate-delay-900 flex flex-col gap-2">

                      {/* GOOGLE */}

                      <button
                        type="button"
                        onClick={() =>
                          handleOAuthSignIn(
                            "google"
                          )
                        }
                        disabled={isLoading}
                        className="w-full flex items-center justify-center gap-2 border border-white/10 rounded-2xl py-3 hover:bg-white/5 transition-colors text-sm text-white disabled:opacity-50"
                      >
                        <GoogleIcon />
                        Continue with Google
                      </button>

                      {/* GITHUB */}

                      <button
                        type="button"
                        onClick={() =>
                          handleOAuthSignIn(
                            "github"
                          )
                        }
                        disabled={isLoading}
                        className="w-full flex items-center justify-center gap-2 border border-white/10 rounded-2xl py-3 hover:bg-white/5 transition-colors text-sm text-white disabled:opacity-50"
                      >
                        <GitHubIcon />
                        Continue with GitHub
                      </button>

                      {/* APPLE */}

                      <button
                        type="button"
                        onClick={() =>
                          handleOAuthSignIn(
                            "apple"
                          )
                        }
                        disabled={isLoading}
                        className="w-full flex items-center justify-center gap-2 border border-white/10 rounded-2xl py-3 hover:bg-white/5 transition-colors text-sm text-white disabled:opacity-50"
                      >
                        <AppleIcon />
                        Continue with Apple
                      </button>

                    </div>

                    {/* SWITCH */}

                    <p className="animate-element animate-delay-1000 text-center text-xs text-white/60">

                      {isSignUp
                        ? "Already have an account?"
                        : "New to our platform?"}

                      <button
                        type="button"
                        onClick={() => {
                          setIsSignUp(
                            !isSignUp
                          );
                          setError("");
                          setEmail("");
                          setPassword("");
                          setVerificationCode("");
                          setIsVerifyingEmail(false);
                        }}
                        className="text-[#1f3dbc] hover:underline transition-colors ml-1"
                      >
                        {isSignUp
                          ? "Sign In"
                          : "Create Account"}
                      </button>

                    </p>

                  </form>
                </div>
              )}

            </div>
          </section>

          {/* ==================================================
              RIGHT SIDE
          ================================================== */}

          <section className="hidden md:block flex-1 relative p-3">

            <div
              className="animate-slide-right animate-delay-300 absolute inset-3 rounded-2xl bg-cover bg-center"
              style={{
                backgroundImage: `url(/brand-assets/05F8029C-1DD1-40AD-97D8-29954B629E25.png)`,
              }}
            />

            <div className="absolute inset-3 rounded-2xl bg-black/30" />

            {testimonials.length > 0 && (
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 px-4 w-full justify-center z-10">

                <TestimonialCard
                  testimonial={testimonials[0]}
                  delay="animate-delay-1000"
                />

                {testimonials[1] && (
                  <div className="hidden xl:flex">
                    <TestimonialCard
                      testimonial={
                        testimonials[1]
                      }
                      delay="animate-delay-1200"
                    />
                  </div>
                )}

                {testimonials[2] && (
                  <div className="hidden 2xl:flex">
                    <TestimonialCard
                      testimonial={
                        testimonials[2]
                      }
                      delay="animate-delay-1400"
                    />
                  </div>
                )}

              </div>
            )}

          </section>

        </div>
      </div>
    </div>
  );
};
