import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#111111] text-[#f4ead5]">
      {" "}
      <div className="mx-auto max-w-7xl px-5 py-6 sm:px-8 sm:py-8">
        {" "}
        <header className="mb-8 flex flex-col gap-5 border-b-4 border-[#f26a3d] pb-6 sm:flex-row sm:items-end sm:justify-between">
          {" "}
          <div>
            {" "}
            <p className="mb-2 text-xs font-black tracking-[0.3em] text-[#f26a3d]">
              BACKGROUND JOB CONTROL{" "}
            </p>
            ```
            <h1 className="text-4xl font-black tracking-tight sm:text-5xl">
              QUEUE<span className="text-[#f26a3d]">FLOW</span>
            </h1>
            <p className="mt-2 text-sm font-medium text-[#a89f8c]">
              Redis-powered job processing system
            </p>
          </div>
          <div className="flex items-center gap-3 self-start rounded-full border-2 border-[#f26a3d] bg-[#1a1a1a] px-4 py-2 sm:self-auto">
            <span className="h-3 w-3 rounded-full bg-[#f26a3d] shadow-[0_0_10px_#f26a3d]" />
            <span className="text-xs font-black tracking-widest">
              REDIS ONLINE
            </span>
          </div>
        </header>
        <section className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          <StatCard title="Waiting" value="0" symbol="01" />
          <StatCard title="Active" value="0" symbol="02" />
          <StatCard title="Completed" value="2" symbol="03" highlighted />
          <StatCard title="Failed" value="1" symbol="04" />
          <StatCard title="Delayed" value="0" symbol="05" />
        </section>
        <section className="overflow-hidden border-2 border-[#f4ead5] bg-[#181818] shadow-[6px_6px_0px_#f26a3d]">
          <div className="flex flex-col gap-4 border-b-2 border-[#3a3a3a] p-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-black tracking-[0.25em] text-[#f26a3d]">
                QUEUE MONITOR
              </p>

              <h2 className="mt-1 text-2xl font-black uppercase">
                Recent Jobs
              </h2>
            </div>

            <Link
              href="/jobs/new"
              className="inline-flex items-center justify-center border-2 border-[#111111] bg-[#f26a3d] px-5 py-3 text-sm font-black uppercase tracking-wide text-[#111111] transition-transform hover:-translate-y-1 hover:shadow-[4px_4px_0px_#f4ead5]"
            >
              + Create Job
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[650px] text-left">
              <thead>
                <tr className="border-b-2 border-[#3a3a3a] bg-[#121212] text-xs uppercase tracking-widest text-[#8f8778]">
                  <th className="px-5 py-4">Job ID</th>
                  <th className="px-5 py-4">Type</th>
                  <th className="px-5 py-4">Status</th>
                  <th className="px-5 py-4">Attempts</th>
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

          <div className="border-t-2 border-[#3a3a3a] bg-[#121212] px-5 py-4">
            <p className="text-xs font-bold uppercase tracking-widest text-[#6f685d]">
              BullMQ / Redis / Worker Status: Operational
            </p>
          </div>
        </section>
        <footer className="mt-8 flex flex-col gap-2 border-t border-[#333333] pt-5 text-xs font-bold uppercase tracking-widest text-[#625d54] sm:flex-row sm:items-center sm:justify-between">
          <span>QUEUEFLOW v0.1</span>
          <span>LOCAL DEVELOPMENT ENVIRONMENT</span>
        </footer>
      </div>
    </main>
  );
}

function StatCard({
  title,
  value,
  symbol,
  highlighted = false,
}: {
  title: string;
  value: string;
  symbol: string;
  highlighted?: boolean;
}) {
  return (
    <div
      className={`relative border-2 border-[#f4ead5] p-5 transition-transform hover:-translate-y-1 ${
        highlighted
          ? "bg-[#f26a3d] text-[#111111]"
          : "bg-[#181818] text-[#f4ead5]"
      }`}
    >
      <span
        className={`absolute right-4 top-3 text-[10px] font-black tracking-widest ${
          highlighted ? "text-[#111111]/50" : "text-[#f26a3d]"
        }`}
      >
        {symbol}{" "}
      </span>

      <p
        className={`text-xs font-black uppercase tracking-[0.2em] ${
          highlighted ? "text-[#111111]/70" : "text-[#8f8778]"
        }`}
      >
        {title}
      </p>

      <p className="mt-3 text-4xl font-black">{value}</p>
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
    <tr className="border-b border-[#2d2d2d] transition-colors hover:bg-[#202020]">
      <td className="px-5 py-5 font-black text-[#f26a3d]">#{id} </td>
      <td className="px-5 py-5">
        <span className="font-bold uppercase tracking-wide">{type}</span>
      </td>
      <td className="px-5 py-5">
        <span
          className={`inline-flex items-center gap-2 border px-3 py-1.5 text-xs font-black uppercase tracking-wide ${
            isCompleted
              ? "border-[#f26a3d] bg-[#f26a3d] text-[#111111]"
              : "border-[#d94b35] bg-[#d94b35]/10 text-[#ff7157]"
          }`}
        >
          <span className="h-2 w-2 rounded-full bg-current" />
          {status}
        </span>
      </td>
      <td className="px-5 py-5 font-bold text-[#a89f8c]">{attempts}</td>
    </tr>
  );
}
