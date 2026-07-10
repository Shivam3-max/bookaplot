import Link from "next/link";
import { POSTS } from "@/lib/data";

export default function AdminBlog() {
  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-black">Blog / Insights CMS</h1>
          <p className="text-sm text-graphite">{POSTS.length} published · SEO-ready with categories and read time.</p>
        </div>
        <button className="btn-gold !py-2.5">+ New Post</button>
      </div>

      <div className="card overflow-x-auto">
        <table className="w-full min-w-[720px] text-sm">
          <thead>
            <tr className="border-b border-line bg-paper text-left text-[10px] font-bold uppercase tracking-wider text-graphite">
              <th className="px-5 py-3">Title</th>
              <th className="px-5 py-3">Category</th>
              <th className="px-5 py-3">Date</th>
              <th className="px-5 py-3">Status</th>
              <th className="px-5 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {POSTS.map((p) => (
              <tr key={p.slug} className="border-b border-line last:border-0 hover:bg-paper/60">
                <td className="max-w-72 px-5 py-3.5 font-bold leading-snug">{p.title}</td>
                <td className="px-5 py-3.5"><span className="chip badge-steel">{p.category}</span></td>
                <td className="px-5 py-3.5 text-xs font-semibold text-graphite">{p.date}</td>
                <td className="px-5 py-3.5"><span className="chip badge-green">Published</span></td>
                <td className="px-5 py-3.5 text-right">
                  <Link href={`/insights/${p.slug}`} className="text-xs font-bold" style={{ color: "var(--gold)" }}>View ↗</Link>
                  <button className="ml-3 text-xs font-bold text-graphite hover:text-ink">Edit</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="card p-6">
        <h2 className="font-display text-lg font-black">Homepage Content Blocks</h2>
        <p className="mt-1 text-sm text-graphite">Control what the homepage shows without touching code.</p>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {["Hero headline & CTAs", "Featured deals selection", "Trust stats bar", "Testimonials", "Featured locations", "Map section highlights", "Calculators ordering", "CTA band copy"].map((b) => (
            <div key={b} className="flex items-center justify-between rounded-xl border border-line px-4 py-3">
              <span className="text-[13px] font-semibold">{b}</span>
              <button className="text-xs font-bold" style={{ color: "var(--gold)" }}>Edit</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
