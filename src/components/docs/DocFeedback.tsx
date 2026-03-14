"use client";

import { useState } from "react";

const API_BASE =
  typeof process !== "undefined" && process.env.NEXT_PUBLIC_API_BASE
    ? process.env.NEXT_PUBLIC_API_BASE
    : "http://localhost:8000";

function generateFingerprint(): string {
  if (typeof window === "undefined") return "";
  const raw = [
    navigator.userAgent,
    `${screen.width}x${screen.height}`,
    Intl.DateTimeFormat().resolvedOptions().timeZone,
  ].join("|");
  let h = 0;
  for (let i = 0; i < raw.length; i++) {
    h = ((h << 5) - h + raw.charCodeAt(i)) | 0;
  }
  const hex = (h >>> 0).toString(16);
  return (hex + hex + hex + hex).slice(0, 64);
}

export function DocFeedback({
  docPath,
  docLocale,
}: {
  docPath: string;
  docLocale: string;
}) {
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  async function sendFeedback(isHelpful: boolean) {
    if (submitted || submitting) return;
    setSubmitting(true);
    setError("");
    try {
      const resp = await fetch(`${API_BASE}/api/v1/docs/feedback`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          doc_path: docPath,
          doc_locale: docLocale,
          is_helpful: isHelpful,
          visitor_fingerprint: generateFingerprint(),
        }),
      });
      if (!resp.ok) {
        const data = await resp.json().catch(() => ({}));
        setError(
          (data.detail as string) || "提交失败，请稍后重试"
        );
        return;
      }
      setSubmitted(true);
    } catch {
      setError("网络错误，请稍后重试");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="doc-feedback mt-8 flex items-center gap-2 border-t border-gray-200 py-4 dark:border-gray-700">
      {!submitted ? (
        <>
          <span className="text-sm text-gray-600 dark:text-gray-400">
            这篇文档有帮助吗？
          </span>
          <button
            type="button"
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-gray-300 bg-gray-50 text-lg transition hover:border-blue-500 hover:bg-blue-50 disabled:opacity-50 dark:border-gray-600 dark:bg-gray-800 dark:hover:border-blue-400 dark:hover:bg-blue-900/20"
            disabled={submitting}
            onClick={() => sendFeedback(true)}
            title="有帮助"
          >
            👍
          </button>
          <button
            type="button"
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-gray-300 bg-gray-50 text-lg transition hover:border-blue-500 hover:bg-blue-50 disabled:opacity-50 dark:border-gray-600 dark:bg-gray-800 dark:hover:border-blue-400 dark:hover:bg-blue-900/20"
            disabled={submitting}
            onClick={() => sendFeedback(false)}
            title="没帮助"
          >
            👎
          </button>
          {error && (
            <span className="text-xs text-red-600 dark:text-red-400">
              {error}
            </span>
          )}
        </>
      ) : (
        <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
          感谢反馈！
        </span>
      )}
    </div>
  );
}
