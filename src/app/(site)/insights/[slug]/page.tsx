import { notFound } from "next/navigation";
import Link from "next/link";
import { POSTS, getPost, DEALS } from "@/lib/data";
import Reveal from "@/components/Reveal";
import DealCard from "@/components/DealCard";

export function generateStaticParams() {
  return POSTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const post = getPost((await params).slug);
  if (!post) return {};
  return { title: post.title, description: post.excerpt };
}

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const post = getPost((await params).slug);
  if (!post) notFound();
  const others = POSTS.filter((p) => p.slug !== post.slug).slice(0, 3);

  return (
    <>
      <section className="grid-bg border-b border-line py-14">
        <div className="container-x mx-auto max-w-3xl">
          <Reveal>
            <nav className="text-xs font-semibold text-graphite">
              <Link href="/insights" className="hover:text-ink">Insights</Link> <span className="mx-1">/</span>
              <span className="text-ink">{post.category}</span>
            </nav>
            <h1 className="mt-4 text-3xl font-black leading-tight sm:text-4xl">{post.title}</h1>
            <p className="mt-4 text-xs font-bold text-graphite">
              BookAPlot Research Desk · {new Date(post.date).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })} · {post.readMins} min read
            </p>
          </Reveal>
        </div>
      </section>

      <article className="container-x mx-auto max-w-3xl py-12">
        <Reveal>
          <div className="space-y-5 text-[15.5px] leading-relaxed text-slate">
            {post.body.map((p, i) => (
              <p key={i} className={i === 0 ? "font-display text-lg font-bold text-ink" : ""}>{p}</p>
            ))}
          </div>
          <div className="card mt-10 flex flex-col items-center gap-4 p-7 text-center sm:flex-row sm:text-left">
            <div className="flex-1">
              <p className="font-display font-black">Want this analysis applied to your shortlist?</p>
              <p className="mt-1 text-sm text-graphite">Talk to the research desk about your budget and horizon.</p>
            </div>
            <Link href="/contact" className="btn-gold shrink-0">Talk to an Expert</Link>
          </div>
        </Reveal>
      </article>

      <section className="border-t border-line bg-paper py-14">
        <div className="container-x">
          <Reveal><h2 className="font-display text-2xl font-black">Keep Reading</h2></Reveal>
          <div className="mt-6 grid gap-5 sm:grid-cols-3">
            {others.map((p, i) => (
              <Reveal key={p.slug} delay={i * 70}>
                <Link href={`/insights/${p.slug}`} className="card card-hover block h-full p-5">
                  <span className="chip badge-steel">{p.category}</span>
                  <p className="mt-3 font-display font-bold leading-snug">{p.title}</p>
                  <p className="mt-2 text-xs text-graphite">{p.readMins} min read</p>
                </Link>
              </Reveal>
            ))}
          </div>
          <Reveal delay={150}>
            <h2 className="mt-14 font-display text-2xl font-black">Live Opportunities</h2>
            <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {DEALS.filter((d) => d.featured).map((d) => <DealCard key={d.slug} deal={d} />)}
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
