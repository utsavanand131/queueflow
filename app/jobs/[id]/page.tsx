"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type Job = {
  id: string;
  name: string;
  status: string;
  attemptsMade: number;
  data: unknown;
  failedReason: string | null;
  processedAt: string | null;
  finishedAt: string | null;
};

export default function JobDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchJob() {
      try {
        const { id } = await params;

        const response = await fetch(`/api/jobs/${id}`, {
          cache: "no-store",
        });

        const result = await response.json();

        if (!response.ok || !result.success) {
          throw new Error(result.error || "Job not found");
        }

        setJob(result.job);
      } catch (error) {
        setError(error instanceof Error ? error.message : "Failed to load job");
      } finally {
        setLoading(false);
      }
    }

    fetchJob();
  }, [params]);

  if (loading) {
    return (
      <main className="min-h-screen bg-[#111111] text-[#f4ead5]">
        {" "}
        <div className="mx-auto max-w-4xl px-5 py-8 sm:px-8">
          {" "}
          <p className="text-sm font-black uppercase tracking-widest text-[#f26a3d]">
            Loading job...{" "}
          </p>{" "}
        </div>{" "}
      </main>
    );
  }

  if (error || !job) {
    return (
      <main className="min-h-screen bg-[#111111] text-[#f4ead5]">
        {" "}
        <div className="mx-auto max-w-4xl px-5 py-8 sm:px-8">
          {" "}
          <Link
            href="/"
            className="text-xs font-black uppercase tracking-widest text-[#f26a3d]"
          >
            ← Back to Queue{" "}
          </Link>
          <div className="mt-8 border-2 border-[#d94b35] bg-[#181818] p-6">
            <p className="text-sm font-black uppercase text-[#ff7157]">
              {error || "Job not found"}
            </p>
          </div>
        </div>
      </main>
    );
  }

  const isCompleted = job.status === "completed";
  const isFailed = job.status === "failed";

  return (
    <main className="min-h-screen bg-[#111111] text-[#f4ead5]">
      {" "}
      <div className="mx-auto max-w-4xl px-5 py-8 sm:px-8">
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
            JOB INSPECTOR
          </p>
          <div className="mt-2 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <h1 className="text-4xl font-black uppercase">Job #{job.id}</h1>

            <span
              className={`inline-flex w-fit items-center gap-2 border-2 px-4 py-2 text-xs font-black uppercase tracking-wide ${
                isCompleted
                  ? "border-[#f26a3d] bg-[#f26a3d] text-[#111111]"
                  : isFailed
                    ? "border-[#d94b35] bg-[#d94b35]/10 text-[#ff7157]"
                    : "border-[#8f8778] bg-[#8f8778]/10 text-[#a89f8c]"
              }`}
            >
              <span className="h-2.5 w-2.5 rounded-full bg-current" />
              {job.status}
            </span>
          </div>
        </header>
        <section className="grid gap-4 sm:grid-cols-2">
          <InfoCard label="Job Type" value={job.name} />
          <InfoCard label="Attempts" value={String(job.attemptsMade)} />
          <InfoCard label="Processed" value={formatDate(job.processedAt)} />
          <InfoCard label="Finished" value={formatDate(job.finishedAt)} />
        </section>
        <section className="mt-6 border-2 border-[#f4ead5] bg-[#181818] shadow-[6px_6px_0px_#f26a3d]">
          <div className="border-b-2 border-[#3a3a3a] p-5">
            <p className="text-xs font-black tracking-[0.25em] text-[#f26a3d]">
              PAYLOAD
            </p>

            <h2 className="mt-1 text-xl font-black uppercase">Job Data</h2>
          </div>

          <pre className="overflow-x-auto p-5 text-sm leading-7 text-[#a89f8c]">
            {JSON.stringify(job.data, null, 2)}
          </pre>
        </section>
        {job.failedReason && (
          <section className="mt-6 border-2 border-[#d94b35] bg-[#d94b35]/10 p-5">
            <p className="text-xs font-black tracking-[0.25em] text-[#ff7157]">
              FAILURE REASON
            </p>

            <p className="mt-2 font-bold text-[#ff7157]">{job.failedReason}</p>
          </section>
        )}
        <div className="mt-8">
          <Link
            href="/"
            className="inline-flex border-2 border-[#3a3a3a] px-5 py-3 text-sm font-black uppercase tracking-wide text-[#a89f8c] hover:border-[#f4ead5] hover:text-[#f4ead5]"
          >
            ← Back to Dashboard
          </Link>
        </div>
      </div>
    </main>
  );
}

function InfoCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="border-2 border-[#3a3a3a] bg-[#181818] p-5">
      {" "}
      <p className="text-xs font-black uppercase tracking-[0.2em] text-[#8f8778]">
        {label}{" "}
      </p>
      <p className="mt-2 break-words font-black text-[#f4ead5]">{value}</p>
    </div>
  );
}

function formatDate(value: string | null) {
  if (!value) {
    return "—";
  }

  return new Date(value).toLocaleString();
}
