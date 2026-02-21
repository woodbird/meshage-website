"use client";

import { useState, useCallback } from "react";
import { cta } from "@/lib/constants";

type FieldErrors = Record<string, string>;

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validateEmail(email: string): string | null {
  if (!email.trim()) return "Email is required.";
  if (!EMAIL_REGEX.test(email)) return "Enter a valid email address.";
  return null;
}

export function WaitlistForm() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState<FieldErrors>({});
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [submitError, setSubmitError] = useState<string | null>(null);

  const validate = useCallback((): boolean => {
    const emailError = validateEmail(email);
    const newErrors: FieldErrors = {};
    if (emailError) newErrors.email = emailError;
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [email]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitError(null);
    if (!validate()) {
      setTimeout(() => document.getElementById("email")?.focus(), 0);
      return;
    }
    setStatus("submitting");
    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim(),
          name: name.trim() || undefined,
          message: message.trim() || undefined,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        if (res.status === 400 && typeof data.errors === "object") {
          setErrors(data.errors as FieldErrors);
          const first = Object.keys(data.errors)[0];
          if (first) setTimeout(() => document.getElementById(first)?.focus(), 0);
        } else {
          setSubmitError("Something went wrong. Please try again.");
        }
        setStatus("idle");
        return;
      }
      setStatus("success");
    } catch {
      setSubmitError("Something went wrong. Please try again.");
      setStatus("idle");
    }
  };

  if (status === "success") {
    return (
      <p className="rounded-lg bg-green-50 p-4 text-green-800" role="status" aria-live="polite">
        {cta.successMessage}
      </p>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mx-auto max-w-md space-y-4 text-left"
      noValidate
      aria-labelledby="waitlist-form-heading"
    >
      <h3 id="waitlist-form-heading" className="sr-only">
        Join waitlist
      </h3>
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
          Email <span className="text-red-600" aria-hidden>*</span>
        </label>
        <input
          id="email"
          type="email"
          name="email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={status === "submitting"}
          aria-required
          aria-invalid={!!errors.email}
          aria-describedby={errors.email ? "email-error" : undefined}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus-visible:ring-2 focus-visible:ring-gray-900 focus-visible:ring-offset-2 disabled:opacity-50"
          spellCheck={false}
        />
        {errors.email && (
          <p id="email-error" className="mt-1 text-sm text-red-600" role="alert">
            {errors.email}
          </p>
        )}
      </div>
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
          Name
        </label>
        <input
          id="name"
          type="text"
          name="name"
          autoComplete="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          disabled={status === "submitting"}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus-visible:ring-2 focus-visible:ring-gray-900 focus-visible:ring-offset-2 disabled:opacity-50"
        />
      </div>
      <div>
        <label htmlFor="message" className="block text-sm font-medium text-gray-700">
          Message
        </label>
        <textarea
          id="message"
          name="message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          disabled={status === "submitting"}
          rows={3}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus-visible:ring-2 focus-visible:ring-gray-900 focus-visible:ring-offset-2 disabled:opacity-50"
        />
      </div>
      {submitError && (
        <p className="text-sm text-red-600" role="alert">
          {submitError}
        </p>
      )}
      <button
        type="submit"
        disabled={status === "submitting"}
        className="w-full rounded-lg bg-gray-900 px-4 py-3 text-white hover:bg-gray-800 focus-visible:ring-2 focus-visible:ring-gray-900 focus-visible:ring-offset-2 disabled:opacity-50"
      >
        {status === "submitting" ? cta.submittingLabel : cta.submitLabel}
      </button>
    </form>
  );
}
