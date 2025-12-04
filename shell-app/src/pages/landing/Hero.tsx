import { motion } from "framer-motion";

const Hero = () => {
  return (
    <section className="relative overflow-hidden bg-white px-6 py-20 sm:py-28">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(59,130,246,0.12),transparent_40%),radial-gradient(circle_at_80%_10%,rgba(16,185,129,0.12),transparent_38%),radial-gradient(circle_at_50%_60%,rgba(99,102,241,0.12),transparent_40%)]" />
      <div className="relative mx-auto flex max-w-6xl flex-col items-start gap-10 text-left">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="inline-flex items-center gap-2 rounded-full bg-slate-900/90 px-3 py-1 text-xs font-semibold uppercase tracking-[0.08em] text-white shadow-lg shadow-slate-900/15"
        >
          FPK-OS • AI Ecosystem
        </motion.div>

        <div className="space-y-6">
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.05 }}
            className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl md:text-6xl"
          >
            The Trusted AI Ecosystem for Human Potential.
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.12 }}
            className="max-w-3xl text-lg leading-relaxed text-slate-600 sm:text-xl"
          >
            Powerful, governed applications for schools and businesses.
            Life-changing tools for families and individuals.
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
          className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-6"
        >
          <button className="group inline-flex items-center justify-center rounded-full bg-slate-900 px-6 py-3 text-base font-semibold text-white shadow-xl shadow-slate-900/15 transition-transform duration-200 hover:-translate-y-0.5 hover:bg-slate-800">
            Explore the Ecosystem
            <span className="ml-2 inline-block transition-transform duration-200 group-hover:translate-x-1">
              →
            </span>
          </button>
          <span className="text-sm font-medium text-slate-500">
            Trusted by leading schools, therapy centers, and businesses.
          </span>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
