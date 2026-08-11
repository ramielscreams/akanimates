import Link from "next/link";

export default function NotFound() {
  return (
    <main className="relative isolate min-h-dvh bg-[#050507] text-[#f4f5f7]">
      <div
        className="absolute inset-0 -z-20 bg-[radial-gradient(circle_at_78%_18%,rgba(74,43,99,0.28),transparent_32rem),radial-gradient(circle_at_10%_72%,rgba(43,22,56,0.24),transparent_34rem),linear-gradient(180deg,#050507,#0c0c10)]"
        aria-hidden="true"
      />
      <div
        className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(244,245,247,0.035)_1px,transparent_1px),linear-gradient(180deg,rgba(244,245,247,0.026)_1px,transparent_1px)] bg-[size:18vw_18vw] opacity-35 [mask-image:linear-gradient(180deg,transparent,black_18%,black_82%,transparent)]"
        aria-hidden="true"
      />

      <section className="grid min-h-dvh grid-cols-1 items-center gap-10 px-[clamp(1.25rem,6vw,4.5rem)] py-[clamp(4rem,9vh,7rem)] lg:grid-cols-[minmax(0,0.92fr)_minmax(20rem,1.08fr)]">
        <div className="max-w-2xl">
          <p className="text-xs font-medium uppercase tracking-[0.38em] text-[#a5abb5]">
            Error / 404
          </p>
          <h1 className="mt-6 text-[clamp(4rem,9vw,9rem)] font-light uppercase leading-[0.86] tracking-normal text-[#f4f5f7]">
            Off Route.
          </h1>
          <p className="mt-8 max-w-[28rem] text-base leading-8 text-[#a5abb5] sm:text-lg">
            The page you&apos;re looking for isn&apos;t here.
          </p>
          <Link
            href="/"
            className="group mt-10 inline-flex min-h-12 items-center gap-4 bg-[#f4f5f7] px-5 text-xs font-medium uppercase tracking-[0.22em] text-[#050507] transition duration-300 hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#7d67e6]"
          >
            Return Home
            <span
              className="transition-transform duration-300 group-hover:translate-x-1"
              aria-hidden="true"
            >
              -&gt;
            </span>
          </Link>
        </div>

        <div
          className="select-none justify-self-start text-[clamp(7.5rem,min(27vw,34dvh),24rem)] font-light leading-none tracking-normal text-[#f4f5f7]/[0.045] sm:text-[clamp(9rem,min(30vw,36dvh),28rem)] lg:justify-self-end"
          aria-hidden="true"
        >
          404
        </div>
      </section>
    </main>
  );
}
