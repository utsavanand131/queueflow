"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

type JobType = "email" | "report" | "export" | "notification";

export default function NewJobPage() {
  const router = useRouter();

  const [type, setType] = useState<JobType>("email");
  const [to, setTo] = useState("");
  const [subject, setSubject] = useState("");
  const [name, setName] = useState("");
  const [userId, setUserId] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setSubmitting(true);
    setError("");

    let data: Record<string, string>;

    switch (type) {
      case "email":
        data = {
          to,
          subject,
        };
        break;

      case "report":
        data = {
          name,
        };
        break;

      case "export":
        data = {
          userId,
        };
        break;

      case "notification":
        data = {
          message,
        };
        break;
    }

    try {
      const response = await fetch("/api/jobs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type,
          data,
        }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || "Failed to create job");
      }

      router.push("/");
      router.refresh();
    } catch (error) {
      setError(error instanceof Error ? error.message : "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#111111] text-[#f4ead5]">
      {" "}
      <div className="mx-auto max-w-3xl px-5 py-8 sm:px-8">
        {" "}
        <header className="mb-8 border-b-4 border-[#f26a3d] pb-6">
          {" "}
          <Link
            href="/"
            className="mb-6 inline-block text-xs font-black uppercase tracking-[0.2em] text-[#f26a3d] hover:text-[#ff8a61]"
          >
            ← Back to Queue{" "}
          </Link>
          <p className="text-xs font-black tracking-[0.3em] text-[#f26a3d]">
            JOB DISPATCH
          </p>
          <h1 className="mt-2 text-4xl font-black uppercase">Create Job</h1>
          <p className="mt-2 text-sm text-[#8f8778]">
            Add a background task to the Redis queue.
          </p>
        </header>
        <form
          onSubmit={handleSubmit}
          className="border-2 border-[#f4ead5] bg-[#181818] p-6 shadow-[6px_6px_0px_#f26a3d] sm:p-8"
        >
          <div className="mb-7">
            <label
              htmlFor="type"
              className="mb-2 block text-xs font-black uppercase tracking-[0.2em] text-[#8f8778]"
            >
              Job Type
            </label>

            <select
              id="type"
              value={type}
              onChange={(event) => setType(event.target.value as JobType)}
              className="w-full border-2 border-[#f4ead5] bg-[#111111] px-4 py-3 font-bold uppercase text-[#f4ead5] outline-none focus:border-[#f26a3d]"
            >
              <option value="email">Email</option>
              <option value="report">Report</option>
              <option value="export">Export</option>
              <option value="notification">Notification</option>
            </select>
          </div>

          {type === "email" && (
            <div className="space-y-5">
              <Field
                label="Recipient"
                value={to}
                onChange={setTo}
                placeholder="user@example.com"
                type="email"
              />

              <Field
                label="Subject"
                value={subject}
                onChange={setSubject}
                placeholder="Welcome to QueueFlow"
              />
            </div>
          )}

          {type === "report" && (
            <Field
              label="Report Name"
              value={name}
              onChange={setName}
              placeholder="Monthly Sales Report"
            />
          )}

          {type === "export" && (
            <Field
              label="User ID"
              value={userId}
              onChange={setUserId}
              placeholder="user-123"
            />
          )}

          {type === "notification" && (
            <div>
              <label
                htmlFor="message"
                className="mb-2 block text-xs font-black uppercase tracking-[0.2em] text-[#8f8778]"
              >
                Message
              </label>

              <textarea
                id="message"
                value={message}
                onChange={(event) => setMessage(event.target.value)}
                placeholder="Your notification message..."
                rows={4}
                className="w-full resize-none border-2 border-[#f4ead5] bg-[#111111] px-4 py-3 text-sm font-medium text-[#f4ead5] outline-none placeholder:text-[#514d46] focus:border-[#f26a3d]"
              />
            </div>
          )}

          {error && (
            <div className="mt-6 border-2 border-[#d94b35] bg-[#d94b35]/10 p-4 text-sm font-bold text-[#ff7157]">
              {error}
            </div>
          )}

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <button
              type="submit"
              disabled={submitting}
              className="border-2 border-[#111111] bg-[#f26a3d] px-6 py-3 text-sm font-black uppercase tracking-wide text-[#111111] transition-transform hover:-translate-y-1 hover:shadow-[4px_4px_0px_#f4ead5] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {submitting ? "Queueing..." : "Queue Job →"}
            </button>

            <Link
              href="/"
              className="border-2 border-[#3a3a3a] px-6 py-3 text-center text-sm font-black uppercase tracking-wide text-[#a89f8c] hover:border-[#f4ead5] hover:text-[#f4ead5]"
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </main>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  type?: string;
}) {
  return (
    <div>
      {" "}
      <label className="mb-2 block text-xs font-black uppercase tracking-[0.2em] text-[#8f8778]">
        {label}{" "}
      </label>
      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        required
        className="w-full border-2 border-[#f4ead5] bg-[#111111] px-4 py-3 text-sm font-medium text-[#f4ead5] outline-none placeholder:text-[#514d46] focus:border-[#f26a3d]"
      />
    </div>
  );
}
