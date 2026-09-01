import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto max-w-7xl px-6 py-8">
        <header className="mb-10 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">QueueFlow</h1>
            <p className="mt-1 text-sm text-slate-400">
              Background job processing dashboard
            </p>
          </div>

          <div className="flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-4 py-2 text-sm text-emerald-400">
            <span className="h-2 w-2 rounded-full bg-emerald-400" />
            Redis Online
          </div>
        </header>

        <section className="mb-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          <StatCard title="Waiting" value="0" />
          <StatCard title="Active" value="0" />
          <StatCard title="Completed" value="2" />
          <StatCard title="Failed" value="1" />
          <StatCard title="Delayed" value="0" />
        </section>

        <section className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold">Recent Jobs</h2>
              <p className="mt-1 text-sm text-slate-400">
                Monitor your background jobs
              </p>
            </div>

            <Link
              href="/jobs/new"
              className="rounded-lg bg-white px-4 py-2 text-sm font-medium text-slate-950 transition hover:bg-slate-200"
            >
              Create Job
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400">
                  <th className="px-4 py-3 font-medium">ID</th>
                  <th className="px-4 py-3 font-medium">Type</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium">Attempts</th>
                </tr>
              </thead>

              <tbody>
                <JobRow id="2" type="email" status="completed" attempts="1" />

                <JobRow
                  id="3"
                  type="failing-test"
                  status="failed"
                  attempts="3"
                />
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </main>
  );
}

function StatCard({ title, value }: { title: string; value: string }) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
      <p className="text-sm text-slate-400">{title}</p>
      <p className="mt-2 text-3xl font-bold">{value}</p>
    </div>
  );
}

function JobRow({
  id,
  type,
  status,
  attempts,
}: {
  id: string;
  type: string;
  status: string;
  attempts: string;
}) {
  const isCompleted = status === "completed";

  return (
    <tr className="border-b border-slate-800 last:border-0">
      <td className="px-4 py-4 font-medium">#{id}</td>

      <td className="px-4 py-4 text-slate-300">{type}</td>

      <td className="px-4 py-4">
        <span
          className={`rounded-full px-3 py-1 text-xs font-medium ${
            isCompleted
              ? "bg-emerald-500/10 text-emerald-400"
              : "bg-red-500/10 text-red-400"
          }`}
        >
          {status}
        </span>
      </td>

      <td className="px-4 py-4 text-slate-300">{attempts}</td>
    </tr>
  );
}
