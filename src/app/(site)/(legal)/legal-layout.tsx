import Reveal from "@/components/Reveal";

export default function LegalShell({ title, updated, children }: { title: string; updated: string; children: React.ReactNode }) {
  return (
    <>
      <section className="grid-bg border-b border-line py-12">
        <div className="container-x mx-auto max-w-3xl">
          <Reveal>
            <p className="eyebrow">Legal</p>
            <h1 className="mt-3 text-3xl font-black sm:text-4xl">{title}</h1>
            <p className="mt-2 text-xs font-bold text-graphite">Last updated: {updated}</p>
          </Reveal>
        </div>
      </section>
      <section className="container-x mx-auto max-w-3xl py-10">
        <div className="space-y-5 text-[14.5px] leading-relaxed text-slate">{children}</div>
      </section>
    </>
  );
}
