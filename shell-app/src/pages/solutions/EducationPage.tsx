const features = [
  "Integrated Student Information System (SIS)",
  "Adaptive Learning with FPK University",
  "Clinical Data Tracking with FPK-X",
  "Streamlined Operations with FPK Pulse",
];

const EducationPage = () => {
  return (
    <div className="min-h-screen bg-white text-slate-900">
      <main>
        <section className="relative overflow-hidden bg-gradient-to-b from-slate-900 via-slate-900 to-slate-800 px-6 py-20 sm:py-24">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.08),transparent_35%),radial-gradient(circle_at_80%_10%,rgba(255,255,255,0.06),transparent_32%),radial-gradient(circle_at_50%_60%,rgba(255,255,255,0.05),transparent_38%)]" />
          <div className="relative mx-auto flex max-w-6xl flex-col gap-8 text-left">
            <div className="space-y-4">
              <p className="text-sm font-semibold uppercase tracking-[0.12em] text-slate-200">
                Education Solutions
              </p>
              <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl md:text-6xl">
                The All-in-One Operating System for Modern Education.
              </h1>
              <p className="max-w-3xl text-lg leading-relaxed text-slate-200 sm:text-xl">
                Unify admissions, learning, clinical data, and operations under
                a single, governed AI platform designed for student success and
                institutional efficiency.
              </p>
            </div>
            <div>
              <button className="inline-flex items-center rounded-full bg-white px-6 py-3 text-base font-semibold text-slate-900 shadow-xl shadow-black/20 transition hover:-translate-y-0.5 hover:shadow-2xl">
                Request a Demo
                <span className="ml-2 transition-transform duration-200 group-hover:translate-x-1">
                  →
                </span>
              </button>
            </div>
          </div>
        </section>

        <section className="bg-white px-6 py-16 sm:py-20">
          <div className="mx-auto max-w-6xl space-y-8">
            <div className="space-y-3">
              <p className="text-sm font-semibold uppercase tracking-[0.08em] text-slate-500">
                Features for Education
              </p>
              <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                Built for student success and operational excellence
              </h2>
              <p className="max-w-3xl text-base text-slate-600 sm:text-lg">
                Every module is connected through our governed AI layer,
                ensuring secure data flows, consistent experiences, and
                measurable outcomes across your institution.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              {features.map((feature) => (
                <div
                  key={feature}
                  className="rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_10px_40px_-24px_rgba(15,23,42,0.25)]"
                >
                  <h3 className="text-lg font-semibold text-slate-900">
                    {feature}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600">
                    Purpose-built to give educators, administrators, and
                    clinicians the clarity and tools they need to deliver better
                    outcomes.
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default EducationPage;
